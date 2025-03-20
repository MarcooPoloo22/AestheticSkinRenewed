<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Allow PUT requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Exit early for preflight requests
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

// Check if required fields are provided
if (isset($data['id']) && isset($data['question']) && isset($data['answer'])) {
    $id = $data['id'];
    $question = $data['question'];
    $answer = $data['answer'];

    // Update the FAQ in the database
    $sql = "UPDATE faqs SET question = '$question', answer = '$answer' WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "FAQ updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating FAQ: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Required fields not provided"]);
}

$conn->close();
?>