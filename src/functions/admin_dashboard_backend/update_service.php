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
$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];

// Handle file upload
$fileUrl = null;
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/'; // Directory to store uploaded files
    $uploadFile = $uploadDir . basename($_FILES['file']['name']);

    // Move the uploaded file to the uploads directory
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        $fileUrl = 'http://localhost/admin_dashboard_backend/' . $uploadFile;
    } else {
        echo json_encode(["error" => "Error uploading file"]);
        exit;
    }
}

// Update the service in the database using prepared statements
if ($fileUrl) {
    // If a new file is uploaded, update the file URL as well
    $stmt = $conn->prepare("UPDATE services SET name = ?, description = ?, price = ?, file_url = ? WHERE id = ?");
    $stmt->bind_param("ssdsi", $name, $description, $price, $fileUrl, $id);
} else {
    // If no new file is uploaded, update only the other fields
    $stmt = $conn->prepare("UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?");
    $stmt->bind_param("ssdi", $name, $description, $price, $id);
}

if ($stmt->execute()) {
    echo json_encode(["message" => "Service updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating service: " . $stmt->error]);
}
$stmt->close();

$conn->close();
?>