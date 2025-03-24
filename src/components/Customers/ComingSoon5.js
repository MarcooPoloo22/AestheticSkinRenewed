import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./ComingSoon5.css";

const ComingSoon5 = () => {
  return (
    <section className="spa__comingsoon-section position-relative overflow-hidden py-5">
      <Container>
        <Row className="align-items-center justify-content-between">
          <Col xs={12} lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
            <h2 className="spa__heading mb-4">Glow Up with ASR</h2>
            <p className="spa__subheading mb-4">
            Indulge in relaxation with our special seasonal treatments. <br />From facials to massages, our spa treatments are designed to rejuvenate your skin and body.
            </p>
          </Col>
          <Col xs={12} lg={5} className="text-center">
            <div className="spa__image-wrapper">
              <img
                src="./assets/asr_beautytreatment.jpg"
                alt="Relaxing Spa"
                className="img-fluid rounded shadow"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ComingSoon5;
