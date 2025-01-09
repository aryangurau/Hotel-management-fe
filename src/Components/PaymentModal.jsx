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
        setLoading(true);
        try {
            // Initiate payment
            const response = await httpClient.post('/payments/initiate', {
                bookingId: bookingData._id,
                paymentMethod,
                amount: bookingData.totalAmount
            });

            // Simulate payment verification (in real app, this would be handled by the payment gateway)
            await httpClient.post('/payments/verify', {
                transactionId: response.data.data.transactionId,
                status: 'COMPLETED'
            });

            toast.success('Payment successful!');
            onHide();
            
        } catch (error) {
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
                    <Form.Group className="mb-3">
                        <Form.Label>Amount to Pay</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={`NPR ${bookingData?.totalAmount || 0}`} 
                            disabled 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Select Payment Method</Form.Label>
                        <Form.Select 
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Choose...</option>
                            <option value="KHALTI">Khalti</option>
                            <option value="ESEWA">eSewa</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="CASH">Cash</option>
                        </Form.Select>
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading} 
                        className="w-100"
                    >
                        {loading ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;
