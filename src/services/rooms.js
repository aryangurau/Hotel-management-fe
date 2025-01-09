import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { getToken } from "../Utils/session";

const config = {
  headers: {
    access_token: getToken(),
  },
};

const list = ({ limit = 10, page = 1, name = "", status = "" }) => {
  return axiosInstance.get(
    `${URLS.ROOMS}?page=${page}&limit=${limit}&name=${name}&status=${status}`,
    config
  );
};

const getPublicRooms = () => {
  return axiosInstance.get(`${URLS.ROOMS}/public`);
};

const create = async (payload) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    // Extract data from FormData
    const roomData = {};
    const files = [];

    for (let [key, value] of payload.entries()) {
      if (key === 'images') {
        files.push(value);
      } else {
        roomData[key] = value;
      }
    }

    // Convert numeric fields
    roomData.price = Number(roomData.price);
    roomData.totalGuests = Number(roomData.totalGuests);

    // Ensure required fields
    if (!roomData.name?.trim()) {
      throw new Error('Room name is required');
    }

    // Create the room data object exactly as backend expects
    const roomPayload = {
      name: roomData.name.trim(),
      type: roomData.type.toLowerCase(),
      price: roomData.price,
      totalGuests: roomData.totalGuests,
      created_by: roomData.updated_by,
      status: 'empty'
    };

    // Add optional fields
    if (roomData.description?.trim()) {
      roomPayload.description = roomData.description.trim();
    }
    if (roomData.amenities?.trim()) {
      try {
        roomPayload.amenities = JSON.parse(roomData.amenities);
      } catch {
        roomPayload.amenities = roomData.amenities
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
      }
    }

    // Log the final payload
    console.log('Room payload:', roomPayload);

    // First check if room name exists
    try {
      const checkResponse = await axiosInstance.get(`${URLS.ROOMS}?name=${encodeURIComponent(roomPayload.name)}`, {
        headers: { 'access_token': token }
      });
      
      if (checkResponse?.data?.data?.length > 0) {
        throw new Error(`A room with the name "${roomPayload.name}" already exists. Please choose a different name.`);
      }
    } catch (checkError) {
      if (checkError.message.includes('already exists')) {
        throw checkError;
      }
      // Ignore other errors from the check
    }

    // Create room first
    const response = await axiosInstance.post(URLS.ROOMS, roomPayload, {
      headers: {
        'access_token': token,
        'Content-Type': 'application/json'
      }
    });

    // If we have images and room creation was successful, upload them
    if (response?.data?.data?._id && files.length > 0) {
      try {
        const imageFormData = new FormData();
        files.forEach(file => {
          imageFormData.append('images', file);
        });

        // Upload images to the room - using the correct endpoint
        await axiosInstance.patch(
          `${URLS.ROOMS}/${response.data.data._id}`,
          imageFormData,
          {
            headers: {
              'access_token': token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } catch (imageError) {
        console.error('Failed to upload images:', imageError);
        // Don't fail the whole operation if image upload fails
        // Just return the room data
      }
    }

    return response;
  } catch (error) {
    // Log the detailed error
    console.error('Room creation error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific error cases
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    }

    // If it's our custom error, throw it directly
    if (error.message?.includes('already exists')) {
      throw error;
    }

    throw new Error('Failed to create room. Please try again.');
  }
};

const getRoomById = (id) => {
  return axiosInstance.get(`${URLS.ROOMS}/${id}`, { ...config });
};

const updateRoom = (id, payload) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const multipartConfig = {
    headers: {
      'access_token': token
    }
  };

  return axiosInstance.put(`${URLS.ROOMS}/${id}`, payload, multipartConfig);
};

const updateRoomStatus = (id, payload) => {
  return axiosInstance.patch(`${URLS.ROOMS}/${id}`, payload, { ...config });
};

const removeRoom = (name) => {
  return axiosInstance.delete(`${URLS.ROOMS}/${name}`, { ...config });
};

const RoomServices = {
  list,
  getPublicRooms,
  create,
  getRoomById,
  updateRoom,
  updateRoomStatus,
  removeRoom,
};

export default RoomServices;
