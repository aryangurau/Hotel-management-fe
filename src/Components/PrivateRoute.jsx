import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getCurrentUser } from "../Utils/session";

// Higher Order Component
const PrivateRoute = ({ children, roles }) => {
  const isLoggedIn = () => {
    const user = getCurrentUser();
    return !!user;
  };

  const hasRequiredRole = () => {
    if (!roles) return true;
    
    try {
      const user = getCurrentUser();
      // Check if user is already an object
      if (!user) return false;
      
      // If user is a string, try to parse it
      const userData = typeof user === 'string' ? JSON.parse(user) : user;
      
      if (!userData || !userData.roles) {
        console.error('No roles found in user data');
        return false;
      }
      
      return roles.some(role => userData.roles.includes(role));
    } catch (error) {
      console.error('Error checking user roles:', error);
      return false;
    }
  };

  if (!isLoggedIn()) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole()) {
    // Logged in but wrong role
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