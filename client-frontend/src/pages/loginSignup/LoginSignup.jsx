import React, { useState } from 'react'
import './LoginSignup.css'

import email from '../../assets/images/email.png';
import person from '../../assets/images/person.png';
import password from '../../assets/images/password.png';
import phone from '../../assets/images/phone.png';

const LoginSignup = () => {
  
  const [action,setAction] = useState("Login");

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
        {action === "Login" ? (
           <div></div>
        ) : (
        <>
          <div className="input">
             <img src={person} alt="" />
             <input placeholder="Name" type="text" />
         </div>
         <div className="input">
            <img src={email} alt="" />
            <input placeholder="Email Id" type="email" />
         </div>
       </>
    )}


            
            
            <div className="input">
                <img src={phone} alt="" />
                <input placeholder="Phone Number" type="phone" />
            </div>
            <div className="input">
                <img src={password} alt="" />
                <input placeholder="Password" type="password" />
            </div>
        </div>
        {action==="Sign Up"?<div></div>:<div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
        
        <div className="submit-container">
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>

    </div>
  )
}

export default LoginSignup