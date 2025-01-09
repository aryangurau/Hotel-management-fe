import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Logo from "../assets/img/logo3.jpg";
import "./css/admin.css";

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div className="container-fluid px-4">
        <div className="brand">
          <Image 
            src={Logo} 
            width="30" 
            height="30" 
            className="rounded-circle" 
            alt="Logo"
          />
          <div>
            <span className="fw-semibold">Broadway Hotels</span>
            <small className="d-block text-muted"> {new Date().getFullYear()}</small>
          </div>
        </div>

        <div className="text-muted">
          All rights reserved
        </div>

        <div className="social-links">
          <Link to="#" title="Facebook">
            <FaFacebookF size={18} />
          </Link>
          <Link to="#" title="Twitter">
            <FaTwitter size={18} />
          </Link>
          <Link to="#" title="LinkedIn">
            <FaLinkedinIn size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;