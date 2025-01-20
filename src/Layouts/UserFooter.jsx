import {
  FaFacebookF,
  FaTwitter,
  FaGooglePlusG,
  FaInstagram,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaPrint
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import logo from "../assets/img/logo3.jpg";
import Map from '../Components/Map';
import '../styles/footer.css';

const UserFooter = () => {
  return (
    <footer className="text-white" style={{ backgroundColor: "#003B95" }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* About Us Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-section">
              <div className="d-flex align-items-center mb-4">
                <Image src={logo} width={60} height={60} roundedCircle className="me-3" />
                <h5 className="text-uppercase mb-0">About Us</h5>
              </div>
              <p className="mb-3">
                Welcome to XYZ Hotel, where luxury meets comfort. We are dedicated to providing exceptional hospitality services with a commitment to excellence in every stay.
              </p>
              <p className="mb-4">
                Our mission is to create memorable experiences for our guests through personalized service, elegant accommodations, and world-class amenities.
              </p>
              <div className="social-icons">
                <Link to="/" target="_blank" className="btn btn-floating btn-warning btn-lg me-2">
                  <FaFacebookF size={20} />
                </Link>
                <Link to="/" target="_blank" className="btn btn-floating btn-warning btn-lg me-2">
                  <FaTwitter size={20} />
                </Link>
                <Link to="/" target="_blank" className="btn btn-floating btn-warning btn-lg me-2">
                  <FaGooglePlusG size={22} />
                </Link>
                <Link to="/" target="_blank" className="btn btn-floating btn-warning btn-lg">
                  <FaInstagram size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-section">
              <h5 className="text-uppercase mb-4">Contact Us</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaHome className="me-3 flex-shrink-0" size={20} />
                    <span>123 Hotel Street, Kathmandu, Nepal</span>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaEnvelope className="me-3 flex-shrink-0" size={20} />
                    <span>info@xyzhotel.com</span>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaPhone className="me-3 flex-shrink-0" size={20} />
                    <span>+ 977 234 567 88</span>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaPrint className="me-3 flex-shrink-0" size={20} />
                    <span>+ 977 234 567 89</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Map Column */}
          <div className="col-lg-4 col-md-12">
            <div className="footer-section">
              <h5 className="text-uppercase mb-4">Location</h5>
              <div className="footer-map">
                <Map />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        {new Date().getFullYear()} Copyright:{" "}
        <a className="text-white text-decoration-none" href="/">
          XYZ Hotel
        </a>
      </div>
    </footer>
  );
};

export default UserFooter;
