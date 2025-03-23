// src/pages/customer/ProfilePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/customer/ProfilePage.css";

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

  // For editing profile
  const [editing, setEditing] = useState(false);

  // For password update
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Booking history states
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 1. Fetch profile data on mount
  useEffect(() => {
    fetch("http://localhost/getProfile.php", {
      method: "GET",
      credentials: "include", // Include session cookies
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUserData(data.user);
          setNewData(data.user);
          setUser(data.user); // Update global user so Navbar can reflect changes
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

  // 2. Fetch booking history when the user switches to the "bookingHistory" tab
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

  // 3. Handle editing form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  // 4. Save updated profile
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
        alert("Profile updated successfully!");

        // Update global user so Navbar shows new name
        setUser((prev) => ({
          ...prev,
          ...newData,
        }));
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    }
  };

  // 5. Cancel editing
  const handleCancel = () => {
    setNewData({ ...userData });
    setEditing(false);
  };

  // 6. Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  // 7. Update password
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
        alert("Password successfully updated!");
        // Clear password fields
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(result.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("An error occurred while updating password.");
    }
  };

  // 8. Render logic
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data available.</div>;

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
        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div className="account-details">
            <h2>
              <strong>Account Information</strong>
            </h2>
            {editing ? (
              <>
                <div className="account-info-grid">
                  {Object.keys(newData)
                    // Exclude "id" and "password"
                    .filter((key) => key !== "id" && key !== "password")
                    .map((key) => (
                      <div key={key}>
                        <label>{capitalizeLabel(key)}:</label>
                        <input
                          type="text"
                          name={key}
                          value={newData[key] || ""}
                          onChange={handleInputChange}
                          disabled={
                            key === "verified" ||
                            key === "verification_token" ||
                            key === "role"
                          }
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
