import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { CiSearch } from "react-icons/ci";
import "../../../styles/admin/dashboard/faqs.css";

const customStyles = {
  pagination: {
    style: {
      justifyContent: 'center',
    },
  },
  cells: {
    style: {
      padding: '8px',
    },
  },
};

// Mapping of database column names to user-friendly labels
const fieldMapping = {
  id: "ID",
  name: "Name",
  description: "Description",
  price: "Price",
  image_url: "Image",
  start_date: "Start Date",
  end_date: "End Date",
  duration: "Duration",
  created_at: "Created At",
  updated_at: "Updated At",
  branch_ids: "Branches",
  staff_ids: "Staff",
  // Removed file_url (Image URL)
};

// Helper function to compute differences between two objects
const getDifferences = (oldObj, newObj) => {
  oldObj = oldObj || {};
  newObj = newObj || {};
  const differences = {};
  const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  keys.forEach(key => {
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      differences[key] = true;
    }
  });
  return differences;
};

const FAQTable = ({ data, loading, totalRows, currentPage, perPage, handlePageChange }) => {
  const columns = [
    {
      name: 'Timestamp',
      selector: row => new Date(row.timestamp).toLocaleString(),
      sortable: true,
      width: '170px'
    },
    {
      name: 'User',
      selector: row => row.user_name,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Role',
      selector: row => row.user_role,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Action',
      selector: row => row.action_type,
      cell: row => (
        <span style={{
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor:
            row.action_type === 'CREATE' ? '#4CAF50' :
            row.action_type === 'UPDATE' ? '#2196F3' :
            '#F44336'
        }}>
          {row.action_type}
        </span>
      ),
      width: '100px'
    },
    {
      name: 'Table',
      selector: row => row.table_name,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Changes',
      cell: row => {
        let oldData = {};
        let newData = {};
        try {
          oldData = row.old_value ? JSON.parse(row.old_value) || {} : {};
        } catch (error) {
          oldData = {};
        }
        try {
          newData = row.new_value ? JSON.parse(row.new_value) || {} : {};
        } catch (error) {
          newData = {};
        }

        // Compute the differences
        const diffs = getDifferences(oldData, newData);

        // Filter out "updated_at", "created_at", and "file_url" fields
        const changedFields = Object.keys(diffs).filter(
          field => field !== 'updated_at' && field !== 'created_at' && field !== 'file_url'
        );

        // Map database field names to user-friendly labels
        const friendlyNames = changedFields.map(field => fieldMapping[field] || field);

        return (
          <div className="changes-container">
            {friendlyNames.length > 0 ? (
              <span>Changed: {friendlyNames.join(', ')}</span>
            ) : (
              <span>No changes detected.</span>
            )}
          </div>
        );
      },
      width: '300px',
      wrap: true
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      paginationPerPage={perPage}
      paginationDefaultPage={currentPage}
      onChangePage={handlePageChange}
      progressPending={loading}
      highlightOnHover
      responsive
      customStyles={customStyles}
      noDataComponent={<div style={{ padding: '24px' }}>There are no records to display</div>}
    />
  );
};

const FAQs = () => {
  const [searchText, setSearchText] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [error, setError] = useState(null);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost/admin_dashboard_backend/api/audit_logs_get.php?page=${currentPage}&perPage=${perPage}&search=${encodeURIComponent(searchText)}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch logs');
      
      const result = await response.json();
      setLogs(result.data || []);
      setTotalRows(result.total || 0);
      
    } catch (error) {
      setError(error.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(fetchAuditLogs, 300);
    return () => clearTimeout(delaySearch);
  }, [currentPage, searchText]);

  const handlePageChange = page => setCurrentPage(page);

  return (
    <div className="faq-main-container">
      <div className="faq-header">
        <h1 className="faq-text">Audit Logs</h1>
        <div className="faq-header-actions">
          <div className="search-container">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="faq-search-bar"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error: {error} - <button onClick={fetchAuditLogs}>Retry</button>
        </div>
      )}

      <FAQTable 
        data={logs}
        loading={loading}
        totalRows={totalRows}
        currentPage={currentPage}
        perPage={perPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default FAQs;
