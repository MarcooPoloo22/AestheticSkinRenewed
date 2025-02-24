import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import BookingPage from "./pages/customer/BookingPage";
import CustomerPay from "./pages/customer/CustomerPayment"; 

const App = () => {
  return (
    <>
      <div className="main-content">
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/booking" element={<BookingPage />} />
            </Routes>
          </main>
        </Router>
        <Footer />
      </div>
    </>
  );
};

export default App;
