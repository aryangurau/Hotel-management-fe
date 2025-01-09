import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button, Form, Modal } from 'react-bootstrap';
import { getMyBookings } from '../slices/bookingSlice';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser } from '../slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.booking);
  const auth = useSelector((state) => state.auth);
  const user = auth?.user || {};

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (user?.name || user?.email) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      }));
    }
  }, [user?.name, user?.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updateData = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      toast.success('Profile updated successfully');
      setShowEditModal(false);
      
      // Update auth state with new user data
      dispatch(updateUser(data.user));
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
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

  // Calculate booking statistics
  const stats = bookings?.reduce((acc, booking) => {
    // Total amount spent
    acc.totalSpent += booking.amount || 0;
    
    // Count by status
    acc.statusCount[booking.status] = (acc.statusCount[booking.status] || 0) + 1;
    
    // Most recent booking
    const bookingDate = new Date(booking.created_at);
    if (!acc.lastBooking || bookingDate > new Date(acc.lastBooking.created_at)) {
      acc.lastBooking = booking;
    }
    
    // Most expensive booking
    if (!acc.mostExpensive || booking.amount > acc.mostExpensive.amount) {
      acc.mostExpensive = booking;
    }

    return acc;
  }, { totalSpent: 0, statusCount: {}, lastBooking: null, mostExpensive: null });

  return (
    <>
      <ToastContainer />
      
      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password (optional)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Container className="py-5">
        <Row>
          {/* Profile Information */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <div className="text-center mb-4">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <h3 className="mt-3">{user?.name || 'User'}</h3>
                  <p className="text-muted">{user?.email}</p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
                
                <div>
                  <h5>Account Details</h5>
                  <hr />
                  <p><strong>Role:</strong> {user?.role?.toUpperCase() || 'User'}</p>
                  <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
                  {user?.created_at && (
                    <p><strong>Member Since:</strong> {moment(user.created_at).format('MMMM YYYY')}</p>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Booking Statistics */}
            <Card>
              <Card.Body>
                <h5>Booking Statistics</h5>
                <hr />
                <div className="mb-3">
                  <strong>Total Spent:</strong>
                  <h4 className="text-success">₹{stats?.totalSpent?.toLocaleString() || '0'}</h4>
                </div>
                <div className="mb-3">
                  <strong>Booking Status:</strong>
                  <div className="mt-2">
                    {Object.entries(stats?.statusCount || {}).map(([status, count]) => (
                      <Badge 
                        key={status}
                        bg={getStatusBadgeVariant(status)}
                        className="me-2 mb-2"
                        style={{ fontSize: '0.9em' }}
                      >
                        {status}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
                {stats?.lastBooking && (
                  <div className="mb-3">
                    <strong>Last Booking:</strong>
                    <p className="mb-1">{moment(stats.lastBooking.created_at).format('MMM D, YYYY')}</p>
                    <small className="text-muted">{stats.lastBooking.hotelName}</small>
                  </div>
                )}
                {stats?.mostExpensive && (
                  <div>
                    <strong>Highest Booking:</strong>
                    <p className="mb-1">₹{stats.mostExpensive.amount?.toLocaleString()}</p>
                    <small className="text-muted">{stats.mostExpensive.hotelName}</small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Booking History */}
          <Col md={8}>
            <Card>
              <Card.Body>
                <h5>Recent Booking History</h5>
                <hr />
                
                {bookingsLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Hotel</th>
                          <th>Dates</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id || booking.orderNo}>
                            <td>
                              <small>{booking.orderNo}</small>
                            </td>
                            <td>
                              <div>{booking.hotelName || 'Hotel'}</div>
                              <small className="text-muted">
                                {booking.roomType || 'Standard Room'}
                              </small>
                            </td>
                            <td>
                              <div>{moment(booking.arrivalDate).format('MMM D')}</div>
                              <small className="text-muted">
                                to {moment(booking.departureDate).format('MMM D, YYYY')}
                              </small>
                            </td>
                            <td>
                              <div>₹{booking.amount?.toLocaleString()}</div>
                              <small className="text-muted">
                                {booking.paymentMethod?.replace('_', ' ').toUpperCase()}
                              </small>
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(booking.status)}>
                                {booking.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No booking history found</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
