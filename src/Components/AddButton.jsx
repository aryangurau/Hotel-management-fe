import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { TbShoppingBag } from "react-icons/tb";
import { Badge } from "react-bootstrap";

const AddButton = ({ text = "Add new", variant = "primary", url = "/" }) => {
  return (
    <Link to={url} className="text-decoration-none">
      <div className="d-flex flex-row-reverse">
        <button type="button" className={`btn btn-${variant}`}>
          <i className="bi bi-plus"></i> {text}
        </button>
      </div>
    </Link>
  );
};

export const ShoppingButton = ({ size }) => {
  return (
    <div className="shopping-button">
      <i className="bi bi-cart3 fs-5"></i>
      <span className="quantity-badge">
        {size || 0}
      </span>
    </div>
  );
};

AddButton.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.string,
  url: PropTypes.string,
};

ShoppingButton.propTypes = {
  size: PropTypes.number,
};

export default AddButton;