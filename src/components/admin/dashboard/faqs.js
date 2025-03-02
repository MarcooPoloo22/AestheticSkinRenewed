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
      name: 'Questions',
      selector: row => row.question,
      sortable: true,
    },
    {
      name: 'Answer',
      selector: row => row.answer,
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
      question: 'Are the treatments safe?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...',
    },
    {
      id: 2,
      question: 'Question 2',
      answer: 'Answer 2...',
    },
    // Add more FAQ items here
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(item =>
    item.question.toLowerCase().includes(searchText.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Frequently Asked Questions</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" onClick={() => setActivePage("ManageFAQAdd")}>
                + Add FAQ
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