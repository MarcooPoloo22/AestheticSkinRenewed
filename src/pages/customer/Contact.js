import React from "react";
import "../../styles/customer/Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <div className="contact-sections">
        <div className="contact-box">
          <i className="phone-icon">📞</i>
          <h3>Talk to a member of our team</h3>
          <p>Interested in our services? Give us a call!</p>
          <p className="contact-number">+63 9172385134</p>
        </div>
        <div className="social-box">
          <i className="social-icon">🌍</i>
          <h3>Reach us through our socials</h3>
          <p>Connect with us on social media. Just click below!</p>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-link">📘</a>
            <a href="https://instagram.com" className="social-link">📷</a>
            <a href="https://twitter.com" className="social-link">🐦</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;