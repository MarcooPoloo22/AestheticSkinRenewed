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
    isset($data['name']) &&
    isset($data['description']) &&
    isset($data['price']) &&
    isset($data['start_date']) &&
    isset($data['end_date']) &&
    isset($data['duration']) &&
    isset($data['branch_ids']) &&
    isset($data['staff_ids'])
) {
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

    // Insert promo into database
    $sql = "INSERT INTO promos (name, description, price, file_url, start_date, end_date, duration) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdsssi", $name, $description, $price, $fileUrl, $startDate, $endDate, $duration);

    if ($stmt->execute()) {
        $promoId = $stmt->insert_id;

        // Insert into promo_branches table
        foreach ($branchIds as $branchId) {
            $sql = "INSERT INTO promo_branches (promo_id, branch_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $promoId, $branchId);
            $stmt->execute();
        }

        // Insert into promo_staff table
        foreach ($staffIds as $staffId) {
            $sql = "INSERT INTO promo_staff (promo_id, staff_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $promoId, $staffId);
            $stmt->execute();
        }

        echo json_encode(["message" => "Promo added successfully", "promo_id" => $promoId]);
    } else {
        echo json_encode(["error" => "Error adding promo: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid data received"]);
}

$conn->close();
?>