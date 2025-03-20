<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admin_dashboard";

// Get the type parameter from the request
$type = isset($_GET['type']) ? $_GET['type'] : die(json_encode(array("error" => "Type parameter is required")));

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

// Determine the table name based on the type
switch ($type) {
    case 'Promo':
        $table = 'promos';
        break;
    case 'Service':
        $table = 'services';
        break;
    case 'Surgery':
        $table = 'surgeries';
        break;
    default:
        die(json_encode(array("error" => "Invalid type specified")));
}

// Query to fetch data from the appropriate table
$query = "SELECT * FROM $table";
$stmt = $conn->prepare($query);

if (!$stmt) {
    die(json_encode(array("error" => "Prepare failed: " . $conn->error)));
}

if (!$stmt->execute()) {
    die(json_encode(array("error" => "Execute failed: " . $stmt->error)));
}

$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);

$stmt->close();
$conn->close();
?>