import React, { useState, useEffect } from "react";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Customers/Navbar";
import Home from "./pages/customer/Home";
import Services from "./pages/customer/Services";
import Products from "./pages/customer/Products";
import Login from "./pages/customer/Login";
import CreateAccount from "./pages/customer/CreateAccount";
import ForgotPassword from "./pages/customer/ForgotPassword";
import Footer4 from "./components/Customers/Footer4";
import FAQ from "./pages/customer/FAQ";
import Contact from "./pages/customer/Contact";
import {
  BookingPageGuest,
  BookingPageRegistered,
} from "./pages/customer/BookingPage";
import CustomerPay from "./pages/customer/CustomerPayment";
import SurgAppoint from "./pages/customer/SurgeryAppointment";
import ProfilePage from "./pages/customer/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LiveChatWidget from "./components/Customers/LiveChatWidget"; // Import the widget

const App = () => {
  useEffect(() => {
    // Request permission and get token
    generateToken();

    // Set up foreground message handler
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // Optionally, display a notification or update UI here.
    });
  }, []);

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <MainContent
          user={user}
          setUser={setUser}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      </div>
    </Router>
  );
};

const MainContent = ({ user, setUser, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const hideAdminUI = location.pathname === "/admindashboard";

  return (
    <div className="main-content">
      {!hideAdminUI && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route
            path="/booking"
            element={
              isLoggedIn ? (
                <BookingPageRegistered user={user} />
              ) : (
                <BookingPageGuest />
              )
            }
          />
          <Route path="/payment" element={<CustomerPay />} />
          <Route path="/surgery" element={<SurgAppoint />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
        </Routes>
      </div>

      {!hideAdminUI && <Footer4 />}

      {/* Render LiveChat widget only on customer pages */}
      {!hideAdminUI && <LiveChatWidget />}
    </div>
  );
};

export default App;
