<?php
header("Access-Control-Allow-Credentials: true");

function logAuditTrail($conn, $user_id, $user_name, $user_role, $action_type, $table_name, $old_value = null, $new_value = null, $description = '') {
    // Filter sensitive fields
    $sensitive_fields = ['password', 'credit_card', 'token'];
    
    if (is_array($old_value)) {
        foreach ($sensitive_fields as $field) {
            if (isset($old_value[$field])) {
                $old_value[$field] = '***REDACTED***';
            }
        }
    }
    
    if (is_array($new_value)) {
        foreach ($sensitive_fields as $field) {
            if (isset($new_value[$field])) {
                $new_value[$field] = '***REDACTED***';
            }
        }
    }

    // Convert values to JSON
    $old_json = $old_value ? json_encode($old_value) : null;
    $new_json = $new_value ? json_encode($new_value) : null;
    
    // Get additional context
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Determine connection type (PDO or MySQLi)
    if ($conn instanceof PDO) {
        // PDO version
        $sql = "INSERT INTO audit_logs (
            user_id, user_name, user_role, action_type, 
            table_name, old_value, new_value, description,
            timestamp
        ) VALUES (
            :user_id, :user_name, :user_role, :action_type,
            :table_name, :old_value, :new_value, :description,
            NOW()
        )";
        
        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':user_id' => $user_id,
                ':user_name' => $user_name,
                ':user_role' => $user_role,
                ':action_type' => $action_type,
                ':table_name' => $table_name,
                ':old_value' => $old_json,
                ':new_value' => $new_json,
                ':description' => $description
            ]);
        } catch (PDOException $e) {
            error_log("Audit trail error (PDO): " . $e->getMessage());
        }
    } else {
        // MySQLi version
        $sql = "INSERT INTO audit_logs (
            user_id, user_name, user_role, action_type, 
            table_name, old_value, new_value, description,
            ip_address, user_agent, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param(
                "isssssssss", 
                $user_id,
                $user_name,
                $user_role,
                $action_type,
                $table_name,
                $old_json,
                $new_json,
                $description
            );
            
            if (!$stmt->execute()) {
                error_log("Audit trail error (MySQLi): " . $stmt->error);
            }
            $stmt->close();
        } else {
            error_log("Audit trail prepare failed (MySQLi): " . $conn->error);
        }
    }
}
?>