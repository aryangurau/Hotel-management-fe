import { getToken } from './session';
import { jwtDecode } from 'jwt-decode';

export const getUserData = () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User session expired');
    }

    const decoded = jwtDecode(token);
    if (!decoded || !decoded.email) {
      throw new Error('Invalid user data');
    }

    return {
      email: decoded.email,
      name: decoded.name || 'Guest',
      _id: decoded._id
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};
