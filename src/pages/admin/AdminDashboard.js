// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/admin/ASR Logo.png";
import frame1 from "../../assets/admin/DashboardDesign.png";
import welcome from "../../assets/admin/Welcome.png";
import "../../styles/admin/adminDashboard.css";
import { TbLogout2 } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { VscSettings } from "react-icons/vsc";
import { LuMessageSquareMore } from "react-icons/lu";
import { RiDiscountPercentLine, RiEditBoxLine } from "react-icons/ri";
import { AiOutlineShopping } from "react-icons/ai";
import { FaRegHandPaper } from "react-icons/fa";
import {
  MdOutlineMedicalServices,
  MdOutlineEditCalendar,
} from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import Admin from "../../components/admin/dashboard/admin.js";
import Appointments from "../../components/admin/dashboard/appointments.js";
import Branch from "../../components/admin/dashboard/branch.js";
import Contact from "../../components/admin/dashboard/contact.js";
import DashboardCalendar from "../../components/admin/dashboard/dashboard.js";
import Faqs from "../../components/admin/dashboard/faqs.js";
import Logs from "../../components/admin/dashboard/logs.js";
import Messages from "../../components/admin/dashboard/messages.js";
import Products from "../../components/admin/dashboard/products.js";
import Promos from "../../components/admin/dashboard/promos.js";
import Services from "../../components/admin/dashboard/services.js";
import Surgeries from "../../components/admin/dashboard/surgeries.js";
import Users from "../../components/admin/dashboard/users.js";

const Button = ({ children, onClick, isActive }) => (
  <button className={`button ${isActive ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const Header = ({ onLogout }) => {
  return (
    <nav className="header">
      <div className="admin-header">
        <div className="admin">
          <span className="admin-name">Gwen</span>
          <span className="role">Administrator</span>
        </div>
        <button className="admin-logout" onClick={onLogout}>
          <TbLogout2 style={{ marginRight: "4px" }} />
          Log Out
        </button>
      </div>
  </nav>
);}

const Dashboard = ({ isLoggedIn, user, setUser, setIsLoggedIn }) => {
  const [activePage, setActivePage] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/login");
    }
    if (isLoggedIn && user) {
      if (user.role !== "admin" && user.role !== "employee") {
        return navigate("/");
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost/admin_dashboard_backend/logout.php", {
        method: "POST",
        credentials: "include",
      });

      // ✅ Clear frontend session
      setUser(null);
      setIsLoggedIn(false);

      // ✅ Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const pages = {
    Home: <DashboardCalendar />,
    Profile: <Branch />,
    Messages: <Messages />,
    ManageServices: <Services />,
    ManagePromos: <Promos />,
    ManageProducts: <Products />,
    ManageFAQ: <Faqs />,
    ManageSurgeries: <Surgeries />,
    ManageContact: <Contact />,
    ManageAppointments: <Appointments />,
    ManageUsers: <Users />,
    ManageAdmin: <Admin />,
    Logs: <Logs />,
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src={logo} className="logo" alt="Logo" />
        <Button
          onClick={() => setActivePage("Home")}
          isActive={activePage === "Home"}
        >
          <RxDashboard /> Dashboard
        </Button>
        <Button
          onClick={() => setActivePage("Profile")}
          isActive={activePage === "Profile"}
        >
          <VscSettings /> Branch
        </Button>
        <div className="divider" />
        <Button
          onClick={() => setActivePage("Messages")}
          isActive={activePage === "Messages"}
        >
          <LuMessageSquareMore /> Messages
        </Button>
        <Button
          onClick={() => setActivePage("ManageServices")}
          isActive={activePage === "ManageServices"}
        >
          <FaRegHandPaper /> Manage Services
        </Button>
        <Button
          onClick={() => setActivePage("ManagePromos")}
          isActive={activePage === "ManagePromos"}
        >
          <RiDiscountPercentLine /> Manage Promos
        </Button>
        <Button
          onClick={() => setActivePage("ManageProducts")}
          isActive={activePage === "ManageProducts"}
        >
          <AiOutlineShopping /> Manage Products
        </Button>
        <Button
          onClick={() => setActivePage("ManageSurgeries")}
          isActive={activePage === "ManageSurgeries"}
        >
          <MdOutlineMedicalServices /> Manage Surgeries
        </Button>
        <Button
          onClick={() => setActivePage("ManageFAQ")}
          isActive={activePage === "ManageFAQ"}
        >
          <RiEditBoxLine /> Manage FAQ
        </Button>
        <Button
          onClick={() => setActivePage("ManageContact")}
          isActive={activePage === "ManageContact"}
        >
          <IoCallOutline /> Manage Contact
        </Button>
        <div className="divider" />
        <Button
          onClick={() => setActivePage("ManageAppointments")}
          isActive={activePage === "ManageAppointments"}
        >
          <MdOutlineEditCalendar /> Manage Appointments
        </Button>
        <Button
          onClick={() => setActivePage("ManageUsers")}
          isActive={activePage === "ManageUsers"}
        >
          <BsPeople /> Manage Users
        </Button>
        <Button
          onClick={() => setActivePage("ManageAdmin")}
          isActive={activePage === "ManageAdmin"}
        >
          <BsPeople /> Manage Admin
        </Button>
        <Button
          onClick={() => setActivePage("Logs")}
          isActive={activePage === "Logs"}
        >
          <IoSettingsOutline /> Audit Trail
        </Button>
        <img src={frame1} className="design-pic" alt="Dashboard Design" />
      </div>

      <div className="content-area">
        <Header onLogout={handleLogout} />
        <img src={welcome} className="welcome" alt="Welcome" />
        {pages[activePage]}
      </div>
    </div>
  );
};

export default Dashboard;
