import React from "react";
import "../../styles/customer/BookingPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPageGuest = () => {
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
          {/* Branch, Service, Date, Time, and Staff Selection */}
          <div className="row mb-3">
            <div className="col-md-6">
              <p className="branch-label">Branch</p>
              <select className="form-select form-select-lg mb-3" required>
                <option selected>Select your Branch</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="col-md-6">
              <p className="service-label">Service</p>
              <select className="form-select form-select-lg mb-3">
                <option selected>Select Service</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <p className="bookdate-label">Booking Date</p>
              <input type="date" className="form-control" required />
            </div>
            <div className="col-md-6">
              <p className="booktime-label">Booking Time</p>
              <select className="form-select form-select-lg">
                <option selected>Select your Time</option>
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

          <div className="row mb-3 justify-content-center">
            <div className="col-md-6 text-center">
              <p className="staffselect-label">Staff Select</p>
              <select className="form-select form-select-lg mb-3">
                <option selected>Select Staff</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="d-grid gap-2 col-6 mx-auto">
          <button className="btn btn-primary" type="button">
            Book Appointment
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingPageGuest;
