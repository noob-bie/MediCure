import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if we're on the main admin page (no nested route)
  const isMainAdminPage = location.pathname === "/admin";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-panel-container">
      {/* Hamburger Menu Button */}
      <button 
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li>
            <Link 
              to="/admin/product-management" 
              className="sidebar-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              Product Management
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/order-management" 
              className="sidebar-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              Order Management
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/delivery-management" 
              className="sidebar-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              Delivery Management
            </Link>
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="dashboard">
        {isMainAdminPage ? (
          // Show dashboard only on main admin page
          <>
            <h2>Dashboard</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Total Orders</h3>
                <p className="number">120</p>
              </div>
              <div className="dashboard-card">
                <h3>Pending Orders</h3>
                <p className="number">25</p>
              </div>
              <div className="dashboard-card">
                <h3>Completed Orders</h3>
                <p className="number">95</p>
              </div>
              <div className="dashboard-card">
                <h3>Payments Due</h3>
                <p className="number">৳ 15,000</p>
              </div>
            </div>
          </>
        ) : (
          // Show nested route content
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;