import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { isLoggedIn } from '../Utils/login';
import { getCurrentUser } from '../Utils/session';

const BookingModal = ({ show, handleClose, room, onProceedToPayment }) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const loggedIn = isLoggedIn();
  const user = loggedIn ? getCurrentUser() : null;

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const days = moment(bookingData.checkOut).diff(moment(bookingData.checkIn), 'days');
    return days * room.price;
  };

  const handleProceedToPayment = () => {
    if (!loggedIn || !user) {
      alert('Please login to book a room');
      navigate('/login');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (moment(bookingData.checkIn).isSameOrAfter(bookingData.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    if (bookingData.guests < 1 || bookingData.guests > room.maxGuests) {
      alert(`Number of guests must be between 1 and ${room.maxGuests}`);
      return;
    }

    const bookingDetails = {
      ...bookingData,
      roomId: room._id,
      amount: calculateTotalPrice(),
      roomType: room.type,
      user: user._id
    };

    onProceedToPayment(bookingDetails);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Book {room?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5>Room Details</h5>
          <p><strong>Type:</strong> {room?.type}</p>
          <p><strong>Price:</strong> NPR {room?.price?.toLocaleString()}/night</p>
          <p><strong>Max Guests:</strong> {room?.maxGuests}</p>
          <p><strong>Description:</strong> {room?.description}</p>
        </div>

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Check-in Date</Form.Label>
                <Form.Control
                  type="date"
                  min={moment().format('YYYY-MM-DD')}
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Check-out Date</Form.Label>
                <Form.Control
                  type="date"
                  min={moment(bookingData.checkIn || undefined).add(1, 'day').format('YYYY-MM-DD')}
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Guests</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={room?.maxGuests}
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <div className="form-control bg-light">
                  NPR {calculateTotalPrice().toLocaleString()}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
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
