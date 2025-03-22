import React, { useState } from "react";
import "../../styles/customer/ProfilePage.css";

const capitalizeLabel = (str) => {
  return str.replace(/([A-Z])/g, ' $1') 
            .split(' ') 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
            .join(' '); 
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState({
    firstName: "John",
    middleInitial: "H",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    password: "********",
    contactNo: "09123456789",
    verified: "Yes",
    verificationToken: "N/A",
    role: "Customer",
  });

  const [editing, setEditing] = useState(false);
  const [newData, setNewData] = useState({ ...userData });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleSave = () => {
    setUserData(newData);
    setEditing(false);
  };

  const handleCancel = () => {
    setNewData({ ...userData });
    setEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

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
      <div className="profile-sidebar">
        <h3>Welcome, {userData.firstName} {userData.lastName}!</h3>
        <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>Account</button>
        <button className={activeTab === "changePassword" ? "active" : ""} onClick={() => setActiveTab("changePassword")}>Change Password</button>
        <button className={activeTab === "bookingHistory" ? "active" : ""} onClick={() => setActiveTab("bookingHistory")}>Booking History</button>
      </div>

      <div className="profile-content">
        {activeTab === "account" && (
          <div className="account-details">
            <h2><strong>Account Information</strong></h2>
            {editing ? (
              <>
                <div className="account-info-grid">
                  {Object.keys(newData).map((key) => (
                    <div key={key}>
                      <label>{capitalizeLabel(key)}:</label>
                      <input 
                        type="text" 
                        name={key} 
                        value={newData[key]} 
                        onChange={handleInputChange} 
                        disabled={key === 'verified' || key === 'verificationToken' || key === 'role'} 
                      />
                    </div>
                  ))}
                </div>
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <div className="account-info-grid">
                  {Object.keys(userData).map((key) => (
                    <p key={key}><strong>{capitalizeLabel(key)}:</strong> {userData[key]}</p>
                  ))}
                </div>
                <button className="edit-button" onClick={() => setEditing(true)}>Edit Profile</button>
              </>
            )}
          </div>
        )}

        {activeTab === "changePassword" && (
          <div className="password-change">
            <h2><strong>Change Password</strong></h2>
            <div>
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="Current Password" />
            </div>
            <div>
              <label>New Password</label>
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="New Password" />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm Password" />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button className="update-password" onClick={updatePassword}>Update Password</button>
          </div>
        )}

        {activeTab === "bookingHistory" && (
          <div className="booking-history">
            <h2><strong>Booking History</strong></h2>
            <p>The User's Booking History Will Be Displayed Here:</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;