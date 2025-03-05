<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE"); // Allow DELETE requests
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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

// Check if ID is provided
if (isset($data['id'])) {
    $id = $data['id'];

    // Delete the product from the database
    $sql = "DELETE FROM products WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "Product deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting product: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Product ID not provided"]);
}

$conn->close();
?>