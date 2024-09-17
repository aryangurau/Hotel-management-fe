import { Link } from "react-router-dom";
import "./login.css";
import logo from "../assets/img/logo3.jpg";

const Login = () => {
  const showHide = () => {
    const pass = document.getElementById("pass");
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  };

  const loginForm = () => {
    // Display the thank you message

    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;

    const msgClass = document.getElementsByClassName("msg")[0];

    //checks for above data
    if (!email || !pass) {
      msgClass.innerHTML = "please the credentials ";
      msgClass.style.color = "red";

      return;
    }

    // If all checks are correct then display success message
    msgClass.innerHTML = "Logged in Successfuly";
    msgClass.style.color = "green";

    // Hide the thank you message after 4 seconds
    setTimeout(() => {
      msgClass.innerHTML = "";
    }, 4000);

    //clearing the form after fillup
    document.getElementById("form").reset();
  };

  return (
    <>
      <section className="main d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  {/* form start */}
                  <form className="form">
                    <div className="row login flex-md-row ms-md-3">
                      <div className="col-md-3">
                        <img className="img-logo" src={logo} alt="logo" />
                      </div>
                      <div className="col-md-9">
                        <h2 className="ms-md-5 mb-4">Login</h2>
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Email"
                      />
                      <div id="emailHelp" className="form-text" />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="pass"
                        placeholder="Password"
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
                        onClick={loginForm}
                        type="button"
                        className="btn py-2 btn-primary"
                      >
                        Sign In
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
                    <div className="msg" />
                  </form>
                  {/* form end */}
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
