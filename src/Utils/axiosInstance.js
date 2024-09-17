import axios from "axios";
import { BASE_URL } from "../Constants/index";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});
