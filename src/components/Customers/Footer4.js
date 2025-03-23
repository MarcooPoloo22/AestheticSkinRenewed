import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer4.css";

const Footer4 = () => {
  return (
    <footer className="ezy__footer4">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-md-start text-center mb-3 mb-md-0">
            <img
              src="/assets/asr_logoround.png"
              alt="ASR Logo"
              className="footer-logo-img"
            />
          </Col>
          <Col md={6} className="text-md-end text-center">
            <a href="#!" className="footer-link">
              Privacy Policy
            </a>
            <a href="#!" className="footer-link">
              Security
            </a>
            <a href="#!" className="footer-link">
              Terms & Condition
            </a>
            <p className="footer-copy">
              © 2025 Aesthetics Skin Renewed. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer4;
