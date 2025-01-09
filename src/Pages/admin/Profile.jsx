import { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Form, Button, Image, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../../Utils/axiosInstance';
import '../css/admin.css';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    joinDate: '',
    profilePicture: null
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
          }) : 'N/A',
          profilePicture: userData.profilePicture || null
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
    if (!isEditing) {
      setPreviewImage(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
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
      setProfileData(prev => ({
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

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update your profile');
        return;
      }

      // Validate required fields
      if (!profileData.name?.trim()) {
        toast.error('Name is required');
        return;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add required fields first
      formDataToSend.set('name', profileData.name.trim());
      
      // Add optional fields
      if (profileData.phone?.trim()) {
        formDataToSend.set('phone', profileData.phone.trim());
      }
      if (profileData.address?.trim()) {
        formDataToSend.set('address', profileData.address.trim());
      }
      
      // Add profile picture if it's a new file
      if (profileData.profilePicture instanceof File) {
        formDataToSend.set('profilePicture', profileData.profilePicture);
      }

      // Log the form data entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axiosInstance.put('/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
          }) : 'N/A',
          profilePicture: updatedUser.profilePicture || null
        });
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setPreviewImage(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
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
                <div className="profile-image-container position-relative">
                  <Image
                    src={previewImage || profileData.profilePicture || "https://via.placeholder.com/150"}
                    roundedCircle
                    className="profile-image mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  {isEditing && (
                    <>
                      <div 
                        className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FaCamera className="text-white" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="d-none"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                    </>
                  )}
                </div>
                <h4>{profileData.name}</h4>
                <p className="text-muted mb-4">{profileData.role}</p>
                <Button
                  variant={isEditing ? "success" : "primary"}
                  onClick={isEditing ? handleSave : handleEdit}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
                {isEditing && (
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewImage(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
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
