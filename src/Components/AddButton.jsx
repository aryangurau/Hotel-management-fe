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

export const ShoppingButton = ({ size = 0 }) => {
  return (
    <>
      <TbShoppingBag size="1.5rem" />
      <Badge pill bg="dark">
        {size}
      </Badge>
    </>
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