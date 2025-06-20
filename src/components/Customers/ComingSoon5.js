import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./ComingSoon5.css";

// Reusable fade-in wrapper
const FadeInSection = ({ children }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // animate only once
        }
      });
    });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
    >
      {children}
    </div>
  );
};

const ComingSoon5 = () => {
  return (
    <section className="spa__comingsoon-section position-relative overflow-hidden py-5">
      <Container>
        <Row className="align-items-center justify-content-between">
          <Col xs={12} lg={6} className="text-center text-lg-start mb-4 mb-lg-0">
            <FadeInSection>
              <h2 className="spa__heading mb-4">Glow Naturally, Glow ASR</h2>
              <p className="spa__subheading mb-4">
                Indulge in relaxation with our special seasonal treatments. <br />
                From facials to massages, our spa treatments are designed to rejuvenate your skin and body.
              </p>
            </FadeInSection>
          </Col>
          <Col xs={12} lg={5} className="text-center">
            <FadeInSection>
              <div className="spa__image-wrapper">
                <img
                  src="./assets/asr_beautytreatment.jpg"
                  alt="Relaxing Spa"
                  className="img-fluid rounded shadow"
                />
              </div>
            </FadeInSection>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ComingSoon5;
