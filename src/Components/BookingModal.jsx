import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Utils/axiosInstance';
import { getCurrentUser, isLoggedIn } from '../Utils/session';
import { toast } from 'react-toastify';

const BookingModal = ({ show, onHide, room }) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: moment().format('YYYY-MM-DD'),
    checkOut: moment().add(1, 'days').format('YYYY-MM-DD'),
    guests: 1
  });

  const maxGuests = room?.maxGuests || 1;

  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const days = Math.max(1, moment(bookingData.checkOut).diff(moment(bookingData.checkIn), 'days'));
    return days * (room?.price || 0);
  };

  const handleProceedToPayment = async () => {
    if (!loggedIn) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }

    try {
      const checkInDate = moment(bookingData.checkIn);
      const checkOutDate = moment(bookingData.checkOut);
      
      if (!checkInDate.isValid() || !checkOutDate.isValid()) {
        toast.error('Please select valid dates');
        return;
      }

      if (checkInDate.isSameOrAfter(checkOutDate)) {
        toast.error('Check-out date must be after check-in date');
        return;
      }

      const guests = Number(bookingData.guests);
      if (guests < 1 || guests > maxGuests) {
        toast.error(`Number of guests must be between 1 and ${maxGuests}`);
        return;
      }

      const numberOfDays = Math.max(1, checkOutDate.diff(checkInDate, 'days'));
      const totalAmount = numberOfDays * (room?.price || 0);

      const response = await axiosInstance.post('/bookings', {
        roomId: room._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests,
        numberOfDays,
        totalAmount,
        guestName: user.name,
        phoneNumber: user.phoneNumber || ''
      });

      if (response.data.success) {
        toast.success('Booking created successfully');
        onHide();
        navigate('/booking-history');
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Check-in Date</Form.Label>
                <Form.Control
                  type="date"
                  value={bookingData.checkIn}
                  min={moment().format('YYYY-MM-DD')}
                  onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Check-out Date</Form.Label>
                <Form.Control
                  type="date"
                  value={bookingData.checkOut}
                  min={moment(bookingData.checkIn).add(1, 'days').format('YYYY-MM-DD')}
                  onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Number of Guests</Form.Label>
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setBookingData(prev => ({
                    ...prev,
                    guests: Math.max(1, Number(prev.guests) - 1)
                  }));
                }}
                disabled={bookingData.guests <= 1}
              >
                -
              </Button>
              <div style={{ width: '60px', margin: '0 10px' }}>
                <Form.Control
                  type="text"
                  value={bookingData.guests}
                  style={{ textAlign: 'center' }}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '') value = '1';
                    const numValue = Math.min(Math.max(Number(value), 1), maxGuests);
                    setBookingData(prev => ({ ...prev, guests: numValue }));
                  }}
                  onBlur={() => {
                    const value = Math.min(Math.max(Number(bookingData.guests) || 1, 1), maxGuests);
                    setBookingData(prev => ({ ...prev, guests: value }));
                  }}
                />
              </div>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setBookingData(prev => ({
                    ...prev,
                    guests: Math.min(Number(prev.guests) + 1, maxGuests)
                  }));
                }}
                disabled={bookingData.guests >= maxGuests}
              >
                +
              </Button>
            </div>
            <Form.Text className="text-muted">
              Maximum {maxGuests} guests allowed
            </Form.Text>
          </Form.Group>

          <div className="booking-summary mt-4">
            <h5>Booking Summary</h5>
            <p>Room Type: {room?.type}</p>
            <p>Room Rate: NPR {room?.price}/night</p>
            <p>Number of Days: {moment(bookingData.checkOut).diff(moment(bookingData.checkIn), 'days')}</p>
            <p>Total Amount: NPR {calculateTotalPrice()}</p>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleProceedToPayment}
          disabled={!bookingData.checkIn || !bookingData.checkOut || !bookingData.guests}
        >
          Proceed to Payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingModal;
