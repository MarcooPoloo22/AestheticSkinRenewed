<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
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

// Get form data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['name']) && isset($data['description']) && isset($data['price']) && isset($data['file_url']) && isset($data['start_date']) && isset($data['end_date'])) {
    $id = $data['id'];
    $name = $data['name'];
    $description = $data['description'];
    $price = $data['price'];
    $fileUrl = $data['file_url'];
    $startDate = $data['start_date'];
    $endDate = $data['end_date'];

    // Update promo
    $sql = "UPDATE promos SET name = '$name', description = '$description', price = '$price', file_url = '$fileUrl', start_date = '$startDate', end_date = '$endDate' WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "Promo updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating promo: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid data received"]);
}

$conn->close();
?>