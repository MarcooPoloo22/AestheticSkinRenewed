import React from "react";
import { NavLink } from 'react-router-dom';
import logo from "../../assets/ASR_Logo.png";

const Navbar = () => {
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
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav nav-underline me-auto mb-2 mb-lg-0 mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services" activeClassName="active">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products" activeClassName="active">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/faq" activeClassName="active">
                FaQ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" activeClassName="active">
                Contact Us
              </NavLink>
            </li>
          </ul>
          <button className="btn btn-outline-success mx-5" type="button">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
