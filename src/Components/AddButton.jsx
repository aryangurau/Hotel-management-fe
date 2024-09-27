
import PropTypes from "prop-types";
import { TbShoppingBag } from "react-icons/tb";
import { Badge } from "react-bootstrap";

const AddButton = ({ text = "Add new", variant = "primary" }) => {
  return (
    <div className="d-flex flex-row-reverse">
      <button type="button" className={`btn btn-${variant}`}>
        <i className="bi bi-plus"></i> {text}
      </button>
    </div>
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
};

ShoppingButton.propTypes = {
  size: PropTypes.number,
};

export default AddButton;
