import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../styles/customer/BookingPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MySwal = withReactContent(Swal);

const BookingPageRegistered = ({ user }) => {
  const [formData, setFormData] = useState({
    service_type: "",
    service: "",
    branch_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
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
    if (formData.service_type) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=${formData.service_type}`)
        .then((response) => response.json())
        .then((data) => setServices(data))
        .catch((error) => console.error("Error fetching services:", error));
    } else {
      setServices([]);
      setFormData((prev) => ({ ...prev, service: "", branch_id: "", staff_id: "" }));
    }
  }, [formData.service_type]);

  useEffect(() => {
    if (formData.service) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_branches.php?serviceId=${encodeURIComponent(formData.service)}&type=${formData.service_type}`)
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
      setFormData((prev) => ({ ...prev, branch_id: "", staff_id: "" }));
    }
  }, [formData.service]);

  useEffect(() => {
    if (formData.branch_id) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_staff.php?branchId=${encodeURIComponent(formData.branch_id)}`, {
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
      setFormData((prev) => ({ ...prev, staff_id: "" }));
    }
  }, [formData.branch_id]);

  useEffect(() => {
    if (formData.appointment_date && formData.staff_id) {
      setIsLoading(true);
      fetch(`http://localhost/booking.php?date=${formData.appointment_date}&staff_id=${formData.staff_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === 'success') {
            setBookedSlots(data.booked_slots || []);
          } else {
            throw new Error(data.message || 'Failed to fetch booked slots.');
          }
        })
        .catch((error) => {
          console.error("Error fetching booked slots:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch booked slots. Please try again.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setBookedSlots([]);
    }
  }, [formData.appointment_date, formData.staff_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showPaymentModal = (paymentData) => {
    MySwal.fire({
      html: (
        <>
          <div className="booking-container">
            <img
              src="./assets/asr_bookinghead.jpg"
              alt="Booking Background"
              className="booking-bg"
            />
            <h1 className="booking-title">Booking Appointment</h1>
          </div>
          <br />
          <div className="white-box my-5">
            <div className="container">
              <p 
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#4169E1",
                  textAlign: "center",
                  textTransform: "uppercase",
                  marginBottom: "20px"
                }}
              >
                Minimum 50% Down Payment Required
              </p>

              <p className="gcash-label">GCash payment Details</p>
              <p className="gcash-details">GCash Number: {paymentData.gcash_number}</p>
              <p className="gcash-details">GCash Name: {paymentData.gcash_name}</p>
              <p className="gcash-details">Amount: {paymentData.gcash_amount}</p>
              
              <p className="paymaya-label">PayMaya payment Details</p>
              <p className="paymaya-details">PayMaya Number: {paymentData.paymaya_number}</p>
              <p className="paymaya-details">PayMaya Name: {paymentData.paymaya_name}</p>
              <p className="paymaya-details">Amount: {paymentData.paymaya_amount}</p>
              
              <p className="bank-label">Bank payment Details</p>
              <p className="bank-details">Bank: {paymentData.bank_name}</p>
              <p className="bank-details">Account Number: {paymentData.bank_account_number}</p>
              <p className="bank-details">Account Name: {paymentData.bank_account_name}</p>
              <p className="bank-details">Amount: {paymentData.bank_amount}</p>
              
              <div className="mb-3">
                <p className="receipt-label">Upload Payment Receipt</p>
                <input className="form-control" type="file" id="formFileMultiple" multiple />
              </div>
              
              <div className="d-grid gap-2 col-6 mx-auto">
                <br />
                <button 
                  className="btn btn-payment" 
                  type="button"
                  onClick={() => {
                    MySwal.close();
                    handleAppointmentSubmission();
                  }}
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </>
      ),
      showConfirmButton: false,
      width: '80%',
      customClass: {
        popup: 'sweet-alert-popup'
      }
    });
  };

  const handleAppointmentSubmission = async () => {
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
          service_type: formData.service_type,
          branch_id: formData.branch_id,
          staff_id: formData.staff_id,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "You need to log in to book an appointment.",
      });
      return;
    }

    if (formData.service_type === "Surgery") {
      setIsLoadingPayment(true);
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/fetch_payment_details.php");
        if (!response.ok) throw new Error("Failed to fetch payment details");
        const result = await response.json();
        
        if (!result.data || !result.data.gcash_number) {
          throw new Error("Invalid payment details format");
        }
        
        setPaymentDetails(result);
        showPaymentModal(result.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        MySwal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoadingPayment(false);
      }
      return;
    }

    handleAppointmentSubmission();
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  return (
    <>
      <div className="booking-container">
        <img
          src="./assets/asr_bookinghead.jpg"
          alt="Booking Background"
          className="booking-bg"
        />
        <div className="booking-title-wrapper">
          <h1 className="booking-title">Booking Appointments</h1>
        </div>
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
                name="service_type"
                value={formData.service_type}
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
                disabled={!formData.service_type}
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
                name="branch_id"
                value={formData.branch_id}
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
                name="staff_id"
                value={formData.staff_id}
                onChange={handleChange}
                required
                disabled={!formData.branch_id}
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
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <br />
              <p className="booktime-label">Booking Time</p>
              <select
                className="form-select form-select-lg"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select Time</option>
                {isLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  timeSlots.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                      disabled={bookedSlots.includes(slot)}
                      style={{
                        backgroundColor: bookedSlots.includes(slot) ? "#f0f0f0" : "inherit",
                        color: bookedSlots.includes(slot) ? "#a0a0a0" : "inherit",
                      }}
                    >
                      {slot}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {bookedSlots.length === timeSlots.length && (
            <div className="alert alert-warning mt-3">
              All time slots are booked for the selected date. Please choose another date.
            </div>
          )}

          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={isLoadingPayment}
            >
              {isLoadingPayment ? "Loading..." : 
               formData.service_type === "Surgery" ? "Continue to Payment" : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const BookingPageGuest = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    service_type: "",
    service: "",
    branch_id: "",
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.service_type) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_services.php?type=${formData.service_type}`)
        .then((response) => response.json())
        .then((data) => setServices(data))
        .catch((error) => console.error("Error fetching services:", error));
    } else {
      setServices([]);
      setFormData((prev) => ({ ...prev, service: "", branch_id: "", staff_id: "" }));
    }
  }, [formData.service_type]);

  useEffect(() => {
    if (formData.service) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_branches.php?serviceId=${encodeURIComponent(formData.service)}&type=${formData.service_type}`)
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
      setFormData((prev) => ({ ...prev, branch_id: "", staff_id: "" }));
    }
  }, [formData.service]);

  useEffect(() => {
    if (formData.branch_id) {
      fetch(`http://localhost/admin_dashboard_backend/bookingpage_staff.php?branchId=${encodeURIComponent(formData.branch_id)}`, {
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
      setFormData((prev) => ({ ...prev, staff_id: "" }));
    }
  }, [formData.branch_id]);

  useEffect(() => {
    if (formData.appointment_date && formData.staff_id) {
      setIsLoading(true);
      fetch(`http://localhost/booking.php?date=${formData.appointment_date}&staff_id=${formData.staff_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === 'success') {
            setBookedSlots(data.booked_slots || []);
          } else {
            throw new Error(data.message || 'Failed to fetch booked slots.');
          }
        })
        .catch((error) => {
          console.error("Error fetching booked slots:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch booked slots. Please try again.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setBookedSlots([]);
    }
  }, [formData.appointment_date, formData.staff_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showPaymentModal = (paymentData) => {
    MySwal.fire({
      html: (
        <>
          <div className="booking-container">
            <img
              src="./assets/bookinghead.jpg"
              alt="Booking Background"
              className="booking-bg"
            />
            <h1 className="booking-title">Upload Payment</h1>
          </div>
          <br />
          <div className="white-box my-5">
            <div className="container">
              <p 
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#4169E1",
                  textAlign: "center",
                  textTransform: "uppercase",
                  marginBottom: "20px"
                }}
              >
                Minimum 50% Down Payment Required
              </p>

              <p className="gcash-label">GCash payment Details</p>
              <p className="gcash-details">GCash Number: {paymentData.gcash_number}</p>
              <p className="gcash-details">GCash Name: {paymentData.gcash_name}</p>
              <p className="gcash-details">Amount: {paymentData.gcash_amount}</p>
              
              <p className="paymaya-label">PayMaya payment Details</p>
              <p className="paymaya-details">PayMaya Number: {paymentData.paymaya_number}</p>
              <p className="paymaya-details">PayMaya Name: {paymentData.paymaya_name}</p>
              <p className="paymaya-details">Amount: {paymentData.paymaya_amount}</p>
              
              <p className="bank-label">Bank payment Details</p>
              <p className="bank-details">Bank: {paymentData.bank_name}</p>
              <p className="bank-details">Account Number: {paymentData.bank_account_number}</p>
              <p className="bank-details">Account Name: {paymentData.bank_account_name}</p>
              <p className="bank-details">Amount: {paymentData.bank_amount}</p>
              
              <div className="mb-3">
                <p className="receipt-label">Upload Payment Receipt</p>
                <input className="form-control" type="file" id="formFileMultiple" multiple />
              </div>
              
              <div className="d-grid gap-2 col-6 mx-auto">
                <br />
                <button 
                  className="btn btn-payment" 
                  type="button"
                  onClick={() => {
                    MySwal.close();
                    handleAppointmentSubmission();
                  }}
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </>
      ),
      showConfirmButton: false,
      width: '80%',
      customClass: {
        popup: 'sweet-alert-popup'
      }
    });
  };

  const handleAppointmentSubmission = async () => {
    try {
      const response = await fetch("http://localhost/booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: null,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          contact_no: formData.contact_no,
          service_type: formData.service_type,
          branch_id: formData.branch_id,
          staff_id: formData.staff_id,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    if (formData.service_type === "Surgery") {
      setIsLoadingPayment(true);
      try {
        const response = await fetch("http://localhost/admin_dashboard_backend/fetch_payment_details.php");
        if (!response.ok) throw new Error("Failed to fetch payment details");
        const result = await response.json();
        
        if (!result.data || !result.data.gcash_number) {
          throw new Error("Invalid payment details format");
        }
        
        setPaymentDetails(result);
        showPaymentModal(result.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        MySwal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoadingPayment(false);
      }
      return;
    }

    handleAppointmentSubmission();
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

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
                name="first_name"
                value={formData.first_name}
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
                name="last_name"
                value={formData.last_name}
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
              name="contact_no"
              value={formData.contact_no}
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
                name="service_type"
                value={formData.service_type}
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
                disabled={!formData.service_type}
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
                name="branch_id"
                value={formData.branch_id}
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
                name="staff_id"
                value={formData.staff_id}
                onChange={handleChange}
                required
                disabled={!formData.branch_id}
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
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <br />
              <p className="booktime-label">Booking Time</p>
              <select
                className="form-select form-select-lg"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select Time</option>
                {isLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  timeSlots.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                      disabled={bookedSlots.includes(slot)}
                      style={{
                        backgroundColor: bookedSlots.includes(slot) ? "#f0f0f0" : "inherit",
                        color: bookedSlots.includes(slot) ? "#a0a0a0" : "inherit",
                      }}
                    >
                      {slot}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {bookedSlots.length === timeSlots.length && (
            <div className="alert alert-warning mt-3">
              All time slots are booked for the selected date. Please choose another date.
            </div>
          )}

          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={isLoadingPayment}
            >
              {isLoadingPayment ? "Loading..." : 
               formData.service_type === "Surgery" ? "Continue to Payment" : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { BookingPageRegistered, BookingPageGuest };