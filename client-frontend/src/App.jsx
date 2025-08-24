import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import DeleteProduct from "./pages/admin/DeleteProduct";
import SingleUpdateProduct from "./pages/admin/SingleUpdateProduct";

// DeliveryMan Pages
import DeliveryManDashboard from "./pages/delivery/DeliveryManDashboard";
import DeliveryOrders from "./pages/delivery/DeliveryOrders";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ✅ Sync auth state from localStorage (reactive, your approach)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Route */}
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        {isAuthenticated && userRole === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/update-product" element={<UpdateProduct />} />
            <Route path="/admin/update-product/:id" element={<SingleUpdateProduct />} />
            <Route path="/admin/delete-product" element={<DeleteProduct />} />
          </>
        )}

        {/* DeliveryMan Routes */}
        {isAuthenticated && userRole === "deliveryman" && (
          <>
            <Route path="/delivery" element={<DeliveryManDashboard />} />
            <Route path="/delivery/orders" element={<DeliveryOrders />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
