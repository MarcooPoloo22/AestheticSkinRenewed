import React from "react";
import "../../styles/customer/FAQ.css";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        <div className="faq-item">
          <h3>Are the treatments safe?</h3>
          <p>Yes, all our treatments are dermatologically tested and approved by experts.</p>
        </div>
        <div className="faq-item">
          <h3>How can I book an appointment?</h3>
          <p>You can book an appointment through our website or by calling our hotline.</p>
        </div>
        <div className="faq-item">
          <h3>Do you offer home services?</h3>
          <p>Yes, we provide premium home services for selected treatments.</p>
        </div>
        <div className="faq-item">
          <h3>What are your payment options?</h3>
          <p>We accept credit cards, online payments, and cash transactions.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;