import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/customer/ProfilePage.css";
import Swal from "sweetalert2";

const capitalizeLabel = (str) => {
  return str
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

  // Fetch profile data on mount
  useEffect(() => {
    fetch("http://localhost/getProfile.php", {
      method: "GET",
      credentials: "include", // Include session cookies
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUserData(data.user); // Store user data
          setNewData(data.user);
          setUser(data.user); // Update global user state
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

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Render logic
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data available.</div>;

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        {/* Dynamically display the user's name */}
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

      {/* Rest of the profile content */}
      <div className="profile-content">
        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div className="account-details">
            <h2>
              <strong>Account Information</strong>
            </h2>
            {/* Display and edit user data */}
            {editing ? (
              <>
                <div className="account-info-grid">
                  {Object.keys(newData)
                    .filter((key) => key !== "id" && key !== "password")
                    .map((key) => (
                      <div key={key}>
                        <label>{capitalizeLabel(key)}:</label>
                        <input
                          type="text"
                          name={key}
                          value={newData[key] || ""}
                          onChange={handleInputChange}
                          disabled={key === "role"} // Disable role field
                        />
                      </div>
                    ))}
                </div>
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="account-info-grid">
                  {Object.keys(userData)
                    .filter((key) => key !== "id" && key !== "password")
                    .map((key) => (
                      <p key={key}>
                        <strong>{capitalizeLabel(key)}:</strong>{" "}
                        {userData[key] === null ? "" : userData[key]}
                      </p>
                    ))}
                </div>
                <button
                  className="edit-button"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}

        {/* CHANGE PASSWORD TAB */}
        {activeTab === "changePassword" && (
          <div className="password-change">
            <h2>
              <strong>Change Password</strong>
            </h2>
            {/* Password change form */}
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

        {/* BOOKING HISTORY TAB */}
        {activeTab === "bookingHistory" && (
          <div className="booking-history">
            <h2>
              <strong>Booking History</strong>
            </h2>
            {/* Display booking history */}
            {loadingBookings ? (
              <p>Loading booking history...</p>
            ) : bookingError ? (
              <p style={{ color: "red" }}>{bookingError}</p>
            ) : bookingHistory.length > 0 ? (
              bookingHistory.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <p>
                    <strong>Service:</strong> {booking.service_type}
                  </p>
                  <p>
                    <strong>Date:</strong> {booking.appointment_date}
                  </p>
                  <p>
                    <strong>Time:</strong> {booking.appointment_time}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                  <hr />
                </div>
              ))
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