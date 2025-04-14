<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$branchId = isset($_GET['branchId']) ? $_GET['branchId'] : die(json_encode(array("error" => "Branch ID parameter is required")));

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

$query = "SELECT * FROM staff WHERE branch_id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    die(json_encode(array("error" => "Prepare failed: " . $conn->error)));
}

$stmt->bind_param("i", $branchId);

if (!$stmt->execute()) {
    die(json_encode(array("error" => "Execute failed: " . $stmt->error)));
}

$result = $stmt->get_result();
$staff = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($staff);

$stmt->close();
$conn->close();
?>