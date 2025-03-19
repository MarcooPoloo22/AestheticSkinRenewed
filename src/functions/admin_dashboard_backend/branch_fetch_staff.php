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

// Get branch IDs from query string
$branch_ids = isset($_GET['branch_ids']) ? explode(",", $_GET['branch_ids']) : [];

if (empty($branch_ids)) {
    echo json_encode([]);
    exit;
}

// Prepare placeholders for SQL query
$placeholders = implode(",", array_fill(0, count($branch_ids), "?"));

// Prepare SQL statement
$sql = "SELECT staff.id, staff.name, branches.name AS branch_name 
        FROM staff 
        JOIN branches ON staff.branch_id = branches.id 
        WHERE staff.branch_id IN ($placeholders)";

$stmt = $conn->prepare($sql);

// Bind parameters dynamically
$stmt->bind_param(str_repeat("i", count($branch_ids)), ...$branch_ids);

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
