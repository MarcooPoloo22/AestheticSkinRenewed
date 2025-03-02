import React, { useState, useEffect } from "react";
import "../../styles/customer/FAQ.css";
import Accordion from "react-bootstrap/Accordion";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);

  // Fetch FAQs from the backend
  useEffect(() => {
    fetch('http://localhost/fetch_faqs.php')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched FAQs:", data); // Debugging
        setFaqs(data);
      })
      .catch(error => console.error('Error fetching FAQs:', error));
  }, []);

  return (
    <>
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <Accordion defaultActiveKey="0" flush>
          {faqs.map((faq, index) => (
            <Accordion.Item key={faq.id} eventKey={index.toString()}>
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default FAQ;