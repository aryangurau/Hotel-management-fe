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
import logo from "../assets/img/logo3.jpg"

const UserFooter = () => {
  return (
    <div>
      {/* Remove the container if you want to extend the Footer to full width. */}
      <footer
        className="text-white text-center text-lg-start"
        style={{ backgroundColor: "#003B95" }}
      >
        {/* Grid container */}
        <div className="container p-4">
          {/*Grid row*/}
          <div className="row mt-4">
            {/*Grid column*/}
            <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
              <Image src={logo} width={60} height={60} roundedCircle />
              <h5 className="text-uppercase mb-4">About Us</h5>
              <p>
                Welcome to XYZ Hotel, where luxury meets comfort. We are dedicated to providing exceptional hospitality services with a commitment to excellence in every stay.
              </p>
              <p>
                Our mission is to create memorable experiences for our guests through personalized service, elegant accommodations, and world-class amenities.
              </p>
              <div className="mt-4 social-icons">
                {/* Facebook */}
                <Link to="/" target="_blank"
                  type="button"
                  className="btn btn-floating btn-warning btn-lg mx-2"
                >
                  <FaFacebookF size={20} />
                </Link>
                {/* Twitter */}
                <Link to="/" target="_blank"
                  type="button"
                  className="btn btn-floating btn-warning btn-lg mx-2"
                >
                  <FaTwitter size={20} />
                </Link>
                {/* Google Plus */}
                <Link to="/" target="_blank"
                  type="button"
                  className="btn btn-floating btn-warning btn-lg mx-2"
                >
                  <FaGooglePlusG size={22} />
                </Link>
                {/* Instagram */}
                <Link to="/" target="_blank"
                  type="button"
                  className="btn btn-floating btn-warning btn-lg mx-2"
                >
                  <FaInstagram size={20} />
                </Link>
              </div>
            </div>
            {/*Grid column*/}
            {/*Grid column*/}
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4 pb-1">Search something</h5>
              <div className="form-outline form-white mb-4">
                <input
                  type="text"
                  id="formControlLg"
                  className="form-control form-control-lg"
                />
                <label
                  className="form-label"
                  htmlFor="formControlLg"
                  style={{ marginLeft: 0 }}
                >
                  Search
                </label>
                <div className="form-notch">
                  <div className="form-notch-leading" style={{ width: 9 }} />
                  <div className="form-notch-middle" style={{ width: "48.8px" }} />
                  <div className="form-notch-trailing" />
                </div>
              </div>
              <ul className="fa-ul" style={{ marginLeft: "1.65em" }}>
                <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-home" />
                  </span>
                  <span className="ms-2">New York, NY 10012, US</span>
                </li>
                <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-envelope" />
                  </span>
                  <span className="ms-2">info@example.com</span>
                </li>
                <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-phone" />
                  </span>
                  <span className="ms-2">+ 01 234 567 88</span>
                </li>
                <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-print" />
                  </span>
                  <span className="ms-2">+ 01 234 567 89</span>
                </li>
              </ul>
            </div>
            {/*Grid column*/}
            {/*Grid column*/}
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Opening hours</h5>
              <table className="table text-center text-white">
                <tbody className="font-weight-normal">
                  <tr>
                    <td>Mon - Thu:</td>
                    <td>8am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Fri - Sat:</td>
                    <td>8am - 1am</td>
                  </tr>
                  <tr>
                    <td>Sunday:</td>
                    <td>9am - 10pm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/*Grid column*/}
          </div>
          {/*Grid row*/}
        </div>
        {/* Grid container */}
        {/* Copyright */}
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          2024 Copyright:
          <Link className="text-white" to="https://github.com/aryangurau/Hotel-management-fe" target="_blank">
            XYZ hotel
          </Link>
        </div>
        {/* Copyright */}
      </footer>
      {/* End of .container */}
    </div>
  );
};

export default UserFooter;
