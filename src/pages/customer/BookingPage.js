import React from "react";
import "../../styles/customer/BookingPage.css"; 
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPageGuest = () => {
    return (
        <>
            <div className="booking-container">
                <img src="./assets/bookinghead.jpg" alt="Booking Background" className="booking-bg" />
                <h1 className="booking-title">Booking Appointment</h1>
            </div>

            <br />
            <div className="white-box">
                <div className="container">
                    
                    {/* Branch & Service Selection */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                        <p class="branch-label">Branch</p>
                            <select className="form-select form-select-lg mb-3 staff-dropdown" required>
                                <option selected>Select your Branch</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                        <p class="service-label">Service</p>
                            <select className="form-select form-select-lg mb-3 staff-dropdown" >
                                <option selected>Select Service</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>

                    {/* Booking Date & Time */}
                    <div className="row align-items-center mb-3">
                        <div className="col-md-5">
                    <br />
                    <br />
                        <p class="bookdate-label">Booking Date</p>
                            <input type="text" className="form-control" placeholder="yyyy-mm-dd" required />
                        </div>
                        <div className="col-md-5">
                    <br />
                    <br />
                        <p class="booktime-label">Booking Time</p>
                            <input type="text" className="form-control" placeholder="Select your Time" required />
                        </div>
                    </div>
                </div>
                <div className="row">
                <div className="row">
                
                {/* Set column width */}
                <div className="col-md-4"> 
                <br />
                <br />
                   <p className="staffselect-label">Staff Select</p>
                 <select className="form-select form-select-lg mb-3 staff-dropdown">
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
                <div class="d-grid gap-2 col-6 mx-auto">
                     <button class="btn btn-primary" type="button"> Book Appointment </button>
                 </div>
            </div>
       
        </>
    );
};

export default BookingPageGuest;
