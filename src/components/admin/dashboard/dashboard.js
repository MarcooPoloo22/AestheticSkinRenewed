import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/admin/dashboard/faqs.css";
import Swal from 'sweetalert2';

// Icons
import { FaCartShopping } from "react-icons/fa6";
import { FaUsers, FaCalendar } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { FaBriefcaseMedical } from "react-icons/fa";

// Initialize the localizer with moment
const localizer = momentLocalizer(moment);

const DashboardCalendar = () => {
  // State for dashboard metrics
  const [totalServices, setTotalServices] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  // State for calendar controls
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("week");

  // State for filters and data
  const [branches, setBranches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch branches
        const branchesRes = await fetch("http://localhost/admin_dashboard_backend/dashboard_fetch_branches.php");
        const branchesData = await branchesRes.json();
        setBranches(branchesData);

        // Fetch services count
        const servicesRes = await fetch("http://localhost/admin_dashboard_backend/fetch_total_services.php");
        if (!servicesRes.ok) throw new Error('Services fetch failed');
        const servicesData = await servicesRes.json();
        setTotalServices(servicesData.total_services || 0);

        // Fetch products count
        const productsRes = await fetch("http://localhost/admin_dashboard_backend/fetch_total_products.php");
        if (!productsRes.ok) throw new Error('Products fetch failed');
        const productsData = await productsRes.json();
        setTotalProducts(productsData.total_products || 0);

        const customersRes = await fetch("http://localhost/admin_dashboard_backend/dashboard_fetch_total_customers.php");
        if (!customersRes.ok) throw new Error('Customers fetch failed');
        const customersData = await customersRes.json();
        setTotalCustomers(customersData.total_customers || 0);

        // Fetch initial appointments
        const appointmentsRes = await fetch("http://localhost/admin_dashboard_backend/dashboard_fetch_appointments.php");
        const appointmentsData = await appointmentsRes.json();
        setEvents(formatAppointments(appointmentsData));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch initial data. Please try again later.',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch staff when branch changes
  useEffect(() => {
    if (selectedBranch) {
      setIsLoading(true);
      fetch(`http://localhost/admin_dashboard_backend/dashboard_fetch_staff.php?branch_id=${selectedBranch}`)
        .then(res => res.json())
        .then(data => {
          setStaff(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching staff:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch staff data. Please try again later.',
            confirmButtonColor: '#3085d6',
          });
          setIsLoading(false);
        });
    } else {
      setStaff([]);
      setSelectedStaff("");
    }
  }, [selectedBranch]);

  // Fetch appointments when filters change
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        let url = "http://localhost/admin_dashboard_backend/dashboard_fetch_appointments.php?";
        if (selectedBranch) url += `branch_id=${selectedBranch}&`;
        if (selectedStaff) url += `staff_id=${selectedStaff}`;

        const res = await fetch(url);
        const data = await res.json();
        setEvents(formatAppointments(data));
      } catch (error) {
        console.error("Error fetching appointments:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch appointments. Please try again later.',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedBranch, selectedStaff]);

  // Helper function to format appointments for calendar
  const formatAppointments = (appointments) => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: appointment.service_type,
      name: `${appointment.first_name} ${appointment.last_name}`,
      start: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`),
      end: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 3600000), // +1 hour
      staff: appointment.staff_name,
      branch: appointment.branch_name,
      status: appointment.status
    }));
  };

  // Custom event component
  const EventComponent = ({ event }) => (
    <div className="custom-event">
      <strong>{event.title}</strong>
      <div className="event-client">{event.name}</div>
      {event.staff && <div className="event-staff">Staff: {event.staff}</div>}
      {event.status && <div className={`event-status ${event.status}`}>{event.status}</div>}
    </div>
  );

  // Custom Toolbar Component
  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate("TODAY");
      setDate(new Date());
    };

    const changeView = (newView) => {
      toolbar.onView(newView);
      setView(newView);
    };

    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button onClick={goToToday} className="rbc-toolbar-button">
            Today
          </button>
        </div>

        <div className="rbc-btn-group">
          <button
            className="rbc-toolbar-button"
            onClick={() => toolbar.onNavigate("PREV")}
          >
            Back
          </button>
          <button
            className="rbc-toolbar-button"
            onClick={() => toolbar.onNavigate("NEXT")}
          >
            Next
          </button>
        </div>

        <div className="rbc-toolbar-label">{toolbar.label}</div>

        <div className="rbc-btn-group view-buttons">
          <button
            className={`rbc-toolbar-button ${view === "month" ? "active" : ""}`}
            onClick={() => changeView("month")}
          >
            Month
          </button>
          <button
            className={`rbc-toolbar-button ${view === "week" ? "active" : ""}`}
            onClick={() => changeView("week")}
          >
            Week
          </button>
          <button
            className={`rbc-toolbar-button ${view === "day" ? "active" : ""}`}
            onClick={() => changeView("day")}
          >
            Day
          </button>
        </div>
      </div>
    );
  };

  // Handle event click with SweetAlert
  const handleEventClick = (event) => {
    Swal.fire({
      title: 'Appointment Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Service:</strong> ${event.title}</p>
          <p><strong>Client:</strong> ${event.name}</p>
          <p><strong>Date:</strong> ${moment(event.start).format("MMMM Do YYYY")}</p>
          <p><strong>Time:</strong> ${moment(event.start).format("h:mm a")} - ${moment(event.end).format("h:mm a")}</p>
          <p><strong>Staff:</strong> ${event.staff || "Not assigned"}</p>
          <p><strong>Branch:</strong> ${event.branch || "Not specified"}</p>
          <p><strong>Status:</strong> ${event.status || "Unknown"}</p>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#3085d6',
      showCloseButton: true,
      width: '600px'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header Cards */}
      <div className="dashboard-header">
        {[
          { icon: <IoBriefcase size={28} />, bg: "#068B92", text: "Total Services", count: totalServices },
          { icon: <FaCartShopping size={28} />, bg: "#F16A1B", text: "Total Products", count: totalProducts },
          { icon: <FaBriefcaseMedical size={28} />, bg: "#17904B", text: "Weekly Appointments", count: events.filter(e => moment(e.start).isSame(new Date(), "week")).length },
          { icon: <FaUsers size={28} />, bg: "#C03221", text: "Registered Users", count: totalCustomers }
        ].map((card, i) => (
          <div className="dashboard-card" key={i}>
            <div className="dashboard-card-icon" style={{ backgroundColor: card.bg }}>
              {card.icon}
            </div>
            <div className="dashboard-card-info">
              <span className="dashboard-card-text">{card.text}</span>
              <span className="dashboard-card-count">{card.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Calendar Area */}
      <div className="calendar-main-container">
        <div className="calendar-container">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={date}
              view={view}
              onNavigate={setDate}
              onView={setView}
              defaultView="week"
              views={["month", "week", "day"]}
              components={{
                event: EventComponent,
                toolbar: CustomToolbar
              }}
              onSelectEvent={handleEventClick}
              style={{ height: "100%", padding: "1rem" }}
            />
          )}
        </div>

        {/* Side Container with Filters */}
        <div className="dashboard-calendar-sidecontainer">
          <div className="filters-section">
            <h3>Filter Appointments</h3>
            
            <div className="filter-group">
              <label htmlFor="branch-filter">Branch:</label>
              <select
                id="branch-filter"
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setSelectedStaff("");
                }}
                disabled={isLoading}
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="staff-filter">Staff:</label>
              <select
                id="staff-filter"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                disabled={!selectedBranch || isLoading}
              >
                <option value="">All Staff</option>
                {staff.map(staffMember => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-results">
              <h4>Current Filters:</h4>
              <p>
                <strong>Branch:</strong> {selectedBranch ? branches.find(b => b.id == selectedBranch)?.name : "All"}
              </p>
              <p>
                <strong>Staff:</strong> {selectedStaff ? staff.find(s => s.id == selectedStaff)?.name : "All"}
              </p>
              <p>
                <strong>Appointments:</strong> {events.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;