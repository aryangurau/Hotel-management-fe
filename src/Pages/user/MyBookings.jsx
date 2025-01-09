import { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../slices/orderSlice';
import { getCurrentUser } from '../../Utils/session';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [currentPage] = useState(1);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const userData = JSON.parse(user);
      dispatch(listOrders({ 
        page: currentPage, 
        limit: 10,
        filter: { updated_by: userData.email }
      }));
    }
  }, [dispatch, currentPage]);

  const getStatusBadge = (status) => {
    const variants = {
      unpaid: 'warning',
      paid: 'success',
      cancelled: 'danger',
      completed: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Bookings</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No bookings found.</div>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNo || order._id}</td>
                <td>{order.room?.name || 'N/A'}</td>
                <td>{new Date(order.arrivalDate).toLocaleDateString()}</td>
                <td>{new Date(order.departureDate).toLocaleDateString()}</td>
                <td>NPR {order.amount}</td>
                <td>{getStatusBadge(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyBookings;
