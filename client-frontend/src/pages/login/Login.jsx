import React, { useState } from 'react';
import './Login.css';
import axiosInstance from '../../utils/axiosInstance';
import {Link, useNavigate} from 'react-router-dom';
import Signup from '../signup/Signup';

import Phone from '../../assets/images/Phone.png';
import Password from '../../assets/images/Password.png';

const Login = () => {
  const [role, setRole] = useState("user"); 
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

    // Validation checks
    if (phone.length !== 11 || isNaN(phone)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }
    if (password.length < 6) {
      alert("Wrong password.");
      return;
    }

    try {
      const response = await axiosInstance.post('/login', {
        phone,
        password,
        role,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", response.data.user.role);
      
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Invalid phone number or password."));
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      
      <div className="inputs">
        {/* Role Dropdown */}
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
          <input placeholder="Password" 
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
        <div className="submit" onClick={handleLogin}>Login</div>
      </div>
    </div>
  );
};

export default Login;
