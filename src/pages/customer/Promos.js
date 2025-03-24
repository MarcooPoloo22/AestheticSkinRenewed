import React, { useState, useEffect } from "react";
import Card from "../../components/Customers/ServiceCard";
import "../../styles/customer/Promos.css";

const PromoCard = ({ title, description, time, image, updated }) => {
  return (
    <div className="card mb-3">
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">{time}</p>
        <p className="card-text">
          <small className="text-muted">Last Updated Price: {updated}</small>
        </p>
      </div>
    </div>
  );
};

function PromosPage() {
  const [promoList, setPromoList] = useState([]);

  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        title: "PROMO: Rhinoplasty (Nose Surgery)",
        description: "A cosmetic surgery to reshape the nose for aesthetic or functional reasons.",
        start_date: "April 5, 2025",
        end_date: "April 6, 2025",
        image_url: "https://via.placeholder.com/500x300?text=Rhinoplasty",
        price: "45,000",
      },
      {
        id: 2,
        title: "PROMO: Liposuction",
        description: "Removes stubborn fat deposits to reshape specific areas of the body.",
        start_date: "April 10, 2025",
        end_date: "April 11, 2025",
        image_url: "https://via.placeholder.com/500x300?text=Liposuction",
        price: "60,000",
      },
      {
        id: 3,
        title: "PROMO: Blepharoplasty (Eyelid Surgery)",
        description: "Improves the appearance of the eyelids by removing excess skin and fat.",
        start_date: "April 12, 2025",
        end_date: "April 13, 2025",
        image_url: "https://via.placeholder.com/500x300?text=Eyelid+Surgery",
        price: "35,000",
      },
    ];

    setPromoList(sampleData);
  }, []);

  return (
    <>
      <div className="promos-header" style={{ backgroundImage: "url('./assets/asr_promo.jpg')" }}>
        <div className="overlay">
          <h1 className="promos-title">Our Promo Packages</h1>
        </div>
      </div>

      <div className="container my-4">
        <div className="row mt-3">
          {promoList.map((promo) => (
            <div className="col-md-12 col-lg-6" key={promo.id}>
              <Card
                title={promo.title}
                description={promo.description}
                time={`${promo.start_date} - ${promo.end_date}`}
                image={promo.image_url}
                updated={`₱${promo.price}`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PromosPage;
