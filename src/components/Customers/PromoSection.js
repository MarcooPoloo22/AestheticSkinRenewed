import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EPCategory2.css";

const Epcategory2 = () => {
  const [promos, setPromos] = useState([]);

  // Fetch promos from the PHP API
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/home_fetch_promos.php");
        const data = await response.json();
        if (data.success) {
          setPromos(data.data);
        } else {
          console.error("Failed to fetch promos:", data.error);
        }
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };

    fetchPromos();
  }, []);

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <section className="ezy__epcategory2">
      <Container>
        <Row className="align-items-center">
          <Col xs={8}>
            <h2 className="ezy__epcategory2-heading">Promos</h2>
          </Col>
          <Col xs={4} className="text-end">
            <Link className="ezy__epcategory2-btn" to="/services" role="button">
              See All
            </Link>
          </Col>
        </Row>

        <Row className="text-center justify-content-start justify-content-xl-center mt-4 mt-md-5">
          {promos.length > 0 ? (
            <Slider {...settings}>
              {promos.map((promo) => (
                <div key={promo.id} className="p-3">
                  <div className="card mx-auto" style={{ width: "18rem" }}>
                    <img
                      src={promo.image}
                      className="card-img-top"
                      alt={promo.title}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{promo.title}</h5>
                      <p className="card-text">{promo.description}</p>
                      <p className="card-text">Price: ₱{promo.price}</p>
                      <Link
                        className="btn btn-primary"
                        to={`/booking/${promo.id}`}
                        role="button"
                      >
                        Book Now!
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p>Loading promos...</p>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Epcategory2;