<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Match frontend origin
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
require_once 'audit_logger.php';

// Enable PHP error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/error.log'); // Adjust this path as needed

// Debug: log session contents
error_log("SESSION: " . print_r($_SESSION, true));

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$name = isset($data['name']) ? trim($data['name']) : '';

if ($id <= 0 || empty($name)) {
    echo json_encode(['status' => 'error', 'message' => 'Staff ID and name are required']);
    exit;
}

// Get old data before update
$getOld = $conn->prepare("SELECT * FROM staff WHERE id = ?");
$getOld->bind_param("i", $id);
$getOld->execute();
$oldStaff = $getOld->get_result()->fetch_assoc();
$getOld->close();

if (!$oldStaff) {
    echo json_encode(['status' => 'error', 'message' => 'Staff not found']);
    exit;
}

// Perform update
$stmt = $conn->prepare("UPDATE staff SET name = ? WHERE id = ?");
$stmt->bind_param("si", $name, $id);

if ($stmt->execute()) {
    // Get new data after update
    $getNew = $conn->prepare("SELECT * FROM staff WHERE id = ?");
    $getNew->bind_param("i", $id);
    $getNew->execute();
    $newStaff = $getNew->get_result()->fetch_assoc();
    $getNew->close();

    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'staff',
        $oldStaff,
        $newStaff,
        "Updated staff: " . $newStaff['name']
    );

    echo json_encode(['status' => 'success', 'message' => 'Staff updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update staff']);
}

$stmt->close();
$conn->close();
?>
