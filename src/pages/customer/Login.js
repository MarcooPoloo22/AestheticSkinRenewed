import react from "react";
import '../../styles/customer/Login.css';


const Login = () => {
    return (
          <div className="login-form">
            <h2>Login</h2>
            <form action="login.php" method="post">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required />

              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Password" required />

              <a href="forgot_password.php">Forgot password?</a>
              <br />
              <button type="submit" className="btn">Sign In</button>
              <a href="register.js">Don’t have an account?</a>
            </form>
          </div>
    );    
}

export default Login;