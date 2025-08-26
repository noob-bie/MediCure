import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]); // all products
  const searchRef = useRef(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("userRole");
    setIsAuthenticated(authStatus);
    setUserRole(storedRole);

    // Fetch all products once
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    // Close suggestions if clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          (p.generic_name && p.generic_name.toLowerCase().includes(value.toLowerCase()))
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/" className="link">
          <span className="text">Medicure</span>
        </Link>
      </div>

      <div className="nav-left-middle">
        <div className="search-bar" ref={searchRef}>
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((p) => (
                <li
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setSuggestions([]);
                    setQuery("");
                  }}
                >
                  <strong>{p.name}</strong>{" "}
                  {p.generic_name && <em>({p.generic_name})</em>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`nav-links ${isMenuOpen ? "show" : ""}`}>
        <div className="nav-middle">
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          {userRole === "admin" && <Link to="/admin">Admin Panel</Link>}
          {userRole === "delivery man" && <Link to="/delivery">Rider Panel</Link>}
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
