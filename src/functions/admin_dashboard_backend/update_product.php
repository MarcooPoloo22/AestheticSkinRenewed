<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

// Handle file upload (if a new file is provided)
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

// Get other form data
$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];

// Update the product in the database
if ($fileUrl) {
    $sql = "UPDATE products SET name = '$name', description = '$description', price = $price, file_url = '$fileUrl' WHERE id = $id";
} else {
    $sql = "UPDATE products SET name = '$name', description = '$description', price = $price WHERE id = $id";
}

if ($conn->query($sql)) {
    echo json_encode(["message" => "Product updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating product: " . $conn->error]);
}

$conn->close();
?>