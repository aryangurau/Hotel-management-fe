import PropTypes from "prop-types";

const AddButton = ({ text = "Add new", variant = "primary" }) => {
  return (
    <div className="d-flex flex-row-reverse">
      <button type="button" className={`btn btn-${variant}`}>
        <i className="bi bi-plus"></i> {text}
      </button>
    </div>
  );
};

AddButton.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.string,
};

export default AddButton;