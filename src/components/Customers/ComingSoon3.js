import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./ComingSoon3.css";

const ComingSoon3 = () => {
  return (
    <section className="ezy__comingsoon3">
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col
            xs={12}
            lg={6}
            className="d-flex flex-column justify-content-center text-center text-lg-start"
          >
            <h2 className="ezy__comingsoon3-heading">
              Expert Care for Radiant Skin
            </h2>
            <p className="ezy__comingsoon3-sub-heading mb-5 mb-lg-0">
              From facials to advanced skin treatments, our specialists ensure
              you leave feeling refreshed and confident. Rejuvenate in a
              tranquil, spa-inspired atmosphere.
            </p>
          </Col>
          <Col xs={12} lg={6} className="text-center">
            <div className="ezy__comingsoon3-image-wrapper">
              <img
                src="/assets/asr_home1.jpg"
                alt="Spa"
                className="img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ComingSoon3;
