
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { getToken } from "../Utils/session";

const config = {
  headers: {
    access_token: getToken(),
  },
};

const list = ({ limit, page, name, status }) => {
  return axiosInstance.get(
    `${URLS.ROOMS}?page=${page}&limit=${limit}&name=${name}&status=${status}`,
    config
  );
};

const create = (payload) => {
  return axiosInstance.post(URLS.ROOMS, payload, config);
};

const getRoomById = (id) => {
  return axiosInstance.get(`${URLS.ROOMS}/${id}`, { ...config });
};

const updateRoom = (id, payload) => {
  return axiosInstance.put(`${URLS.ROOMS}/${id}`, payload, { ...config });
};

const updateRoomStatus = (id, payload) => {
  return axiosInstance.patch(`${URLS.ROOMS}/${id}`, payload, { ...config });
};

const removeRoom = (name) => {
  return axiosInstance.delete(`${URLS.ROOMS}/${name}`, { ...config });
};

const RoomServices = {
  list,
  create,
  getRoomById,
  updateRoom,
  updateRoomStatus,
  removeRoom,
};

export default RoomServices;
