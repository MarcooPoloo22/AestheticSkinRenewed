import React, { useState, useEffect } from "react";
import Card from "../../components/Customers/ServiceCard";
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
          <small className="text-muted">Price: {updated}</small>
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

  return (
    <>
      <div
        className="surgery-header"
        style={{ backgroundImage: "url('./assets/asr_surgeryapp.jpg')" }}
      >
        <div className="overlay">
          <h1 className="surgery-title">Surgery Appointments</h1>
        </div>
      </div>

      <div className="container my-4">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
       
        {!loading && !error && (
          <div className="row mt-3">
           {surgeryAppointments.map((appointment, index) => (
           <div
               className="col-md-12 col-lg-6 fade-in"
               key={appointment.id}
               style={{ animationDelay: `${index * 100}ms` }}
             >
                <Card
                  title={appointment.title}
                  description={appointment.description}
                  time={`${appointment.start_date} - ${appointment.end_date}`}
                  image={appointment.image_url}
                  updated={`Price: ₱${appointment.price}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AppointmentPage;
