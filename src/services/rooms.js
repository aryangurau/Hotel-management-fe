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
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axiosInstance.post(URLS.ROOMS, payload, config);
    return response;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

const getRoomById = (id) => {
  return axiosInstance.get(`${URLS.ROOMS}/${id}`, { ...config });
};

const getById = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axiosInstance.get(`${URLS.ROOMS}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
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

const update = async (id, data) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axiosInstance.put(`${URLS.ROOMS}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(data instanceof FormData ? {} : { "Content-Type": "application/json" })
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
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
  getById,
  updateRoom,
  update,
  updateRoomStatus,
  removeRoom,
};

export default RoomServices;
