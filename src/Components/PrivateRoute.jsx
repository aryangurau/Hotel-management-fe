import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getCurrentUser, getToken, removeAll } from "../Utils/session";

// Higher Order Component
const PrivateRoute = ({ children, roles }) => {
  const location = useLocation();

  const isAuthenticated = () => {
    const token = getToken();
    const user = getCurrentUser();
    
    if (!token || !user) {
      console.error('Missing authentication:', { hasToken: !!token, hasUser: !!user });
      return false;
    }
    
    try {
      // Verify token format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        removeAll();
        return false;
      }

      // Decode token
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Verify token payload matches user data
      if (payload.email !== user.email || payload._id !== user._id) {
        console.error('Token payload mismatch with user data');
        removeAll();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      removeAll();
      return false;
    }
  };

  const hasRequiredRole = () => {
    if (!roles) return true;
    
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error('No user data found');
        return false;
      }
      
      if (!user.roles || !Array.isArray(user.roles)) {
        console.error('No valid roles found in user data:', user);
        return false;
      }
      
      const hasRole = roles.some(role => user.roles.includes(role));
      console.log('Role check:', { 
        required: roles, 
        userRoles: user.roles, 
        hasRole,
        path: location.pathname 
      });
      return hasRole;
    } catch (error) {
      console.error('Error checking user roles:', error);
      return false;
    }
  };

  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole()) {
    console.log('User does not have required role, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Authorized, render component
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string)
};

export default PrivateRoute;