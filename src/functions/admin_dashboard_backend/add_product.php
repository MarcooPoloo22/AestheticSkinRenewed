<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST requests
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

// Handle file upload
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/'; // Directory to store uploaded files
    $uploadFile = $uploadDir . basename($_FILES['file']['name']);

    // Move the uploaded file to the uploads directory
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        // File uploaded successfully, now insert data into the database
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        $fileUrl = 'http://localhost/admin_dashboard_backend/' . $uploadFile;

        // Insert into database
        $sql = "INSERT INTO products (name, description, price, file_url) VALUES ('$name', '$description', $price, '$fileUrl')";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Product added successfully"]);
        } else {
            echo json_encode(["error" => "Error adding product: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Error uploading file"]);
    }
} else {
    echo json_encode(["error" => "File upload error: " . $_FILES['file']['error']]);
}

$conn->close();
?>