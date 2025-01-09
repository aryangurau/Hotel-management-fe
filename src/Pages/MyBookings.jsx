import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Row, Col, Badge, Spinner, Form, Button, Pagination } from 'react-bootstrap';
import { getMyBookings } from '../slices/bookingSlice';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  // Sorting state
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('');

  // Filtered and sorted bookings
  const [displayedBookings, setDisplayedBookings] = useState([]);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...bookings];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date fields
      if (['created_at', 'arrivalDate', 'departureDate'].includes(sortField)) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setDisplayedBookings(filtered);
  }, [bookings, statusFilter, sortField, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(displayedBookings.length / itemsPerPage);
  const currentBookings = displayedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Bookings</h2>
          
          {/* Filter Controls */}
          <Form.Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </Form.Select>
        </div>

        {/* Sorting Controls */}
        <div className="mb-4">
          <Button 
            variant={sortField === 'created_at' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => handleSort('created_at')}
          >
            Booking Date {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button 
            variant={sortField === 'amount' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => handleSort('amount')}
          >
            Price {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button 
            variant={sortField === 'arrivalDate' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('arrivalDate')}
          >
            Check-in Date {sortField === 'arrivalDate' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
        </div>

        {currentBookings && currentBookings.length > 0 ? (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {currentBookings.map((booking) => (
                <Col key={booking._id || booking.orderNo}>
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{booking.hotelName || 'Hotel'}</h5>
                      <Badge bg={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>{booking.roomType || 'Standard Room'}</Card.Title>
                      <Card.Subtitle className="text-muted mb-3">
                        Room #{booking.roomNumber || 'N/A'}
                      </Card.Subtitle>

                      <div className="mb-2">
                        <strong>Order #:</strong> {booking.orderNo}
                      </div>
                      <div className="mb-2">
                        <strong>Check-in:</strong>{' '}
                        {moment(booking.arrivalDate).format('MMM D, YYYY')}
                      </div>
                      <div className="mb-2">
                        <strong>Check-out:</strong>{' '}
                        {moment(booking.departureDate).format('MMM D, YYYY')}
                      </div>
                      <div className="mb-2">
                        <strong>Amount:</strong>{' '}
                        ₹{booking.amount?.toLocaleString() || 'N/A'}
                      </div>
                      {booking.totalGuests && (
                        <div className="mb-2">
                          <strong>Guests:</strong> {booking.totalGuests}
                        </div>
                      )}
                      <div>
                        <strong>Payment:</strong> {booking.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      Booked on: {moment(booking.created_at).format('MMM D, YYYY')}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ width: '100px' }}
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </Form.Select>

              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <h4>No bookings found</h4>
            <p className="text-muted">Try adjusting your filters or make a new booking</p>
          </div>
        )}
      </Container>
    </>
  );
};

export default MyBookings;
