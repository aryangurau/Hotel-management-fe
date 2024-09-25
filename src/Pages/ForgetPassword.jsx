import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";

import "./css/forgetpw.css"
import "./login.css";
import banner from "../../public/hotelbanner.jpg";
import banner2 from "../../public/hotelbanner2.jpg";
import banner3 from "../../public/hotelbanner3.jpg";
import forgoticon from "../assets/img/forgot.png";

const ForgetPassword = () => {
  const { state } = useLocation();
  console.log({ state });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // State for error message
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents the by default submission of form
    setError(""); // Clear error before new attempt
    try {
      // API backend
        //posts for token confirmation
      const { data } = await axiosInstance.post(
        `${URLS.USERS}/generate-fp-token`,
        { email }
      );
      console.log({ data });
      if (data.msg === "please check your email for token") {
        setMsg("please check your email for token");

        setTimeout(() => {
          setError("");
          setMsg("");
          navigate("/forget-password/verifyFp", {
            state: { email },
          });
        }, 2000);
      }
    } catch (e) {
      const errMsg = e?.response?.data?.msg || "Something went wrong";
      setError(errMsg); // Set the error message in state
    }
  };

  // useEffect(() => {
  //   if (!state?.email) {
  //     navigate("/register"); //throws back to register page if email is empty
  //   }
  //   setemail((prev) => {
  //     return {
  //       ...prev,
  //       email: state?.email
  //     };
  //   });
  // }, [navigate, state]);
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

            <div className="col-lg-6 col-md-8 login-card">
              <div className="card  login-card-content">
                <div className="card-body">
                  <form
                    className="form needs-validation"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="text-center mb-4">
                      <img
                        className="img-logo"
                        src={forgoticon}
                        height={60}
                        width={10}
                        alt="Logo"
                      />
                      <h2 className="mt-3 text-dark"><b>Forgot your password?</b></h2>

                      <small className="text-body-secondary">
                        Please enter the email address associated with your
                        account and we&apos;ll email you a link to reset your
                        password.
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

                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="text-center mb-3">
                      <button type="submit" className="btn btn-primary w-100">
                        Send Request
                      </button>
                    </div>
                    <div>
                      <p className="text-center mb-3 ">
                        Return to {" "}
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

export default ForgetPassword;
