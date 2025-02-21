import React from "react";
import "../../styles/customer/FAQ.css";
import Accordion from "react-bootstrap/Accordion";

const FAQ = () => {
  return (
    <>
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Are the treatments safe?</Accordion.Header>
            <Accordion.Body>
              Yes, all our treatments are dermatologically tested and approved
              by experts.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>How can I book an appointment?</Accordion.Header>
            <Accordion.Body>
              You can book an appointment through our website or by calling our
              hotline.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Do you offer home services?</Accordion.Header>
            <Accordion.Body>
              Yes, we provide premium home services for selected treatments.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>What are your payment options?</Accordion.Header>
            <Accordion.Body>
              We accept credit cards, online payments, and cash transactions.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* <div className="faq-list">
          <div className="faq-item">
            <h3>Are the treatments safe?</h3>
            <p>
              Yes, all our treatments are dermatologically tested and approved
              by experts.
            </p>
          </div>
          <div className="faq-item">
            <h3>How can I book an appointment?</h3>
            <p>
              You can book an appointment through our website or by calling our
              hotline.
            </p>
          </div>
          <div className="faq-item">
            <h3>Do you offer home services?</h3>
            <p>
              Yes, we provide premium home services for selected treatments.
            </p>
          </div>
          <div className="faq-item">
            <h3>What are your payment options?</h3>
            <p>
              We accept credit cards, online payments, and cash transactions.
            </p>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default FAQ;
