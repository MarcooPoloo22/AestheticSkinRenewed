import React, { useState, useEffect } from "react";
import Card from "../../components/Customers/ServiceCard";
import "../../styles/customer/Services.css";

function ServicePage() {
  const [services, setServices] = useState([]);

  // Fetch services from backend
  useEffect(() => {
    fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched services:", data); // Debugging
        setServices(data);
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  return (
    <>
  <div
      className="service-header"
      style={{ backgroundImage: "url('./assets/spa_services.jpg')" }}
    >
      <div className="overlay">
        <h1 className="service-title">Our Services</h1>
      </div>
  </div>
      <div className="container my-5">
        <div className="row mt-3">
          {services.map((service) => (
            <div className="col-md-12 col-lg-6" key={service.id}>
              <Card
                title={service.name}
                description={service.description}
                image={service.file_url} // Use the file_url from the backend
                updated={`Price: ₱${service.price}`} // Display the price with the Peso sign
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ServicePage;