<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS"); // Allow these request methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow necessary headers
header('Content-Type: application/json');

// Handle preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$conn = new mysqli("localhost", "root", "", "admin_dashboard");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Branch id is required']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM branches WHERE id = ?");
$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Branch deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete branch']);
}

$stmt->close();
$conn->close();
?>
