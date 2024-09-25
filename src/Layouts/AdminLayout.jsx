import { Outlet } from "react-router-dom";
// import UserFooter from "./UserFooter";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

const AdminLayout = () => {
  return (
    <>
      <div className="d-flex vh-100 overflow-hidden">
        <AdminNavbar />
        <div className="container-fluid" style={{ minHeight: "48rem" }}>
          <div className="container-fluid" style={{ minHeight: "53rem" }}>
            <div className="container">
              <Outlet />

            </div>
            <div className="col-lg " style={{"marginTop": "290px"}}>
            <AdminFooter />
            </div>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
