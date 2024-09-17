import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import UserLayout from "./Layouts/UserLayout";
import Home from "./Pages/Home";
import ForgetPassword from "./Pages/ForgetPassword";
import Signup from "./Pages/Signup";

function App() {
  return (
    <>
      <Routes>
        {/* Separate routes for login, forget password, and signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/signup" element={<Signup />} />

        {/* Nested route for the home page inside UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
