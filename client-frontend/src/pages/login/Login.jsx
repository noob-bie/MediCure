import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

import Phone from "../../assets/images/phone.png";
import Password from "../../assets/images/password.png";

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showPopup = (message, errorFlag) => {
    setPopupMessage(message);
    setIsError(errorFlag);
    setIsPopupVisible(true);
  };

  const handleLogin = async () => {
    // Prevent multiple submissions
    if (isLoading) return;

    // Validation
    if (phone.length !== 11 || isNaN(phone)) {
      showPopup("Phone number must be exactly 11 digits.", true);
      return;
    }
    if (password.length < 6) {
      showPopup("Password must contain 6 Characters", true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/login", {
        phone,
        password,
        role,
      });

      console.log("Login Response:", response.data);
      
      if (!response.data.token) {
        showPopup("Token not received!", true);
        setIsLoading(false);
        return;
      }

      // Store in localStorage first
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", response.data.user.role);

      // Update app state
      setIsAuthenticated(true);
      setUserRole(response.data.user.role);

      // Show success message
      showPopup(response.data.message || "Login successful!", false);
      
      // Navigate after a delay to allow state to propagate
      setTimeout(() => {
        setIsPopupVisible(false);
        navigate("/");
      }, 1500);

    } catch (error) {
      showPopup(
        "Login failed: " +
          (error.response?.data?.message || "Invalid phone number or password."),
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    // Don't navigate here - let the automatic navigation handle success cases
    // For error cases, just close the popup
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {/* Role Dropdown */}
        <div className="input">
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="delivery man">Delivery Man</option>
          </select>
        </div>

        <div className="input">
          <img src={Phone} alt="Phone" />
          <input
            placeholder="Phone Number"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        <div className="input">
          <img src={Password} alt="Password" />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="forgot-password">
        Forgot password? <span>Click Here!</span>
      </div>

      <div className="no-account">
        Do not have an account? <Link to="/signup">Signup</Link>
      </div>

      <div className="submit-container">
        <div 
          className={`submit ${isLoading ? 'loading' : ''}`}
          onClick={handleLogin}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </div>
      </div>

      {/* Popup Message */}
      <div
        className="popup-overlay"
        style={{ display: isPopupVisible ? "flex" : "none" }}
      >
        <div className="popup-box">
          <p className={isError ? "error-message" : "success-message"}>
            {popupMessage}
          </p>
          
          {isError ? (
            // Show OK button for errors
            <button onClick={handleClosePopup}>OK</button>
          ) : (
            // Show auto-redirect message for success
            <div>
              <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                Redirecting to home page...
              </p>
              <div className="loading-spinner" style={{ 
                width: '20px', 
                height: '20px', 
                border: '2px solid #f3f3f3',
                borderTop: '2px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '10px auto'
              }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
};

export default Login;