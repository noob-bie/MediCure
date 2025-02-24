import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

import person from '../../assets/images/person.png';
import email from '../../assets/images/email.png';
import Phone from '../../assets/images/Phone.png';
import Password from '../../assets/images/Password.png';
import {Link, useNavigate} from 'react-router-dom';
import Login from '../login/Login';


const Signup = () => {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [emailValue, setEmail] = useState("");
  const [phoneValue, setPhone] = useState("");
  const [passwordValue, setPassword] = useState("");
  const navigate = useNavigate();

  

  const handleSignup = async () => {

    // Validation
    if (!emailValue.includes("@")) {
      alert("Invalid email! Email must contain '@'.");
      return;
    }
    if (phoneValue.length !== 11 || isNaN(phoneValue)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }
    if (passwordValue.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }


    try {
      const response = await axiosInstance.post('/register', {
        name,
        email: emailValue.toLowerCase(), //Convert to lowercase
        phone: phoneValue,
        password: passwordValue,
        role: "user", //Default role
      });
      alert(response.data.message);
      navigate('/login');
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
          onChange={(e) => setEmail(e.target.value.toLowerCase())} // Convert to lowercase
          />
        </div>
        <div className="input">
          <img src={Phone} alt="Phone" />
          <input 
          placeholder="Phone Number" 
          type="text"
          value={phoneValue} 
          onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <div className="input">
          <img src={Password} alt="Password" />
          <input 
          placeholder="Password" 
          type="password" 
          value={passwordValue} 
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="have-account">
        Already have an account? <Link to="/login">Login</Link>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleSignup}>Sign Up</div>
      </div>
    </div>
  );
};

export default Signup;
