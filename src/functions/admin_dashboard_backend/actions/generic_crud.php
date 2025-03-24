<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Configure session cookie parameters FIRST
session_set_cookie_params([
    'lifetime' => 86400, // 1 day
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,    // For local development
    'httponly' => true,
    'samesite' => 'Lax'   // Allows cross-origin GET requests
]);

// Start session BEFORE any output
session_start();

// Debug session data
error_log("Session Data at Start: " . print_r($_SESSION, true));

// Add CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Logger.php';

header('Content-Type: application/json');

// Enhanced session validation
$required_session_keys = ['user_id', 'first_name', 'role'];
foreach ($required_session_keys as $key) {
    if (!isset($_SESSION[$key])) {
        error_log("Missing session key: $key");
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized. Please login.']);
        exit;
    }
}

// Capture session data
$userId = $_SESSION['user_id'];
$userName = $_SESSION['first_name'];
$userRole = $_SESSION['role'];

error_log("Authenticated User: ID=$userId, Name=$userName, Role=$userRole");

try {
    // Log the raw input for debugging
    $rawInput = file_get_contents('php://input');
    error_log("Raw input: " . $rawInput);

    $data = json_decode($rawInput, true);
    
    if ($data === null) {
        throw new Exception("Invalid JSON input");
    }

    // Validate required parameters
    $required = ['action', 'table'];
    if ($data['action'] !== 'CREATE') {
        $required[] = 'record_id'; // record_id is required for UPDATE and DELETE
    }
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Start a transaction only if needed
    $pdo->beginTransaction();

    // Fetch old data for UPDATE/DELETE
    $oldData = null;
    if ($data['action'] === 'UPDATE' || $data['action'] === 'DELETE') {
        $stmt = $pdo->prepare("SELECT * FROM {$data['table']} WHERE id = ?");
        $stmt->execute([$data['record_id']]);
        $oldData = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Execute operation
    $newId = null;
    switch ($data['action']) {
        case 'CREATE':
            if (!isset($data['values'])) {
                throw new Exception("Missing required field: values");
            }
            // Convert arrays to JSON strings
            if (isset($data['values']['branch_ids'])) {
                $data['values']['branch_ids'] = json_encode($data['values']['branch_ids']);
            }
            if (isset($data['values']['staff_ids'])) {
                $data['values']['staff_ids'] = json_encode($data['values']['staff_ids']);
            }
            $columns = implode(', ', array_keys($data['values']));
            $placeholders = implode(', ', array_fill(0, count($data['values']), '?'));
            $stmt = $pdo->prepare("INSERT INTO {$data['table']} ($columns) VALUES ($placeholders)");
            $stmt->execute(array_values($data['values']));
            $newId = $pdo->lastInsertId();
            break;

        case 'UPDATE':
            if (!isset($data['values'])) {
                throw new Exception("Missing required field: values");
            }
            // Convert arrays to JSON strings
            if (isset($data['values']['branch_ids'])) {
                $data['values']['branch_ids'] = json_encode($data['values']['branch_ids']);
            }
            if (isset($data['values']['staff_ids'])) {
                $data['values']['staff_ids'] = json_encode($data['values']['staff_ids']);
            }
            $setClause = implode(', ', array_map(fn($col) => "$col = ?", array_keys($data['values'])));
            $stmt = $pdo->prepare("UPDATE {$data['table']} SET $setClause WHERE id = ?");
            $stmt->execute([...array_values($data['values']), $data['record_id']]);
            break;

        case 'DELETE':
            $stmt = $pdo->prepare("DELETE FROM {$data['table']} WHERE id = ?");
            $stmt->execute([$data['record_id']]);
            break;

        default:
            throw new Exception("Invalid action: {$data['action']}");
    }

    // Get new data for logging (only for CREATE/UPDATE)
    $newData = null;
    if ($data['action'] !== 'DELETE') {
        $stmt = $pdo->prepare("SELECT * FROM {$data['table']} WHERE id = ?");
        $stmt->execute([$data['record_id'] ?? $newId]);
        $newData = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Log the action with session user details
    Logger::log(
        $data['action'],
        $data['table'],
        $oldData,
        $newData,
        $userId,
        $userName,
        $userRole
    );

    // Commit the transaction
    $pdo->commit();

    // Return success response
    echo json_encode(['success' => true, 'newId' => $newId]);

} catch (Exception $e) {
    // Rollback only if a transaction is active
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // Return error response
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>