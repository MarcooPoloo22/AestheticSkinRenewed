import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/customer/BookingPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPageRegistered = ({ user }) => {
  const [formData, setFormData] = useState({
    type: "",
    service: "",
    branch: "",
    staff: "",
    bookingDate: "",
    bookingTime: "",
  });

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "You need to log in to book an appointment.",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formData.type) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=${formData.type}`)
        .then((response) => response.json())
        .then((data) => setServices(data))
        .catch((error) => console.error("Error fetching services:", error));
    } else {
      setServices([]);
      setFormData((prev) => ({ ...prev, service: "", branch: "", staff: "" }));
    }
  }, [formData.type]);

  useEffect(() => {
    if (formData.service) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_branches.php?serviceId=${encodeURIComponent(formData.service)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setBranches(data);
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load branches. Please try again.',
          });
        });
    } else {
      setBranches([]);
      setFormData((prev) => ({ ...prev, branch: "", staff: "" }));
    }
  }, [formData.service]);

  useEffect(() => {
    if (formData.branch) {
      console.log("Fetching staff for branchId:", formData.branch); // Debug
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_staff.php?branchId=${encodeURIComponent(formData.branch)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          console.log("Fetched staff:", data); // Debug
          setStaffList(data);
        })
        .catch((error) => {
          console.error("Error fetching staff:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load staff. Please try again.',
          });
        });
    } else {
      setStaffList([]);
      setFormData((prev) => ({ ...prev, staff: "" }));
    }
  }, [formData.branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "You need to log in to book an appointment.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost/booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          contact_no: user.contact_no,
          service_id: formData.service,
          branch_id: formData.branch,
          staff_id: formData.staff,
          appointment_date: formData.bookingDate,
          appointment_time: formData.bookingTime,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message,
        }).then(() => {
          navigate("/profile");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while booking the appointment.",
      });
    }
  };

  return (
    <>
      <div className="booking-container">
        <img
          src="./assets/bookinghead.jpg"
          alt="Booking Background"
          className="booking-bg"
        />
        <h1 className="booking-title">Booking Appointment</h1>
      </div>

      <br />
      <div className="white-box my-5">
        <div className="container">
          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Choose Type</p>
              <select
                className="form-select form-select-lg mb-3"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Promo">Promo</option>
                <option value="Service">Service</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Select which to book</p>
              <select
                className="form-select form-select-lg mb-3"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                disabled={!formData.type}
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Branch</p>
              <select
                className="form-select form-select-lg mb-3"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                disabled={!formData.service}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Staff</p>
              <select
                className="form-select form-select-lg mb-3"
                name="staff"
                value={formData.staff}
                onChange={handleChange}
                required
                disabled={!formData.branch}
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="bookdate-label">Booking Date</p>
              <input
                type="date"
                className="form-control"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <br />
              <p className="booktime-label">Booking Time</p>
              <select
                className="form-select form-select-lg"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const BookingPageGuest = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    type: "",
    service: "",
    branch: "",
    staff: "",
    bookingDate: "",
    bookingTime: "",
  });

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.type) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=${formData.type}`)
        .then((response) => response.json())
        .then((data) => setServices(data))
        .catch((error) => console.error("Error fetching services:", error));
    } else {
      setServices([]);
      setFormData((prev) => ({ ...prev, service: "", branch: "", staff: "" }));
    }
  }, [formData.type]);

  useEffect(() => {
    if (formData.service) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_branches.php?serviceId=${encodeURIComponent(formData.service)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setBranches(data);
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load branches. Please try again.',
          });
        });
    } else {
      setBranches([]);
      setFormData((prev) => ({ ...prev, branch: "", staff: "" }));
    }
  }, [formData.service]);

  useEffect(() => {
    if (formData.branch) {
      console.log("Fetching staff for branchId:", formData.branch); // Debug
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_staff.php?branchId=${encodeURIComponent(formData.branch)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          console.log("Fetched staff:", data); // Debug
          setStaffList(data);
        })
        .catch((error) => {
          console.error("Error fetching staff:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load staff. Please try again.',
          });
        });
    } else {
      setStaffList([]);
      setFormData((prev) => ({ ...prev, staff: "" }));
    }
  }, [formData.branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: null,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          contact_no: formData.contactNo,
          service_id: formData.service,
          branch_id: formData.branch,
          staff_id: formData.staff,
          appointment_date: formData.bookingDate,
          appointment_time: formData.bookingTime,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message,
        }).then(() => {
          Swal.fire({
            icon: "info",
            title: "Important Notice",
            text: "Any schedule changes or cancellations will require you to call our support number: 123-456-7890.",
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while booking the appointment.",
      });
    }
  };

  return (
    <>
      <div className="booking-container">
        <img
          src="./assets/bookinghead.jpg"
          alt="Booking Background"
          className="booking-bg"
        />
        <h1 className="booking-title">Booking Appointment</h1>
      </div>

      <br />
      <div className="white-box my-5">
        <div className="container">
          <div className="row g-3">
            <div className="col">
              <p className="fname-label">First Name</p>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <p className="lname-label">Last Name</p>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <br />
            <p className="email-label">Email address</p>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <br />
            <p className="connumb-label">Contact No.</p>
            <input
              type="text"
              className="form-control"
              placeholder="0912314567"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Choose Type</p>
              <select
                className="form-select form-select-lg mb-3"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Promo">Promo</option>
                <option value="Service">Service</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Select which to book</p>
              <select
                className="form-select form-select-lg mb-3"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                disabled={!formData.type}
              >
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Branch</p>
              <select
                className="form-select form-select-lg mb-3"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                disabled={!formData.service}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <p className="service-label">Staff</p>
              <select
                className="form-select form-select-lg mb-3"
                name="staff"
                value={formData.staff}
                onChange={handleChange}
                required
                disabled={!formData.branch}
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="bookdate-label">Booking Date</p>
              <input
                type="date"
                className="form-control"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <br />
              <p className="booktime-label">Booking Time</p>
              <select
                className="form-select form-select-lg"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { BookingPageRegistered, BookingPageGuest };