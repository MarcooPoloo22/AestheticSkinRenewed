import { useState } from "react";
import DataTable from 'react-data-table-component';

import "../../../styles/admin/dashboard/faqs.css";

// Icons
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
      name: 'Timestamp',
      selector: row => row.timestamp,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Action',
      cell: () => <span>Added an Appointment</span>, // Static text for Action
      ignoreRowClick: true,
      allowOverflow: true,
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
          <p className="faq-text">Edit Item</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="timestampInput">Timestamp</label>
            <input type="datetime-local" className="questionInput" id="timestampInput" name="timestampInput" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="nameInput">Name</label>
            <input className="answerInput" id="nameInput" name="nameInput" placeholder="Value" required />
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
          <p className="faq-text">Add Item</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="timestampInput">Timestamp</label>
            <input type="datetime-local" className="questionInput" id="timestampInput" name="timestampInput" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="nameInput">Name</label>
            <input className="answerInput" id="nameInput" name="nameInput" placeholder="Value" required />
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
      timestamp: '2023-10-15 10:00 AM',
      name: 'Admin',
    },
    {
      id: 2,
      timestamp: '2023-10-16 02:30 PM',
      name: 'Admin',
    },
    {
      id: 3,
      timestamp: '2023-10-17 11:15 AM',
      name: 'Admin',
    },
    // Add more items here
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(item =>
    item.timestamp.toLowerCase().includes(searchText.toLowerCase()) ||
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Logs</p>
            <div className="faq-header-actions">
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