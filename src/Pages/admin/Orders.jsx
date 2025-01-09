import React, { useEffect, useState } from 'react';
import { Table, Badge, Container, Pagination, Form, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../slices/orderSlice';
import { Notify } from '../../components/Notify';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [], loading, error, currentPage, totalPages, total } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    // Check user session and roles
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.roles?.includes('admin')) {
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
          Notify.error(error.message || 'Failed to fetch orders');
        });
    } catch (error) {
      console.error('Error processing user data:', error);
      navigate('/login');
    }
  }, [dispatch, page, limit, statusFilter, navigate]);

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger',
      unpaid: 'secondary',
      'checked-in': 'info',
      'checked-out': 'dark'
    };
    return <Badge bg={variants[status?.toLowerCase()] || 'secondary'}>
      {status || 'N/A'}
    </Badge>;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h2 className="mb-3">Booking Management</h2>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Filter by Status:</Form.Label>
            <Col sm={4}>
              <Form.Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
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

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Guest Name</th>
            <th>Phone</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center">Loading...</td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">No bookings found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.guestName}</td>
                <td>{order.phoneNumber}</td>
                <td>{formatDate(order.checkIn)}</td>
                <td>{formatDate(order.checkOut)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>${order.totalAmount}</td>
                <td>{getStatusBadge(order.paymentStatus)}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      <div className="text-center mt-3">
        <small className="text-muted">
          Showing {orders.length} of {total} bookings
        </small>
      </div>
    </Container>
  );
};

export default AdminOrders;
