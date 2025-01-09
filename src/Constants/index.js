export const BASE_URL = "http://localhost:4999/api/v1";

// Debug log
console.log('API Base URL:', BASE_URL);

export const URLS = {
  LOGIN: `${BASE_URL}/users/login`,
  REGISTER: `${BASE_URL}/users/register`,
  USERS: `${BASE_URL}/users`,
  ROOMS: `${BASE_URL}/rooms`,
  HOTELS: `${BASE_URL}/hotels`,
  ORDERS: `${BASE_URL}/orders`,
  BOOKINGS: `${BASE_URL}/bookings`,
  VERIFY: `${BASE_URL}/users/verify`,
  FORGET_PASSWORD: `${BASE_URL}/users/forget-password`,
  VERIFY_FORGET_PASSWORD: `${BASE_URL}/users/verify-forget-password`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  PROFILE: `${BASE_URL}/profile`,
};

// Debug log
console.log('Login URL:', URLS.LOGIN);

export const TOKEN_KEY = "token";
export const USER_KEY = "user";