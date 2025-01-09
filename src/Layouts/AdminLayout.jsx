import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, getToken } from "../Utils/session";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import "./css/admin.css";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 992);
  const location = useLocation();

  // Check for admin access
  const checkAdminAccess = () => {
    const token = getToken();
    const user = getCurrentUser();

    if (!token || !user) {
      console.error('Missing authentication in admin layout');
      return false;
    }

    try {
      // Check for admin role
      if (!user.roles || !Array.isArray(user.roles) || !user.roles.includes('admin')) {
        console.error('User does not have admin role:', user.roles);
        return false;
      }

      // Verify token format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format in admin layout');
        return false;
      }

      // Decode token
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Verify token payload matches user data and has admin role
      if (payload.email !== user.email || 
          payload._id !== user._id || 
          !payload.roles.includes('admin')) {
        console.error('Token payload mismatch or missing admin role');
        return false;
      }

      console.log('Admin access verified for:', {
        email: user.email,
        roles: user.roles,
        path: location.pathname
      });

      return true;
    } catch (error) {
      console.error('Error validating admin access:', error);
      return false;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if not admin
  if (!checkAdminAccess()) {
    console.log('No admin access, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar isCollapsed={isSidebarCollapsed} onToggle={setIsSidebarCollapsed} />
      <div 
        className="admin-main"
        style={{
          marginLeft: isSidebarCollapsed ? "0" : "280px",
        }}
      >
        <div className="admin-content">
          <Outlet />
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
