import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../Utils/axiosInstance';
import { getToken, getCurrentUser } from '../Utils/session';
import moment from 'moment';
import './Payment.css';
import { useDispatch } from 'react-redux';
import { removeItem } from '../slices/cartSlice';

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

const Payment = ({ show, handleClose, selectedRoom, bookingDetails, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    setIsProcessing(true);

    try {
      // Validate payment data
      if (!paymentData.guestName.trim()) {
        throw new Error('Guest name is required');
      }
      if (!paymentData.phoneNumber.trim()) {
        throw new Error('Phone number is required');
      }
      if (!paymentData.paymentMethod) {
        throw new Error('Please select a payment method');
      }

      // Validate booking details
      if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) {
        throw new Error('Check-in and Check-out dates are required');
      }
      if (!bookingDetails?.guests || bookingDetails.guests <= 0) {
        throw new Error('Number of guests must be greater than 0');
      }

      // Log the input data
      console.log('Payment Data:', {
        selectedRoom,
        bookingDetails,
        paymentData
      });

      // Validate selectedRoom first
      if (!selectedRoom?._id) {
        console.error('Selected room data:', selectedRoom);
        throw new Error('Room ID is missing');
      }

      const checkIn = moment(bookingDetails.checkIn).format('YYYY-MM-DD');
      const checkOut = moment(bookingDetails.checkOut).format('YYYY-MM-DD');

      // Prepare booking payload
      const bookingPayload = {
        roomId: selectedRoom._id,  // Ensure this is at root level
        checkIn,
        checkOut,
        guests: parseInt(bookingDetails.guests),
        totalAmount: bookingDetails.totalAmount,
        guestName: paymentData.guestName.trim(),
        phoneNumber: paymentData.phoneNumber.trim(),
        paymentMethod: paymentData.paymentMethod,
        status: 'confirmed',
        paymentDetails: {
          method: paymentData.paymentMethod,
          status: 'paid',
          paidAt: new Date().toISOString()
        }
      };

      // Detailed validation logging
      console.log('Validation checks:', {
        roomId: bookingPayload.roomId,
        selectedRoomId: selectedRoom._id,
        hasRoomId: !!bookingPayload.roomId,
        hasCheckIn: !!bookingPayload.checkIn,
        hasCheckOut: !!bookingPayload.checkOut,
        guests: bookingPayload.guests,
        totalAmount: bookingPayload.totalAmount,
        hasGuestName: !!bookingPayload.guestName,
        hasPhoneNumber: !!bookingPayload.phoneNumber,
        paymentMethod: bookingPayload.paymentMethod
      });

      // Validate payload before sending
      if (!bookingPayload.roomId) {
        console.error('Missing room ID in payload:', bookingPayload);
        throw new Error('Room ID is missing');
      }
      if (!bookingPayload.totalAmount || bookingPayload.totalAmount <= 0) {
        throw new Error('Invalid total amount');
      }
      if (!bookingPayload.guestName) {
        throw new Error('Guest name is required');
      }
      if (!bookingPayload.phoneNumber) {
        throw new Error('Phone number is required');
      }
      if (!bookingPayload.guests || bookingPayload.guests <= 0) {
        throw new Error('Number of guests is required');
      }

      console.log('Sending booking payload:', JSON.stringify(bookingPayload, null, 2));

      // Make the API call
      const response = await axiosInstance.post('/bookings', bookingPayload);
      
      if (response.data.success) {
        // Remove the booked room from cart
        dispatch(removeItem(selectedRoom._id));
        setIsProcessing(false);
        toast.success('Booking confirmed successfully!');
        
        if (onPaymentSuccess) {
          await onPaymentSuccess();
        }
        handleClose();
        navigate('/booking-history');
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      setIsProcessing(false);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during payment';
      console.error('Detailed payment error:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: errorMessage
      });
      toast.error(errorMessage);
      console.error('Payment error:', {
        message: errorMessage,
        details: error.response?.data || error
      });
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
