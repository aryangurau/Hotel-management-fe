import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { default as axiosInstance } from '../Utils/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings...');
      const response = await axiosInstance.get('/bookings', {
        params: {
          populate: 'roomId'
        }
      });
      console.log('Bookings response:', response.data);
      
      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
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
      return moment(dateString).format('MMM D, YYYY');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      startDate: '',
      endDate: '',
      searchTerm: ''
    });
  };

  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (filters.status !== 'ALL' && booking.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.startDate && moment(booking.checkIn).isBefore(filters.startDate)) {
      return false;
    }
    if (filters.endDate && moment(booking.checkOut).isAfter(filters.endDate)) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        booking.roomId?.name?.toLowerCase().includes(searchLower) ||
        booking.roomId?.type?.toLowerCase().includes(searchLower) ||
        booking._id.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Bookings</h2>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Check-in From</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Check-out To</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search rooms..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={resetFilters}>
                    Reset
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results */}
      {filteredBookings.length === 0 ? (
        <div className="text-center text-muted">
          <p>No bookings found</p>
        </div>
      ) : (
        <Row xs={1} className="g-4">
          {filteredBookings.map((booking) => (
            <Col key={booking._id}>
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
                        <strong>Room Type:</strong> {booking.roomId?.type?.charAt(0).toUpperCase() + booking.roomId?.type?.slice(1)}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <strong>Booking Date:</strong> {formatDate(booking.createdAt)}
                      </div>
                      <div className="mb-2">
                        <strong>Booking ID:</strong> {booking._id}
                      </div>
                      {booking.status === 'CANCELLED' && booking.cancellationReason && (
                        <div className="text-danger">
                          <strong>Cancellation Reason:</strong> {booking.cancellationReason}
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;
