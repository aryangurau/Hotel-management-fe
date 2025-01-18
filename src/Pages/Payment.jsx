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
import { removeItem } from "../slices/cartSlice";
import moment from 'moment';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { hotel, dates } = location.state || {};
  const { paymentProcessing, paymentError, lastPaymentResult } = useSelector((state) => state.orders);

  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    cardName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Clear any previous payment results when component mounts
    dispatch(clearPaymentResult());
    
    // Check login status
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    
    if (!token || !user) {
      console.log('No auth data found, redirecting to login');
      // Store current state before redirecting
      sessionStorage.setItem('pendingPayment', JSON.stringify({
        hotel,
        dates,
        selectedPaymentMethod,
        formData
      }));
      navigate('/login', { 
        replace: true,
        state: { 
          from: location.pathname,
          returnTo: '/payment'
        }
      });
      return;
    }

    // Validation on component mount
    if (!hotel || !dates) {
      toast.error('Missing booking information');
      navigate('/hotels');
      return;
    }

    if (!dates.checkIn || !dates.checkOut) {
      toast.error('Invalid booking dates');
      navigate('/hotels');
      return;
    }

    // Validate dates
    const checkIn = moment(dates.checkIn);
    const checkOut = moment(dates.checkOut);
    
    if (!checkIn.isValid() || !checkOut.isValid()) {
      toast.error('Invalid date format');
      navigate('/hotels');
      return;
    }

    if (checkIn.isBefore(moment(), 'day')) {
      toast.error('Check-in date cannot be in the past');
      navigate('/hotels');
      return;
    }

    if (checkOut.isSameOrBefore(checkIn)) {
      toast.error('Check-out date must be after check-in date');
      navigate('/hotels');
      return;
    }
  }, [hotel, dates, navigate]);

  useEffect(() => {
    // Handle payment result changes
    if (lastPaymentResult) {
      setShowToast(true);
      if (lastPaymentResult.success) {
        setToastVariant('success');
        setToastMessage('Payment successful! Redirecting to your bookings...');
      } else {
        setToastVariant('danger');
        setToastMessage(lastPaymentResult.error || 'Payment failed. Please try again.');
      }
    }
  }, [lastPaymentResult]);

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate card details if using card payment
    if (selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card') {
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
    if (!hotel || !dates) {
      setToastVariant('danger');
      setToastMessage('Invalid booking details');
      setShowToast(true);
      return;
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
      setToastVariant('danger');
      setToastMessage('Please select a payment method');
      setShowToast(true);
      return;
    }

    // Validate card details for card payments
    if ((selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card')) {
      if (!validateForm()) {
        return;
      }
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    try {
      // Validate order data
      if (!hotel?._id) {
        throw new Error('Invalid hotel information');
      }

      // Log input data
      console.log('Creating order with data:', {
        hotel,
        dates,
        selectedPaymentMethod
      });

      const orderData = {
        roomId: hotel._id,
        checkIn: moment(dates.checkIn).format('YYYY-MM-DD'),
        checkOut: moment(dates.checkOut).format('YYYY-MM-DD'),
        guests: parseInt(dates.guests),
        totalAmount: calculateTotalAmount(),
        paymentMethod: selectedPaymentMethod,
        guestName: formData.cardName || '',
        phoneNumber: formData.phoneNumber || '',
        status: 'confirmed',
        paymentDetails: {
          method: selectedPaymentMethod,
          status: 'paid',
          paidAt: new Date().toISOString()
        }
      };

      // Validate the order data
      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        throw new Error('Invalid total amount');
      }
      if (!orderData.guests || orderData.guests <= 0) {
        throw new Error('Invalid number of guests');
      }
      if (!orderData.guestName) {
        throw new Error('Guest name is required');
      }
      if (!orderData.phoneNumber) {
        throw new Error('Phone number is required');
      }

      // Log the final payload
      console.log('Sending order payload:', JSON.stringify(orderData, null, 2));

      // Create the order
      const result = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order creation result:', result);
      
      if (!result.success) {
        if (result.error && result.error.code === 'ECONNABORTED') {
          throw new Error('Connection timed out. Please try again.');
        } else if (result.error && result.error.code === 'ECONNREFUSED') {
          throw new Error('Failed to connect to server. Please try again.');
        } else {
          throw new Error(result.message || 'Order creation failed');
        }
      }

      // Show success message
      dispatch(paymentResult({ success: true }));
      // Remove the booked room from cart
      dispatch(removeItem(hotel._id));
      setShowConfirmation(false);
      
      // Show toast and redirect
      toast.success('Payment successful! Redirecting to booking history...');
      setTimeout(() => {
        navigate("/booking-history");
      }, 2000);
    } catch (error) {
      console.error('Payment error:', {
        message: error.message,
        details: error.response?.data || error
      });
      
      if (error.response && error.response.status === 400) {
        dispatch(paymentResult({ 
          success: false, 
          error: error.response.data.message || 'Invalid request. Please try again.' 
        }));
      } else if (error.response && error.response.status === 401) {
        dispatch(paymentResult({ 
          success: false, 
          error: error.response.data.message || 'Unauthorized. Please login to continue.' 
        }));
      } else if (error.response && error.response.status === 500) {
        dispatch(paymentResult({ 
          success: false, 
          error: error.response.data.message || 'Internal server error. Please try again.' 
        }));
      } else {
        dispatch(paymentResult({ 
          success: false, 
          error: error.message || 'Payment failed. Please try again.' 
        }));
      }
      
      toast.error(error.message || 'Payment failed. Please try again.');
      setShowConfirmation(false);
    }
  };

  const calculateTotalAmount = () => {
    // Calculate total amount based on hotel price and dates
    const checkIn = moment(dates.checkIn);
    const checkOut = moment(dates.checkOut);
    const nights = checkOut.diff(checkIn, 'days');
    return hotel.price * nights;
  };

  if (!hotel || !dates) {
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
                    <p><strong>Check-in:</strong> {dates?.checkIn ? moment(dates.checkIn).format('YYYY-MM-DD') : ''}</p>
                    <p><strong>Check-out:</strong> {dates?.checkOut ? moment(dates.checkOut).format('YYYY-MM-DD') : ''}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Guests:</strong> {dates?.guests}</p>
                    <p className="h5 text-primary">Total Amount: NPR {calculateTotalAmount()}</p>
                  </Col>
                </Row>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="esewa">eSewa</option>
                    <option value="khalti">Khalti</option>
                  </Form.Select>
                </Form.Group>

                {(selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card') && (
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

                    <Form.Group className="mb-3">
                      <Form.Label>Card Holder Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="JOHN DOE"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="9801234567"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </>
                )}

                {(selectedPaymentMethod === 'esewa' || selectedPaymentMethod === 'khalti') && (
                  <Alert variant="info">
                    Payment will be processed directly through {selectedPaymentMethod === 'esewa' ? 'eSewa' : 'Khalti'}.
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : `Pay NPR ${calculateTotalAmount()}`}
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
              dates,
              selectedPaymentMethod,
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
