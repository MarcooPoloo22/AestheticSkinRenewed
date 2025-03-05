import React, { useState } from "react";
import Swal from 'sweetalert2';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost/forgotPassword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response from server.');
            }

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: result.message,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while processing your request.',
            });
        }
    };

    return (
        <div className="forgot-password-container d-flex justify-content-center align-items-center">
            <div className="form-box p-4">
                <h2 className="text-center mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}> 
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 d-flex justify-content-center">
                        <button className="submit-btn" type="submit">Send Reset Link</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;