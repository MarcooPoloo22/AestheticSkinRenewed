import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaCartShopping } from "react-icons/fa6";
import { FaUsers, FaCalendar } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";

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
      title: "Hydra Facial",
      name: "James, Lebron",
      start: new Date(2025, 1, 24, 10, 0), // February 24, 2025, 10:00 AM
      end: new Date(2025, 1, 24, 12, 0), // February 24, 2025, 11:00 AM
    },
    {
      id: 2,
      title: "Chemical Peel",
      name: "Durant, Kevin",
      start: new Date(2025, 1, 24, 13, 0), // February 24, 2025, 11:00 AM
      end: new Date(2025, 1, 24, 15, 0), // February 24, 2025, 12:00 PM
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
          <FaCalendar size={28} />
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-text">Weekly Appointments</span>
          <span className="dashboard-card-count">23</span>
        </div>
      </div>

      {/* Registered Users Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-icon" style={{ backgroundColor: "#C03221" }}>
          <FaUsers size={28} />
        </div>
        <div className="dashboard-card-info">
          <span className="dashboard-card-text">Registered Users</span>
          <span className="dashboard-card-count">39</span>
        </div>
      </div>
    </div>

      {/* Calendar and Side Container */}
      <div className="calendar-main-container">
        <div className="calendar-container" style={{ height: "480px", padding: "20px", width: "800px" }}>
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

        <div>
          <div className="dashboad-calendar-sidecontainer">
            <div className="dashboad-header-container-content">
              <div className="info-sidecontainer">
                <div className="dashboad-header-count">6</div>
                <div className="dashboad-header-text">Total Branches</div>
              </div>
              <div className="info-sidecontainer">
                <div className="dashboad-header-count">5</div>
                <div className="dashboad-header-text">Total Appointments</div>
              </div>
            </div>
          </div>

          <div className="dashboad-calendar-side">
            <div><h3>Activity Logs</h3></div>
            <LogsTable /> {/* Add the LogsTable component here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;