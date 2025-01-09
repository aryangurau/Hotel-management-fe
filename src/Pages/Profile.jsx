import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button, Form, Modal } from 'react-bootstrap';
import { getMyBookings } from '../slices/bookingSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Utils/axiosInstance';

const Profile = () => {
  const dispatch = useDispatch();
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.booking);
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    // Get user data from session storage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }));
    }
    setLoading(false);

    // Fetch bookings
    dispatch(getMyBookings());
  }, [dispatch]);

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
      const response = await axiosInstance.put('/users/profile', updateData);
      
      if (response.data?.success) {
        // Update session storage
        const updatedUser = { ...user, ...updateData };
        delete updatedUser.password; // Don't store password
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update local state
        setUser(updatedUser);
        
        toast.success('Profile updated successfully');
        setShowEditModal(false);
        
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-4">
        <Card className="text-center p-5">
          <Card.Body>
            <h4>Session Expired</h4>
            <p className="text-muted">Please log in again to view your profile.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        {/* Profile Information */}
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center" 
                     style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="mt-3 mb-0">{user.name}</h4>
                <p className="text-muted">{user.email}</p>
              </div>
              
              <div className="d-grid">
                <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
                  Edit Profile
                </Button>
              </div>

              <hr />

              <div>
                <h6 className="text-muted mb-3">Account Information</h6>
                <p className="mb-2">
                  <strong>Role:</strong> {user.roles?.join(', ') || 'User'}
                </p>
                <p className="mb-2">
                  <strong>Member Since:</strong> {formatDate(user.createdAt)}
                </p>
                <p className="mb-0">
                  <strong>Last Updated:</strong> {formatDate(user.updatedAt)}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Bookings */}
        <Col lg={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Recent Bookings</h5>
                <Badge bg="primary" pill>
                  {bookings.length} Total
                </Badge>
              </div>

              {bookingsLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-muted text-center mb-0">No bookings found</p>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking._id}>
                          <td>{booking.roomId?.name || 'N/A'}</td>
                          <td>{formatDate(booking.checkIn)}</td>
                          <td>{formatDate(booking.checkOut)}</td>
                          <td>
                            NPR {booking.totalAmount?.toLocaleString()}
                          </td>
                          <td>{getStatusBadge(booking.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;
