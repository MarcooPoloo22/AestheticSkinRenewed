import { useState, useEffect } from "react";
import logo from "../../assets/admin/ASR Logo.png";
import frame1 from "../../assets/admin/DashboardDesign.png";
import welcome from "../../assets/admin/Welcome.png";
import "../../styles/admin/adminDashboard.css";
import { useNavigate } from "react-router-dom";

// Icons for dashboard
import { BsPeople } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { LuMessageSquareMore } from "react-icons/lu";
import { RiEditBoxLine } from "react-icons/ri";
import { MdOutlineEditCalendar } from "react-icons/md";
import { FaRegHandPaper } from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineShopping } from "react-icons/ai";
import { VscSettings } from "react-icons/vsc";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineMedicalServices } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

// Imports for buttons
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
          <span className="admin-name">Name</span>
          <span className="role">Administrator</span>
        </div>
        <button className="admin-logout" onClick={onLogout}>
          <TbLogout2 style={{ marginRight: "4px" }} />
          Log Out
        </button>
      </div>
    </nav>
  );
};

const Dashboard = (faqs) => {
  const [activePage, setActivePage] = useState("Home");
  const navigate = useNavigate();

  // Authentication check on component mount
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost/admin_dashboard_backend/check_session.php", {
                credentials: "include"
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (!data.authenticated) {
                navigate("/login");
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            navigate("/login");
        }
    };
    
    checkAuth();
}, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/logout.php", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
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
        <img src={logo} alt="Logo" className="logo" />
        <div className="division">Home</div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("Home")}
            isActive={activePage === "Home"}
          >
            <RxDashboard className="icon" />
            Dashboard
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("Profile")}
            isActive={activePage === "Profile"}
          >
            <VscSettings className="icon" />
            Branch
          </Button>
        </div>
        <div className="divider" />
        <div className="division">Website</div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("Messages")}
            isActive={activePage === "Messages"}
          >
            <LuMessageSquareMore className="icon" />
            Messages
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageServices")}
            isActive={activePage === "ManageServices"}
          >
            <FaRegHandPaper className="icon" />
            Manage Services
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManagePromos")}
            isActive={activePage === "ManagePromos"}
          >
            <RiDiscountPercentLine className="icon" />
            Manage Promos
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageProducts")}
            isActive={activePage === "ManageProducts"}
          >
            <AiOutlineShopping className="icon" />
            Manage Products
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageSurgeries")}
            isActive={activePage === "ManageSurgeries"}
          >
            <MdOutlineMedicalServices className="icon" />
            Manage Surgeries
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageFAQ")}
            isActive={activePage === "ManageFAQ"}
          >
            <RiEditBoxLine className="icon" />
            Manage FAQ
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageContact")}
            isActive={activePage === "ManageContact"}
          >
            <IoCallOutline className="icon" />
            Manage Contact
          </Button>
        </div>
        <div className="divider" />
        <div className="division">Users and Appointment</div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageAppointments")}
            isActive={activePage === "ManageAppointments"}
          >
            <MdOutlineEditCalendar className="icon" />
            Manage Appointments
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageUsers")}
            isActive={activePage === "ManageUsers"}
          >
            <BsPeople className="icon" />
            Manage Users
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("ManageAdmin")}
            isActive={activePage === "ManageAdmin"}
          >
            <BsPeople className="icon" />
            Manage Admin
          </Button>
        </div>
        <div className="button-page">
          <Button
            onClick={() => setActivePage("Logs")}
            isActive={activePage === "Logs"}
          >
            <IoSettingsOutline className="icon" />
            Audit Trail
          </Button>
        </div>
        <div className="design-pic">
          <img src={frame1} alt="Dashboard Design" />
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        <Header onLogout={handleLogout} />
        <img src={welcome} alt="Welcome" className="welcome" />
        {pages[activePage]}
      </div>
    </div>
  );
};

export default Dashboard;