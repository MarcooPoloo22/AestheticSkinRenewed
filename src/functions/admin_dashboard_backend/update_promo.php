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
$data = $_POST; // Use $_POST for form data
$file = $_FILES['file'] ?? null; // Use $_FILES for file uploads

if (
    isset($data['id']) &&
    isset($data['name']) &&
    isset($data['description']) &&
    isset($data['price']) &&
    isset($data['start_date']) &&
    isset($data['end_date']) &&
    isset($data['duration']) &&
    isset($data['branch_ids']) &&
    isset($data['staff_ids'])
) {
    $id = $data['id'];
    $name = $data['name'];
    $description = $data['description'];
    $price = $data['price'];
    $startDate = $data['start_date'];
    $endDate = $data['end_date'];
    $duration = $data['duration'];
    $branchIds = json_decode($data['branch_ids'], true); // Array of branch IDs
    $staffIds = json_decode($data['staff_ids'], true); // Array of staff IDs

    // Handle file upload
    $fileUrl = null;
    if ($file && $file['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/'; // Ensure this directory exists and is writable
        $fileName = uniqid() . '-' . basename($file['name']);
        $filePath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $fileUrl = 'http://localhost/admin_dashboard_backend/' . $filePath; // Adjust the URL as needed
        } else {
            echo json_encode(["error" => "Failed to upload file"]);
            exit;
        }
    }

    // Update promo in database
    $sql = "UPDATE promos SET 
            name = ?, 
            description = ?, 
            price = ?, 
            file_url = COALESCE(?, file_url), 
            start_date = ?, 
            end_date = ?, 
            duration = ? 
            WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdsssii", $name, $description, $price, $fileUrl, $startDate, $endDate, $duration, $id);

    if ($stmt->execute()) {
        // Delete existing branch and staff associations
        $sql = "DELETE FROM promo_branches WHERE promo_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $sql = "DELETE FROM promo_staff WHERE promo_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        // Insert new branch associations
        foreach ($branchIds as $branchId) {
            $sql = "INSERT INTO promo_branches (promo_id, branch_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $id, $branchId);
            $stmt->execute();
        }

        // Insert new staff associations
        foreach ($staffIds as $staffId) {
            $sql = "INSERT INTO promo_staff (promo_id, staff_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $id, $staffId);
            $stmt->execute();
        }

        echo json_encode(["message" => "Promo updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating promo: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid data received"]);
}

$conn->close();
?>