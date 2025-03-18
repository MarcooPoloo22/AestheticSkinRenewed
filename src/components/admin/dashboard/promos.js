import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
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

const FAQTable = ({ setActivePage, activePage, data, fetchPromos }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this promo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost/admin_dashboard_backend/delete_promo.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete promo');
        }

        const result = await response.json();
        Swal.fire({
          title: 'Deleted!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Refresh the promos list
        fetchPromos();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete promo. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error deleting promo:', error);
      }
    }
  };

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
        <a href={row.file_url} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'Start Date & Time',
      selector: row => new Date(row.start_date).toLocaleString(),
      sortable: true,
    },
    {
      name: 'End Date & Time',
      selector: row => new Date(row.end_date).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => setActivePage({ page: "ManageFAQEdit", promo: row })} className="edit-button">
            <FaRegEdit />
          </button>
          <button onClick={() => handleDelete(row.id)} className="delete-button">
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

const ManageFAQEdit = ({ setActivePage, activePage, fetchPromos }) => {
  const [name, setName] = useState(activePage.promo.name);
  const [description, setDescription] = useState(activePage.promo.description);
  const [price, setPrice] = useState(activePage.promo.price);
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState(activePage.promo.start_date.split('T')[0]);
  const [startTime, setStartTime] = useState(activePage.promo.start_date.split('T')[1]);
  const [endDate, setEndDate] = useState(activePage.promo.end_date.split('T')[0]);
  const [endTime, setEndTime] = useState(activePage.promo.end_date.split('T')[1]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time into a single datetime string
    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    // Prepare form data
    const formData = {
      id: activePage.promo.id,
      name,
      description,
      price,
      file_url: activePage.promo.file_url, // Replace with actual file URL
      start_date: startDateTime,
      end_date: endDateTime,
    };   

    try {
      const response = await fetch(`http://localhost/admin_dashboard_backend/update_promo.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update promo');
      }

      const result = await response.json();
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Refresh the promos list
      fetchPromos();
      setActivePage({ page: "FAQs" });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update promo. Please check the console for details.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error updating promo:', error);
    }
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "FAQs" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Item</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input
              className="questionInput"
              id="nameInput"
              name="nameInput"
              placeholder="Value"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input
              className="answerInput"
              id="descriptionInput"
              name="descriptionInput"
              placeholder="Value"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input
              className="answerInput"
              id="priceInput"
              name="priceInput"
              placeholder="Value"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input
              type="file"
              className="answerInput"
              id="fileInput"
              name="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="startDateInput">Start Date</label>
              <input
                type="date"
                className="answerInput"
                id="startDateInput"
                name="startDateInput"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="startTimeInput">Start Time</label>
              <input
                type="time"
                className="answerInput"
                id="startTimeInput"
                name="startTimeInput"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="endDateInput">End Date</label>
              <input
                type="date"
                className="answerInput"
                id="endDateInput"
                name="endDateInput"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="endTimeInput">End Time</label>
              <input
                type="time"
                className="answerInput"
                id="endTimeInput"
                name="endTimeInput"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageFAQAdd = ({ setActivePage, activePage, fetchPromos }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time into a single datetime string
    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    // Prepare form data
    const formData = {
      name,
      description,
      price,
      file_url: "https://example.com/file.pdf", // Replace with actual file URL
      start_date: startDateTime,
      end_date: endDateTime,
    };

    try {
      const response = await fetch(`http://localhost/admin_dashboard_backend/add_promo.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add promo');
      }

      const result = await response.json();
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Refresh the promos list
      fetchPromos();
      setActivePage({ page: "FAQs" });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add promo. Please check the console for details.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error adding promo:', error);
    }
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage({ page: "FAQs" })} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Item</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="nameInput">Name</label>
            <input
              className="questionInput"
              id="nameInput"
              name="nameInput"
              placeholder="Value"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">Description</label>
            <input
              className="answerInput"
              id="descriptionInput"
              name="descriptionInput"
              placeholder="Value"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">Price</label>
            <input
              className="answerInput"
              id="priceInput"
              name="priceInput"
              placeholder="Value"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="fileInput">File</label>
            <input
              type="file"
              className="answerInput"
              id="fileInput"
              name="fileInput"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="startDateInput">Start Date</label>
              <input
                type="date"
                className="dateInput"
                id="startDateInput"
                name="startDateInput"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="startTimeInput">Start Time</label>
              <input
                type="time"
                className="dateInput"
                id="startTimeInput"
                name="startTimeInput"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="endDateInput">End Date</label>
              <input
                type="date"
                className="dateInput"
                id="endDateInput"
                name="endDateInput"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="date-input">
              <label className="answerLabel" htmlFor="endTimeInput">End Time</label>
              <input
                type="time"
                className="dateInput"
                id="endTimeInput"
                name="endTimeInput"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activePage, setActivePage] = useState({ page: "FAQs" });
  const [searchText, setSearchText] = useState("");
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promos from backend
  const fetchPromos = async () => {
    try {
      const response = await fetch("http://localhost/admin_dashboard_backend/fetch_promos.php");
      if (!response.ok) {
        throw new Error('Failed to fetch promos');
      }
      const data = await response.json();
      setPromos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Filter data based on search text
  const filteredData = promos.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()) ||
    item.price.toLowerCase().includes(searchText.toLowerCase()) ||
    new Date(item.start_date).toLocaleString().toLowerCase().includes(searchText.toLowerCase()) ||
    new Date(item.end_date).toLocaleString().toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {activePage.page === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Promos</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" style={{ width: "110px" }} onClick={() => setActivePage({ page: "ManageFAQAdd" })}>
                + Add Promo
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
          <FAQTable setActivePage={setActivePage} activePage={activePage} data={filteredData} fetchPromos={fetchPromos} />
        </div>
      ) : activePage.page === "ManageFAQEdit" ? (
        <ManageFAQEdit setActivePage={setActivePage} activePage={activePage} fetchPromos={fetchPromos} />
      ) : (
        <ManageFAQAdd setActivePage={setActivePage} activePage={activePage} fetchPromos={fetchPromos} />
      )}
    </>
  );
};

export default FAQs;