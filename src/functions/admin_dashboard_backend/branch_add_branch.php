<?php
header("Access-Control-Allow-Origin: *"); // Allows requests from any origin (use specific origin in production)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allows GET, POST, and OPTIONS requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allows required headers
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


$data = json_decode(file_get_contents('php://input'), true);
$name = isset($data['name']) ? trim($data['name']) : '';

if (empty($name)) {
    echo json_encode(['status' => 'error', 'message' => 'Branch name is required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO branches (name) VALUES (?)");
$stmt->bind_param("s", $name);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'id' => $stmt->insert_id, 'message' => 'Branch added successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add branch']);
}

$stmt->close();
$conn->close();
?>
