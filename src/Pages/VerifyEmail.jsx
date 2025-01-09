import { useState, useEffect } from "react";
import { Alert, Spinner, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { FaEnvelope, FaKey } from 'react-icons/fa';
import "./css/verify.css";

import banner from "../assets/img/hotelbanner.jpg";
import banner2 from "../assets/img/hotelbanner2.jpg";
import banner3 from "../assets/img/hotelbanner3.jpg";
import logo from "../assets/img/logo3.jpg";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState({
    email: "",
    token: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitDisabled(true);
      const { data } = await axiosInstance.post(
        `${URLS.USERS}/verify-email`,
        verificationData
      );
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
      setError(errMsg);
    }
  };

  const handleInput = (e) => {
    const regex = new RegExp(/^\d+$/, "g");
    const isValid = regex.test(e.target.value);
    if (isValid || e.target.value === "") {
      setVerificationData((prev) => ({
        ...prev,
        token: e.target.value,
      }));
    }
  };

  useEffect(() => {
    if (!state?.email) {
      navigate("/register");
    }
    setVerificationData((prev) => ({
      ...prev,
      email: state?.email,
    }));
  }, [navigate, state]);

  return (
    <section className="verify-section">
      <div className="verify-container">
        <div className="row verify-row g-0">
          <div className="col-lg-6 p-0 d-none d-lg-block">
            <div className="carousel-wrapper">
              <div id="verifyCarousel" className="carousel slide carousel-fade h-100" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  <button type="button" data-bs-target="#verifyCarousel" data-bs-slide-to="0" className="active" />
                  <button type="button" data-bs-target="#verifyCarousel" data-bs-slide-to="1" />
                  <button type="button" data-bs-target="#verifyCarousel" data-bs-slide-to="2" />
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
                <button className="carousel-control-prev" type="button" data-bs-target="#verifyCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#verifyCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="verify-form-wrapper">
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" className="img-logo" />
                <h2 className="verify-title">Verify Your Email</h2>
                <p className="verify-subtitle">
                  We've emailed a 6-digit confirmation code to your email address. Please enter the code below to complete your registration.
                </p>
                {(msg || error) && (
                  <Alert variant={error ? "danger" : "success"} className="text-center">
                    {error || msg}
                  </Alert>
                )}
              </div>

              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    value={verificationData?.email}
                    disabled
                    className="verify-input"
                  />
                </InputGroup>

                <InputGroup className="mb-4">
                  <InputGroup.Text>
                    <FaKey />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationData?.token}
                    onChange={handleInput}
                    maxLength="6"
                    required
                    className="verify-input"
                  />
                </InputGroup>

                <button type="submit" className="btn btn-primary w-100 verify-btn" disabled={submitDisabled}>
                  {submitDisabled && (
                    <Spinner animation="border" variant="light" size="sm" className="me-2" />
                  )}
                  Verify Email
                </button>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="verify-link">
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

export default VerifyEmail;
