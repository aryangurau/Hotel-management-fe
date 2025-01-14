import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button, Form, Modal } from 'react-bootstrap';
import { getMyBookings } from '../slices/bookingSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Utils/axiosInstance';
import { URLS } from '../Constants';

const Profile = () => {
  const dispatch = useDispatch();
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.booking);
  const fileInputRef = useRef(null);
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null
  });
  const [errors, setErrors] = useState({});

  // Initialize user state from session storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        toast.error('Error loading profile data');
      }
    }
    // Fetch bookings if needed
    dispatch(getMyBookings());
  }, [dispatch]);

  // Handle edit modal
  const handleShowEditModal = () => {
    const userData = user || JSON.parse(sessionStorage.getItem('user') || '{}');
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      profilePicture: null
    });
    setPreviewImage(null);
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update profile function
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update your profile');
        return;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add required fields first
      formDataToSend.append('name', formData.name.trim());
      
      // Add optional fields
      if (formData.phone?.trim()) {
        formDataToSend.append('phone', formData.phone.trim());
      }
      if (formData.address?.trim()) {
        formDataToSend.append('address', formData.address.trim());
      }
      
      // Add profile picture if it's a new file
      if (formData.profilePicture instanceof File) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      console.log('Updating profile...');
      const response = await axiosInstance.put('/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.data) {
        const updatedUser = response.data.data;
        // Update local state
        setUser(updatedUser);
        // Update session storage
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
        setShowEditModal(false);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  // Edit Profile Modal
  const renderEditProfileModal = () => (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateProfile}>
          <div className="text-center mb-4">
            <div 
              className="position-relative d-inline-block"
              style={{ cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={previewImage || (user?.profilePicture ? `http://localhost:4999/resources/uploads/${user.profilePicture}` : 'https://via.placeholder.com/150')}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <div 
                className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-camera text-white"></i>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>

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
              value={formData.email}
              disabled
            />
            <Form.Text className="text-muted">
              Email cannot be changed
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
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
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img
                  src={user?.profilePicture ? `http://localhost:4999/resources/uploads/${user.profilePicture}` : 'https://via.placeholder.com/150'}
                  alt={user?.name}
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <h4>{user?.name}</h4>
                <p className="text-muted mb-1">{user?.email}</p>
                <p className="text-muted mb-4">{user?.address}</p>
                <Button variant="primary" onClick={handleShowEditModal}>
                  Edit Profile
                </Button>
              </div>
              <hr />
              <div className="mb-3">
                <strong>Phone:</strong> {user?.phone || 'Not provided'}
              </div>
              <div className="mb-3">
                <strong>Address:</strong> {user?.address || 'Not provided'}
              </div>
              <div className="mb-3">
                <strong>Member Since:</strong> {' '}
                {moment(user?.createdAt).format('MMMM DD, YYYY')}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">Profile Details</h5>
              <Table>
                <tbody>
                  <tr>
                    <td><strong>Full Name</strong></td>
                    <td>{user?.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone</strong></td>
                    <td>{user?.phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Address</strong></td>
                    <td>{user?.address || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Member Since</strong></td>
                    <td>{moment(user?.createdAt).format('MMMM D, YYYY')}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

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
                          <td>{moment(booking.checkIn).format('MMM D, YYYY')}</td>
                          <td>{moment(booking.checkOut).format('MMM D, YYYY')}</td>
                          <td>
                            NPR {booking.totalAmount?.toLocaleString()}
                          </td>
                          <td>
                            <Badge bg={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'PENDING' ? 'warning' : booking.status === 'CANCELLED' ? 'danger' : 'info'}>
                              {booking.status}
                            </Badge>
                          </td>
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

      {renderEditProfileModal()}
    </Container>
  );
};

export default Profile;
