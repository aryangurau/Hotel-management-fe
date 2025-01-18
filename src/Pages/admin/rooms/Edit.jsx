import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { getCurrentUser } from "../../../utils/session";
import { getRoom, updateRoom } from "../../../slices/roomSlice";

const AdminRoomEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "double",
    price: "",
    totalGuests: "",
    description: "",
    amenities: "",
    status: "empty",
    images: []
  });

  // Fetch room data on component mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await dispatch(getRoom(id)).unwrap();
        if (response?.data) {
          const room = response.data;
          setFormData({
            name: room.name || "",
            type: room.type || "double",
            price: room.price || "",
            totalGuests: room.totalGuests || "",
            description: room.description || "",
            amenities: room.amenities?.join(", ") || "",
            status: room.status || "empty"
          });
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error(error.message || "Failed to fetch room details");
        navigate("/admin/rooms");
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id, dispatch, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user and check token
      const currentUser = getCurrentUser();
      const token = sessionStorage.getItem('token');

      if (!currentUser || !token) {
        toast.error('Your session has expired. Please login again.');
        navigate('/login');
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
      formDataToSend.append('status', formData.status);

      // Add new images if selected
      if (formData.images?.length > 0) {
        Array.from(formData.images).forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      console.log('Updating room data:', {
        name: formData.name,
        type: formData.type,
        price,
        totalGuests,
        status: formData.status,
        newImages: formData.images?.length || 0
      });

      const response = await dispatch(updateRoom({ id, data: formDataToSend })).unwrap();
      console.log('Room update response:', response);
      
      if (response?.data || response?._id) { 
        toast.success(response.msg || 'Room updated successfully!');
        navigate('/admin/rooms');
      } else {
        throw new Error('Failed to update room: No data returned');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error(error.message || 'Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-4">Edit Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Room Name*</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Room Type*</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price (NPR)*</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="750"
            max="10000"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Guests*</label>
          <input
            type="number"
            className="form-control"
            name="totalGuests"
            value={formData.totalGuests}
            onChange={handleInputChange}
            min="1"
            max="5"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amenities (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            name="amenities"
            value={formData.amenities}
            onChange={handleInputChange}
            placeholder="e.g., WiFi, TV, Air Conditioning"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="empty">Empty</option>
            <option value="booked">Booked</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">New Images (optional)</label>
          <input
            type="file"
            className="form-control"
            name="images"
            onChange={handleInputChange}
            accept="image/*"
            multiple
          />
          <small className="text-muted">Leave empty to keep existing images</small>
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Room'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/rooms')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRoomEdit;