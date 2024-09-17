import {  Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import logo from "../assets/img/logo3.jpg"
const UserNavbar = () => {
  return (
    <div>
      {/* Nav bar */}
      <Navbar expand="lg" className="bg-primary text-white " variant="dark">
        <div className="container d-flex justify-content-center">
          <Link to="/" className="navbar-brand">
           <img src={logo} width={30} height={30} alt="" /> XYZ hotel
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
              <Link to="/about" className="nav-link">
                About
              </Link>
              
            </Nav>
          <button>
          <Link to="/login" className="nav-link mx-2 p-2">
                login <LuLogIn />
              </Link>
              </button>
            <button>  <Link to="/signup" className="nav-link p-2">
                Sign up 
              </Link>
              </button>
              </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
};

export default UserNavbar;
