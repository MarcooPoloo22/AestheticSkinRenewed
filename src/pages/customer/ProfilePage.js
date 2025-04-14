import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/customer/ProfilePage.css";
import Swal from "sweetalert2";

const capitalizeLabel = (str) => {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProfilePage = ({ user, setUser, isLoggedIn }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetch("http://localhost/getProfile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUserData(data.user);
          setNewData(data.user);
          setUser(data.user);
        } else {
          setError("Failed to load profile data.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("An error occurred.");
        setLoading(false);
      });
  }, [setUser]);

  useEffect(() => {
    if (activeTab === "bookingHistory") {
      setLoadingBookings(true);
      fetch("http://localhost/getBookingHistory.php", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setBookingHistory(data.bookings);
          } else {
            setBookingError(data.message || "Failed to load booking history.");
          }
          setLoadingBookings(false);
        })
        .catch((err) => {
          console.error("Error fetching booking history:", err);
          setBookingError("An error occurred.");
          setLoadingBookings(false);
        });
    }
  }, [activeTab]);

  const handleRating = async (bookingId) => {
    const { value: rating } = await Swal.fire({
      title: 'Rate your experience',
      input: 'radio',
      inputOptions: {
        '1': '1 - Highly unsatisfactory',
        '2': '2 - Unsatisfactory',
        '3': '3 - Neutral',
        '4': '4 - Satisfactory',
        '5': '5 - Highly satisfactory'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose a rating!';
        }
      },
      showCancelButton: true
    });

    if (rating) {
      try {
        const response = await fetch("http://localhost/booking.php", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: bookingId,
            rating: parseInt(rating)
          })
        });

        const result = await response.json();

        if (result.status === "success") {
          setBookingHistory(prev => prev.map(booking => 
            booking.id === bookingId ? { ...booking, rating: parseInt(rating) } : booking
          ));

          Swal.fire({
            icon: 'success',
            title: 'Thank you!',
            text: 'Your rating has been submitted successfully.'
          });
        } else {
          throw new Error(result.message || "Failed to submit rating");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit rating. Please try again.'
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost/updateProfile.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const data = await response.json();

      if (data.status === "success") {
        setUserData(newData);
        setEditing(false);
        setUser((prev) => ({
          ...prev,
          ...newData,
        }));
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile was updated successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating profile.",
      });
    }
  };

  const handleCancel = () => {
    setNewData({ ...userData });
    setEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }
    setPasswordError("");

    try {
      const response = await fetch("http://localhost/updatePassword.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const result = await response.json();

      if (result.status === "success") {
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been successfully changed.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password Update Failed",
          text: result.message || "Failed to update password.",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating password.",
      });
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data available.</div>;

  const fieldsToDisplay = ["first_name", "middle_initial", "last_name", "email", "contact_no"];

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <h3>
          Welcome, {userData.first_name} {userData.last_name}!
        </h3>
        <button
          className={activeTab === "account" ? "active" : ""}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button
          className={activeTab === "changePassword" ? "active" : ""}
          onClick={() => setActiveTab("changePassword")}
        >
          Change Password
        </button>
        <button
          className={activeTab === "bookingHistory" ? "active" : ""}
          onClick={() => setActiveTab("bookingHistory")}
        >
          Booking History
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "account" && (
          <div className="account-details">
            <h2><strong>Account Information</strong></h2>
            {editing ? (
              <>
                <div className="account-info-grid">
                  {fieldsToDisplay.map((key) => (
                    <div key={key}>
                      <label>{capitalizeLabel(key)}:</label>
                      <input
                        type="text"
                        name={key}
                        value={newData[key] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
                <div className="button-group">
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
              </>
            ) : (
              <>
                <div className="account-info-grid">
                  {fieldsToDisplay.map((key) => (
                    <p key={key}>
                      <strong>{capitalizeLabel(key)}:</strong>{" "}
                      {userData[key] === null ? "" : userData[key]}
                    </p>
                  ))}
                </div>
                <button className="edit-button" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === "changePassword" && (
          <div className="password-change">
            <h2><strong>Change Password</strong></h2>
            <div>
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
              />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm Password"
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button className="update-password" onClick={updatePassword}>
              Update Password
            </button>
          </div>
        )}

        {activeTab === "bookingHistory" && (
          <div className="booking-history">
            <h2><strong>Booking History</strong></h2>
            {loadingBookings ? (
              <p>Loading booking history...</p>
            ) : bookingError ? (
              <p style={{ color: "red" }}>{bookingError}</p>
            ) : bookingHistory.length > 0 ? (
              <div className="booking-list-container">
                <div className="booking-list-header">
                  <div>Type</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Status</div>
                  <div>Action</div>
                </div>
                <div className="booking-list">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div>{booking.service_type}</div>
                      <div>{booking.appointment_date}</div>
                      <div>{booking.appointment_time}</div>
                      <div>{booking.status}</div>
                      <div>
                        {booking.status === "completed" && !booking.rating && (
                          <button
                            className="rate-button"
                            onClick={() => handleRating(booking.id)}
                          >
                            Rate
                          </button>
                        )}
                        {booking.rating && (
                          <span className="rating-display">
                            {booking.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>You have no bookings.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;