import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner, Card } from 'react-bootstrap';
import { default as axiosInstance } from '../Utils/axiosInstance';
import { toast } from 'react-toastify';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const fetchBookingHistory = async () => {
        try {
            const response = await axiosInstance.get('/bookings');
            if (response.data?.success) {
                setBookings(response.data.data);
            } else {
                throw new Error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Booking history error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch booking history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'CONFIRMED': 'success',
            'PENDING': 'warning',
            'CANCELLED': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="text-center text-muted">
                    <p>No bookings found</p>
                </div>
            ) : (
                <div className="row g-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="col-12">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="mb-1">
                                                {booking.roomId?.name || 'Room Unavailable'}
                                                {' '}
                                                {getStatusBadge(booking.status)}
                                            </h5>
                                            <p className="text-muted mb-2">
                                                {booking.roomId?.type?.charAt(0).toUpperCase() + booking.roomId?.type?.slice(1)} Room
                                            </p>
                                        </div>
                                        <h5 className="mb-0">NPR {booking.totalAmount?.toLocaleString()}</h5>
                                    </div>
                                    
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <div className="mb-2">
                                                <strong>Check-in:</strong> {formatDate(booking.checkIn)}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Check-out:</strong> {formatDate(booking.checkOut)}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Guests:</strong> {booking.guests}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-2">
                                                <strong>Booking Date:</strong> {formatDate(booking.createdAt)}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Room Type:</strong> {booking.roomId?.type?.charAt(0).toUpperCase() + booking.roomId?.type?.slice(1)}
                                            </div>
                                            {booking.status === 'CANCELLED' && (
                                                <div className="mb-2">
                                                    <strong>Cancelled On:</strong> {formatDate(booking.cancelledAt)}
                                                    {booking.cancellationReason && (
                                                        <div className="small text-muted">
                                                            Reason: {booking.cancellationReason}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default BookingHistory;
