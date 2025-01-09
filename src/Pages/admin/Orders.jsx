import React, { useEffect, useState } from 'react';
import { Table, Badge, Container, Pagination, Form, Row, Col, Alert, Card, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../slices/orderSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaBed, FaCalendarAlt, FaCreditCard, FaEdit } from 'react-icons/fa';
import { default as axiosInstance } from '../../Utils/axiosInstance';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [], loading, error, currentPage, totalPages, total } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Check user session and roles
    const userStr = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    if (!userStr || !token) {
      console.log('Missing auth data:', { hasUser: !!userStr, hasToken: !!token });
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.roles?.includes('admin')) {
        console.log('User is not admin:', user.roles);
        toast.error('Access denied: Admin only');
        navigate('/');
        return;
      }

      console.log('Fetching orders with filter:', { statusFilter });
      const filter = statusFilter ? { status: statusFilter } : {};
      
      dispatch(listOrders({ 
        page, 
        limit, 
        filter 
      })).unwrap()
        .catch(error => {
          console.error('Error fetching orders:', error);
          if (error.message?.toLowerCase().includes('token')) {
            console.log('Token error, redirecting to login');
            sessionStorage.clear();
            navigate('/login');
          } else {
            toast.error(error.message || 'Failed to fetch orders');
          }
        });
    } catch (error) {
      console.error('Error processing user data:', error);
      sessionStorage.clear();
      navigate('/login');
    }
  }, [dispatch, page, limit, statusFilter, navigate]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setUpdating(true);
    try {
      const response = await axiosInstance.patch(
        `/orders/${selectedOrder._id}/status`,
        { status: newStatus },
        {
          headers: {
            'access_token': sessionStorage.getItem('token')
          }
        }
      );

      if (response.data.success) {
        toast.success('Order status updated successfully');
        // Refresh orders list
        dispatch(listOrders({ 
          page, 
          limit, 
          filter: statusFilter ? { status: statusFilter } : {} 
        }));
        setShowStatusModal(false);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const getStatusBadge = (status, type = 'status') => {
    const variants = {
      status: {
        unpaid: 'warning',
        confirmed: 'success',
        cancelled: 'danger',
        completed: 'info',
        pending: 'secondary'
      },
      payment: {
        paid: 'success',
        unpaid: 'warning',
        refunded: 'info',
        failed: 'danger',
        pending: 'secondary'
      }
    };
    
    const variant = variants[type]?.[status?.toLowerCase()] || 'secondary';
    return (
      <Badge bg={variant}>
        {status || 'N/A'}
      </Badge>
    );
  };

  const renderStatusWithEdit = (order) => (
    <div className="d-flex align-items-center gap-2">
      {getStatusBadge(order.status, 'status')}
      <Button 
        variant="link" 
        className="p-0 text-primary" 
        onClick={() => openStatusModal(order)}
      >
        <FaEdit />
      </Button>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h2 className="mb-3">Order Management</h2>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Filter by Status:</Form.Label>
            <Col sm={4}>
              <Form.Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : !orders || orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          <p className="mb-0">No orders found</p>
          {statusFilter && (
            <small>Try clearing the status filter to see all orders</small>
          )}
        </Alert>
      ) : (
        <>
          <div className="order-cards">
            {orders.map((order) => (
              <Card key={order._id} className="mb-3 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                  <div>
                    <strong className="text-primary">Order #{order.orderNo}</strong>
                    <div className="small text-muted">
                      Created: {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {renderStatusWithEdit(order)}
                    {getStatusBadge(order.paymentStatus, 'payment')}
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <h6 className="text-secondary">
                        <FaUser className="me-2" />Customer Details
                      </h6>
                      <p className="mb-1">
                        <strong>{order.customer?.name || 'N/A'}</strong>
                      </p>
                      <p className="mb-1 small">
                        <FaEnvelope className="me-1" />
                        {order.customer?.email || 'N/A'}
                      </p>
                      <p className="mb-1 small">
                        <FaPhone className="me-1" />
                        {order.customer?.phone || 'N/A'}
                      </p>
                    </Col>
                    <Col md={4}>
                      <h6 className="text-secondary">
                        <FaBed className="me-2" />Room Details
                      </h6>
                      {order.room ? (
                        <>
                          <p className="mb-1">
                            <strong>{order.room.name}</strong>
                          </p>
                          <p className="mb-1 small">
                            Type: {order.room.type}
                          </p>
                          <p className="mb-1 small">
                            Capacity: {order.room.totalGuests} guests
                          </p>
                        </>
                      ) : (
                        <p className="text-muted">Room details not available</p>
                      )}
                    </Col>
                    <Col md={4}>
                      <h6 className="text-secondary">
                        <FaCalendarAlt className="me-2" />Booking Details
                      </h6>
                      <p className="mb-1">
                        Check-in: {formatDate(order.checkIn)}
                      </p>
                      <p className="mb-1">
                        Check-out: {formatDate(order.checkOut)}
                      </p>
                      <p className="mb-1">
                        <FaCreditCard className="me-1" />
                        {order.paymentMethod} - {formatCurrency(order.amount)}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-muted small bg-light">
                  <Row className="align-items-center">
                    <Col>
                      Created by: {order.createdBy?.name || 'N/A'} ({order.createdBy?.email || 'N/A'})
                    </Col>
                    <Col xs="auto">
                      Last updated: {formatDate(order.updatedAt)}
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted small">
                Showing {orders.length} of {total} orders | Page {currentPage} of {totalPages}
              </div>
              <Pagination className="mb-0">
                <Pagination.First 
                  onClick={() => handlePageChange(1)} 
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                
                {currentPage > 2 && (
                  <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                )}
                
                {currentPage > 3 && <Pagination.Ellipsis />}
                
                {currentPage > 1 && (
                  <Pagination.Item onClick={() => handlePageChange(currentPage - 1)}>
                    {currentPage - 1}
                  </Pagination.Item>
                )}
                
                <Pagination.Item active>{currentPage}</Pagination.Item>
                
                {currentPage < totalPages && (
                  <Pagination.Item onClick={() => handlePageChange(currentPage + 1)}>
                    {currentPage + 1}
                  </Pagination.Item>
                )}
                
                {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                
                {currentPage < totalPages - 1 && (
                  <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </Pagination.Item>
                )}

                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
              <Form.Select 
                style={{ width: 'auto' }}
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="ms-3"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </Form.Select>
            </div>
          )}
        </>
      )}

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Order #{selectedOrder?.orderNo}</p>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
              disabled={updating}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={updating}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate} disabled={updating}>
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;
