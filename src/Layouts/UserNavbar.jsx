import { Nav, Navbar, Button, ButtonGroup, Dropdown } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import logo from "../assets/img/logo3.jpg";
// import icon from "../assets/img/signup.gif";
import icon2 from "../assets/img/login.gif";
import { getCurrentUser, removeAll } from "../Utils/session";
import { isLoggedIn } from "../Utils/login";

const UserNavbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const getUserInfo = () => {
    const data = getCurrentUser();
    if (!data) return "";
    const { name } = JSON.parse(data); //converts into object
    console.log({ name });
    if (!name) return "";
    return name;
  };

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
            <Nav className="ms-auto">
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
              {loggedIn && getUserInfo() ? (
                <>
                  <Dropdown as={ButtonGroup}>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Welcome {getUserInfo()}
                    </Button>
                    <Dropdown.Toggle
                      split
                      variant="secondary"
                      id="dropdown-split-basic"
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => navigate("/admin/profile")}>
                        My Profile
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate("/admin/orders")}>
                        My Orders
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={() => {
                          removeAll();
                          navigate("/login");
                        }}
                      >
                        Log Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Link to="/login" className="nav-link mx-2 p-2">
                  <img src={icon2} width={30} height={30} alt="" /> login{" "}
                  <LuLogIn />
                </Link>
               
                
              )}
            </button>
            {/* <button>
              {loggedIn &&}
              <Link to="/signup" className="nav-link p-2">
                Sign up <img src={icon} width={30} height={30} alt="" />
              </Link>
            </button>  */}
          </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
};

export default UserNavbar;
