import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/customer/spa_massage.jpg";
import "./EPCategory2.css";
import { Link } from "react-router-dom";

/*
{
	"react": "React",
	"react-bootstrap": "{ Button, Card, Col, Container, Row }",
	"prop-types": "PropTypes",
}
*/

const products = [
  {
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/product23.png",
    title: "Fashion",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/product12.png",
    title: "Perfume",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/product18.png",
    title: "Shoes",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/product8.png",
    title: "Kitchen",
  },
];

const ProductItem = ({ product }) => {
  return (
    <a href="#">
      <Card className="ezy__epcategory2-card p-5 pb-3">
        <div className="ezy__epcategory2-card-img d-flex justify-content-center align-items-center">
          <img src={product.img} alt="..." />
        </div>
        <Card.Body>
          <h2 className="ezy__epcategory2-title mt-2">{product.title}</h2>
        </Card.Body>
      </Card>
    </a>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

const Epcategory2 = () => {
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,

    // customPaging: function (i) {
    //   return <p>{i + 1}</p>;
    // },

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
            <h2 className="ezy__epcategory2-heading">Services</h2>
          </Col>
          {/* button start  */}
          <Col xs={4} className="text-end">
            <Link className="ezy__epcategory2-btn" to="/services" role="button">
              See All
            </Link>
          </Col>
          {/* button end  */}
        </Row>

        <Row className="text-center justify-content-start justify-content-xl-center mt-4 mt-md-5">
          <Slider {...settings}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="p-3">
                <div className="card mx-auto" style={{ width: "18rem" }}>
                  <img src={banner} className="card-img-top" alt="Promo" />
                  <div className="card-body text-center">
                    <h5 className="card-title">Promo {index + 1}</h5>
                    <p className="card-text">Exclusive deal for you!</p>
                    <Link
                      className="btn btn-primary"
                      to="/booking"
                      role="button"
                    >
                      Book Now!
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </Row>
      </Container>
    </section>
  );
};

export default Epcategory2;
