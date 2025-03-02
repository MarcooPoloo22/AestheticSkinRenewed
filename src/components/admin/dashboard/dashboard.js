import React from "react";
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
        <div className="dashboad-header-container ">
          <div className="dashboad-header-container-content">
            <div className="dashboad-header-container-image">
              <div style={{ backgroundColor: "#068B92" }} className="dashboad-header-container-services">
                <IoBriefcase style={{ fontSize: "28px" }} />
              </div>
            </div>
            <div className="dashboad-header-container-text">
              <div className="dashboad-header-text">Total Services</div>
              <div className="dashboad-header-count">8</div>
            </div>
          </div>
        </div>

        <div className="dashboad-header-container ">
          <div className="dashboad-header-container-content">
            <div className="dashboad-header-container-image">
              <div style={{ backgroundColor: "#F16A1B" }} className="dashboad-header-container-services">
                <FaCartShopping style={{ fontSize: "28px" }} />
              </div>
            </div>
            <div className="dashboad-header-container-text">
              <div className="dashboad-header-text">Total Products</div>
              <div className="dashboad-header-count">6</div>
            </div>
          </div>
        </div>

        <div className="dashboad-header-container ">
          <div className="dashboad-header-container-content">
            <div className="dashboad-header-container-image">
              <div style={{ backgroundColor: "#17904B" }} className="dashboad-header-container-services">
                <FaCalendar style={{ fontSize: "28px" }} />
              </div>
            </div>
            <div className="dashboad-header-container-text">
              <div className="dashboad-header-text">Weekly Appointments</div>
              <div className="dashboad-header-count">23</div>
            </div>
          </div>
        </div>

        <div className="dashboad-header-container ">
          <div className="dashboad-header-container-content">
            <div className="dashboad-header-container-image">
              <div style={{ backgroundColor: "#C03221" }} className="dashboad-header-container-services">
                <FaUsers style={{ fontSize: "28px" }} />
              </div>
            </div>
            <div className="dashboad-header-container-text">
              <div className="dashboad-header-text">Registered Users</div>
              <div className="dashboad-header-count">39</div>
            </div>
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