import { useState } from "react";
import DataTable from 'react-data-table-component';

import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const customStyles = {
  pagination: {
    style: {
      justifyContent: 'center',
    },
  },
};

const FAQTable = ({ setActivePage, activePage, data }) => {
  // Define columns
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Password',
      selector: row => row.password,
      sortable: true,
    },
    {
      name: 'Contact Number',
      selector: row => row.contactNumber,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => setActivePage("ManageFAQEdit")} className="edit-button">
            <FaRegEdit />
          </button>
          <button className="delete-button">
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

const ManageFAQEdit = ({ setActivePage, activePage }) => {
  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Entry</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input className="questionInput" id="nameInput" name="nameInput" placeholder="Name" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="emailInput">Email</label>
            <input className="answerInput" id="emailInput" name="emailInput" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="passwordInput">Password</label>
            <input className="answerInput" id="passwordInput" name="passwordInput" placeholder="Password" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="contactNumberInput">Contact Number</label>
            <input className="answerInput" id="contactNumberInput" name="contactNumberInput" placeholder="Contact Number" required />
          </div>
          <button className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageFAQAdd = ({ setActivePage, activePage }) => {
  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Entry</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input className="questionInput" id="nameInput" name="nameInput" placeholder="Name" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="emailInput">Email</label>
            <input className="answerInput" id="emailInput" name="emailInput" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="passwordInput">Password</label>
            <input className="answerInput" id="passwordInput" name="passwordInput" placeholder="Password" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="contactNumberInput">Contact Number</label>
            <input className="answerInput" id="contactNumberInput" name="contactNumberInput" placeholder="Contact Number" required />
          </div>
          <button className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activePage, setActivePage] = useState("FAQs");
  const [searchText, setSearchText] = useState("");

  // Sample data
  const initialData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      contactNumber: '09111111111',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'qwerty123',
      contactNumber: '09222222222',
    },
    // Add more data items here
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.password.toLowerCase().includes(searchText.toLowerCase()) ||
    item.contactNumber.includes(searchText)
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Employees List</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" onClick={() => setActivePage("ManageFAQAdd")}>
                + Add User
              </button>
              <div className="search-container">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="faq-search-bar"
                />
              </div>
            </div>
          </div>
          <FAQTable setActivePage={setActivePage} activePage={activePage} data={filteredData} />
        </div>
      ) : activePage === "ManageFAQEdit" ? (
        <ManageFAQEdit setActivePage={setActivePage} activePage={activePage} />
      ) : (
        <ManageFAQAdd setActivePage={setActivePage} activePage={activePage} />
      )}
    </>
  );
};

export default FAQs;
