import "../Layouts/css/interface.css";
import { Nav, Navbar, Button, ButtonGroup, Dropdown } from "react-bootstrap";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import logo from "../assets/img/logo3.jpg";
// import icon from "../assets/img/signup.gif";
import icon2 from "../assets/img/login.gif";
import { getCurrentUser, removeAll } from "../Utils/session";
import { isLoggedIn } from "../Utils/login";
import UserFooter from "./UserFooter";

const Interface = () => {
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
      <div>
        {/* top  start*/}
        <section className="container-fluid head-top">
          <div className="container top-con">
            <div className="row">
              {/* logo */}
              <div className="col-lg-6">
                <h1>
                  <Link to="/" className="navbar-brand">
                    <img src={logo} width={40} height={40} alt="" /> XYZ hotel
                  </Link>
                </h1>
              </div>
              {/* logo end */}
              {/*  nav 1 listing and registration */}
              <div className="col-lg-6 ms-0 listing">
                {/* navbar */}
                <nav className="navbar navbar-expand-lg">
                  <div className="container-fluid ms-auto d-flex align-items-start">
                    <a className="navbar-brand" href="#">
                      NPR
                    </a>
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarNavDropdown"
                      aria-controls="navbarNavDropdown"
                      aria-label="Toggle navigation"
                    >
                      <span className="navbar-toggler-icon" />
                    </button>
                    <div
                      className="collapse navbar-collapse"
                      id="navbarNavDropdown"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <a className="nav-link" aria-current="page" href="#">
                            <img
                              className="state"
                              src="https://wallpapercave.com/wp/wp4034154.jpg"
                              alt
                            />
                          </a>
                        </li>
                        <li className="nav-item ms-md-2 p-2">
                          <a href>
                            {" "}
                            <i className="bi bi-question-circle" />
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            list your property
                          </a>
                        </li>
                        <li className="nav-item">
                          <button className="btn ms-md-2 bg-primary text-dark register-login-btn">
                            <Link to="/register">Register</Link>
                          </button>
                        </li>
                        <button className="text-dark bg-primry">
                          {loggedIn && getUserInfo() ? (
                            <>
                              <Dropdown  as={ButtonGroup}>
                                <Button
                                  style={{ padding: "5px 3px" }}
                                  className="text-center bg-primary rounded"
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
                                  <Dropdown.Item
                                    onClick={() => navigate("/admin/profile")}
                                  >
                                    My Profile
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => navigate("/admin/orders")}
                                  >
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
                              <img src={icon2} width={25} height={25} alt="" />{" "}
                              login <LuLogIn />
                            </Link>
                          )}
                        </button>
                       
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
              {/*nav 1 listing and registration end */}
            </div>
            {/* nav 2  start*/}
            <div className="row">
              <div className="col-lg-6 col-md-5">
                <nav className="navbar navbar-expand-md">
                  <div className="container-fluid ms-auto d-flex align-items-center">
                    <a
                      className="navbar-brand bg-primary rounded-pill px-4"
                      href="#"
                    >
                      <i className="bi bi-hospital px-1" />
                      Stays
                    </a>
                    {/* <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button> */}
                    {/* <div class="collapse navbar-collapse" id="navbarNavDropdown"> */}
                    <ul className="navbar-nav container-fluid ms-auto d-flex align-items-start">
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="bi bi-airplane px-1" />
                          flights
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="bi bi-car-front px-1" />
                          Car rentals
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="bi bi-bar-chart-fill px-1" />
                          Attractions
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="bi bi-taxi-front-fill px-1" /> taxis
                        </a>
                      </li>
                    </ul>
                    {/* </div> */}
                  </div>
                </nav>
              </div>
            </div>
            {/* nav 2 end*/}
            {/* top content start*/}
            <div className="row py-5">
              <h1>Find you next stay</h1>
              <h2>Search deals on hotels, homes, and much more</h2>
            </div>
            {/* top content end */}
          </div>
        </section>
        {/* top end */}

        {/* <div class="main"> */}

        {/* search start */}
        <div className="container search-section ">
          <div className="row justify-content-center ">
            <form className="row g-3 justify-content-center form align-items-center">
              {/* Destination */}
              <div className="col-12 col-md-3">
                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Destination"
                />
              </div>
              {/* Check-in & Check-out */}
              <div className="col-12 col-md-4">
                <input type="date" className="form-control" />
              </div>
              {/* Additional Field */}
              <div className="col-12 col-md-3 position-relative guest">
                <i className="bi bi-person" />
                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Total guests"
                />
              </div>
              {/* Search Button */}
              <div className="col-12 col-md-1">
                <button className="btn-search">Search</button>
              </div>
            </form>
          </div>
        </div>
        {/* search end */}

        
        <Outlet/>
        {/* hotels card */}
        {/* <div className="container con mt-5 pt-5">
          <h2 className="text-dark fs-2 text-ms">Explore Hotels</h2>
          <div className="row justify-content-center">
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square600/522067066.jpg?k=7bce548c7382b551be6362393c59fdd4633c49ee400cf9dd4d52eb5f4ef98f89&o="
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://i.ytimg.com/vi/gsaLaYSizk8/maxresdefault.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square600/283374329.jpg?k=3ac15dffc1efe76b14ff3436242681ddc77e977bddd9b18b7f2283713334ca48&o="
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://r-xx.bstatic.com/xdata/images/hotel/263x210/100235855.jpeg?k=5b6e6cff16cfd290e953768d63ee15f633b56348238a705c45759aa3a81ba82b&o="
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container con mt-5 pt-5">
          <h2 className="text-dark fs-2 text-ms">Explore Hotels</h2>
          <div className="row justify-content-center">
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square600/522067066.jpg?k=7bce548c7382b551be6362393c59fdd4633c49ee400cf9dd4d52eb5f4ef98f89&o="
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://i.ytimg.com/vi/gsaLaYSizk8/maxresdefault.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/square600/283374329.jpg?k=3ac15dffc1efe76b14ff3436242681ddc77e977bddd9b18b7f2283713334ca48&o="
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
            <div
              className="card col-lg-3 col-md-5 shadow p-3 mb-5 bg-body-tertiary rounded"
              style={{ width: "20rem" }}
            >
              <img
                src="https://r-xx.bstatic.com/xdata/images/hotel/263x210/100235855.jpeg?k=5b6e6cff16cfd290e953768d63ee15f633b56348238a705c45759aa3a81ba82b&o="
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </p>
              </div>
            </div>
          </div>
        </div> */}
        {/* hotels card end */}
      </div>
      <UserFooter />
    </div>
  );
};

export default Interface;
