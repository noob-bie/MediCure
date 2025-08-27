import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    cancelled_orders: 0,
    confirmed_orders: 0,
    total_delivery_men: 0,
    expired_products: 0,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check if we're on the main admin page (no nested route)
  const isMainAdminPage = location.pathname === "/admin";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch dashboard statistics
  useEffect(() => {
    if (isMainAdminPage) {
      fetchDashboardStats();
    }
  }, [isMainAdminPage]);

  // In AdminPanel.jsx, update the fetchDashboardStats function:

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching dashboard stats with token:",
        token ? "Token exists" : "No token"
      );

      // FIXED: Changed from 'dashboard/stats' to 'dashboard-stats'
      const response = await fetch(
        "http://localhost:8000/api/admin/dashboard-stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Dashboard data received:", data);
        setDashboardStats(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch dashboard stats:", errorText);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
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
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
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
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Main Content Area */}
      <main className="dashboard">
        {isMainAdminPage ? (
          // Show dashboard only on main admin page
          <>
            <h2>Dashboard</h2>
            {loading ? (
              <div>Loading dashboard statistics...</div>
            ) : (
              <>
                
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                >
                  <strong>Debug Info:</strong> {JSON.stringify(dashboardStats)}
                </div>

                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <h3>Total Orders</h3>
                    <p className="number">{dashboardStats.total_orders || 0}</p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Pending Orders</h3>
                    <p className="number">
                      {dashboardStats.pending_orders || 0}
                    </p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Confirmed Orders</h3>
                    <p className="number">
                      {dashboardStats.confirmed_orders || 0}
                    </p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Cancelled Orders</h3>
                    <p className="number">
                      {dashboardStats.cancelled_orders || 0}
                    </p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Delivery Men</h3>
                    <p className="number">
                      {dashboardStats.total_delivery_men || 0}
                    </p>
                  </div>
                  <div className="dashboard-card">
                    <h3>Expired Products</h3>
                    <p className="number">
                      {dashboardStats.expired_products || 0}
                    </p>
                  </div>
                </div>
              </>
            )}
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
