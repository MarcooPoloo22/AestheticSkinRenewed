import { useState } from "react";
import logo from "./Images/admin/ASR Logo.png";
import frame1 from "./Images/admin/DashboardDesign.png";
import welcome from "./Images/admin/Welcome.png";
import './css/admin/adminDashboard.css';
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

const Button = ({ children, onClick, isActive }) => (
  <button className={`button ${isActive ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const Header = () => {
    return (
        <nav className="header">
            <div className= "admin">
              <span className="admin-name">Name</span>
              <span className="role">Administrator</span>
            </div>
        </nav>
    );
};


const Dashboard = () => {
  const [activePage, setActivePage] = useState("Home");

  const pages = {
    Home:
    <div className="page-content">
      Welcome to the Home Page
    </div>,

    Profile: 
    <div className="page-content">
      This is your Profile
    </div>,

    Messages: 
    <div className="page-content">
      messages
    </div>,

    ManageServices: 
    <div className="page-content">
      manage services
    </div>,

    ManagePromos: 
    <div className="page-content">
      manage promos
    </div>,

    ManageProducts: 
    <div className="page-content">
      manage product
    </div>,

    ManageFAQ: 
    <div className="page-content">
      manage faq
    </div>,

    ManageAppointments: 
    <div className="page-content">
      manage appointments
    </div>,

    ManageUsers: 
    <div className="page-content">
      manage users
    </div>,

    ManageAdmin: 
    <div className="page-content">
      manage admin
    </div>,
    
    Logs: 
    <div className="page-content">
      logs
    </div>,
  };

  
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="division">Home</div>

        <div className="button-page">
          <Button onClick={() => setActivePage("Home")} isActive={activePage === "Home"}><RxDashboard className="icon"/>Dashboard</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("Profile")} isActive={activePage === "Profile"}><VscSettings className="icon"/>Branch</Button>
        </div>

        <div className="divider" />
        <div className="division">Website</div> 
        <div className="button-page">
          <Button onClick={() => setActivePage("Messages")} isActive={activePage === "Messages"}><LuMessageSquareMore className="icon"/>Messages</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("ManageServices")} isActive={activePage === "ManageServices"}><FaRegHandPaper className="icon"/>Manage Services</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("ManagePromos")} isActive={activePage === "ManagePromos"}><RiDiscountPercentLine className="icon"/>Manage Promos</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("ManageProducts")} isActive={activePage === "ManageProducts"}><AiOutlineShopping className="icon"/>Manage Products</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("ManageFAQ")} isActive={activePage === "ManageFAQ"}><RiEditBoxLine className="icon"/>Manage FAQ</Button>
        </div>

        <div className="divider" />
        <div className="division">Users and Appointment</div> 
        <div className="button-page">
          <Button onClick={() => setActivePage("ManageAppointments")} isActive={activePage === "ManageAppointments"}><MdOutlineEditCalendar className="icon"/>Manage Appointments</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("ManageUsers")} isActive={activePage === "ManageUsers"}><BsPeople className="icon"/>Manage Users</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("ManageAdmin")} isActive={activePage === "ManageAdmin"}><BsPeople className="icon"/>Manage Admin</Button>
        </div>
        <div className="button-page">
          <Button onClick={() => setActivePage("Logs")} isActive={activePage === "Logs"}><IoSettingsOutline className="icon"/>Logs</Button>
        </div>

        <div className="design-pic">
          <img src={frame1} alt="Dashboard Design" />
        </div>
      </div>

      {/* Content */}
        <div className="content-area">
        <Header />
        <img src={welcome} alt="Welcome" className="welcome" />
          {pages[activePage]}
        </div>
    </div>
  );
};

export default Dashboard;