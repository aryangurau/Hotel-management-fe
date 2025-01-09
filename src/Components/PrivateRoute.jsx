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
      if (!user) {
        console.error('No user data found');
        return false;
      }
      
      if (!user.roles || !Array.isArray(user.roles)) {
        console.error('No valid roles found in user data:', user);
        return false;
      }
      
      const hasRole = roles.some(role => user.roles.includes(role));
      console.log('Role check:', { required: roles, userRoles: user.roles, hasRole });
      return hasRole;
    } catch (error) {
      console.error('Error checking user roles:', error);
      return false;
    }
  };

  if (!isLoggedIn()) {
    console.log('User not logged in, redirecting to login');
    return <Navigate to="/login" replace />;
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