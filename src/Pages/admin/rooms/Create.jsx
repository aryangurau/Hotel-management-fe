import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { createRoom } from "../../../slices/roomSlice";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../../Utils/session";

const AdminRoomCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    type: "single", 
    price: "",
    description: "",
    totalGuests: "",
    amenities: "",
    images: [],
    status: "empty"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user and check token
      const currentUser = getCurrentUser();
      const token = sessionStorage.getItem('token');

      if (!currentUser || !token) {
        toast.error('Your session has expired. Please login again.');
        navigate('/login', { state: { from: location } });
        return;
      }

      // Validate required fields
      const requiredFields = ['name', 'type', 'price', 'totalGuests'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate numeric fields
      const price = Number(formData.price);
      const totalGuests = Number(formData.totalGuests);

      if (isNaN(price) || price < 750 || price > 10000) {
        throw new Error('Price must be between 750 and 10000');
      }
      if (isNaN(totalGuests) || totalGuests < 1 || totalGuests > 5) {
        throw new Error('Total guests must be between 1 and 5');
      }

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', price);
      formDataToSend.append('totalGuests', totalGuests);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('amenities', formData.amenities || '');
      formDataToSend.append('status', 'empty');

      // Add images
      if (formData.images?.length > 0) {
        Array.from(formData.images).forEach(image => {
          formDataToSend.append('images', image);
        });
      } else {
        throw new Error('Please select at least one image');
      }

      console.log('Submitting room data:', {
        name: formData.name,
        type: formData.type,
        price,
        totalGuests,
        images: formData.images.length
      });

      const response = await dispatch(createRoom(formDataToSend)).unwrap();
      console.log('Room creation response:', response);
      
      if (response?.data) {
        toast.success(response.msg || 'Room created successfully!');
        navigate('/admin/rooms');
      } else {
        throw new Error('Failed to create room: No data returned');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error(error.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h4>Create New Room</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter room name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Type*</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (Rs.)*</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price (750-10000)"
                    min="750"
                    max="10000"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Guests*</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalGuests"
                    value={formData.totalGuests}
                    onChange={handleChange}
                    placeholder="Enter total guests (1-5)"
                    min="1"
                    max="5"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter room description"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amenities (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="e.g., WiFi, AC, TV"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Images*</Form.Label>
              <Form.Control
                type="file"
                name="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                required
              />
              <Form.Text className="text-muted">
                Select one or more images for the room
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/admin/rooms')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminRoomCreate;
