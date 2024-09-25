import { Navigate } from "react-router-dom";
import { isLoggedIn, isValidRole } from "../Utils/login";
import PropTypes from "prop-types";

// Higher Order Component
const PrivateRoute = ({ children, role }) => {
  return (
    <>
      {isLoggedIn() && isValidRole(role) ? (
        children
      ) : isLoggedIn() && !isValidRole(role) ? (
        <Navigate replace to="/admin/dashboard" />
      ) : (
        <Navigate replace to="/login" />
      )}
    </>
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  role: PropTypes.array,
};

export default PrivateRoute;