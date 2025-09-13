import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header-section">
        <h1>About Medicure</h1>
        <p>Your trusted partner in health and wellness</p>
      </div>

      <div className="about-content">
        {/* Our Story Section */}
        <section className="story-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Founded in 2025, Medicure was born out of a simple yet powerful vision: 
                to make quality healthcare accessible to everyone, everywhere. What started 
                as a small initiative is growing into the most trusted online pharmacy of Bangladesh, 
                serving thousands of customers across the country.
              </p>
              <p>
                Our journey began when our founders recognized the challenges people face 
                in accessing medicines and healthcare products, especially during emergencies 
                or in remote areas. We set out to bridge this gap by creating a platform 
                that combines convenience, reliability, and affordability.
              </p>
            </div>
            <div className="story-image">
              <div className="placeholder-image">🏥</div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mission-vision-section">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide convenient, reliable, and affordable access to quality 
                medicines and healthcare products, empowering individuals to take 
                control of their health and well-being.
              </p>
            </div>

            <div className="vision-card">
              <div className="card-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To become  leading digital healthcare platform of Bangladesh, 
                revolutionizing how people access and manage their healthcare needs 
                through technology and innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🛡️</div>
              <h4>Trust & Safety</h4>
              <p>We ensure all products are genuine and sourced from licensed manufacturers and suppliers.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">⚡</div>
              <h4>Convenience</h4>
              <p>Order from anywhere, anytime. Fast delivery to your doorstep with just a few clicks.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">💰</div>
              <h4>Affordability</h4>
              <p>Competitive prices and regular discounts to make healthcare accessible to all.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">👨‍⚕️</div>
              <h4>Expert Care</h4>
              <p>Qualified pharmacists and healthcare professionals available for consultation.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">🔒</div>
              <h4>Privacy</h4>
              <p>Your health information and personal data are protected with the highest security standards.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">🌍</div>
              <h4>Community</h4>
              <p>Contributing to healthier communities by making healthcare more accessible and affordable.</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Products Available</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">64</div>
              <div className="stat-label">Districts Served</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Our Team</h2>
          <p className="team-intro">
            Behind Medicure is a dedicated team of healthcare professionals, 
            pharmacists, and technology experts committed to your well-being.
          </p>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h4>Dr. Mohammad Rahman</h4>
              <p className="member-role">Chief Executive Officer</p>
              <p className="member-bio">15+ years in healthcare management and digital health solutions.</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍⚕️</div>
              <h4>Dr. Fatima Khatun</h4>
              <p className="member-role">Chief Pharmacist</p>
              <p className="member-bio">Licensed pharmacist with expertise in pharmaceutical care and safety.</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h4>Eng. Arif Hassan</h4>
              <p className="member-role">Chief Technology Officer</p>
              <p className="member-bio">Leading our technology initiatives and platform development.</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h4>Ms. Nusrat Jahan</h4>
              <p className="member-role">Head of Customer Care</p>
              <p className="member-bio">Ensuring exceptional customer service and support experience.</p>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="certifications-section">
          <h2>Certifications & Partnerships</h2>
          <div className="certifications-content">
            <div className="cert-item">
              <div className="cert-icon">🏆</div>
              <h4>Licensed Pharmacy</h4>
              <p>Certified by the Department of Drug Administration, Bangladesh</p>
            </div>

            <div className="cert-item">
              <div className="cert-icon">🛡️</div>
              <h4>ISO Certified</h4>
              <p>ISO 9001:2015 certified for quality management systems</p>
            </div>

            <div className="cert-item">
              <div className="cert-icon">🤝</div>
              <h4>Trusted Partners</h4>
              <p>Partnerships with leading pharmaceutical companies and manufacturers</p>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Experience Better Healthcare?</h2>
            <p>Join thousands of satisfied customers who trust Medicure for their health needs.</p>
            <div className="cta-buttons">
              <a href="/shop" className="cta-button primary">Shop Now</a>
              <a href="/contact" className="cta-button secondary">Contact Us</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;