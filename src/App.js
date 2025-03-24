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
import Promos from "./pages/customer/Promos";
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
import LiveChatWidget from "./components/Customers/LiveChatWidget";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost/getProfile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user);
          setIsLoggedIn(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error checking session:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <MainContent
          user={user}
          setUser={setUser}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loading={loading}
        />
      </div>
    </Router>
  );
};

const MainContent = ({ user, setUser, isLoggedIn, setIsLoggedIn, loading }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  if (loading) return null;

  const isAdmin = user?.role === "admin" || user?.role === "employee";
  const isAdminPage = currentPath.startsWith("/admindashboard");
  const hideAdminUI = isAdmin && isAdminPage;

  return (
    <div className="main-content">
      {!hideAdminUI && (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
        />
      )}

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              <Login
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
              />
            }
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admindashboard"
            element={
              <AdminDashboard
                isLoggedIn={isLoggedIn}
                user={user}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />

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
          <Route
            path="/profile"
            element={
              <ProfilePage
                user={user}
                setUser={setUser}
                isLoggedIn={isLoggedIn}
              />
            }
          />
        </Routes>
      </div>

      {!hideAdminUI && <Footer4 />}
      {!hideAdminUI && <LiveChatWidget />}
    </div>
  );
};

export default App;
