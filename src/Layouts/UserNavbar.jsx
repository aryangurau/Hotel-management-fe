import { Button, ButtonGroup, Dropdown } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import logo from "../assets/img/logo3.jpg";
// import icon from "../assets/img/signup.gif";
import icon2 from "../assets/img/login.gif";
import { getCurrentUser, removeAll } from "../Utils/session";
import { isLoggedIn } from "../Utils/login";
import "./css/nav.css";

import { ShoppingButton } from "../components/AddButton";
import { useSelector } from "react-redux";

const UserNavbar = () => {
  const { quantity } = useSelector((state) => state.cart);
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
                    <ul className="navbar-nav mx-5">
                      <li className="nav-item">
                        <a className="nav-link">
                          <img
                            className="state"
                            src="https://wallpapercave.com/wp/wp4034154.jpg"
                            alt
                          />
                        </a>
                      </li>

                      {/* {loggedIn && getUserInfo() ? (  //ToDo
                            <> </>): (<></>)} */}
                      <li className="nav-item">
                        <ButtonGroup className="btn ms-md-2 mx-2 ">
                          <Link to="/register">Register</Link>
                        </ButtonGroup>
                      </li>

                      {/*TODO */}
                      <li className="nav-item">
                        <ButtonGroup>
                          
                            <Link to="/booking" className="btn btn-danger">
                              Book Now
                            </Link>
                         
                        </ButtonGroup>
                      </li>
                      <li>
                      <ButtonGroup className="mx-2 ">
                      
                      <Link to="/cart" className="btn">
                        <ShoppingButton  size={Number(quantity)} />
                      </Link>
                    
                  </ButtonGroup>
                      </li>
                      
                      <ButtonGroup>
                      {loggedIn && getUserInfo() ? (
                        <>
                          <Dropdown as={ButtonGroup}>
                            <Button
                              style={{ padding: "3px" }}
                              className="text-center bg-primary"
                              onClick={() => navigate("/admin/dashboard")}
                            >
                              Welcome {getUserInfo()}
                            </Button>
                            <Dropdown.Toggle
                              className="bg-primary"
                              split
                              id="dropdown-split-basic"
                            />
                            <Dropdown.Menu className="bg-primary">
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
                      
                          <li>
                            <ButtonGroup>
                              <Link to="/login" className="btn btn-danger">
                                login
                              </Link>
                            </ButtonGroup>
                          </li>
                        
                      )}
                        </ButtonGroup>
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

      {/* <Navbar expand="lg" className=" text-white " variant="dark" style={{"backgroundColor":" #003B95"}} >
        <div className="container d-flex justify-content-center">
          <Link to="/" className="navbar-brand">
            <img src={logo} width={30} height={30} alt="" /> XYZ hotel
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto "  variant="" defaultActiveKey="/home">
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
                          navigate("/");
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
          
          </Navbar.Collapse>
        </div>
        
      </Navbar> */}
    </div>
  );
};

export default UserNavbar;
