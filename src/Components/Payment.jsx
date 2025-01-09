import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../Utils/axiosInstance';
import { getToken, getCurrentUser } from '../Utils/session';

const PAYMENT_METHODS = {
  ESEWA: {
    id: 'ESEWA',
    name: 'eSewa',
    logo: 'https://esewa.com.np/common/images/esewa_logo.png'
  },
  KHALTI: {
    id: 'KHALTI',
    name: 'Khalti',
    logo: 'https://khalti.com/static/img/khalti-logo.png'
  },
  BANK_TRANSFER: {
    id: 'BANK_TRANSFER',
    name: 'Bank Transfer',
    logo: 'https://connectips.com/images/logo.png'
  },
  CASH: {
    id: 'CASH',
    name: 'Cash',
    logo: 'https://imepay.com.np/wp-content/uploads/2020/09/ime-pay.png'
  }
};

const Payment = ({ show, handleClose, amount, onPaymentSuccess, selectedRoom, bookingDetails = {} }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (!show) {
      setPaymentMethod('');
      setLoading(false);
      setPaymentProcessing(false);
    }
  }, [show]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      // Validate user session
      const token = getToken();
      const currentUser = getCurrentUser();
      
      if (!token || !currentUser) {
        toast.error('Please login to continue');
        handleClose();
        navigate('/login');
        return;
      }

      // Validate payment method
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      // Validate room and booking details
      if (!selectedRoom?._id) {
        toast.error('Invalid room selection');
        return;
      }

      if (!bookingDetails?.checkIn || !bookingDetails?.checkOut) {
        toast.error('Please select check-in and check-out dates');
        return;
      }

      if (!amount || amount <= 0) {
        toast.error('Invalid amount');
        return;
      }

      setLoading(true);
      setPaymentProcessing(true);

      // Step 1: Create the booking
      const bookingData = {
        roomId: selectedRoom._id,
        checkIn: new Date(bookingDetails.checkIn).toISOString(),
        checkOut: new Date(bookingDetails.checkOut).toISOString(),
        guests: bookingDetails.guests || 1,
        totalAmount: amount
      };

      console.log('Creating booking with data:', bookingData);
      const bookingResponse = await axiosInstance.post('/bookings', bookingData);

      if (!bookingResponse?.data?.data?._id) {
        throw new Error('Failed to create booking');
      }

      const bookingId = bookingResponse.data.data._id;
      console.log('Booking created with ID:', bookingId);

      // Step 2: Initiate payment
      const paymentData = {
        bookingId,
        paymentMethod,
        amount
      };

      console.log('Initiating payment with data:', paymentData);
      const paymentResponse = await axiosInstance.post('/payments/initiate', paymentData);

      if (!paymentResponse?.data?.data?.payment) {
        // Cancel the booking if payment initiation fails
        await axiosInstance.post(`/bookings/${bookingId}/cancel`, {
          reason: 'Payment initiation failed'
        });
        throw new Error('Failed to initiate payment');
      }

      const { payment } = paymentResponse.data.data;
      console.log('Payment initiated:', payment);

      // Step 3: Show processing message
      toast.info('Processing payment...', {
        autoClose: 2000
      });

      // Step 4: Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 5: Simulate successful payment
      const gatewayResponse = { status: 'success', token: 'mock_token' };
      
      // Step 6: Verify payment
      const verifyData = {
        transactionId: payment.transactionId,
        gatewayResponse,
        bookingId
      };

      console.log('Verifying payment with data:', verifyData);
      const verifyResponse = await axiosInstance.post('/payments/verify', verifyData);

      if (!verifyResponse?.data?.success) {
        throw new Error('Payment verification failed');
      }

      // Success! Close modal and show success message
      toast.success('Payment successful!');
      
      // Complete all state updates before navigation
      await Promise.all([
        onPaymentSuccess?.(),
        new Promise(resolve => {
          handleClose();
          setTimeout(resolve, 100);
        })
      ]);

      // Navigate to booking history
      navigate('/booking-history', { replace: true });

    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
        handleClose();
        navigate('/login', { replace: true });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
        console.error('Error message:', errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={() => !paymentProcessing && handleClose()} 
      centered 
      size="lg"
      backdrop={paymentProcessing ? 'static' : true}
      keyboard={!paymentProcessing}
    >
      <Modal.Header closeButton={!paymentProcessing}>
        <Modal.Title>Complete Your Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <h4 className="mb-3">Total Amount: Rs. {amount}</h4>
          <p className="text-muted">Choose your preferred payment method</p>
        </div>

        <Form onSubmit={handlePayment}>
          <Row className="g-4">
            {Object.values(PAYMENT_METHODS).map((option) => (
              <Col md={6} key={option.id}>
                <div
                  className={`payment-option p-3 rounded border ${
                    paymentMethod === option.id ? 'border-primary' : ''
                  }`}
                  onClick={() => !paymentProcessing && setPaymentMethod(option.id)}
                  style={{ cursor: paymentProcessing ? 'not-allowed' : 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      id={option.id}
                      checked={paymentMethod === option.id}
                      onChange={() => !paymentProcessing && setPaymentMethod(option.id)}
                      disabled={paymentProcessing}
                    />
                    <div className="ms-3">
                      <Image
                        src={option.logo}
                        alt={option.name}
                        style={{ height: '30px' }}
                      />
                      <div className="mt-2 small text-muted">{option.name}</div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!paymentMethod || loading || paymentProcessing}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Payment;
