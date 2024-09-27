import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import UserLayout from "./Layouts/UserLayout";
import Home from "./Pages/Home";
import ForgetPassword from "./Pages/ForgetPassword";
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/VerifyEmail";
import VerifyFp from "./Pages/VerifyFp";
import AdminLayout from "./Layouts/AdminLayout";
import PrivateRoute from "./Components/PrivateRoute";
import AdminDashboard from "./Pages/admin/Dashboard";
import NotFound from "./Pages/NotFound";
import AdminUsers from "./Pages/admin/Users";
import AdminOrders from "./Pages/admin/Orders";
import AdminRooms from "./Pages/admin/Rooms";
import AdminProfile from "./Pages/admin/Profile";
import Booking from "./Pages/Booking";
import Cart from "./Pages/Cart";

function App() {
  return (
    <>
      <Routes>
        {/* Separate routes for login, forget password, and signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify" element={<VerifyEmail/>} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password/verifyFp" element={<VerifyFp/>} />
       
        {/* <Route path="/" element={<Interface/>} > */}
        
        {/* User Routes */}
        {/* Nested route for the home page inside UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="booking" element={<Booking />} />
          <Route path="cart" element={<Cart/>} />
        </Route>



{/* Admin Routes */}
<Route path="/admin" element={<AdminLayout/>}>
          <Route
            path="dashboard"
            element={
              <PrivateRoute role={["admin", "user"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute role={["admin", "user"]}>
                <AdminOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute role={["admin", "user"]}>
                <AdminProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="rooms"
            element={
              <PrivateRoute role={["admin"]}>
                <AdminRooms />
              </PrivateRoute>
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute role={["admin"]}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound/>} />

        
      </Routes>
    </>
  );
}

export default App;
