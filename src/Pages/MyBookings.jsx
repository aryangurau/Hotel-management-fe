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
      // Get user data from session storage
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        throw new Error('User session not found');
      }
      const user = JSON.parse(userStr);
      
      // Fetch bookings for the current user
      const response = await axiosInstance.get(`/bookings/user/${user._id}`);
      console.log('Bookings response:', response.data);
      
      if (response.data?.data) {
        setBookings(response.data.data);
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'CONFIRMED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger',
      'COMPLETED': 'info'
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(price);
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
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
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
                  <option value="ALL">All</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>To Date</Form.Label>
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
                    placeholder="Search bookings..."
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

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No bookings found</h4>
            <p className="text-muted">You haven't made any bookings yet.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredBookings.map((booking) => (
            <Col key={booking._id}>
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>Booking #{booking._id.slice(-6)}</span>
                    {getStatusBadge(booking.status)}
                  </Card.Title>
                  <Card.Text as="div">
                    <p className="mb-1">
                      <strong>Room:</strong> {booking.roomId?.name || 'N/A'}
                    </p>
                    <p className="mb-1">
                      <strong>Check In:</strong> {formatDate(booking.checkIn)}
                    </p>
                    <p className="mb-1">
                      <strong>Check Out:</strong> {formatDate(booking.checkOut)}
                    </p>
                    <p className="mb-1">
                      <strong>Guests:</strong> {booking.guests}
                    </p>
                    <p className="mb-1">
                      <strong>Amount:</strong> {formatPrice(booking.totalAmount)}
                    </p>
                    <p className="mb-1">
                      <strong>Payment:</strong> {booking.paymentMethod}
                    </p>
                  </Card.Text>
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
