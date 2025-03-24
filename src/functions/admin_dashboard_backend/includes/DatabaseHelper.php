<?php
// File: DatabaseHelper.php

class DatabaseHelper {
    private $conn;

    // Constructor to initialize the database connection
    public function __construct($host, $username, $password, $database) {
        // Enable error reporting
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        // Create connection
        $this->conn = new mysqli($host, $username, $password, $database);

        // Check connection
        if ($this->conn->connect_error) {
            error_log("Database connection failed: " . $this->conn->connect_error);
            throw new Exception("Database connection failed: " . $this->conn->connect_error);
        }
    }

    // Log an audit entry
    public function logAudit($userId, $action, $tableName, $recordId, $oldValue = null, $newValue = null) {
        try {
            error_log("Attempting to log audit entry:");
            error_log("User ID: $userId, Action: $action, Table: $tableName, Record ID: $recordId");
    
            // Validate action type
            $allowedActions = ['CREATE', 'UPDATE', 'DELETE'];
            if (!in_array(strtoupper($action), $allowedActions)) {
                throw new Exception("Invalid action type: $action");
            }
    
            // Check user exists
            $userCheck = $this->conn->prepare("SELECT id FROM users WHERE id = ?");
            if (!$userCheck) throw new Exception("Prepare failed: " . $this->conn->error);
            
            $userCheck->bind_param("i", $userId);
            if (!$userCheck->execute()) throw new Exception("Execute failed: " . $userCheck->error);
            
            $userCheck->store_result();
            if ($userCheck->num_rows === 0) {
                throw new Exception("User $userId does not exist");
            }
            $userCheck->close();
    
            // Prepare insert statement
            $stmt = $this->conn->prepare("INSERT INTO audit_log 
                (user_id, action, table_name, record_id, old_value, new_value)
                VALUES (?, ?, ?, ?, ?, ?)");
    
            if (!$stmt) throw new Exception("Prepare failed: " . $this->conn->error);
    
            // Convert values to JSON
            $oldValueJson = $oldValue ? json_encode($oldValue, JSON_UNESCAPED_UNICODE) : null;
            $newValueJson = $newValue ? json_encode($newValue, JSON_UNESCAPED_UNICODE) : null;
    
            $stmt->bind_param("ississ", 
                $userId,
                $action,
                $tableName,
                $recordId,
                $oldValueJson,
                $newValueJson
            );
    
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error . 
                    " | Error code: " . $stmt->errno);
            }
    
            error_log("Audit log inserted successfully. Last insert ID: " . $stmt->insert_id);
            return true;
    
        } catch (Exception $e) {
            error_log("Audit log error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            throw $e;
        }
    }

    // Add these new methods for total count
    public function getTotalAuditLogs($search = '') {
        try {
            $query = "SELECT COUNT(*) AS total 
                     FROM audit_log al
                     JOIN users u ON al.user_id = u.id";
            
            if (!empty($search)) {
                $query .= " WHERE 
                    al.action LIKE ? OR 
                    al.table_name LIKE ? OR 
                    u.email LIKE ? OR 
                    al.old_value LIKE ? OR 
                    al.new_value LIKE ?";
            }
            
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }
            
            if (!empty($search)) {
                $searchTerm = "%$search%";
                $stmt->bind_param("sssss", 
                    $searchTerm,
                    $searchTerm,
                    $searchTerm,
                    $searchTerm,
                    $searchTerm
                );
            }
            
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }
            
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            return $row['total'];
            
        } catch (Exception $e) {
            error_log("Error in getTotalAuditLogs: " . $e->getMessage());
            throw $e;
        }
    }

    // Fetch audit logs with pagination and search
    public function getAuditLogs($page = 1, $limit = 10, $search = '') {
        try {
            $offset = ($page - 1) * $limit;
            $query = "SELECT al.*, u.email 
                     FROM audit_log al
                     JOIN users u ON al.user_id = u.id";
            
            if (!empty($search)) {
                $query .= " WHERE 
                    al.action LIKE ? OR 
                    al.table_name LIKE ? OR 
                    u.email LIKE ? OR 
                    al.old_value LIKE ? OR 
                    al.new_value LIKE ?";
            }
            
            $query .= " ORDER BY al.created_at DESC LIMIT ? OFFSET ?";
            
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }
            
            if (!empty($search)) {
                $searchTerm = "%$search%";
                $stmt->bind_param("sssssii", 
                    $searchTerm,
                    $searchTerm,
                    $searchTerm,
                    $searchTerm,
                    $searchTerm,
                    $limit,
                    $offset
                );
            } else {
                $stmt->bind_param("ii", $limit, $offset);
            }
            
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }
            
            $result = $stmt->get_result();
            return $result->fetch_all(MYSQLI_ASSOC);
            
        } catch (Exception $e) {
            error_log("Error in getAuditLogs: " . $e->getMessage());
            throw $e;
        }
    }

    // Close the database connection
    public function close() {
        $this->conn->close();
    }
}
?>