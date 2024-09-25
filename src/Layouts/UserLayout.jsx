import { Outlet } from "react-router-dom";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />




      <UserFooter />
    </>
  );
};

export default UserLayout;
