import { useState, useEffect } from 'react';
import { Dropdown } from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, removeAll } from "../Utils/session";
import { isValidRole } from "../Utils/login";

import "./css/admin.css";

const AdminNavbar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const isAdmin = isValidRole(["admin"]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        onToggle?.(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onToggle]);

  const handleLogout = () => {
    removeAll();
    navigate("/login");
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <div className="sidebar-overlay" onClick={() => onToggle?.(true)} />
      )}
      <div
        className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
        style={{
          width: isCollapsed ? "0" : (isMobile ? "280px" : "280px"),
          transform: isCollapsed && isMobile ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          {!isCollapsed && (
            <Link to="/" className="text-decoration-none text-white">
              <span className="fs-4">XYZ Hotel</span>
            </Link>
          )}
          <button
            className="btn btn-link text-white p-0"
            onClick={() => onToggle?.(!isCollapsed)}
          >
            {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
          </button>
        </div>

        <div className="sidebar-content">
          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <Link
                to="/admin/dashboard"
                className={`nav-link text-white ${pathname.includes("dashboard") ? "active" : ""}`}
              >
                <i className="bi bi-house me-2"></i>
                {!isCollapsed && "Dashboard"}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/orders"
                className={`nav-link text-white ${pathname.includes("orders") ? "active" : ""}`}
              >
                <i className="bi bi-bag me-2"></i>
                {!isCollapsed && "Orders"}
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    to="/admin/rooms"
                    className={`nav-link text-white ${pathname.includes("rooms") ? "active" : ""}`}
                  >
                    <i className="bi bi-archive me-2"></i>
                    {!isCollapsed && "Rooms"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/admin/users"
                    className={`nav-link text-white ${pathname.includes("users") ? "active" : ""}`}
                  >
                    <i className="bi bi-people me-2"></i>
                    {!isCollapsed && "Users"}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="sidebar-footer border-top p-3">
          <Dropdown align={isCollapsed ? "end" : "start"}>
            <Dropdown.Toggle variant="dark" className="d-flex align-items-center w-100">
              <MdAccountCircle size="1.5rem" />
              {!isCollapsed && (
                <span className="ms-2">
                  {(() => {
                    const user = getCurrentUser();
                    if (!user) return "";
                    return typeof user === 'string' ? JSON.parse(user).name : user.name;
                  })() || ""}
                </span>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link to="/admin/profile" className="dropdown-item">
                <i className="bi bi-person me-2"></i>
                Profile
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
