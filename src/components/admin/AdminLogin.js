import React from "react";
import frame1 from "../../Images/admin/Graphic Side.png";
import frame2 from "../../Images/admin/ASR Logo.png";
import frame3 from "../../Images/admin/LoginDesign.png";
import "../../css/admin/adminLogin.css";

const AdminLogin = () => {
    return (
        <div className="admin-login-form">
            <img src={frame2} alt="ASR Logo"/>
            <div className="frame">
                <span className="admin-login">Admin Login</span>
                <span className="sign-in">Sign in to access admin page</span>
            </div>
            <form>
                <div className="form-group">
                    <label className="emailLabel" htmlFor="email">Email</label>
                    <input className="email" type="email" id="email" name="email" placeholder="Enter email" required />
                </div>
                <div className="form-group">
                    <label className="passwordLabel" htmlFor="password">Password</label>
                    <input className="password" type="password" id="password" name="password" placeholder="Enter password" required />
                </div>
                <div className="form-bottom">
                    <input type="checkbox" id="remember" name="remember" />
                    <label className="Remember" htmlFor="remember">Remember me</label>
                    <a className="Forgot" href="ForgotPassword.js">Forgot Password?</a>
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
}

const AdminResetPasswordLogin = () => {
    return (
        <div className="admin-login-form">
            <img src={frame2} alt="ASR Logo"/>
            <div className="frame">
                <span className="admin-login">Reset Password</span>
                <span className="sign-in">Enter your email address to reset your password</span>
            </div>
            <form>
                <div className="form-group">
                    <label className="emailLabel" htmlFor="email">Email</label>
                    <input className="email" type="email" id="email" name="email" placeholder="Enter email" required />
                </div>
                <button style={{ marginTop: "7%" }} type="submit" className="login-btn">Continue</button>
            </form>
        </div>
    );
}

const AdminInputCodeLogin = () => {
    return (
        <div className="admin-login-form">
            <img src={frame2} alt="ASR Logo"/>
            <div className="frame">
                <span className="admin-login">Enter Verification Code</span>
                <span className="sign-in">Please enter the code sent to your email</span>
            </div>
            <form>
                <div className="form-group">
                    <label className="codeLabel" htmlFor="code">Verification Code</label>
                    <input className="code" type="number" id="code" name="code" placeholder="Enter the code" required />
                </div>
                <button style={{ marginTop: "7%" }} type="submit" className="login-btn">Continue</button>
            </form>
        </div>
    );
}


const AdminInputResetPasswordLogin = () => {
    return (
        <div className="admin-login-form">
            <img src={frame2} alt="ASR Logo"/>
            <div className="frame">
                <span className="admin-login">Reset Password</span>
                <span className="sign-in">Enter your new password</span>
            </div>
            <form>
                <div className="form-group">
                    <label className="passwordLabel" htmlFor="password">Password</label>
                    <input className="password" type="password" id="password" name="password" placeholder="Enter password" required />
                </div>
                <div className="form-group">
                    <label className="passwordLabel" htmlFor="password">Password</label>
                    <input className="password" type="password" id="password" name="password" placeholder="Enter password" required />
                </div>
                <button style={{ marginTop: "7%" }} type="submit" className="login-btn">Reset</button>
            </form>
        </div>
    );
}

const AdminLoginPic = () => {
    return (
        <div className="admin-login-pic">
            <img src={frame1} alt="Pic" />
        </div>
    );
}

const AdminLoginPicDesign = () => {
    return (
        <div className="design-pic">
                <img src={frame3} alt="Login Design" />
        </div>
    );
}

export {AdminLogin, AdminLoginPic, AdminLoginPicDesign, AdminResetPasswordLogin, AdminInputResetPasswordLogin, AdminInputCodeLogin};