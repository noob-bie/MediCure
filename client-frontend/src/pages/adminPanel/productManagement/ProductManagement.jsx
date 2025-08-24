import React, { useState, useEffect } from "react";
import "./ProductManagement.css";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expiredCount, setExpiredCount] = useState(0);

  // Check if we're on the main product management page (no nested route)
  const isMainProductManagementPage = location.pathname === "/admin/product-management";

  // Fetch expired products count
  useEffect(() => {
    if (isMainProductManagementPage) {
      fetchExpiredProductsCount();
    }
  }, [isMainProductManagementPage]);

  const fetchExpiredProductsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const products = await response.json();
        const today = new Date();
        const expired = products.filter(product => {
          const expDate = new Date(product.expiration_date);
          return expDate < today;
        });
        setExpiredCount(expired.length);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="page-container">
      {isMainProductManagementPage ? (
        // Show product management options only on main page
        <div className="content">
          <h2>Product Management</h2>
          <p>Select an option below to manage products.</p>
          <div className="button-group">
            <button 
              className="management-btn add-btn"
              onClick={() => navigate("/admin/product-management/Add Product")}
            >
              Add Product
            </button>
            <button 
              className="management-btn update-btn"
              onClick={() => navigate("/admin/product-management/Update Products")}
            >
              Update Products
            </button>
            <button 
              className="management-btn delete-btn"
              onClick={() => navigate("/admin/product-management/Delete Products")}
            >
              Delete Products
              {expiredCount > 0 && (
                <span className="notification-badge">
                  {expiredCount}
                </span>
              )}
            </button>
          </div>
          
          {expiredCount > 0 && (
            <div className="expired-products-alert">
              <div className="alert-content">
                <span className="alert-icon">⚠️</span>
                <div className="alert-text">
                  <strong>Attention!</strong> You have {expiredCount} expired product{expiredCount > 1 ? 's' : ''} that need{expiredCount === 1 ? 's' : ''} to be removed.
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Show nested route content (Add/Update/Delete components)
        <Outlet />
      )}
    </div>
  );
};

export default ProductManagement;