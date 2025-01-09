import { useState } from 'react';
import { Card, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import '../css/admin.css';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'admin@broadway.com',
    phone: '+977 9876543210',
    address: 'Kathmandu, Nepal',
    role: 'Administrator',
    joinDate: 'January 1, 2024'
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Add API call to save profile data
  };

  return (
    <div className="admin-profile py-4">
      <h2 className="mb-4">Admin Profile</h2>
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="mb-4">
                <Image
                  src="https://via.placeholder.com/150"
                  roundedCircle
                  width={150}
                  height={150}
                  className="border shadow-sm"
                />
              </div>
              <h4>{profileData.name}</h4>
              <p className="text-muted">{profileData.role}</p>
              <p className="small text-muted">Member since {profileData.joinDate}</p>
              <Button
                variant="outline-primary"
                className="mt-2"
                onClick={handleEdit}
              >
                <FaEdit className="me-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Profile Details</h5>
              <Form onSubmit={handleSave}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="text-muted">
                        <FaUser className="me-2" />
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="text-muted">
                        <FaEnvelope className="me-2" />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="text-muted">
                        <FaPhone className="me-2" />
                        Phone
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="text-muted">
                        <FaMapMarkerAlt className="me-2" />
                        Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({ ...profileData, address: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {isEditing && (
                  <div className="text-end mt-3">
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfile;
