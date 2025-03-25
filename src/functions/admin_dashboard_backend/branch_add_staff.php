<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow necessary HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow required headers

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

// Get input data
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$branch_id = $data['branch_id'] ?? '';

if (empty($name) || empty($branch_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Staff name and branch id are required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO staff (name, branch_id) VALUES (?, ?)");
$stmt->bind_param("si", $name, $branch_id);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'id' => $stmt->insert_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add staff']);
}

$stmt->close();
$conn->close();
?>
