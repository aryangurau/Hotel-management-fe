import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Payment = ({ show, handleClose, amount, onPaymentSuccess, selectedRoom }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentOptions = [
    { 
      id: 'esewa', 
      name: 'eSewa', 
      logo: 'https://esewa.com.np/common/images/esewa_logo.png'
    },
    { 
      id: 'khalti', 
      name: 'Khalti', 
      logo: 'https://khalti.com/static/img/khalti-logo.png'
    },
    { 
      id: 'connectips', 
      name: 'ConnectIPS', 
      logo: 'https://connectips.com/images/logo.png'
    },
    { 
      id: 'imepay', 
      name: 'IME Pay', 
      logo: 'https://imepay.com.np/wp-content/uploads/2020/09/ime-pay.png'
    }
  ];

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    setLoading(true);
    try {
      await onPaymentSuccess({
        roomId: selectedRoom._id,
        amount: amount,
        paymentMethod: paymentMethod,
        receiver: selectedRoom.name,
        arrivalDate: new Date(),
        departureDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // next day
      });
      
      handleClose();
      navigate('/my-bookings');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Complete Your Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePayment}>
          <div className="mb-4 text-center">
            <h4 className="mb-3">Amount to Pay</h4>
            <h2 className="text-primary">NPR {amount.toLocaleString()}</h2>
          </div>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Select Payment Method</Form.Label>
            <Row className="g-3">
              {paymentOptions.map((option) => (
                <Col md={6} key={option.id}>
                  <div
                    className={`payment-option p-3 border rounded ${
                      paymentMethod === option.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setPaymentMethod(option.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        id={option.id}
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id)}
                        label={option.name}
                      />
                      <Image
                        src={option.logo}
                        alt={option.name}
                        height="30"
                        className="ms-auto"
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={!paymentMethod || loading}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              size="lg"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Payment;
