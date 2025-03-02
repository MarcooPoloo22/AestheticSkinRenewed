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
      name: 'Branch',
      selector: row => row.branch,
      sortable: true,
    },
    {
      name: 'Service',
      selector: row => row.service,
      sortable: true,
    },
    {
      name: 'Preferred Staff',
      selector: row => row.preferredStaff,
      sortable: true,
    },
    {
      name: 'Date and Time',
      selector: row => row.dateAndTime.toLocaleString(),
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

const FAQs = () => {
  const [activePage, setActivePage] = useState("FAQs");
  const [searchText, setSearchText] = useState("");

  // Sample data
  const initialData = [
    {
        id: 1,
        name: 'James, Lebron',
        email: 'lebronjames@gmail.com',
        contactNumber: '09111111111',
        branch: 'Katipunan',
        service: 'Hydra Facial',
        preferredStaff: 'Rob Plenika',
        dateAndTime: new Date('2023-10-15T10:00:00'),
      },
      {
        id: 2,
        name: 'Curry, Stephen',
        email: 'stephencurry@gmail.com',
        contactNumber: '09222222222',
        branch: 'BGC',
        service: 'Laser Hair Removal',
        preferredStaff: 'Anna Smith',
        dateAndTime: new Date('2023-10-16T14:30:00'),
      },
      {
        id: 3,
        name: 'Durant, Kevin',
        email: 'kevindurant@gmail.com',
        contactNumber: '09333333333',
        branch: 'Makati',
        service: 'Chemical Peel',
        preferredStaff: 'John Doe',
        dateAndTime: new Date('2023-10-17T11:15:00'),
      },
      {
        id: 4,
        name: 'Antetokounmpo, Giannis',
        email: 'giannis@gmail.com',
        contactNumber: '09444444444',
        branch: 'Alabang',
        service: 'Microdermabrasion',
        preferredStaff: 'Maria Garcia',
        dateAndTime: new Date('2023-10-18T09:45:00'),
      },
      {
        id: 5,
        name: 'Doncic, Luka',
        email: 'lukadoncic@gmail.com',
        contactNumber: '09555555555',
        branch: 'Ortigas',
        service: 'Botox',
        preferredStaff: 'Chris Johnson',
        dateAndTime: new Date('2023-10-19T16:00:00'),
      },
      {
        id: 6,
        name: 'Jokic, Nikola',
        email: 'nikolajokic@gmail.com',
        contactNumber: '09666666666',
        branch: 'Katipunan',
        service: 'Hydra Facial',
        preferredStaff: 'Rob Plenika',
        dateAndTime: new Date('2023-10-20T13:30:00'),
      },
      {
        id: 7,
        name: 'Tatum, Jayson',
        email: 'jaysontatum@gmail.com',
        contactNumber: '09777777777',
        branch: 'BGC',
        service: 'Laser Hair Removal',
        preferredStaff: 'Anna Smith',
        dateAndTime: new Date('2023-10-21T15:45:00'),
      },
      {
        id: 8,
        name: 'Morant, Ja',
        email: 'jamorant@gmail.com',
        contactNumber: '09888888888',
        branch: 'Makati',
        service: 'Chemical Peel',
        preferredStaff: 'John Doe',
        dateAndTime: new Date('2023-10-22T12:00:00'),
      },
      {
        id: 9,
        name: 'Booker, Devin',
        email: 'devinbooker@gmail.com',
        contactNumber: '09999999999',
        branch: 'Alabang',
        service: 'Microdermabrasion',
        preferredStaff: 'Maria Garcia',
        dateAndTime: new Date('2023-10-23T10:30:00'),
      },
      {
        id: 10,
        name: 'Embiid, Joel',
        email: 'joelembiid@gmail.com',
        contactNumber: '09000000000',
        branch: 'Ortigas',
        service: 'Botox',
        preferredStaff: 'Chris Johnson',
        dateAndTime: new Date('2023-10-24T17:15:00'),
      },
      
   
    // Add more appointment items here
  ];

  // Filter data based on search text
  const filteredData = initialData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchText.toLowerCase()) ||
      item.service.toLowerCase().includes(searchText.toLowerCase()) ||
      item.preferredStaff.toLowerCase().includes(searchText.toLowerCase()) ||
      item.dateAndTime.toLocaleString().toLowerCase().includes(searchText.toLowerCase()) // Convert Date to string
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Appointments</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" onClick={() => setActivePage("ManageFAQEdit")}>
                + Book
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
      ) : (
        <ManageFAQEdit setActivePage={setActivePage} activePage={activePage} />
      )}
    </>
  );
};

export default FAQs;