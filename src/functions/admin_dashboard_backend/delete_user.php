<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    die(json_encode(["error" => "Invalid input: User ID is required"]));
}

$id = $data['id'];

// Prepare and execute the query
$sql = "DELETE FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    die(json_encode(["error" => "Failed to prepare statement: " . $conn->error]));
}

$stmt->bind_param("i", $id); // Bind the ID parameter
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["message" => "User deleted successfully"]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>