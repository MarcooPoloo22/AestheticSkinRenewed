import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import "../../../styles/admin/dashboard/faqs.css";
import Swal from 'sweetalert2';

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

const FAQTable = ({ setActivePage, activePage, data, setServices, setServiceToEdit }) => {
  const handleDelete = (id) => {
    console.log("Deleting service with ID:", id); // Debugging
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost/admin_dashboard_backend/delete_service.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("Delete response data:", data); // Debugging
            Swal.fire({
              title: 'Deleted!',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
            // Refresh services list
            fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
              .then(response => response.json())
              .then(data => {
                console.log("Updated services after delete:", data); // Debugging
                setServices(data);
              })
              .catch(error => console.error('Error fetching services:', error));
          })
          .catch(error => {
            console.error('Error deleting service:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete service. Please check the console for details.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          });
      }
    });
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
      name: 'Action',
      cell: row => (
        <div>
          <button onClick={() => { setServiceToEdit(row); setActivePage("ManageFAQEdit"); }} className="edit-button">
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

const ManageFAQEdit = ({ setActivePage, activePage, serviceToEdit, setServices }) => {
  const [name, setName] = useState(serviceToEdit.name);
  const [description, setDescription] = useState(serviceToEdit.description);
  const [price, setPrice] = useState(serviceToEdit.price);
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", serviceToEdit.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (file) {
      formData.append("file", file);
    }

    fetch('http://localhost/admin_dashboard_backend/update_service.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setActivePage("FAQs"); // Redirect back to Services page
        // Refresh services list
        fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
          .then(response => response.json())
          .then(data => {
            console.log("Updated services after edit:", data); // Debugging
            setServices(data);
          })
          .catch(error => console.error('Error fetching services:', error));
      })
      .catch(error => {
        console.error('Error updating service:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update service. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Service</p>
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
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const ManageFAQAdd = ({ setActivePage, activePage, setServices }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("file", file);

    fetch('http://localhost/admin_dashboard_backend/add_service.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setActivePage("FAQs"); // Redirect back to Services page
        // Refresh services list
        fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
          .then(response => response.json())
          .then(data => {
            console.log("Updated services after add:", data); // Debugging
            setServices(data);
          })
          .catch(error => console.error('Error fetching services:', error));
      })
      .catch(error => {
        console.error('Error adding service:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add service. Please check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("FAQs")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Service</p>
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
          <button type="submit" className="button-ManageFAQEdit">Save</button>
        </form>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activePage, setActivePage] = useState("FAQs");
  const [searchText, setSearchText] = useState("");
  const [services, setServices] = useState([]);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  // Fetch services from backend
  useEffect(() => {
    console.log("Fetching services..."); // Debugging
    fetch('http://localhost/admin_dashboard_backend/fetch_services.php')
      .then(response => {
        console.log("Fetch response:", response); // Debugging
        return response.json();
      })
      .then(data => {
        console.log("Fetched services:", data); // Debugging
        setServices(data);
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  // Filter data based on search text
  const filteredData = services.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()) ||
    item.price.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "FAQs" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Services</p>
            <div className="faq-header-actions">
              <button className="add-faq-button" style={{ width: "120px" }} onClick={() => setActivePage("ManageFAQAdd")}>
                + Add Service
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
          <FAQTable
            setActivePage={setActivePage}
            activePage={activePage}
            data={filteredData}
            setServices={setServices}
            setServiceToEdit={setServiceToEdit}
          />
        </div>
      ) : activePage === "ManageFAQEdit" ? (
        <ManageFAQEdit
          setActivePage={setActivePage}
          activePage={activePage}
          serviceToEdit={serviceToEdit}
          setServices={setServices}
        />
      ) : (
        <ManageFAQAdd
          setActivePage={setActivePage}
          activePage={activePage}
          setServices={setServices}
        />
      )}
    </>
  );
};

export default FAQs;