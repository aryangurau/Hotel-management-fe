import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";

import banner from "../../public/hotelbanner.jpg";
import banner2 from "../../public/hotelbanner2.jpg";
import banner3 from "../../public/hotelbanner3.jpg";
import message from "../assets/img/message.gif";

const VerifyFp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState({
    email: "",
    token: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(""); // State for error message
  const [msg, setMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    setError(""); // Clear general error
    setPasswordError(""); // Clear password error before new validation
  
    // Check if passwords match
    if (verificationData.newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return; // Stop form submission if passwords don't match
    }
  
    try {
      // API backend
      const { data } = await axiosInstance.post(
        `${URLS.USERS}/verify-fp-token`,
        verificationData
      );
  
      if (data.msg === "password changed successfully") {
        setMsg("Password reset successful");
        setTimeout(() => {
          setError("");
          setMsg("");
          navigate("/login");
        }, 2000);
      }
    } catch (e) {
      console.log(e.response); // Log the entire response to inspect it
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
  const showHide = () => {
    const pass = document.getElementById("pass");
    const repeatPass = document.getElementById("repeatPass");
    if (pass.type === "password" || repeatPass.type === "password") {
      pass.type = "text";
      repeatPass.type = "text";
    } else {
      pass.type = "password";
      repeatPass.type = "password";
    }
  };

  const passwordValidation = (e) => {
    setVerificationData((prev) => {
      return { ...prev, newPassword: e.target.value };
    });
    // Reset the password mismatch error if any
    if (passwordError) {
      setPasswordError("");
    }
  };
  const confirmPasswordValidation = (e) => {
    setConfirmPassword(e.target.value);
  
    if (passwordError) {
      setPasswordError("");
    }
  };


  useEffect(() => {
    (() => {
      "use strict";

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll(".needs-validation");

      // Loop over them and prevent submission
      Array.from(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          (e) => {
            if (!form.checkValidity()) {
              e.preventDefault();
              e.stopPropagation();
            }

            form.classList.add("was-validated");
          },
          false
        );
      });
    })();

    if (!state?.email) {
      navigate("/verifyFp"); //throws back to register page if email is empty
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
              <div className="card-body ">
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
                  {/* form start */}
                  <form
                    className="form needs-validation was-validated  novalidate"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <div className="text-center mb-4">
                      <img
                        className="img-logo"
                        src={message}
                        height={60}
                        width={30}
                        alt="Logo"
                      />
                      <h3 className="mt-3 text-dark">Request Sent successfully</h3>

                      <small className="text-body-secondary">
                        We&apos;ve sent a 6-digit confirmation email to your
                        email. Please enter the code in below box to verify your
                        email.
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

                       {/* Add this block to display password mismatch error */}
  {passwordError && (
    <div className="alert alert-danger text-center">
      {passwordError} {/* Render the password mismatch error */}
    </div>
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
                    <div className="mb-4">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        id="pass"
                        value={verificationData?.newPassword}
                        onInput={passwordValidation}
                        
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="confirm Password"
                        id="repeatPass"
                        value={confirmPassword}
                        onInput={confirmPasswordValidation}
                        required
                      />
                    </div>
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

                    <div className="text-center">
                      <button type="submit" className="btn btn-primary w-100">
                        Update-Password
                      </button>
                    </div>
                    <div>
                      <p className="text-center ">
                        Return to
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

export default VerifyFp;
