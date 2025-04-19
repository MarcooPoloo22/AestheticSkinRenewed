import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Customers/ServiceCard";
import "../../styles/customer/Services.css";

function ServicePage() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched services:", data);
        setServices(data);
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/details/service/${id}`);
  };

  return (
    <>
      <div className="service-header" style={{ backgroundImage: "url('/assets/spa_services.jpg')" }}>
        {window.innerWidth > 768 && (
         <div className="overlay">
         <h1 className="service-title">Our Services</h1>
        </div>
       )}
    </div>
      <div className="container my-5">
      <div className="row g-4 mt-3">
      {services.map((service, index) => (
  <div className="col-12 col-md-6 fade-in" key={service.id} style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
      <Card
        title={service.name}
        description={service.description}
        image={service.file_url}
        updated={`Price: ₱${service.price}`}
        link={`/details/service/${service.id}`}
        id={service.id}
      />
    </div>
  ))}
</div>

      </div>
    </>
  );
}

export default ServicePage;