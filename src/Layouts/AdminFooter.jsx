import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSquareGithub, FaXTwitter } from "react-icons/fa6";
import Logo from "../assets/img/logo3.jpg";

const AdminFooter = () => {
  return (
    <>
         <footer className="d-flex flex-wrap justify-content-between align-items-center border-top">
        <div className="col-md-4 d-flex align-items-center mx-2">
          <Link
            to="/"
            className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
          >
            <Image src={Logo} width="25" height="25" />
          </Link>
          <span className="mb-3 mb-md-0 text-body-secondary">
            &copy; 2024 Hotel Mgmt App, Inc
          </span>
        </div>

        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex px-2">
          <li className="ms-3">
            <Link
              className="text-body-secondary"
              target="_blank"
              to="https://github.com/Aurora-Academy/batch-10-fe"
            >
              <FaXTwitter />
            </Link>
          </li>
          <li className="ms-3">
            <Link
              className="text-body-secondary"
              target="_blank"
              to="https://github.com/Aurora-Academy/batch-10-fe"
            >
              <FaSquareGithub />
            </Link>
          </li>
        </ul>
      </footer>

     
    </>
  );
};

export default AdminFooter;