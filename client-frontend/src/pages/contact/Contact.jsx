import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header-section">
        <h1>Contact Us</h1>
        <p>We are here to help! Get in touch with our support team.</p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon">📍</div>
              <h3>Visit Us</h3>
              <p>123 Healthcare Avenue<br />Dhaka, Bangladesh 1000</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📞</div>
              <h3>Call Us</h3>
              <p>Phone: +880 123-456-789<br />Emergency: +880 987-654-321</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">✉️</div>
              <h3>Email Us</h3>
              <p>support@medicure.com<br />info@medicure.com</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">🕒</div>
              <h3>Business Hours</h3>
              <p>Mon - Fri: 9:00 AM - 9:00 PM<br />Sat - Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              <p>✅ Thank you! Your message has been sent successfully. We will get back to you soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                disabled={loading}
                className="form-input"
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="form-textarea"
                placeholder="Tell us how we can help you..."
                rows="6"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div> */}

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How can I track my order?</h4>
              <p>You can track your order by logging into your account and visiting the My Orders section from Profile, or contact our support team with your order number.</p>
            </div>

            <div className="faq-item">
              <h4>What are your delivery charges?</h4>
              <p>Delivery charges vary based on your location and order value. Orders above ৳1000 qualify for free delivery within Dhaka.</p>
            </div>

            <div className="faq-item">
              <h4>Do you provide medicine consultation?</h4>
              <p>Yes, we have qualified pharmacists available for consultation. You can contact us during business hours for medicine-related queries.</p>
            </div>

            <div className="faq-item">
              <h4>How do I return a product?</h4>
              <p>Products can be returned within 7 days of delivery if unopened and in original packaging. Contact our support team to initiate a return.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;