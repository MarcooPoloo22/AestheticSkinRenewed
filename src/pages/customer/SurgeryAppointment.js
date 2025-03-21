import React, { useState, useEffect } from "react";
import Card from "../../components/Customers/ServiceCard";
import ServiceHead from "../../components/Customers/SurgeryHead";
import "../../styles/customer/SurgeryAppointment.css";

const SurgeryCard = ({ title, description, time, image, updated }) => {
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

function AppointmentPage() {
  const [surgeryAppointments, setSurgeryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/home_fetch_surgeries.php");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSurgeryAppointments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-6"></div>
      </div>
      <ServiceHead />
      <div className="row mt-3">
        {surgeryAppointments.map((appointment) => (
          <div className="col-md-12 col-lg-6" key={appointment.id}>
            <Card
              title={appointment.title}
              description={appointment.description}
              time={`${appointment.start_date} - ${appointment.end_date}`}
              image={appointment.image_url}
              updated={`₱${appointment.price}`} // Add peso sign to the price
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentPage;