import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAuthenticated(authStatus);
    setIsAdmin(adminStatus);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <div className="navbar">
      {/* Left Section */}
      <div className="nav-left">
        <Link to="/" className="link">
          <span className="text">Medicure</span>
        </Link>
      </div>

      <div className="nav-left-middle">
        <div className="search-bar">
          <input
            type="text"
            placeholder={isSearchActive ? "" : "Search medicine or products"}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
          />
        </div>
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`nav-links ${isMenuOpen ? "show" : ""}`}>
        <div className="nav-middle">
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
        </div>

        <div className="nav-right">
          {isAuthenticated ? (
            <div className="profile-section">
              <Link to="/profile" className="profile-icon">
                👤 Profile
              </Link>
            
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
