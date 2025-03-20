<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow GET and preflight OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow required headers

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

// Get branch ID from query string
$branch_id = isset($_GET['branch_id']) ? intval($_GET['branch_id']) : 0;

if ($branch_id <= 0) {
    echo json_encode([]);
    exit;
}

// Prepare SQL statement
$sql = "SELECT staff.id, staff.name 
        FROM staff 
        WHERE staff.branch_id = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die(json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]));
}

$stmt->bind_param("i", $branch_id);
$stmt->execute();
$result = $stmt->get_result();
$staff = [];

while ($row = $result->fetch_assoc()) {
    $staff[] = $row;
}

echo json_encode($staff);

$stmt->close();
$conn->close();
?>