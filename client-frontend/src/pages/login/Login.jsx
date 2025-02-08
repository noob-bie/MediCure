import React, { useState } from 'react';
import './Login.css';
import axiosInstance from '../../utils/axiosInstance';

import phone from '../../assets/images/phone.png';
import password from '../../assets/images/password.png';

const Login = () => {
  const [role, setRole] = useState("user"); // Default role: User
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', {
        phone,
        password,
        role,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
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
          </select>
        </div>

        <div className="input">
          <img src={phone} alt="Phone" />
          <input 
          placeholder="Phone Number" 
          type="text"
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          />
        </div>

        <div className="input">
          <img src={password} alt="Password" />
          <input placeholder="Password" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
      </div>

      <div className="no-account">
        Do not have an account? <span>Signup</span>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>Login</div>
      </div>
    </div>
  );
};

export default Login;
