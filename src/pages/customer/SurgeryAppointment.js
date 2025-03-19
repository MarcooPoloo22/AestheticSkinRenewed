import React from "react";
import Card from "../../components/Customers/ServiceCard";
import ServiceHead from "../../components/Customers/SurgeryHead";
import "../../styles/customer/SurgeryAppointment.css";

const surgeryAppointments = [
  {
    id: 1,
    title: "Surgery Details",
    description: "Doctor's Name: Dr. Juan Dela Cruz",
    time: "Time: 9:00 AM-12:00 PM",
    image: "/assets/doctor_surgery.jpg", 
    updated: "3 mins ago",
  },
  {
    id: 2,
    title: "Surgery Details",
    description: "Doctor's Name: Dr. Juan Dela Cruz",
    time: "Time: 9:00 AM-12:00 PM",
    image: "/assets/doctor_surgery.jpg",
    updated: "10 mins ago",
  },
  {
    id: 3,
    title: "Surgery Details",
    description: "Doctor's Name: Dr. Juan Dela Cruz",
    time: "Time: 9:00 AM-12:00 PM",
    image: "/assets/doctor_surgery.jpg",
    updated: "15 mins ago",
  },
  {
    id: 4,
    title: "Surgery Details",
    description: "Doctor's Name: Dr. Juan Dela Cruz",
    time: "Time: 9:00 AM-12:00 PM",
    image: "/assets/doctor_surgery.jpg",
    updated: "1 hour ago",
  },
  {
    id: 5,
    title: "Surgery Details",
    description: "Doctor's Name: Dr. Juan Dela Cruz",
    time: "Time: 9:00 AM-12:00 PM",
    image: "/assets/doctor_surgery.jpg",
    updated: "2 hours ago",
  },
  {
    id: 6,
    title: "Surgery Details",
    description: "Doctor's Name: Dr. Juan Dela Cruz",
    time: "Time: 9:00 AM-12:00 PM",
    image: "/assets/doctor_surgery.jpg",
    updated: "5 hours ago",
  },
];


const SurgeryCard = ({ title, description, time, image, updated }) => {
  return (
    <div className="card mb-3">
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">{time}</p>
        <p className="card-text">
          <small className="text-muted">Last updated {updated}</small>
        </p>
      </div>
    </div>
  );
};

function AppointmentPage() {
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-6">
        </div>
      </div>
      <ServiceHead />
      <div className="row mt-3">
        {surgeryAppointments.map((appointment) => (
          <div className="col-md-12 col-lg-6" key={appointment.id}>
            <Card
              title={appointment.title}
              description={appointment.description}
              time={appointment.time}
              image={appointment.image}
              updated={appointment.updated}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentPage;
