import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { httpClient } from '../Utils/httpClient';
import { toast } from 'react-toastify';

const PaymentModal = ({ show, onHide, bookingData }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        setLoading(true);
        try {
            // Create booking first
            const bookingResponse = await httpClient.post('/bookings', {
                ...bookingData,
                status: 'confirmed',
                paymentMethod
            });

            if (bookingResponse.data.success) {
                toast.success('Booking confirmed successfully!');
                onHide();
                window.location.href = '/booking-history';
            } else {
                throw new Error(bookingResponse.data.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Payment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handlePayment}>
                    <div className="booking-summary mb-4">
                        <h5>Booking Summary</h5>
                        <p>Room Type: {bookingData?.roomType}</p>
                        <p>Check-in: {bookingData?.checkIn}</p>
                        <p>Check-out: {bookingData?.checkOut}</p>
                        <p>Number of Guests: {bookingData?.guests}</p>
                        <p>Total Amount: NPR {bookingData?.totalAmount}</p>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label>Select Payment Method <span className="text-danger">*</span></Form.Label>
                        <div className="payment-methods">
                            {[
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
                            ].map(method => (
                                <div 
                                    key={method.id}
                                    className={`payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod(method.id)}
                                >
                                    <img 
                                        src={method.logo} 
                                        alt={method.name} 
                                        className="payment-logo"
                                    />
                                    <span>{method.name}</span>
                                </div>
                            ))}
                        </div>
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || !paymentMethod} 
                        className="w-100"
                    >
                        {loading ? 'Processing...' : `Pay NPR ${bookingData?.totalAmount || 0}`}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;
