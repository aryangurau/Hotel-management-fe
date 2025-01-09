import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Badge, Button, Form, Row, Col, Modal, Spinner } from "react-bootstrap";
import { listUsers, blockUser, resetPassword, clearActionError } from "../../slices/userSlice";
import { getCurrentUser } from "../../Utils/session";
import { createSelector } from "@reduxjs/toolkit";

// Memoized selector
const selectUserState = createSelector(
  [(state) => state.user || {}],
  (user) => ({
    users: user.users || [],
    loading: user.loading || false,
    error: user.error || null,
    totalUsers: user.totalUsers || 0,
    actionLoading: user.actionLoading || false,
    actionError: user.actionError || null
  })
);

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, totalUsers, actionLoading, actionError } = useSelector(selectUserState);
  const [searchName, setSearchName] = useState("");
  const [filters, setFilters] = useState({
    isActive: "",
    isBlocked: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const limit = 10;

  const loadUsers = useCallback(() => {
    dispatch(
      listUsers({
        page: currentPage,
        limit,
        name: searchName,
        isActive: filters.isActive,
        isBlocked: filters.isBlocked,
      })
    );
  }, [currentPage, dispatch, limit, searchName, filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBlockUser = async (email, isBlocked) => {
    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) {
      return;
    }

    try {
      const currentUser = getCurrentUser();
      await dispatch(blockUser({ 
        email, 
        updated_by: currentUser.email 
      })).unwrap();
      
      loadUsers();
    } catch (err) {
      console.error("Failed to block/unblock user:", err);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      const currentUser = getCurrentUser();
      await dispatch(resetPassword({
        email: selectedUser.email,
        newPassword,
        updated_by: currentUser.email
      })).unwrap();
      
      setShowResetModal(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to reset password:", err);
    }
  };

  const openResetModal = (user) => {
    setSelectedUser(user);
    setShowResetModal(true);
    dispatch(clearActionError());
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Error loading users: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Users Management</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch} className="mb-4">
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                >
                  <option value="">Filter by Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filters.isBlocked}
                  onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
                >
                  <option value="">Filter by Block Status</option>
                  <option value="true">Blocked</option>
                  <option value="false">Not Blocked</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary" className="w-100">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>

          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : users.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Block Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.isBlocked ? 'danger' : 'success'}>
                        {user.isBlocked ? 'Blocked' : 'Not Blocked'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant={user.isBlocked ? 'success' : 'warning'}
                          onClick={() => handleBlockUser(user.email, user.isBlocked)}
                          disabled={actionLoading}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => openResetModal(user)}
                          disabled={actionLoading}
                        >
                          Reset Password
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">No users found</div>
          )}

          {totalUsers > limit && (
            <div className="d-flex justify-content-center mt-4">
              <Paginate
                total={totalUsers}
                page={currentPage}
                limit={limit}
                siblings={1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionError && (
            <div className="alert alert-danger">{actionError}</div>
          )}
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleResetPassword}
            disabled={!newPassword || actionLoading}
          >
            {actionLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;