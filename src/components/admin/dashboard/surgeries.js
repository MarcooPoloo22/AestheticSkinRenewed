import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "../../../styles/admin/dashboard/faqs.css";

// Icons
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const customStyles = {
  pagination: {
    style: {
      justifyContent: "center",
    },
  },
};

const SurgeryTable = ({ setActivePage, activePage, data, setAppointments, setAppointmentToEdit }) => {
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this appointment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost/admin_dashboard_backend/delete_surgery.php", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire({
              title: "Deleted!",
              text: data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
            // Refresh appointments list
            fetch("http://localhost/admin_dashboard_backend/fetch_surgeries.php")
              .then((response) => response.json())
              .then((data) => setAppointments(data))
              .catch((error) => console.error("Error fetching appointments:", error));
          })
          .catch((error) => {
            console.error("Error deleting appointment:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete appointment. Please check the console for details.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  // Define columns
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Start Date & Time",
      selector: (row) => new Date(row.start_date).toLocaleString(),
      sortable: true,
    },
    {
      name: "End Date & Time",
      selector: (row) => new Date(row.end_date).toLocaleString(),
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "File",
      cell: (row) => (
        <a href={row.image} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() => {
              setAppointmentToEdit(row);
              setActivePage("ManageSurgeryEdit");
            }}
            className="edit-button"
          >
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

const ManageSurgeryEdit = ({ setActivePage, activePage, appointmentToEdit, setAppointments }) => {
  const [title, setTitle] = useState(appointmentToEdit.title);
  const [description, setDescription] = useState(appointmentToEdit.description);
  const [startDate, setStartDate] = useState(appointmentToEdit.start_date);
  const [startTime, setStartTime] = useState(appointmentToEdit.start_time);
  const [endDate, setEndDate] = useState(appointmentToEdit.end_date);
  const [endTime, setEndTime] = useState(appointmentToEdit.end_time);
  const [price, setPrice] = useState(appointmentToEdit.price);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", appointmentToEdit.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("start_time", startTime);
    formData.append("end_date", endDate);
    formData.append("end_time", endTime);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }

    fetch("http://localhost/admin_dashboard_backend/update_surgery.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setActivePage("SurgeryAppointments"); // Redirect back to appointments page
        // Refresh appointments list
        fetch("http://localhost/admin_dashboard_backend/fetch_surgeries.php")
          .then((response) => response.json())
          .then((data) => setAppointments(data))
          .catch((error) => console.error("Error fetching appointments:", error));
      })
      .catch((error) => {
        console.error("Error updating appointment:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update appointment. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("SurgeryAppointments")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Surgery Appointment</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="titleInput">
              Title
            </label>
            <input
              className="questionInput"
              id="titleInput"
              name="titleInput"
              placeholder="Value"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">
              Description
            </label>
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
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="startDateInput">
                Start Date
              </label>
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
              <label className="answerLabel" htmlFor="startTimeInput">
                Start Time
              </label>
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
              <label className="answerLabel" htmlFor="endDateInput">
                End Date
              </label>
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
              <label className="answerLabel" htmlFor="endTimeInput">
                End Time
              </label>
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
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">
              Price
            </label>
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
            <label className="answerLabel" htmlFor="imageInput">
              Image
            </label>
            <input
              type="file"
              className="answerInput"
              id="imageInput"
              name="imageInput"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageSurgeryAdd = ({ setActivePage, activePage, setAppointments }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("start_time", startTime);
    formData.append("end_date", endDate);
    formData.append("end_time", endTime);
    formData.append("price", price);
    formData.append("image", image);

    fetch("http://localhost/admin_dashboard_backend/add_surgery.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setActivePage("SurgeryAppointments"); // Redirect back to appointments page
        // Refresh appointments list
        fetch("http://localhost/admin_dashboard_backend/fetch_surgeries.php")
          .then((response) => response.json())
          .then((data) => setAppointments(data))
          .catch((error) => console.error("Error fetching appointments:", error));
      })
      .catch((error) => {
        console.error("Error adding appointment:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add appointment. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div className="faq-main-container">
      <button onClick={() => setActivePage("SurgeryAppointments")} className="faq-edit-backbutton">
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Surgery Appointment</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="titleInput">
              Title
            </label>
            <input
              className="questionInput"
              id="titleInput"
              name="titleInput"
              placeholder="Value"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="answerLabel" htmlFor="descriptionInput">
              Description
            </label>
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
          <div className="date-row">
            <div className="date-input">
              <label className="answerLabel" htmlFor="startDateInput">
                Start Date
              </label>
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
              <label className="answerLabel" htmlFor="startTimeInput">
                Start Time
              </label>
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
              <label className="answerLabel" htmlFor="endDateInput">
                End Date
              </label>
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
              <label className="answerLabel" htmlFor="endTimeInput">
                End Time
              </label>
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
          <div className="form-group">
            <label className="answerLabel" htmlFor="priceInput">
              Price
            </label>
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
            <label className="answerLabel" htmlFor="imageInput">
              Image
            </label>
            <input
              type="file"
              className="answerInput"
              id="imageInput"
              name="imageInput"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const SurgeryAppointments = () => {
  const [activePage, setActivePage] = useState("SurgeryAppointments");
  const [searchText, setSearchText] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  // Fetch appointments from backend
  useEffect(() => {
    fetch("http://localhost/admin_dashboard_backend/fetch_surgeries.php")
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  // Filter data based on search text
  const filteredData = appointments.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.price.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {activePage === "SurgeryAppointments" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Surgery Appointments</p>
            <div className="faq-header-actions">
              <button
                className="add-faq-button"
                style={{ width: "163px" }}
                onClick={() => setActivePage("ManageSurgeryAdd")}
              >
                + Add Appointment
              </button>
              <div className="search-container">
                <CiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="faq-search-bar"
                />
              </div>
            </div>
          </div>
          <SurgeryTable
            setActivePage={setActivePage}
            activePage={activePage}
            data={filteredData}
            setAppointments={setAppointments}
            setAppointmentToEdit={setAppointmentToEdit}
          />
        </div>
      ) : activePage === "ManageSurgeryEdit" ? (
        <ManageSurgeryEdit
          setActivePage={setActivePage}
          activePage={activePage}
          appointmentToEdit={appointmentToEdit}
          setAppointments={setAppointments}
        />
      ) : (
        <ManageSurgeryAdd
          setActivePage={setActivePage}
          activePage={activePage}
          setAppointments={setAppointments}
        />
      )}
    </>
  );
};

export default SurgeryAppointments;