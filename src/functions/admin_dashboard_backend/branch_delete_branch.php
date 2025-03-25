<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$conn = new mysqli("localhost", "root", "", "asr");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the request body
$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit;
}

$id = isset($data['id']) ? intval($data['id']) : 0;
if ($id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Branch id is required']);
    exit;
}

// Prepare and execute the DELETE query
$stmt = $conn->prepare("DELETE FROM branches WHERE id = ?");
if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Branch deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No branch found with the specified ID']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete branch: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>