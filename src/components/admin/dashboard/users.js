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
          <p className="faq-text">Edit FaQ</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="questionInput">Question</label>
            <input className="questionInput" id="questionInput" name="questionInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="Answer">Answer</label>
            <input className="answerInput" id="answerInput" name="answerInput" placeholder="Value" required />
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
          <p className="faq-text">Add FaQ</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="questionInput">Question</label>
            <input className="questionInput" id="questionInput" name="questionInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="Answer">Answer</label>
            <input className="answerInput" id="answerInput" name="answerInput" placeholder="Value" required />
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
      contactNumber: '09111111111',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      contactNumber: '09222222222',
    },
    // Add more data items here
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.contactNumber.includes(searchText)
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Users List</p>
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
