// Profile.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import download from "../../assets/images/download.png";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError(new Error("No authentication token found"));
          setLoading(false);
          return;
        }

        console.log("Fetching profile data..."); // Debug log
        const response = await axiosInstance.get("/profile");
        console.log("Profile response:", response.data); // Debug log
        
        if (response.data) {
          setProfileData(response.data);
          setImageError(false); // Reset image error state
        } else {
          setError(new Error("No profile data received"));
        }
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err);
        setLoading(false);
        
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          setIsAuthenticated(false);
          setUserRole(null);
          navigate("/login");
        }
      }
    };

    if (authStatus) {
      fetchProfile();
    } else {
      setLoading(false);
      setError(new Error("User not authenticated"));
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Add a small delay to show the loading dialog
    setTimeout(() => {
      // Clear all authentication data
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      
      // Clear any other user-related data if needed
      localStorage.removeItem("cartItems"); // if you store cart data
      localStorage.removeItem("userPreferences"); // if you store preferences
      
      // Reset state
      setIsAuthenticated(false);
      setUserRole(null);
      
      // Navigate to home page and reload the entire website
      navigate("/");
      
      // Force a complete page reload to reset the entire application state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 1500); // Show loading for 1.5 seconds
  };

  const handleImageError = () => {
    console.log("Image failed to load, using default image");
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageError(false);
  };

  const handleImageClick = () => {
    if (profileData?.profile_image_url && !imageError) {
      setShowImageModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowImageModal(false);
    }
  };

  // Get the profile image URL with fallback logic
  const getProfileImageUrl = () => {
    if (imageError || !profileData?.profile_image_url) {
      return download; // Fallback to default image
    }
    return profileData.profile_image_url;
  };

  if (loading) {
    return <div className="profile-container loading">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-container error">
        <p>Error loading profile: {error.message}</p>
        <button onClick={() => navigate("/login")} className="profile-button">
          Go to Login
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container not-found">
        <p>Profile data not found.</p>
        <button onClick={() => navigate("/login")} className="profile-button">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={getProfileImageUrl()}
            alt="Profile Avatar" 
            className={`profile-avatar ${profileData?.profile_image_url && !imageError ? 'clickable' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            onClick={handleImageClick}
            style={{ cursor: profileData?.profile_image_url && !imageError ? 'pointer' : 'default' }}
          />
          
          {profileData.profile_image_url && !imageError && (
            <p className="image-status"> </p>
          )}
          {(!profileData.profile_image_url || imageError) && (
            <p className="image-status"></p>
          )}
        </div>
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {profileData.name || 'Not provided'}
          </p>
          <p>
            <strong>Phone:</strong> {profileData.phone || 'Not provided'}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email || 'Not provided'}
          </p>
          <p>
            <strong>Address:</strong> {profileData.address || 'Not provided'}
          </p>
          <p>
            <strong>Role:</strong> {profileData.role || 'Not provided'}
          </p>
          {profileData.name_changed_at && (
            <p>
              <strong>Name Changed:</strong> {new Date(profileData.name_changed_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="profile-actions">
          <button
            onClick={() => navigate("/orders")}
            className="profile-button"
          >
            My Orders
          </button>
          <button 
            onClick={() => navigate("/edit-profile")}
            className="profile-button"
          >
            Edit Profile
          </button>
          <button onClick={handleLogout} className="profile-button logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;