import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { Alert, Spinner, Form, InputGroup, Button } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../assets/img/logo3.jpg";
import banner from "../assets/img/hotelbanner.jpg";
import banner2 from "../assets/img/hotelbanner2.jpg";
import banner3 from "../assets/img/hotelbanner3.jpg";

const Register = () => {
  const registerRef = useRef();
  const navigate = useNavigate();
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState("");
  const [validPw, setValidPw] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [email, setEmail] = useState({ email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const rawFormData = registerRef.current;
      const formData = new FormData(rawFormData);
      formData.delete("confirmPassword");
      setSubmitDisabled(true);
      
      const { data } = await axiosInstance.post(
        `${URLS.USERS}/register`,
        formData
      );

      if (data.msg === "please check your email for verification") {
        setSubmitDisabled(false);
        navigate("/verify", { state: { email: formData.get("email") } });
      }
    } catch (e) {
      setSubmitDisabled(false);
      const errMsg = e?.response?.data?.msg || "Something went wrong";
      setError(errMsg);
    }
  };

  return (
    <section className="register-section">
      <div className="container">
        <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
          <div className="col-lg-6 p-0 d-none d-lg-block">
            <div className="register-carousel h-100">
              <div id="registerCarousel" className="carousel slide carousel-fade h-100" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#registerCarousel"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  />
                  <button
                    type="button"
                    data-bs-target="#registerCarousel"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  />
                  <button
                    type="button"
                    data-bs-target="#registerCarousel"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  />
                </div>
                <div className="carousel-inner h-100">
                  <div className="carousel-item active h-100">
                    <img src={banner} className="w-100 h-100 object-fit-cover" alt="Hotel view" />
                    <div className="carousel-caption">
                      <h3>Welcome to XYZ Hotel</h3>
                      <p>Experience luxury and comfort at its finest</p>
                    </div>
                  </div>
                  <div className="carousel-item h-100">
                    <img src={banner2} className="w-100 h-100 object-fit-cover" alt="Hotel interior" />
                    <div className="carousel-caption">
                      <h3>Premium Amenities</h3>
                      <p>Discover our world-class facilities</p>
                    </div>
                  </div>
                  <div className="carousel-item h-100">
                    <img src={banner3} className="w-100 h-100 object-fit-cover" alt="Hotel room" />
                    <div className="carousel-caption">
                      <h3>Your Home Away From Home</h3>
                      <p>Creating memorable stays since 2000</p>
                    </div>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#registerCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#registerCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 bg-white p-5">
            <div className="register-form-wrapper">
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" className="register-logo mb-3" />
                <h2 className="fw-bold mb-3">Create Account</h2>
                {error && (
                  <Alert variant="danger" className="mt-2">
                    {error}
                  </Alert>
                )}
              </div>

              <Form ref={registerRef} onSubmit={handleSubmit} className="register-form">
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaUser />
                  </InputGroup.Text>
                  <Form.Control
                    name="name"
                    placeholder="Full Name"
                    required
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    isInvalid={!validEmail}
                    value={email.email}
                    onChange={(e) => {
                      setValidEmail(true);
                      setEmail(prev => ({ ...prev, email: e.target.value }));
                    }}
                    onBlur={(e) => {
                      setValidEmail(
                        new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).test(e.target.value)
                      );
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    isInvalid={!validPw}
                    onChange={() => setValidPw(true)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    Password must contain at least one uppercase letter, one number, and one special character
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-4">
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>

                <Form.Group className="mb-3">
                  <Form.Check
                    required
                    label="I agree to the Terms & Conditions"
                    feedback="You must agree before submitting."
                    feedbackType="invalid"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 mb-3"
                  disabled={submitDisabled}
                >
                  {submitDisabled ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <p className="text-center mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
