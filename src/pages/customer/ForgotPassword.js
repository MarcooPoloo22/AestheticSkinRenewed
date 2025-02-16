import react from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/ForgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <h1>Forgot Password?</h1>
      <p>
        Remember your password? <Link to="/login">Login Here</Link>
      </p>
      <br />
      <form action="/forgot-password" method="post">
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
