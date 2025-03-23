import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PromosSection from "../../components/Customers/PromoSection";
import EPCat from "../../components/Customers/EPCategory2";
import Con1 from "../../components/Customers/ComingSoon1";
import Con2 from "../../components/Customers/ComingSoon3";
import Con3 from "../../components/Customers/ComingSoon5";
import "../../styles/customer/Home.css";


function Home() {
  const images = [
    "/assets/spa_massage.jpg",
    "/assets/spa_helpdesk.jpg",
    "/assets/spa_services.jpg"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
<div className="banner-wrapper position-relative overflow-hidden">
  <div className="banner-images">
    {images.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Slide ${index}`}
        className={`banner-img ${index === current ? "active" : ""}`}
      />
    ))}
  </div>


  <div className="banner-button position-absolute top-50 start-50 translate-middle text-center">
  <img
      src="/assets/asr_logoround.png"
      alt="Aesthetics Skin Renewed Logo"
      className="banner-logo mb-3"
    />
    <Link
      to="/booking"
      role="button"
      style={{
        background: 'linear-gradient(to right, #a2bf5a, #6CB33F)',
        color: '#ffffff',
        padding: '12px 24px',
        fontSize: '1.2rem',
        border: 'none',
        borderRadius: '6px',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        zIndex: 2, // Ensure button stays on top
        position: 'relative',
        marginleft: '12px', 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = 'brightness(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      Book Now <span style={{ fontSize: '1.4rem' }}>→</span>
    </Link>
  </div>
</div>
      <EPCat />
      <Con3 />
      <PromosSection />
      {/* Promos Section
      <div className="container my-5">
        <h1>Promos/Packages</h1>
        <div className="row d-flex justify-content-center">
          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>

          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>

          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>

          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>
        </div>
      </div> */}
      <Con1 />
      <Con2 />
    </>
  );
}

export default Home;
