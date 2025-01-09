import { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Image, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../../Utils/axiosInstance';
import '../css/admin.css';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    joinDate: ''
  });

  // Initialize profile data from session storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          role: userData.roles?.includes('admin') ? 'Administrator' : 'Staff',
          joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        toast.error('Error loading profile data');
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update your profile');
        return;
      }

      const updateData = {
        name: profileData.name.trim(),
        phone: profileData.phone?.trim() || '',
        address: profileData.address?.trim() || ''
      };

      console.log('Updating admin profile with data:', updateData);
      const response = await axiosInstance.put('/users/profile', updateData);
      console.log('Update response:', response);

      if (response.data?.data) {
        const updatedUser = response.data.data;
        setProfileData({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          address: updatedUser.address || '',
          role: updatedUser.roles?.includes('admin') ? 'Administrator' : 'Staff',
          joinDate: updatedUser.createdAt ? new Date(updatedUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'
        });
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

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
    <div className="admin-profile py-4">
      <h2 className="mb-4">Admin Profile</h2>
      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <div className="mb-4">
                <div className="profile-image-container">
                  <Image
                    src="https://via.placeholder.com/150"
                    roundedCircle
                    className="profile-image mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <h4>{profileData.name}</h4>
                <p className="text-muted mb-4">{profileData.role}</p>
                <Button
                  variant={isEditing ? "success" : "primary"}
                  onClick={isEditing ? handleSave : handleEdit}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <h5 className="border-bottom pb-2">Profile Information</h5>
              <Form className="mt-4">
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center">
                        <FaUser className="me-2" /> Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center">
                        <FaEnvelope className="me-2" /> Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center">
                        <FaPhone className="me-2" /> Phone
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center">
                        <FaMapMarkerAlt className="me-2" /> Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.role}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Member Since</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.joinDate}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfile;
