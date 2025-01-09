import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css"; // Import custom toast styles
import { useEffect } from "react";
import { getToken, getCurrentUser, removeAll } from "./Utils/session";
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
import AdminRoomsCreate from "./Pages/admin/rooms/Create";
import AdminRoomEdit from "./Pages/admin/rooms/Edit";
import AdminProfile from "./Pages/admin/Profile";
import UserProfile from "./Pages/user/Profile";
import Booking from "./Pages/Booking";
import Cart from "./Pages/Cart";
import Payment from "./Pages/Payment";
import MyBookings from "./Pages/MyBookings";
import Profile from "./Pages/Profile";
import BookingHistory from "./Pages/BookingHistory";

const App = () => {
  // Validate auth state on app load
  useEffect(() => {
    const validateAuth = () => {
      try {
        const token = getToken();
        const user = getCurrentUser();

        if (!token || !user) {
          console.log('No auth data found, clearing session');
          removeAll();
          return;
        }

        // Verify token format
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid token format');
          removeAll();
          return;
        }

        // Decode token
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Verify token payload matches user data
        if (payload.email !== user.email || payload._id !== user._id) {
          console.error('Token payload mismatch with user data');
          removeAll();
          return;
        }

        console.log('Auth state validated:', {
          email: user.email,
          roles: user.roles
        });
      } catch (error) {
        console.error('Error validating auth state:', error);
        removeAll();
      }
    };

    validateAuth();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        style={{ zIndex: 9999 }}
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
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="booking/:roomId" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="booking-history" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
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
          <Route path="rooms/edit/:id" element={<AdminRoomEdit />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
