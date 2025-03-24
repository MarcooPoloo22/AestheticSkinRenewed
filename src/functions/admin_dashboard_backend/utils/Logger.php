<?php
require_once __DIR__ . '/../config/db.php';

class Logger {
    /**
     * Logs an action to the audit_logs table.
     */
    public static function log(
        $actionType,
        $tableName,
        $oldValue = null,
        $newValue = null,
        $userIdParam = null,
        $userNameParam = null,
        $userRoleParam = null
    ) {
        global $pdo;
    
        // Ensure session is started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    
        // Use parameters or fall back to session
        $userId = $userIdParam ?? $_SESSION['user_id'] ?? 0;
        $userName = $userNameParam ?? $_SESSION['first_name'] ?? 'System';
        $userRole = $userRoleParam ?? $_SESSION['role'] ?? 'System';
    
        // Log debugging info
        error_log("Audit Log Values:");
        error_log("User ID: $userId");
        error_log("User Name: $userName");
        error_log("User Role: $userRole");
    
        // Prepare values
        $oldValueJson = json_encode($oldValue);
        $newValueJson = json_encode($newValue);
    
        try {
            $stmt = $pdo->prepare("
                INSERT INTO audit_logs 
                    (user_id, user_name, user_role, action_type, table_name, old_value, new_value, timestamp)
                VALUES 
                    (:user_id, :user_name, :user_role, :action_type, :table_name, :old_value, :new_value, NOW())
            ");
    
            $stmt->execute([
                ':user_id' => $userId,
                ':user_name' => $userName,
                ':user_role' => $userRole,
                ':action_type' => $actionType,
                ':table_name' => $tableName,
                ':old_value' => $oldValueJson,
                ':new_value' => $newValueJson
            ]);
    
            error_log("✅ Audit log created successfully");
    
        } catch (PDOException $e) {
            error_log("❌ Audit log error: " . $e->getMessage());
            throw new Exception("Failed to log action: " . $e->getMessage());
        }
    }
}
?>