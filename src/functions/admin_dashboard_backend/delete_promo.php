<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = $data['id'];

    // Delete promo
    $sql = "DELETE FROM promos WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "Promo deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting promo: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Promo ID not provided"]);
}

$conn->close();
?>