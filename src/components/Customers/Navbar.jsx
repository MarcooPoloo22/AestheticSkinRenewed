import React, { useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/customer/ASR_Logo.png";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => { // Accept isLoggedIn and setIsLoggedIn as props
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost/checklogin.php", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        setIsLoggedIn(result.status === "success");
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn]); // Add setIsLoggedIn to dependency array

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();
      if (result.status === "success") {
        setIsLoggedIn(false); // Update the login state
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm p-1">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            alt="Logo"
            width="260"
            height="50"
            className="d-inline-block align-text-top"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav nav-underline me-auto mb-2 mb-lg-0 mx-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" activeClassName="active">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/services"
                  activeClassName="active"
                >
                  Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/products"
                  activeClassName="active"
                >
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/surgery"
                  activeClassName="active"
                >
                  Surgery
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/faq"
                  activeClassName="active"
                >
                  FaQ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/contact"
                  activeClassName="active"
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {/* Conditionally render Login or Logout button */}
            {isLoggedIn ? (
              <button
                className="btn btn-outline-danger mx-5 mb-1 d-none d-lg-inline"
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              <Link
                className="btn btn-outline-success mx-5 mb-1 d-none d-lg-inline"
                to="/login"
                role="button"
              >
                Login
              </Link>
            )}

            {/* Conditionally render Login or Logout button for small screens */}
            {isLoggedIn ? (
              <button
                className="btn btn-outline-danger mb-1 d-lg-none"
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              <Link
                className="btn btn-outline-success mb-1 d-lg-none"
                to="/login"
                role="button"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;