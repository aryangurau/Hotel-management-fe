import { useState } from "react";
import { Alert, Spinner, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { FaEnvelope } from 'react-icons/fa';

import "./css/forgetpw.css"
import banner from "../assets/img/hotelbanner.jpg";
import banner2 from "../assets/img/hotelbanner2.jpg";
import banner3 from "../assets/img/hotelbanner3.jpg";
import forgoticon from "../assets/img/forgot.png";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitDisabled(true);
      const { data } = await axiosInstance.post(
        `${URLS.USERS}/generate-fp-token`,
        { email }
      );
      if (data.msg === "please check your email for token") {
        setMsg("Please check your email for the password reset token");
        setTimeout(() => {
          setError("");
          setMsg("");
          navigate("/forget-password/verifyFp", {
            state: { email },
          });
        }, 2000);
      }
    } catch (e) {
      setSubmitDisabled(false);
      const errMsg = e?.response?.data?.msg || "Something went wrong";
      setError(errMsg);
    }
  };

  return (
    <section className="forget-section">
      <div className="forget-container">
        <div className="row forget-row g-0">
          <div className="col-lg-6 p-0 d-none d-lg-block">
            <div className="carousel-wrapper">
              <div id="forgetCarousel" className="carousel slide carousel-fade h-100" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  <button type="button" data-bs-target="#forgetCarousel" data-bs-slide-to="0" className="active" />
                  <button type="button" data-bs-target="#forgetCarousel" data-bs-slide-to="1" />
                  <button type="button" data-bs-target="#forgetCarousel" data-bs-slide-to="2" />
                </div>
                <div className="carousel-inner h-100">
                  <div className="carousel-item active h-100">
                    <img src={banner} alt="Hotel view" />
                    <div className="carousel-caption">
                      <h5>Welcome to XYZ Hotel</h5>
                      <p>Experience luxury and comfort at its finest</p>
                    </div>
                  </div>
                  <div className="carousel-item h-100">
                    <img src={banner2} alt="Hotel interior" />
                    <div className="carousel-caption">
                      <h5>Premium Amenities</h5>
                      <p>Discover our world-class facilities</p>
                    </div>
                  </div>
                  <div className="carousel-item h-100">
                    <img src={banner3} alt="Hotel room" />
                    <div className="carousel-caption">
                      <h5>Your Home Away From Home</h5>
                      <p>Creating memorable stays since 2000</p>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#forgetCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#forgetCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <div className="forget-form-wrapper w-75">
              <Form onSubmit={handleSubmit} className="w-100">
                <div className="text-center">
                  <img src={forgoticon} alt="Forgot Password" className="img-logo" />
                  <h2 className="forget-title">Forgot Password?</h2>
                  <p className="forget-subtitle">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                  {(msg || error) && (
                    <Alert variant={error ? "danger" : "success"} className="text-center">
                      {error || msg}
                    </Alert>
                  )}
                </div>

                <InputGroup className="mb-4">
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="forget-input"
                  />
                </InputGroup>

                <button type="submit" className="btn btn-primary w-100 forget-btn" disabled={submitDisabled}>
                  {submitDisabled && (
                    <Spinner animation="border" variant="light" size="sm" className="me-2" />
                  )}
                  Reset Password
                </button>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Remember your password?{" "}
                    <Link to="/login" className="forget-link">
                      Login here
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
