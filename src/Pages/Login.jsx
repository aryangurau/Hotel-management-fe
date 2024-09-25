import { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { setToken } from "../Utils/session";
import { isLoggedIn, setLoggedInUser } from "../Utils/login";
import "./login.css";
import logo from "../assets/img/logo3.jpg";
import banner from "../assets/img/hotelbanner.jpg";
import banner2 from "../assets/img/hotelbanner2.jpg";
import banner3 from "../assets/img/hotelbanner3.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State for error message
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [valid, setValid] = useState(true);

  const showHide = () => {
    const currentPw = document.getElementById("myPassword");
    if (currentPw.type === "password") {
      currentPw.type = "text";
    } else {
      currentPw.type = "password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear error before new attempt
    try {
      setSubmitDisabled(true);
      const { data } = await axiosInstance.post(`${URLS.USERS}/login`, login);
      if (data?.data) {
        setToken(data.data); //for local storage of jwt token of loggedin user
        setLoggedInUser(); //for local storage of user information
        navigate("/"); // Navigate on successful login
      }
    } catch (e) {
      setSubmitDisabled(false);
      const errMsg = e?.response?.data?.msg || "Something went wrong";
      setError(errMsg); // Set the error message in state
    }
  };
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <section className="main d-flex align-items-center justify-content-center ">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-6 col-md-8  slide-banner">
              <div className="card-body">
                <div id="carouselExampleCaptions" className="carousel slide ">
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to={0}
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    />
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to={1}
                      aria-label="Slide 2"
                    />
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to={2}
                      aria-label="Slide 3"
                    />
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img
                        src={banner}
                        style={{ width: "700px", height: "630px" }}
                        className=" "
                        alt="..."
                      />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Explore Our Hotels</h5>
                        <p>We provide best quality services</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img
                        src={banner2}
                        style={{ width: "700px", height: "630px" }}
                        className="d-block "
                        alt="..."
                      />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Explore Our Hotels</h5>
                        <p>We provide best quality services</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img
                        src={banner3}
                        style={{ width: "700px", height: "630px" }}
                        className="d-block w-100"
                        alt="..."
                      />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Explore Our Hotels</h5>
                        <p>We provide best quality services</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-8 login-card ">
              <div className="card  login-card-content ">
                <div className="card-body">
                  <form className="form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="row login flex-md-row ms-md-3">
                      <div className="col-md-3">
                        <img className="img-logo" src={logo} alt="logo" />
                      </div>
                      <div className="col-md-9">
                        <h2 className="ms-md-5 mb-4">Login</h2>
                      </div>
                      {/* Display the Alert component below the heading */}
                      {error && (
                        <Alert variant="danger" className="mt-2">
                          {error}
                        </Alert>
                      )}
                    </div>

                    <div className="mb-3">
                      <input
                        type="email"
                        className={`form-control ${valid ? "" : "is-invalid"}`}
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Email"
                        value={login.email}
                        onChange={(e) => {
                          setValid(true);
                          setLogin((prevState) => ({
                            ...prevState,
                            email: e.target.value,
                          }));
                        }}
                        onBlur={(e) => {
                          new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).test(
                            e.target.value
                          )
                            ? setValid(true)
                            : setValid(false);
                        }}
                        required
                      />
                        <div className="invalid-feedback">
                        Please provide proper email
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="myPassword"
                        placeholder="Password"
                        value={login.password}
                        onChange={(e) =>
                          setLogin((prevState) => ({
                            ...prevState,
                            password: e.target.value,
                          }))
                        }
                      
                      />
                     
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        id="exampleCheck1"
                        onClick={showHide}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleCheck1"
                      >
                        Show Password
                      </label>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn py-2 btn-primary submit-btn"
                        disabled={submitDisabled}
                      >
                        {" "}
                        {submitDisabled && (
                          <Spinner
                            animation="border"
                            variant="light"
                            size="sm"
                            className="mx-1"
                          />
                        )}
                        Submit
                      </button>
                    </div>

                    <div>
                      <p className="text-center mt-2">
                        Forgot{" "}
                        <Link
                          className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                          to="/forget-password"
                        >
                          Username/Password?
                        </Link>
                      </p>
                    </div>
                    <div>
                      <p className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                          className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                          to="/register"
                        >
                          Register
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
