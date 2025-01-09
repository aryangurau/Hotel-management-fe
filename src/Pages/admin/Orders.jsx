import React, { useEffect, useState } from 'react';
import { Table, Badge, Container, Pagination, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../slices/orderSlice';
import { Notify } from '../../components/Notify';
import { getCurrentUser } from '../../Utils/session';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error, currentPage, totalPages } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Get user data safely
  const userData = (() => {
    const user = getCurrentUser();
    if (!user) return {};
    return typeof user === 'string' ? JSON.parse(user) : user;
  })();
  
  const isAdmin = userData?.roles?.includes('admin');

  useEffect(() => {
    const filter = {
      ...(statusFilter && { status: statusFilter }),
      ...((!isAdmin && userData.email) && { updated_by: userData.email })
    };

    dispatch(listOrders({ page, limit, filter }));
  }, [dispatch, page, limit, statusFilter, isAdmin, userData.email]);

  if (error) {
    return <Notify msg={error.message || error} variant="danger" />;
  }

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger',
      unpaid: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Order Management</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="unpaid">Unpaid</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNo}</td>
                  <td>{order.room?.name || 'N/A'}</td>
                  <td>{new Date(order.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(order.checkOut).toLocaleDateString()}</td>
                  <td>${order.totalPrice}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{order.created_by?.email || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First 
                disabled={page === 1} 
                onClick={() => handlePageChange(1)}
              />
              <Pagination.Prev 
                disabled={page === 1} 
                onClick={() => handlePageChange(page - 1)}
              />
              
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === page}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next 
                disabled={page === totalPages} 
                onClick={() => handlePageChange(page + 1)}
              />
              <Pagination.Last 
                disabled={page === totalPages} 
                onClick={() => handlePageChange(totalPages)}
              />
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
};

export default AdminOrders;
