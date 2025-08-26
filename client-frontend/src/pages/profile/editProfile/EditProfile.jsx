// EditProfile.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import { Camera, Save, ArrowLeft, AlertCircle } from "lucide-react"

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    profile_image: null,
    profile_image_url: null,
    name_changed_at: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [nameChanged, setNameChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/profile");
      console.log("Profile response:", response.data); // Debug log
      
      if (response.data) {
        setProfileData(response.data);
        setNameChanged(!!response.data.name_changed_at);
        
        // Use profile_image_url from backend if available, with error handling
        if (response.data.profile_image_url) {
          setImagePreview(response.data.profile_image_url);
        } else if (response.data.profile_image) {
          // Fallback: construct URL from profile_image filename
          setImagePreview(`http://127.0.0.1:8000/storage/profiles/${response.data.profile_image}`);

        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      console.error("Error details:", err.response?.data); // More detailed error logging
      setError(err.response?.data?.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any existing errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(null); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');

    try {
      // Validate required fields
      if (!profileData.name?.trim()) {
        throw new Error("Name is required");
      }

      const formData = new FormData();
      formData.append('name', profileData.name.trim());
      formData.append('address', profileData.address?.trim() || '');
      
      if (selectedImage) {
        formData.append('profile_image', selectedImage);
      }

      console.log("Submitting form data..."); // Debug log

      const response = await axiosInstance.post("/profile/update", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log("Update response:", response.data); // Debug log

      if (response.data.success) {
        setSuccess(response.data.message);
        
        if (response.data.name_updated) {
          setNameChanged(true);
        }
        
        // Update local state with new data
        if (response.data.user) {
          setProfileData(prev => ({
            ...prev,
            ...response.data.user
          }));
        }
        
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      console.error("Error response:", err.response?.data); // More detailed error logging
      
      let errorMessage = "Failed to update profile";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Cleanup function for image preview URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return (
      <div className="edit-profile-container">
        <div className="loading-spinner">Loading Edit Profile...</div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <button 
            className="back-button"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>
          <h2>Edit Profile</h2>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Profile Image Upload Section */}
          <div className="form-group image-upload-group">
            <label className="form-label">Profile Image</label>
            <div className="image-upload-container">
              <div className="image-preview">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile Preview" 
                    className="preview-image"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      setImagePreview(null);
                    }}
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <Camera size={40} />
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="profile_image" className="image-upload-button">
                <Camera size={20} />
                Choose Image
              </label>
            </div>
            <small className="form-help">
              You can change your profile image anytime. Max size: 2MB. 
              Supported formats: JPEG, PNG, GIF, WebP
            </small>
          </div>

          {/* Name Field with Restriction */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name *
              {nameChanged && <span className="restriction-badge">Changed Once</span>}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="form-input"
              disabled={nameChanged}
              required
              maxLength="255"
            />
            {nameChanged ? (
              <small className="form-help restriction-text">
                <AlertCircle size={16} />
                You have already changed your name once. No further changes allowed.
              </small>
            ) : (
              <small className="form-help red-text">
                ***You can only change your name once in your lifetime***
              </small>
            )}
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              value={profileData.address || ''}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Enter your address"
              maxLength="1000"
            />
            <small className="form-help">
              You can change your address anytime (max 1000 characters)
            </small>
          </div>

          {/* Save Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="button-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;