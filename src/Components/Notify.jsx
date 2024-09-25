import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";

export const Notify = ({ msg = "Something broke", variant = "danger" }) => {
  return (
    <div className="m-2">
      <Alert variant={variant}>{msg}</Alert>
    </div>
  );
};

Notify.propTypes = {
  msg: PropTypes.string,
  variant: PropTypes.string,
};