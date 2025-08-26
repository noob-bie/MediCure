import React, { useState } from 'react';
import './Signup.css';
import axiosInstance from '../../utils/axiosInstance';
import person from '../../assets/images/person.png';
import email from '../../assets/images/email.png';
import Phone from '../../assets/images/phone.png';
import Password from '../../assets/images/password.png';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [emailValue, setEmail] = useState("");
  const [phoneValue, setPhone] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState(null); // popup message state
  const [isError, setIsError] = useState(false); // to differentiate error/success
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validation
    if (!emailValue.includes("@")) {
      setPopupMessage("Invalid email! Email must contain '@'.");
      setIsError(true);
      return;
    }
    if (phoneValue.length !== 11 || isNaN(phoneValue)) {
      setPopupMessage("Phone number must be exactly 11 digits.");
      setIsError(true);
      return;
    }
    if (passwordValue.length < 6) {
      setPopupMessage("Password must be at least 6 characters.");
      setIsError(true);
      return;
    }

    try {
      const response = await axiosInstance.post('/register', {
        name,
        email: emailValue.toLowerCase(),
        phone: phoneValue,
        password: passwordValue,
        role: "user",
      });
      setPopupMessage(response.data.message);
      setIsError(false);
    } catch (error) {
      setPopupMessage("Signup failed: " + (error.response?.data?.message || "Unknown error"));
      setIsError(true);
    }
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
    if (!isError) {
      navigate('/login');
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
            onChange={(e) => setEmail(e.target.value.toLowerCase())} 
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

      {/* Popup Message */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p className={isError ? "error-message" : "success-message"}>{popupMessage}</p>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
