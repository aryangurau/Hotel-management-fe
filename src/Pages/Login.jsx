import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../assets/img/logo3.jpg";
import { useState } from "react";
import { axiosInstance } from "../Utils/axiosInstance";
import { URLS } from "../Constants";
import { Alert } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State for error message

  const showHide = () => {
    const pass = document.getElementById("pass");
    pass.type = pass.type === "password" ? "text" : "password";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear error before new attempt
    try {
      const { data } = await axiosInstance.post(`${URLS.USERS}/login`, login);
      if (data?.data) {
        navigate("/"); // Navigate on successful login
      }
    } catch (e) {
      const errMsg = e?.response?.data?.msg || "Something went wrong";
      setError(errMsg); // Set the error message in state
    }
  };

  return (
    <>
      <section className="main d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form className="form" onSubmit={handleSubmit}>
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
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Email"
                        value={login.email}
                        onChange={(e) =>
                          setLogin((prevState) => ({
                            ...prevState,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="pass"
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
                      >
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
                          to="/signup"
                        >
                          Sign Up
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
