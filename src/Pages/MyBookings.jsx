import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { default as axiosInstance } from '../Utils/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings...');
      const response = await axiosInstance.get('/bookings', {
        params: {
          populate: 'roomId'
        }
      });
      console.log('Bookings response:', response.data);
      
      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'CONFIRMED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    try {
      return moment(dateString).format('MMM D, YYYY');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center text-muted">
          <p>No bookings found</p>
        </div>
      ) : (
        <Row xs={1} className="g-4">
          {bookings.map((booking) => (
            <Col key={booking._id}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">
                        {booking.roomId?.name || 'Room Unavailable'}
                        {' '}
                        {getStatusBadge(booking.status)}
                      </h5>
                      <p className="text-muted mb-2">
                        {booking.roomId?.type?.charAt(0).toUpperCase() + booking.roomId?.type?.slice(1)} Room
                      </p>
                    </div>
                    <h5 className="mb-0">NPR {booking.totalAmount?.toLocaleString()}</h5>
                  </div>
                  
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="mb-2">
                        <strong>Check-in:</strong> {formatDate(booking.checkIn)}
                      </div>
                      <div className="mb-2">
                        <strong>Check-out:</strong> {formatDate(booking.checkOut)}
                      </div>
                      <div className="mb-2">
                        <strong>Room Type:</strong> {booking.roomId?.type?.charAt(0).toUpperCase() + booking.roomId?.type?.slice(1)}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <strong>Booking Date:</strong> {formatDate(booking.createdAt)}
                      </div>
                      <div className="mb-2">
                        <strong>Booking ID:</strong> {booking._id}
                      </div>
                      {booking.status === 'CANCELLED' && booking.cancellationReason && (
                        <div className="text-danger">
                          <strong>Cancellation Reason:</strong> {booking.cancellationReason}
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;
