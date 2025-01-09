import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo3.jpg";
import { getCurrentUser, removeAll } from "../Utils/session";
import { isLoggedIn } from "../Utils/login";
import "./css/nav.css";
import { ShoppingButton } from "../components/AddButton";
import { useSelector } from "react-redux";

const UserNavbar = () => {
  const cart = useSelector((state) => state.cart) || { quantity: 0 };
  const { quantity } = cart;
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 200);  
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getUserInfo = () => {
    const data = getCurrentUser();
    if (!data) return "";
    
    // Check if data is already an object
    if (typeof data === 'object') {
      const { name, roles } = data;
      if (!name) return "";
      return { name, roles };
    }
    
    try {
      // Try parsing if it's a string
      const { name, roles } = JSON.parse(data);
      if (!name) return "";
      return { name, roles };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return "";
    }
  };

  const handleProfileClick = () => {
    const userInfo = getUserInfo();
    if (userInfo?.roles?.includes("admin")) {
      navigate("/admin/profile");
    } else {
      navigate("/profile");
    }
  };

  const handleDashboardClick = () => {
    navigate("/admin/dashboard");
  };

  const userInfo = getUserInfo();
  const isAdmin = userInfo?.roles?.includes("admin");

  return (
    <div>
      {/* Nav bar */}
      <section className={`navbar-wrapper ${isSticky ? 'sticky' : ''}`}>
        <div className="container-fluid head-top">
          <div className="container top-con">
            <nav className="navbar navbar-expand-lg navbar-light">
              {/* Logo */}
              <Link to="/" className="navbar-brand d-flex align-items-center">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "40px", marginRight: "10px" }}
                />
                <span>XYZ Hotel</span>
              </Link>

              {/* Hamburger Menu */}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Navigation Items */}
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto align-items-center gap-3">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/booking" className="nav-link">
                      Booking
                    </Link>
                  </li>
                  {loggedIn ? (
                    <>
                      <li className="nav-item">
                        <Link to="/cart" className="nav-link">
                          <ShoppingButton size={quantity} />
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/my-bookings" className="nav-link">
                          My Bookings
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Dropdown>
                          <Dropdown.Toggle variant="primary">
                            Welcome, {userInfo?.name || "User"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={handleProfileClick}>
                              <i className="fas fa-user me-2"></i>
                              {isAdmin ? "Admin Profile" : "Profile"}
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/my-bookings">
                              <i className="fas fa-calendar-check me-2"></i>
                              My Bookings
                            </Dropdown.Item>
                            {isAdmin && (
                              <>
                                <Dropdown.Item onClick={handleDashboardClick}>
                                  <i className="fas fa-tachometer-alt me-2"></i>
                                  Admin Dashboard
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/admin/rooms">
                                  <i className="fas fa-bed me-2"></i>
                                  Manage Rooms
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/admin/orders">
                                  <i className="fas fa-clipboard-list me-2"></i>
                                  Orders
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/admin/users">
                                  <i className="fas fa-users me-2"></i>
                                  Manage Users
                                </Dropdown.Item>
                              </>
                            )}
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              onClick={() => {
                                removeAll();
                                navigate("/login");
                              }}
                            >
                              <i className="fas fa-sign-out-alt me-2"></i>
                              Logout
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link to="/login" className="nav-link">
                          Login
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/register" className="nav-link">
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserNavbar;
