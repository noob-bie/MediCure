import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./RiderPanel.css";

const RiderPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if we're on the main delivery page (no nested route)
  const isMainDeliveryPage = location.pathname === "/delivery";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="rider-panel-container">
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
        <h2 className="sidebar-title">Rider Panel</h2>
        <ul className="sidebar-menu">
          <li>
            <Link 
              to="/delivery/my-orders" 
              className="sidebar-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              My Orders
            </Link>
          </li>
          <li>
            <Link 
              to="/delivery/delivery-history" 
              className="sidebar-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              Delivery History
            </Link>
          </li>
          <li>
            <Link 
              to="/delivery/payment-details" 
              className="sidebar-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              Payment Details
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
        {isMainDeliveryPage ? (
          // Show dashboard only on main admin page
          <>
            <h2>Dashboard</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Assigned Orders</h3>
                <p className="number">3</p>
              </div>
              <div className="dashboard-card">
                <h3>Pending Orders</h3>
                <p className="number">1</p>
              </div>
              <div className="dashboard-card">
                <h3>Completed Orders</h3>
                <p className="number">2</p>
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

export default RiderPanel;