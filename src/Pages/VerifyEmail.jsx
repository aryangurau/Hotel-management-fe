import { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";

// import "./register.css";
import logo from "../assets/img/logo3.jpg";
import banner from "../../public/hotelbanner.jpg";
import banner2 from "../../public/hotelbanner2.jpg";
import banner3 from "../../public/hotelbanner3.jpg";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState({
    email: "",
    token: "",
  });
  const [error, setError] = useState(""); // State for error message
  const [msg, setMsg] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents the by default submission of form
    setError(""); // Clear error before new attempt
    try {
      // API backend
      setSubmitDisabled(true);
      const { data } = await axiosInstance.post(
        //posts for token confirmation
        `${URLS.USERS}/verify-email`,
        verificationData
      );
      //   console.log({ data });
      if (data.msg === "Thankyou for verifying your email") {
        setMsg("Thank you for verifying your email");
        setTimeout(() => {
          setError("");
          setMsg("");
          navigate("/login");
        }, 2000);
      }
    } catch (e) {
      setSubmitDisabled(false);
      const errMsg = e?.response?.data?.msg || "Something went wrong";
      setError(errMsg); // Set the error message in state
    }
  };
  const handleInput = (e) => {
    const regex = new RegExp(/^\d+$/, "g");
    const isValid = regex.test(e.target.value);
    if (isValid || e.target.value === "") {
      setVerificationData((prev) => {
        return { ...prev, token: e.target.value };
      }); // sets the token data in verification data
    }
  };
  useEffect(() => {
    if (!state?.email) {
      navigate("/register"); //throws back to register page if email is empty
    }
    setVerificationData((prev) => {
      return {
        ...prev,
        email: state?.email,
      };
    });
  }, [navigate, state]);
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

            <div className="col-lg-6 col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form
                    className="form needs-validation"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="text-center mb-4">
                      <img className="img-logo" src={logo} alt="Logo" />
                      <h2 className="mt-3">Please check your email!</h2>

                      <small className="text-body-secondary">
                        We&apos;ve emailed a 6-digit confirmation code. Please
                        enter the code in the box below to verify your email.
                      </small>
                      {/* Display the Alert component below the heading */}
                      {(msg || error) && (
                        <Alert
                          variant={error ? "danger" : "success"}
                          className="text-center"
                        >
                          {error || msg}
                        </Alert>
                      )}
                    </div>

                    <div className="mb-1">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        disabled
                        value={verificationData?.email}
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        className="form-control"
                        placeholder="6 digit token"
                        value={verificationData?.token}
                        maxLength="6"
                        onChange={(e) => handleInput(e)}
                        required
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
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
                        Verify
                      </button>
                    </div>
                    <div>
                      <p className="text-center ">
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

export default VerifyEmail;
