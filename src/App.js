import React, { useState } from "react";
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
import Footer from "./components/Customers/Footer4";
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

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    /**
     * Provide the Router at the top-level
     */
    <Router>
      <MainContent
        user={user}
        setUser={setUser}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
    </Router>
  );
};

const MainContent = ({ user, setUser, isLoggedIn, setIsLoggedIn }) => {
  // Access the current location
  const location = useLocation();

  const hideAdminUI = location.pathname === "/admindashboard";

  return (
    <div className="main-content">
      {/* Hide Navbar if on /admindashboard */}
      {!hideAdminUI && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <main>
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
      </main>

      {/* Hide Footer if on /admindashboard */}
      {!hideAdminUI && <Footer />}
    </div>
  );
};

export default App;
