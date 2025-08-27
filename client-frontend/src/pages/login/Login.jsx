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
  const [popupMessage, setPopupMessage] = useState(""); // default empty string
  const [isError, setIsError] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // NEW
  const navigate = useNavigate();

  const showPopup = (message, errorFlag) => {
    setPopupMessage(message);
    setIsError(errorFlag);
    setIsPopupVisible(true); // ensure popup is visible immediately
  };

  const handleLogin = async () => {
    // Validation
    if (phone.length !== 11 || isNaN(phone)) {
      showPopup("Phone number must be exactly 11 digits.", true);
      return;
    }
    if (password.length < 6) {
      showPopup("Password must contain 6 Characters", true);
      return;
    }

    try {
      const response = await axiosInstance.post("/login", {
        phone,
        password,
        role,
      });

      if (!response.data.token) {
        showPopup("Token not received!", true);
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", response.data.user.role);

      setIsAuthenticated(true);
      setUserRole(response.data.user.role);

      showPopup(response.data.message, false);
    } catch (error) {
      showPopup(
        "Login failed: " +
          (error.response?.data?.message || "Invalid phone number or password."),
        true
      );
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    if (!isError) {
      navigate("/");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
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
          />
        </div>

        <div className="input">
          <img src={Password} alt="Password" />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <div className="submit" onClick={handleLogin}>
          Login
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
          <button onClick={handleClosePopup}>OK</button>
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
