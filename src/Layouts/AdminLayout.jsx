import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import "./css/admin.css";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
