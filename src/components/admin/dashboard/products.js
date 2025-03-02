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
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true,
    },
    {
      name: 'File',
      cell: row => (
        <a href={row.fileUrl} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
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
          <p className="faq-text">Edit Item</p>
        </div>
        <form className="faq-edit">
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input className="questionInput" id="nameInput" name="nameInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input className="answerInput" id="descriptionInput" name="descriptionInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input className="answerInput" id="priceInput" name="priceInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input type="file" className="answerInput" id="fileInput" name="fileInput" required />
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
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input className="questionInput" id="nameInput" name="nameInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input className="answerInput" id="descriptionInput" name="descriptionInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input className="answerInput" id="priceInput" name="priceInput" placeholder="Value" required />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input type="file" className="answerInput" id="fileInput" name="fileInput" required />
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
      name: 'Item 1',
      description: 'This is the description for Item 1.',
      price: 'P1200',
      fileUrl: 'https://example.com/file1.pdf',
    },
    {
      id: 2,
      name: 'Item 2',
      description: 'This is the description for Item 2.',
      price: 'P500',
      fileUrl: 'https://example.com/file2.pdf',
    },
    {
      id: 3,
      name: 'Item 3',
      description: 'This is the description for Item 3.',
      price: 'P700',
      fileUrl: 'https://example.com/file3.pdf',
    },
    // Add more items here
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()) ||
    item.price.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Products</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" style={{width: "120px"}} onClick={() => setActivePage("ManageFAQAdd")}>
                + Add Product
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