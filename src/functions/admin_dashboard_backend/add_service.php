<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$file = $_FILES['file'];

// Handle file upload
$uploadDir = 'uploads/';
$filePath = $uploadDir . basename($file['name']);
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Insert into database using prepared statements
    $stmt = $conn->prepare("INSERT INTO services (name, description, price, file_url) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssds", $name, $description, $price, $filePath);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Service added successfully"]);
    } else {
        echo json_encode(["error" => "Error adding service: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "File upload failed"]);
}

$conn->close();
?>