import moment from "moment";
import { jwtDecode } from "jwt-decode";

import { getToken, setCurrentUser, removeAll } from "./session";

export const isLoggedIn = () => {
  try {
    // Check if token exists or not
    const token = getToken();
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) return false;
    
    const now = moment().unix();
    // Check if token has expired or not
    return decoded.exp > now;
  } catch (error) {
    console.error('Error checking login status:', error);
    removeAll();
    return false;
  }
};

export const setLoggedInUser = () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const decoded = jwtDecode(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }
    const { name, email, roles, _id } = decoded;
    if (!name || !email || !_id) {
      throw new Error('Invalid user data in token');
    }
    const userData = { name, email, roles, _id };
    setCurrentUser(userData);
    return userData;
  } catch (error) {
    console.error('Error setting logged in user:', error);
    removeAll();
    throw error;
  }
};

export const isValidRole = (role = []) => {
  try {
    // Check the token validity
    const isValidLogin = isLoggedIn();
    if (!isValidLogin) return false;

    // If no roles to check, return true
    if (!role || role.length === 0) return true;

    // Get user data from token
    const token = getToken();
    if (!token) return false;

    const decoded = jwtDecode(token);
    if (!decoded || !decoded.roles) return false;

    // Compare the roles
    return role.some((r) => decoded.roles.includes(r));
  } catch (error) {
    console.error('Error checking role validity:', error);
    return false;
  }
};