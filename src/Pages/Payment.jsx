import { useState, useEffect } from "react";
import { Container, Form, Button, Toast, Card, Row, Col, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, clearPaymentResult, paymentResult } from "../slices/orderSlice";
import { isLoggedIn } from "../Utils/login";
import { getCurrentUser } from "../Utils/session";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../Utils/session";
import { getUserData } from '../Utils/getUserData';
import PaymentConfirmationModal from "../components/PaymentConfirmationModal";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { hotel, booking, totalPrice } = location.state || {};
  const { paymentProcessing, paymentError, lastPaymentResult } = useSelector((state) => state.orders);

  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Clear any previous payment results when component mounts
    dispatch(clearPaymentResult());
    
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!hotel || !booking || !totalPrice) {
      console.error('Missing required data:', { hotel, booking, totalPrice });
      navigate('/');
      return;
    }

    if (!hotel._id || !hotel.name || !hotel.price) {
      console.error('Invalid hotel data:', hotel);
      navigate('/');
      return;
    }

    // Check hotel status if it exists, otherwise assume it's available
    if (hotel.status && hotel.status !== 'empty') {
      console.error('Hotel is not available:', hotel.status);
      navigate('/');
      return;
    }

    if (!booking.checkIn || !booking.checkOut || !booking.rooms || !booking.guests) {
      console.error('Invalid booking data:', booking);
      navigate('/');
      return;
    }

    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
      console.error('Invalid dates:', { checkIn: booking.checkIn, checkOut: booking.checkOut });
      navigate('/');
      return;
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const expectedPrice = parseFloat(hotel.price) * parseInt(booking.rooms) * nights;
    if (Math.abs(expectedPrice - totalPrice) > 1) {
      console.error('Price mismatch:', { expected: expectedPrice, actual: totalPrice });
      navigate('/');
      return;
    }

    const userStr = getCurrentUser();
    if (!userStr) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const user = JSON.parse(userStr);
    if (!user || !user.name || !user.email) {
      navigate('/login', { state: { from: location } });
      return;
    }
  }, [hotel, booking, totalPrice, navigate, location, dispatch]);

  useEffect(() => {
    // Handle payment result changes
    if (lastPaymentResult) {
      setShowToast(true);
      if (lastPaymentResult.success) {
        setToastVariant('success');
        setToastMessage('Payment successful! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } else {
        setToastVariant('danger');
        setToastMessage(lastPaymentResult.error || 'Payment failed. Please try again.');
      }
    }
  }, [lastPaymentResult, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate card details if using card payment
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!formData.cardNumber.match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!formData.cvv.match(/^\d{3}$/)) {
        newErrors.cvv = 'Please enter a valid 3-digit CVV';
      }
      if (!formData.nameOnCard.trim()) {
        newErrors.nameOnCard = 'Please enter the name on card';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(\d{0,2})/, (_, p1, p2) => p2 ? `${p1}/${p2}` : p1);
    }
    // Format card number with spaces
    else if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    }
    // Format CVV
    else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePayment = async () => {
    // Validate booking details first
    if (!booking || !hotel || !totalPrice) {
      setToastVariant('danger');
      setToastMessage('Invalid booking details');
      setShowToast(true);
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      setToastVariant('danger');
      setToastMessage('Please select a payment method');
      setShowToast(true);
      return;
    }

    // Validate card details for card payments
    if ((paymentMethod === 'credit_card' || paymentMethod === 'debit_card')) {
      if (!validateForm()) {
        return;
      }
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    try {
      // Double check validation
      if (!booking || !hotel || !totalPrice || !paymentMethod) {
        throw new Error('Invalid booking or payment details');
      }

      // Get user data
      const user = getUserData();
      if (!user || !user.name) {
        throw new Error('User session expired');
      }

      // Create the order data
      const orderData = {
        receiver: user.name,
        arrivalDate: new Date(booking.checkIn).toISOString(),
        departureDate: new Date(booking.checkOut).toISOString(),
        room: hotel._id,
        amount: parseFloat(totalPrice),
        guests: parseInt(booking.guests) || 1,
        rooms: parseInt(booking.rooms) || 1,
        paymentMethod,
        paymentDetails: {
          cardLastFour: (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') 
            ? formData.cardNumber.slice(-4) 
            : null,
          paymentId: Math.random().toString(36).substring(2, 15).toUpperCase()
        }
      };

      // Log the order data before sending
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      // Create the order
      const result = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order creation result:', result);
      
      // Show success message
      dispatch(paymentResult({ success: true }));
      setShowConfirmation(false);
    } catch (error) {
      console.error('Payment failed:', error);
      dispatch(paymentResult({ success: false, error: error.message }));
      setShowConfirmation(false);
    }
  };

  if (!hotel || !booking || !totalPrice) {
    return null;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Payment Details</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6 className="text-muted mb-3">Booking Summary</h6>
                <Row>
                  <Col md={6}>
                    <p><strong>Hotel:</strong> {hotel?.name}</p>
                    <p><strong>Check-in:</strong> {booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''}</p>
                    <p><strong>Check-out:</strong> {booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Rooms:</strong> {booking?.rooms}</p>
                    <p><strong>Guests:</strong> {booking?.guests}</p>
                    <p className="h5 text-primary">Total Amount: NPR {totalPrice}</p>
                  </Col>
                </Row>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="esewa">eSewa</option>
                    <option value="khalti">Khalti</option>
                  </Form.Select>
                </Form.Group>

                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        isInvalid={!!errors.cardNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            isInvalid={!!errors.expiryDate}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.expiryDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="123"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            isInvalid={!!errors.cvv}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cvv}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Name on Card</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="JOHN DOE"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        isInvalid={!!errors.nameOnCard}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nameOnCard}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}

                {(paymentMethod === 'esewa' || paymentMethod === 'khalti') && (
                  <Alert variant="info">
                    Payment will be processed directly through {paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'}.
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : `Pay NPR ${totalPrice}`}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <PaymentConfirmationModal
            show={showConfirmation}
            onHide={() => setShowConfirmation(false)}
            onConfirm={handleConfirmPayment}
            bookingDetails={{
              hotel,
              booking,
              totalPrice,
              paymentMethod,
              cardLastFour: formData.cardNumber.slice(-4)
            }}
            loading={paymentProcessing}
          />

          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            className="position-fixed bottom-0 end-0 m-3"
          >
            <Toast.Header className={`bg-${toastVariant} text-white`}>
              <strong className="me-auto">Payment Status</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
