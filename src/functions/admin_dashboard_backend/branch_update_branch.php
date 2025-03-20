<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Allow PUT requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Exit early for preflight requests
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admin_dashboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$name = isset($data['name']) ? trim($data['name']) : '';

if ($id <= 0 || empty($name)) {
    echo json_encode(['status' => 'error', 'message' => 'Branch id and name are required']);
    exit;
}

$stmt = $conn->prepare("UPDATE branches SET name = ? WHERE id = ?");
$stmt->bind_param("si", $name, $id);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Branch updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update branch']);
}
$stmt->close();
$conn->close();
?>