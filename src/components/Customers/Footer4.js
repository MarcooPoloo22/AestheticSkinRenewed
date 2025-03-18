import React from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import "./Footer4.css";

const navigations = [
  {
    value: "Privacy Policy",
    href: "#!",
  },
  {
    value: "Security",
    href: "#!",
  },
  {
    value: "Terms & Condition",
    href: "#!",
  },
];

const NavigationItem = ({ item }) => (
  <Nav.Item>
    <Nav.Link href={item.href}>{item.value}</Nav.Link>
  </Nav.Item>
);

NavigationItem.propTypes = {
  item: PropTypes.object.isRequired,
};

const Footer4 = () => {
  return (
    <section className="ezy__footer4">
      <Container>
        <Row className="d-flex justify-content-center text-center">
          <Col xs={12}>
            <h2 className="fw-bold fa-3x footer-logo">ASR</h2>
            <Nav className="ezy__footer4-nav justify-content-center my-4 my-lg-5">
              {navigations.map((item, i) => (
                <NavigationItem item={item} key={i} />
              ))}
            </Nav>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Footer4;