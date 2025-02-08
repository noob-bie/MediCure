import React, { useState } from 'react';
import './Signup.css';

import person from '../../assets/images/person.png';
import email from '../../assets/images/email.png';
import phone from '../../assets/images/phone.png';
import password from '../../assets/images/password.png';

const Signup = () => {
  const [role, setRole] = useState("user"); // Default role: User

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
          <input placeholder="Name" type="text" />
        </div>
        <div className="input">
          <img src={email} alt="Email" />
          <input placeholder="Email Id" type="email" />
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

      <div className="have-account">
        Already have an account? <span>Login</span>
      </div>

      <div className="submit-container">
        <div className="submit">Sign Up</div>
      </div>
    </div>
  );
};

export default Signup;
