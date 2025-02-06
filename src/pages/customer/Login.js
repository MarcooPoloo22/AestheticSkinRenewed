import react from "react";
import "../../styles/customer/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-image">
          <img src="./assets/spa_login.jpg" alt="Pic" />
        </div>
        <div className="login-form">
          <h2>Login</h2>
          <form action="login.php" method="post">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />

            <Link to="/forgot-password">Forgot password?</Link>
            <br />
            <button type="submit" className="btn">
              Sign In
            </button>
            <Link to="/create-account">Don’t have an account?</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
