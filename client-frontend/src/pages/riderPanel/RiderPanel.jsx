import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./RiderPanel.css";

const RiderPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orderCounts, setOrderCounts] = useState({
    assigned: 0,
    pending: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check if we're on the main delivery page (no nested route)
  const isMainDeliveryPage = location.pathname === "/delivery";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to fetch order counts from the backend
  const fetchOrderCounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('Fetching dashboard counts...'); // Debug log

      const response = await fetch('http://127.0.0.1:8000/api/delivery/dashboard-counts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers.get('content-type')); // Debug log

      if (response.ok) {
        const text = await response.text(); // Get as text first
        console.log('Raw response:', text); // Debug log
        
        try {
          const data = JSON.parse(text); // Try to parse as JSON
          setOrderCounts({
            assigned: data.assigned || 0,
            pending: data.pending || 0,
            completed: data.completed || 0
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text:', text);
        }
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Network error fetching order counts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order counts when component mounts
  useEffect(() => {
    if (isMainDeliveryPage) {
      fetchOrderCounts();
    }
  }, [isMainDeliveryPage]);

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
                <p className="number">
                  {loading ? '...' : orderCounts.assigned}
                </p>
              </div>
              <div className="dashboard-card">
                <h3>Pending Orders</h3>
                <p className="number">
                  {loading ? '...' : orderCounts.pending}
                </p>
              </div>
              <div className="dashboard-card">
                <h3>Completed Orders</h3>
                <p className="number">
                  {loading ? '...' : orderCounts.completed}
                </p>
              </div>
            </div>
          </>
        ) : (
         
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default RiderPanel;