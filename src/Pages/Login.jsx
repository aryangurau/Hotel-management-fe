import { useState, useEffect } from "react";
import { Alert, Spinner, Form, InputGroup, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { setToken } from "../Utils/session";
import { isLoggedIn, setLoggedInUser } from "../Utils/login";
import logo from "../assets/img/logo3.jpg";
import banner from "../assets/img/hotelbanner.jpg";
import banner2 from "../assets/img/hotelbanner2.jpg";
import banner3 from "../assets/img/hotelbanner3.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [valid, setValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitDisabled(true);
      
      if (!login.email || !login.password) {
        throw new Error('Please enter both email and password');
      }

      const response = await axiosInstance.post(URLS.LOGIN, login);
      
      if (!response?.data?.data?.token) {
        throw new Error('Invalid response from server');
      }

      try {
        // Store token
        setToken(response.data.data.token);
        // Set user data from token
        const userData = setLoggedInUser();
        
        // Redirect based on role
        if (userData.roles && userData.roles.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          // If there's a redirect path, go there, otherwise go to home
          const from = location.state?.from?.pathname || "/";
          navigate(from);
        }
      } catch (tokenError) {
        console.error('Error processing login response:', tokenError);
        setError('Error processing login. Please try again.');
        setSubmitDisabled(false);
      }
    } catch (e) {
      console.error('Login error:', e);
      setSubmitDisabled(false);
      const errMsg = e?.response?.data?.msg || e?.message || "Something went wrong";
      setError(errMsg);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <section className="login-section">
      <div className="container">
        <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
          <div className="col-lg-6 p-0 d-none d-lg-block">
            <div className="login-carousel h-100">
              <img
                src={banner}
                alt="Hotel Banner"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
          
          <div className="col-lg-6 bg-white p-5">
            <div className="login-form-wrapper">
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" className="login-logo mb-3" />
                <h2 className="fw-bold mb-3">Welcome Back</h2>
                {error && (
                  <Alert variant="danger" className="mt-2">
                    {error}
                  </Alert>
                )}
              </div>

              <Form onSubmit={handleSubmit} className="login-form">
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    isInvalid={!valid}
                    value={login.email}
                    onChange={(e) => {
                      setValid(true);
                      setLogin(prev => ({ ...prev, email: e.target.value }));
                    }}
                    onBlur={(e) => {
                      setValid(new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).test(e.target.value));
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-4">
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={login.password}
                    onChange={(e) =>
                      setLogin((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 mb-3"
                  disabled={submitDisabled}
                >
                  {submitDisabled ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <p className="text-center mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary text-decoration-none">
                    Create Account
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

export default Login;
