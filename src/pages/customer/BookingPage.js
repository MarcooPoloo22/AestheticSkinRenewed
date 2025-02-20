import React from "react";
import "../../styles/customer/BookingPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPageRegistered = () => {
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
        <div class="row g-3">

  <div class="row g-3">
  <div class="col">
    <p class = "fname-label">First Name</p>
    <input type="text" class="form-control" placeholder="First name" aria-label="First name" />
  </div>
  <div class="col">
    <p class = "lname-label">Last Name</p>
    <input type="text" class="form-control" placeholder="Last name" aria-label="Last name" />
  </div>
  </div>
  <div class="mb-3">
    <br />
  <p class="email-label">Email address</p>
  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
</div>
<div class="mb-3">
  <br />
  <p class="connumb-label">Contact No.</p>
  <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="0912314567" />
</div>

          {/* Branch, Service, Date, Time, and Staff Selection */}
          <div className="row mb-3">
            <div className="col-md-6">
              <br />
              <p className="branch-label">Branch</p>
              <select className="form-select form-select-lg mb-3" required>
                <option selected>Select your Branch</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="col-md-6">
              <br />
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
              <br />
              <p className="bookdate-label">Booking Date</p>
              <input type="date" className="form-control" required />
            </div>
            <div className="col-md-6">
              <br />
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
          </div>
          <div className="row mb-3 justify-content-center">
            <div className="col-md-6 text-center">
              <br />
              <p class="staffselect-label">Staff Select</p>
              <select className="form-select form-select-lg mb-3">
                <option selected>Select Staff</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
          <button className="btn btn-primary" type="button">
            Book Appointment
          </button>
        </div>
      </div>    
    </div>
  </>
  );
};

export default BookingPageGuest;
