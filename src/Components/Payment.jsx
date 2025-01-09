import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../Utils/axiosInstance';
import { getToken, getCurrentUser } from '../Utils/session';
import moment from 'moment';
import './Payment.css';

const paymentMethods = [
  { 
    id: 'ESEWA', 
    name: 'eSewa', 
    logo: 'https://play-lh.googleusercontent.com/vHB2FTOY2HnUAe_rtSh3QmB8OZI_t0VTDHZVxJl6Bv6HqaQJKzF1WZBFp1QtA3S6POg' 
  },
  { 
    id: 'KHALTI', 
    name: 'Khalti', 
    logo: 'https://play-lh.googleusercontent.com/fqYJHtyzZzA4vacRzeJoB93QC0W-cqI7hkKxBqRWlFRTJyKgLtLZPF_fPcFelAkFd6k' 
  },
  { 
    id: 'BANK_TRANSFER', 
    name: 'Bank Transfer', 
    logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830289.png' 
  },
  { 
    id: 'CASH', 
    name: 'Cash', 
    logo: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png' 
  }
];

const Payment = ({ show, handleClose, selectedRoom, bookingDetails }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    guestName: '',
    phoneNumber: '',
    paymentMethod: ''
  });

  const handlePaymentMethodChange = (method) => {
    setPaymentData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = moment(dateString);
    return date.isValid() ? date.format('YYYY-MM-DD') : '';
  };

  const calculateNumberOfDays = () => {
    if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) return 0;
    const checkIn = moment(bookingDetails.checkIn);
    const checkOut = moment(bookingDetails.checkOut);
    if (!checkIn.isValid() || !checkOut.isValid()) return 0;
    return checkOut.diff(checkIn, 'days');
  };

  const calculateTotalAmount = () => {
    const days = calculateNumberOfDays();
    return days * (selectedRoom?.price || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentData.guestName || !paymentData.phoneNumber || !paymentData.paymentMethod) {
      toast.error('Please fill in all required fields and select a payment method');
      return;
    }

    if (paymentData.phoneNumber.length < 6) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    try {
      // Get user data
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        throw new Error('User session expired');
      }
      const user = JSON.parse(userStr);

      const bookingData = {
        roomId: selectedRoom._id,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        numberOfDays: calculateNumberOfDays(),
        totalAmount: calculateTotalAmount(),
        guestName: paymentData.guestName,
        phoneNumber: paymentData.phoneNumber,
        paymentMethod: paymentData.paymentMethod,
        guests: bookingDetails.guests,
        userId: user._id // Add user ID to booking
      };

      console.log('Sending booking data:', bookingData);

      const response = await axiosInstance.post('/bookings', bookingData);
      console.log('Booking response:', response.data);

      if (response.data.success) {
        toast.success(`Booking confirmed with ${paymentData.paymentMethod}!`);
        handleClose();
        // Store booking ID for future reference
        sessionStorage.setItem('lastBookingId', response.data.bookingId);
        navigate('/booking-history');
      } else {
        throw new Error(response.data?.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error?.response?.status === 401) {
        // Session expired during booking
        toast.error('Your session has expired. Please log in again.');
        // Store booking data
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          selectedRoom,
          bookingDetails,
          paymentData
        }));
        // Redirect to login
        navigate('/login', { 
          replace: true,
          state: { 
            from: '/booking',
            returnTo: '/booking'
          }
        });
      } else {
        toast.error(error.response?.data?.message || error.message || 'Booking failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Complete Your Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Guest Information */}
          <Form.Group className="mb-3">
            <Form.Label>Guest Name</Form.Label>
            <Form.Control
              type="text"
              value={paymentData.guestName}
              onChange={(e) => setPaymentData(prev => ({ ...prev, guestName: e.target.value }))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={paymentData.phoneNumber}
              onChange={(e) => setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </Form.Group>

          {/* Payment Methods */}
          <div className="mb-4">
            <h5 className="mb-3">Select Payment Method</h5>
            <Row xs={1} md={2} lg={4} className="g-3">
              {paymentMethods.map((method) => (
                <Col key={method.id}>
                  <div
                    className={`payment-method-card ${paymentData.paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange(method.id)}
                  >
                    <img src={method.logo} alt={method.name} className="payment-logo" />
                    <span>{method.name}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Booking Summary */}
          <div className="booking-summary">
            <h5>Booking Summary</h5>
            <p>Room Type: {selectedRoom?.type}</p>
            <p>Check-in: {formatDate(bookingDetails?.checkIn)}</p>
            <p>Check-out: {formatDate(bookingDetails?.checkOut)}</p>
            <p>Number of Days: {calculateNumberOfDays()}</p>
            <p>Number of Guests: {bookingDetails?.guests}</p>
            <p>Total Amount: NPR {calculateTotalAmount()}</p>
          </div>

          <div className="d-grid gap-2 mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isProcessing || !paymentData.paymentMethod}
            >
              {isProcessing ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Payment;
