<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow the Content-Type header
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

// Log the received data
error_log("Received data: " . print_r($data, true));

if (isset($data['question']) && isset($data['answer'])) {
    $question = $data['question'];
    $answer = $data['answer'];

    // Log the question and answer
    error_log("Question: " . $question);
    error_log("Answer: " . $answer);

    // Insert into database
    $sql = "INSERT INTO faqs (question, answer) VALUES ('$question', '$answer')";

    if ($conn->query($sql)) {
        echo json_encode(["message" => "FAQ added successfully"]);
    } else {
        echo json_encode(["error" => "Error adding FAQ: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid data received"]);
}

$conn->close();
?>