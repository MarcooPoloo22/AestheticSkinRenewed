import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer4.css";

const Footer4 = () => {
  return (
    <footer className="ezy__footer4">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs="auto" className="text-center">
            <img
              src="/assets/asr_logoround.png"
              alt="ASR Logo"
              className="footer-logo-img"
            />
          </Col>
          <Col xs="auto" className="text-center">
            <div>
              <a href="#!" className="footer-link">
                Privacy Policy
              </a>
              <a href="#!" className="footer-link">
                Terms & Condition
              </a>
              <p className="footer-copy">
                © 2025 Aesthetics Skin Renewed. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer4;