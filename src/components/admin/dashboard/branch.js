import { useState, useEffect } from "react";
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

// DataTable for displaying branches
const BranchTable = ({ setActivePage, branches, fetchBranches }) => {
  const handleDeleteBranch = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this branch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_delete_branch.php",
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete branch");
        }

        const resData = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchBranches();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete branch. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error deleting branch:", error);
      }
    }
  };

  const columns = [
    {
      name: "Branch Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() =>
              setActivePage({ page: "ManageBranchEdit", branch: row })
            }
            className="edit-button"
          >
            <FaRegEdit />
          </button>
          <button
            onClick={() => handleDeleteBranch(row.id)}
            className="delete-button"
          >
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
      data={branches}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

// New StaffTable component renders staff in a DataTable
const StaffTable = ({ staff, handleEditStaff, handleDeleteStaff }) => {
  const columns = [
    {
      name: "Staff Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button onClick={() => handleEditStaff(row)} className="edit-button">
            <FaRegEdit />
          </button>
          <button
            onClick={() => handleDeleteStaff(row.id)}
            className="delete-button"
          >
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
      data={staff}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
    />
  );
};

const ManageBranchEdit = ({ setActivePage, branch, fetchBranches }) => {
  const [branchName, setBranchName] = useState(branch.name);
  const [staff, setStaff] = useState([]);

  // Fetch staff for the selected branch
  const fetchStaff = async () => {
    try {
      const response = await fetch(
        `http://localhost/admin_dashboard_backend/branch_fetch_staff.php?branch_ids=${branch.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch staff");
      }
      const resData = await response.json();
      if (resData.success) {
        setStaff(resData.data);
      } else {
        throw new Error(resData.message);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Update branch name
  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branch_update_branch.php",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: branch.id, name: branchName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update branch");
      }
      const resData = await response.json();
      Swal.fire({
        title: "Success!",
        text: resData.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchBranches();
      setActivePage({ page: "Branches" });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update branch. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating branch:", error);
    }
  };

  // Add new staff via SweetAlert
  const handleAddStaff = async () => {
    const { value: staffName } = await Swal.fire({
      title: "Add New Staff",
      input: "text",
      inputLabel: "Staff Name",
      inputPlaceholder: "Enter staff name",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to write something!";
      },
    });
    if (staffName) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_add_staff.php",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: staffName, branch_id: branch.id }),
          }
        );
        const resData = await response.json();
        if (resData.status === "success") {
          setStaff([...staff, { id: resData.id, name: staffName }]);
          Swal.fire("Success!", "Staff added successfully!", "success");
        } else {
          Swal.fire("Error", resData.message || "Failed to add staff", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to add staff", "error");
        console.error("Error adding staff:", error);
      }
    }
  };

  // Delete a staff member
  const handleDeleteStaff = async (staffId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this staff!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_delete_staff.php",
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: staffId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete staff");
        }
        const resData = await response.json();
        Swal.fire({
          title: "Deleted!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setStaff(staff.filter((member) => member.id !== staffId));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete staff. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error deleting staff:", error);
      }
    }
  };

  // Edit staff member's name via SweetAlert
  const handleEditStaff = async (staffMember) => {
    const { value: newStaffName } = await Swal.fire({
      title: "Edit Staff Name",
      input: "text",
      inputLabel: "Staff Name",
      inputPlaceholder: "Enter new staff name",
      inputValue: staffMember.name,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to write something!";
      },
    });
    if (newStaffName && newStaffName !== staffMember.name) {
      try {
        const response = await fetch(
          "http://localhost/admin_dashboard_backend/branch_update_staff.php",
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: staffMember.id, name: newStaffName }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update staff");
        }
        const resData = await response.json();
        Swal.fire({
          title: "Success!",
          text: resData.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setStaff(
          staff.map((member) =>
            member.id === staffMember.id ? { ...member, name: newStaffName } : member
          )
        );
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update staff. Please check the console for details.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error updating staff:", error);
      }
    }
  };

  return (
    <div className="faq-main-container">
      <button
        onClick={() => setActivePage({ page: "Branches" })}
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Edit Branch</p>
        </div>
        <form className="faq-edit" onSubmit={handleUpdateBranch}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="branchNameInput">
              Branch Name
            </label>
            <input
              className="questionInput"
              id="branchNameInput"
              name="branchNameInput"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">
            Save Branch
          </button>
        </form>
        <div className="form-group">
          <label className="questionLabel">Staff Available:</label>
          {/* Use the StaffTable to render staff in a DataTable */}
          <StaffTable
            staff={staff}
            handleEditStaff={handleEditStaff}
            handleDeleteStaff={handleDeleteStaff}
          />
          <div className="edit-branch-button-center">
            <button onClick={handleAddStaff} className="button-ManageFAQEdit">
                Add Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageBranchAdd = ({ setActivePage, fetchBranches }) => {
  const [branchName, setBranchName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName) return;
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branch_add_branch.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: branchName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add branch");
      }
      const resData = await response.json();
      Swal.fire({
        title: "Success!",
        text: resData.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      fetchBranches();
      setActivePage({ page: "Branches" });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add branch. Please check the console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error adding branch:", error);
    }
  };

  return (
    <div className="faq-main-container">
      <button
        onClick={() => setActivePage({ page: "Branches" })}
        className="faq-edit-backbutton"
      >
        <IoArrowBackOutline />
      </button>
      <div className="faq-edit">
        <div className="align-left">
          <p className="faq-text">Add Branch</p>
        </div>
        <form className="faq-edit" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="questionLabel" htmlFor="branchNameInput">
              Branch Name
            </label>
            <input
              className="questionInput"
              id="branchNameInput"
              name="branchNameInput"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-ManageFAQEdit">
            Save Branch
          </button>
        </form>
      </div>
    </div>
  );
};

const Branch = () => {
  const [activePage, setActivePage] = useState({ page: "Branches" });
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        "http://localhost/admin_dashboard_backend/branching_fetch_branches.php"
      );
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to fetch branches");
      }
      setBranches(resData.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {activePage.page === "Branches" ? (
        <div className="faq-main-container">
          <div className="faq-header">
            <p className="faq-text">Branches</p>
            <div className="faq-header-actions">
              <button
                className="add-faq-button"
                style={{ width: "110px" }}
                onClick={() => setActivePage({ page: "ManageBranchAdd" })}
              >
                + Add Branch
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
          <BranchTable
            setActivePage={setActivePage}
            branches={filteredBranches}
            fetchBranches={fetchBranches}
          />
        </div>
      ) : activePage.page === "ManageBranchEdit" ? (
        <ManageBranchEdit
          setActivePage={setActivePage}
          branch={activePage.branch}
          fetchBranches={fetchBranches}
        />
      ) : (
        <ManageBranchAdd
          setActivePage={setActivePage}
          fetchBranches={fetchBranches}
        />
      )}
    </>
  );
};

export default Branch;
