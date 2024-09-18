import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { Alert } from "react-bootstrap";
import { isLoggedIn } from "../Utils/login";
// import "./register.css";
import logo from "../assets/img/logo3.jpg";
import banner from "../../public/hotelbanner.jpg";
import banner2 from "../../public/hotelbanner2.jpg";
import banner3 from "../../public/hotelbanner3.jpg";

const Register = () => {
  const registerRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // State for error message

  const showHide = () => {
    const pass = document.getElementById("pass");
    const repeatPass = document.getElementById("repeatPass");
    if (pass.type === "password" || repeatPass.type === "Password") {
      pass.type = "text";
      repeatPass.type = "text";
    } else {
      pass.type = "password";
      repeatPass.type = "password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear error before new attempt
    try {
      const rawFormData = registerRef.current;
      const formData = new FormData(rawFormData);
      formData.delete("confirmPassword");
      const { data } = await axiosInstance.post(
        `${URLS.USERS}/register`,
        formData
      );
      console.log({ data });
    } catch (e) {
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
      <section className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
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
                        <h5 >Explore Our Hotels</h5>
                        <p>
                         We provide best quality services
                        </p>
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
                      <h5 >Explore Our Hotels</h5>
                        <p>
                         We provide best quality services
                        </p>
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
                      <h5 >Explore Our Hotels</h5>
                        <p>
                         We provide best quality services
                        </p>
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
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form
                    ref={registerRef}
                    className="form needs-validation"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="text-center mb-4">
                      <img className="img-logo" src={logo} alt="Logo" />
                      <h2 className="mt-3">Register</h2>
                      {/* Display the Alert component below the heading */}
                      {error && (
                        <Alert variant="danger" className="mt-2">
                          {error}
                        </Alert>
                      )}
                    </div>
                    <div className="mb-1">
                      <input
                        className="form-control"
                        name="name"
                        placeholder="Enter name"
                        required
                      />
                    </div>

                    <div className="mb-1">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        required
                      />
                    </div>

                    <div className="mb-1">
                      <input
                        type="password"
                        className="form-control"
                        id="pass"
                        name="password"
                        placeholder="Password"
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="repeatPass"
                        name="confirmPassword"
                        placeholder="Repeat Password"
                        autoComplete="off"
                        required
                      />
                    </div>

                    {/* Aligned checkboxes */}
                    <div className="mb-1 form-check ">
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        id="showPasswordCheck"
                        onClick={showHide}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showPasswordCheck"
                      >
                        Show Password
                      </label>
                    </div>

                    <div className="mb-2 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        id="exampleCheck1"
                        required
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I accept the terms & conditions
                      </label>
                    </div>

                    <div className="text-center">
                      <button type="submit" className="btn btn-primary w-100">
                        Register
                      </button>
                    </div>
                    <div>
                      <p className="text-center">
                        Already have an account?{" "}
                        <Link
                          className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                          to="/login"
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                    <div className="msg mt-3" />
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

export default Register;
