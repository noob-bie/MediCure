// Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import download from "../../assets/images/download.png";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("userRole");
    setIsAuthenticated(authStatus);
    setUserRole(storedRole);
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authToken"); // Remove token on logout
    localStorage.removeItem("userRole"); // Remove role on logout
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  if (loading) {
    return <div className="profile-container loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="profile-container error">Error: {error.message}</div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container not-found">Profile data not found.</div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={download}
            alt="Default Avatar"
            className="profile-avatar"
          />
          <h2>Profile</h2>
        </div>
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Phone:</strong> {profileData.phone}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Address:</strong> {profileData.address}
          </p>
          <p>
            <strong>Role:</strong> {profileData.role}
          </p>
        </div>
        <div className="profile-actions">
          <button className="profile-button">Order History</button>
          <button className="profile-button">Edit Profile</button>
          <button onClick={handleLogout} className="profile-button logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;