import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaCartShopping } from "react-icons/fa6";
import { FaUsers, FaCalendar } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { FaBriefcaseMedical } from "react-icons/fa";

// Initialize the localizer with moment
const localizer = momentLocalizer(moment);

// LogsTable Component
const LogsTable = () => {
  // Sample logs data
  const logs = [
    {
      action: "Edited a service",
      timestamp: "11 JUL 8:10PM",
    },
    {
      action: "Completed an appointment",
      timestamp: "11 JUL 11:00PM",
    },
    {
      action: "Edited an appointment",
      timestamp: "11 JUL 7:64PM",
    },
    {
      action: "New user added",
      timestamp: "11 JUL 1:21AM",
    },
    {
      action: "Product added",
      timestamp: "11 JUL 4:50AM",
    },
  ];

  return (
    <div className="logs-container">
      <div className="horizontal-table">
        {logs.map((log, index) => (
          <div className="table-row" key={index}>
            <div className="table-cell">{log.action}</div>
            <div className="table-cell">{log.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardCalendar = () => {
  // State to store the total services count
  const [totalServices, setTotalServices] = useState(0);
  // State to store the total products count
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch total services count on component mount
  useEffect(() => {
    fetch("http://localhost/admin_dashboard_backend/fetch_total_services.php")
      .then((response) => response.json())
      .then((data) => setTotalServices(data.total_services))
      .catch((error) => console.error("Error fetching total services:", error));
  }, []);

  // Fetch total products count on component mount
  useEffect(() => {
    fetch("http://localhost/admin_dashboard_backend/fetch_total_products.php")
      .then((response) => response.json())
      .then((data) => setTotalProducts(data.total_products))
      .catch((error) => console.error("Error fetching total products:", error));
  }, []);

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      title: "Deep Cleansing Facial",
      name: "Santos, Juan",
      start: new Date(2025, 2, 23, 10, 0), // March 23, 2025, 10:00 AM
      end: new Date(2025, 2, 23, 11, 0), // March 23, 2025, 11:00 AM
    },
    {
      id: 2,
      title: "Acne Control Facial",
      name: "Cruz, Maria",
      start: new Date(2025, 2, 23, 13, 0), // March 23, 2025, 1:00 PM
      end: new Date(2025, 2, 23, 14, 0), // March 23, 2025, 2:00 PM
    },
    {
      id: 3,
      title: "Intensive Whitening Facial",
      name: "Reyes, Jose",
      start: new Date(2025, 2, 24, 9, 0), // March 24, 2025, 9:00 AM
      end: new Date(2025, 2, 24, 10, 0), // March 24, 2025, 10:00 AM
    },
    {
      id: 4,
      title: "Diamond Peel (Microdermabrasion)",
      name: "Garcia, Ana",
      start: new Date(2025, 2, 24, 11, 0), // March 24, 2025, 11:00 AM
      end: new Date(2025, 2, 24, 12, 0), // March 24, 2025, 12:00 PM
    },
    {
      id: 5,
      title: "Vampire Facial",
      name: "Aquino, Benigno",
      start: new Date(2025, 2, 25, 14, 0), // March 25, 2025, 2:00 PM
      end: new Date(2025, 2, 25, 15, 0), // March 25, 2025, 3:00 PM
    },
    {
      id: 6,
      title: "Skin Peeling (Chemical Peel)",
      name: "Dela Cruz, Pedro",
      start: new Date(2025, 2, 26, 10, 0), // March 26, 2025, 10:00 AM
      end: new Date(2025, 2, 26, 11, 0), // March 26, 2025, 11:00 AM
    },
    {
      id: 7,
      title: "High Dose IV Vitamin C Drip",
      name: "Lopez, Carmen",
      start: new Date(2025, 2, 27, 12, 0), // March 27, 2025, 12:00 PM
      end: new Date(2025, 2, 27, 13, 0), // March 27, 2025, 1:00 PM
    },
    {
      id: 8,
      title: "Deep Cleansing Facial",
      name: "Fernandez, Ramon",
      start: new Date(2025, 2, 28, 9, 0), // March 28, 2025, 9:00 AM
      end: new Date(2025, 2, 28, 10, 0), // March 28, 2025, 10:00 AM
    },
    {
      id: 9,
      title: "Acne Control Facial",
      name: "Gonzales, Lourdes",
      start: new Date(2025, 2, 29, 14, 0), // March 29, 2025, 2:00 PM
      end: new Date(2025, 2, 29, 15, 0), // March 29, 2025, 3:00 PM
    },
  ];

  const EventComponent = ({ event }) => (
    <div>
      <div style={{ paddingTop: "4px" }} />
      <strong>{event.title}</strong>
      <div style={{ paddingTop: "4px" }} />
      <span>{event.name}</span>
    </div>
  );

  return (
    <div>
      <div className="dashboard-header">
      {/* Total Services Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-icon" style={{ backgroundColor: "#068B92" }}>
          <IoBriefcase size={28} />
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-text">Total Services</span>
          <span className="dashboard-card-count">{totalServices}</span>
        </div>
      </div>

      {/* Total Products Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-icon" style={{ backgroundColor: "#F16A1B" }}>
          <FaCartShopping size={28} />
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-text">Total Products</span>
          <span className="dashboard-card-count">{totalProducts}</span>
        </div>
      </div>

      {/* Weekly Appointments Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-icon" style={{ backgroundColor: "#17904B" }}>
          <FaBriefcaseMedical size={28} />
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-text">Total Products</span>
          <span className="dashboard-card-count">4</span>
        </div>
      </div>

      {/* Registered Users Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-icon" style={{ backgroundColor: "#C03221" }}>
          <FaUsers size={28} />
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-text">Registered Users</span>
          <span className="dashboard-card-count">1</span>
        </div>
      </div>
    </div>

      {/* Calendar and Side Container */}
      <div className="calendar-main-container">
        <div className="calendar-container" style={{ height: "480px", padding: "20px", width: "79.4vw", marginTop: "-20px", marginLeft: "35px" }}>
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={["month", "week", "day"]}
            onSelectEvent={(event) => alert(`Selected: ${event.title} - ${event.name}`)}
            selectable
            onSelectSlot={(slotInfo) => alert(`Selected slot: ${slotInfo.start}`)}
            components={{
              event: EventComponent, // Use the custom event component
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default DashboardCalendar;