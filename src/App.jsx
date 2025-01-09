import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import AdminRooms from "./Pages/admin/rooms/Rooms";
import AdminRoomsCreate from "./pages/admin/rooms/Create";
import AdminProfile from "./Pages/admin/Profile";
import UserProfile from "./Pages/user/Profile";
import Booking from "./Pages/Booking";
import Cart from "./Pages/Cart";
import AdminRoomEdit from "./Pages/admin/rooms/Edit";
import Payment from "./Pages/Payment";
import MyBookings from "./Pages/MyBookings";
import Profile from "./Pages/Profile";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Separate routes for login, forget password, and signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify" element={<VerifyEmail/>} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password/verifyFp" element={<VerifyFp/>} />
       
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="booking" element={<Booking />} />
          <Route path="booking/:roomId" element={<Booking />} />
          <Route path="payment" element={<Payment />} />
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="rooms/create" element={<AdminRoomsCreate />} />
          <Route path="rooms/edit/:roomId" element={<AdminRoomEdit />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
