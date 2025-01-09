import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { setToken, setCurrentUser } from "../Utils/session";
import { isLoggedIn } from "../Utils/login";
import logo from "../assets/img/logo3.jpg";
import banner from "../assets/img/hotelbanner.jpg";
import banner2 from "../assets/img/hotelbanner2.jpg";
import banner3 from "../assets/img/hotelbanner3.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [valid, setValid] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitDisabled(true);
      
      if (!login.email || !login.password) {
        throw new Error('Please enter both email and password');
      }

      console.log('Sending login request:', { email: login.email });
      const response = await axiosInstance.post(URLS.LOGIN, login);
      console.log('Login response:', response.data);
      
      if (!response?.data?.data) {
        throw new Error('Invalid response from server');
      }

      // Store token
      const token = response.data.data;
      console.log('Setting token:', token);
      
      // Verify token format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      try {
        // Decode token
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Token payload:', payload);
        
        if (!payload._id || !payload.email || !payload.roles) {
          throw new Error('Invalid token payload');
        }

        // Store user data
        const userData = {
          _id: payload._id,
          email: payload.email,
          name: payload.name,
          roles: Array.isArray(payload.roles) ? payload.roles : [payload.roles]
        };
        console.log('Setting user data:', userData);
        
        // Important: Set token first, then user data atomically
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        // Double check storage
        const storedToken = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');
        console.log('Storage check:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser
        });
        
        if (!storedToken || !storedUser) {
          throw new Error('Failed to store auth data');
        }
        
        // Check for pending payment
        const pendingPayment = sessionStorage.getItem('pendingPayment');
        if (pendingPayment) {
          console.log('Found pending payment, redirecting to payment page');
          navigate('/payment', { 
            replace: true, 
            state: JSON.parse(pendingPayment)
          });
          return;
        }
        
        // Redirect based on role
        const isAdmin = userData.roles.includes('admin');
        console.log('Is admin user:', isAdmin);
        
        if (isAdmin) {
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else {
          const returnPath = location.state?.returnTo || location.state?.from?.pathname || "/";
          console.log('Redirecting to:', returnPath);
          navigate(returnPath, { replace: true });
        }
      } catch (error) {
        console.error('Error processing token:', error);
        throw new Error('Invalid token data: ' + error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error?.response?.data?.msg || error.message || "Login failed");
    } finally {
      setSubmitDisabled(false);
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
                      handleChange(e);
                    }}
                    onBlur={(e) => {
                      setValid(new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).test(e.target.value));
                    }}
                    name="email"
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
                    onChange={handleChange}
                    name="password"
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
                  <a href="/register" className="text-primary text-decoration-none">
                    Create Account
                  </a>
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
