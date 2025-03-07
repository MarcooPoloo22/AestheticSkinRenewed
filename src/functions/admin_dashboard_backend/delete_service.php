<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Allow DELETE and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Respond to preflight request with 200 OK
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

    // Delete the service from the database using prepared statements
    $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Service deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting service: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Service ID not provided"]);
}

$conn->close();
?>