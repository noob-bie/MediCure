import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

import person from '../../assets/images/person.png';
import email from '../../assets/images/email.png';
import phone from '../../assets/images/phone.png';
import password from '../../assets/images/password.png';

const Signup = () => {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [emailValue, setEmail] = useState("");
  const [phoneValue, setPhone] = useState("");
  const [passwordValue, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axiosInstance.post('/register', {
        name,
        email: emailValue,
        phone: phoneValue,
        password: passwordValue,
        role,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Sign Up</div>
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
          <img src={person} alt="Person" />
          <input 
          placeholder="Name" 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="input">
          <img src={email} alt="Email" />
          <input 
          placeholder="Email Id" 
          type="email"
          value={emailValue} 
          onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="input">
          <img src={phone} alt="Phone" />
          <input 
          placeholder="Phone Number" 
          type="text"
          value={phoneValue} 
          onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <div className="input">
          <img src={password} alt="Password" />
          <input 
          placeholder="Password" 
          type="password" 
          value={passwordValue} 
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="have-account">
        Already have an account? <span>Login</span>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleSignup}>Sign Up</div>
      </div>
    </div>
  );
};

export default Signup;
