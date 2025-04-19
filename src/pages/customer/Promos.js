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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch('http://localhost/admin_dashboard_backend/nav_fetch_promos.php');
        if (!response.ok) {
          throw new Error('Failed to fetch promos');
        }
        const data = await response.json();
        
        const formattedData = data.map(promo => ({
          id: promo.id,
          title: promo.name,
          description: promo.description,
          start_date: new Date(promo.start_date).toLocaleDateString(),
          end_date: new Date(promo.end_date).toLocaleDateString(),
          image_url: promo.file_url,
          price: promo.price.toLocaleString('en-PH', { 
            style: 'currency', 
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }));

        setPromoList(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading promos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <>
      <div className="promos-header" style={{ backgroundImage: "url('./assets/asr_promo.jpg')" }}>
        <div className="overlay">
          <h1 className="promos-title">Our Promo Packages</h1>
        </div>
      </div>

      <div className="container my-4">
        <div className="row mt-3">
        {promoList.map((promo, index) => (
        <div
             className="col-md-12 col-lg-6 fade-in"
             key={promo.id}
             style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
         >
              <Card
                title={promo.title}
                description={promo.description}
                time={`${promo.start_date} - ${promo.end_date}`}
                image={promo.image_url}
                updated={promo.price}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PromosPage;