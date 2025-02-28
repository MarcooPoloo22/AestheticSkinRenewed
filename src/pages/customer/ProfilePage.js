import React, { useState } from "react";
import "../../styles/customer/ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("account");

  // Editable user information state
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    contactNumber: "1234567890",
  });

  const [editing, setEditing] = useState(false);
  const [newData, setNewData] = useState({ ...userData });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // Handle input changes for account info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  // Save changes and disable editing mode
  const handleSave = () => {
    setUserData(newData);
    setEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setNewData({ ...userData });
    setEditing(false);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  // Validate and update password
  const updatePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }
    setPasswordError("");
    alert("Password successfully updated!");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-card">
        <h3 className="profile-welcome">Welcome, {userData.fullName}!</h3>

        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
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
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {/* Account Information */}
          {activeTab === "account" && (
            <div className="account-details">
              <h4>Account Information</h4>
              {editing ? (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={newData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={newData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                  <input
                    type="text"
                    name="contactNumber"
                    value={newData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Contact Number"
                  />
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
                  <div className="info-row">Full Name: {userData.fullName}</div>
                  <div className="info-row">Email: {userData.email}</div>
                  <div className="info-row">
                    Contact Number: {userData.contactNumber}
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

          {/* Change Password */}
          {activeTab === "changePassword" && (
            <div className="password-change">
              <h4>Change Password</h4>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
              />
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm Password"
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              <button className="update-password" onClick={updatePassword}>
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
