import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EPCategory2.css";

const Epcategory2 = () => {
  const [promos, setPromos] = useState([]);

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
            <Link className="ezy__epcategory2-btn" to="/promos" role="button">
              See All
            </Link>
          </Col>
        </Row>

        <Row className="mt-4 mt-md-5">
          {promos.length > 0 ? (
            <Slider {...settings}>
              {promos.map((promo) => (
                <div key={promo.id} className="px-2 h-100">
                  <Card className="ezy__epcategory2-card h-100">
                    <div className="ezy__epcategory2-card-img">
                      <img src={promo.image} alt={promo.title} className="img-fluid w-100" />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="ezy__epcategory2-title text-center">{promo.title}</Card.Title>
                      <Card.Text className="ezy__epcategory2-description flex-grow-1">
                        {promo.description}
                      </Card.Text>
                      <div className="mt-auto">
                        <Card.Text className="ezy__epcategory2-price text-center">Price: ₱{promo.price}</Card.Text>
                        <Link 
                          className="btn btn-primary w-100 mt-2" 
                          to={`/booking/${promo.id}`} 
                          role="button"
                        >
                          Book Now!
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
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