<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Allow DELETE requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Exit early for preflight requests
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

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

    // Delete the FAQ from the database
    $sql = "DELETE FROM faqs WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "FAQ deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting FAQ: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "FAQ ID not provided"]);
}

$conn->close();
?>