import React, { useState } from 'react';
import './Login.css';

import phone from '../../assets/images/phone.png';
import password from '../../assets/images/password.png';

const Login = () => {
  const [role, setRole] = useState("user"); // Default role: User

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
          <input placeholder="Phone Number" type="text" />
        </div>

        <div className="input">
          <img src={password} alt="Password" />
          <input placeholder="Password" type="password" />
        </div>
      </div>

      <div className="no-account">
        Do not have an account? <span>Signup</span>
      </div>

      <div className="submit-container">
        <div className="submit">Login</div>
      </div>
    </div>
  );
};

export default Login;
