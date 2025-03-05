import React, { useState } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/ResetPassword.css";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match!",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost/resetpassword.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const result = await response.json();

            if (result.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: result.message,
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
                text: "An error occurred while resetting your password.",
            });
        }
    };

    return (
        <div className="reset-password-container d-flex justify-content-center align-items-center">
            <div className="form-box p-4">
                <h2 className="text-center mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 d-flex justify-content-center">
                        <button className="submit-btn" type="submit">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;