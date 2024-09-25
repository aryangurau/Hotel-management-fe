import { Dropdown } from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, removeAll } from "../Utils/session";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = JSON.parse(getCurrentUser()).roles.includes("admin");

  const handleLogout = () => {
    removeAll();
    navigate("/login");
  };
  return (
    <div
      className="d-flex  flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{ width: "280px", maxWidth: "280px" }}
    >
      <Link
        to="/admin/dashboard"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-4">XYZ Hotel</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/admin/dashboard"
            className={`nav-link text-white  ${
              pathname.includes("dashboard") ? "active" : ""
            }`}
          >
            <i className="bi bi-house"></i>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/orders"
            className={`nav-link text-white  ${
              pathname.includes("orders") ? "active" : ""
            }`}
          >
            <i className="bi bi-bag"></i>
            Orders
          </Link>
        </li>
        {isAdmin && (
          <>
            <li className="nav-item">
              <Link
                to="/admin/rooms"
                className={`nav-link text-white  ${
                  pathname.includes("rooms") ? "active" : ""
                }`}
              >
                <i className="bi bi-archive"></i>
                Rooms
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/users"
                className={`nav-link text-white  ${
                  pathname.includes("users") ? "active" : ""
                }`}
              >
                <i className="bi bi-people"></i>
                Users
              </Link>
            </li>
          </>
        )}
      </ul>
      <hr />
      <Dropdown>
        <Dropdown.Toggle split variant="dark">
          <MdAccountCircle size="1.5rem" />
          &nbsp;
          <strong>{JSON.parse(getCurrentUser())?.name || ""}</strong>
          &nbsp;
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Link to="/admin/profile" className="dropdown-item">
            Profile
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default AdminNavbar;
