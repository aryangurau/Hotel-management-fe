import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import moment from 'moment';
import axiosInstance from '../Utils/axiosInstance';
import { getCurrentUser } from '../Utils/session';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching bookings for user:', user?._id);
        
        const response = await axiosInstance.get(`/bookings/user/${user._id}`);
        console.log('Booking response:', response.data);
        
        if (response.data?.success) {
          setBookings(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchBookings();
    }
  }, [user?._id]);

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      CANCELLED: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (date) => {
    return moment(date).format('MMMM D, YYYY');
  };

  if (loading) {
    return (
      <Container className="my-4 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!bookings.length) {
    return (
      <Container className="my-4">
        <h2 className="mb-4">Your Booking History</h2>
        <Alert variant="info">
          No bookings found. Book a room to see your history here.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Your Booking History</h2>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room Type</th>
              <th>Guest Name</th>
              <th>Phone</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Days</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <span className="text-muted">{booking._id.slice(-6).toUpperCase()}</span>
                </td>
                <td>
                  {booking.roomId?.type || 'N/A'}
                </td>
                <td>{booking.guestName}</td>
                <td>{booking.phoneNumber}</td>
                <td>{formatDate(booking.checkIn)}</td>
                <td>{formatDate(booking.checkOut)}</td>
                <td className="text-center">{booking.numberOfDays}</td>
                <td className="text-center">{booking.guests}</td>
                <td className="text-end">NPR {booking.totalAmount?.toLocaleString()}</td>
                <td>{getStatusBadge(booking.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default BookingHistory;
