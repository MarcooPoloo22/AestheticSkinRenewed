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
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get form data from POST
$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$duration = $_POST['duration'] ?? '';

// Decode JSON arrays for branches and staff
$branch_ids = json_decode($_POST['branch_ids'] ?? '[]', true);
$staff_ids = json_decode($_POST['staff_ids'] ?? '[]', true);

// Validate required fields
$required = [
    'id' => $id,
    'name' => $name,
    'description' => $description,
    'price' => $price,
    'duration' => $duration,
    'branch_ids' => $branch_ids,
    'staff_ids' => $staff_ids
];

foreach ($required as $key => $value) {
    if (empty($value)) {
        echo json_encode(['status' => 'error', 'message' => "$key is required"]);
        exit;
    }
}

// Handle file upload if a new file is provided
$file_url = '';
if (!empty($_FILES['file']['name']) && $_FILES['file']['error'] == 0) {
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $target_file = $target_dir . basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $file_url = $target_file;
    }
}

// If no new file was uploaded, keep the existing file_url
if (empty($file_url)) {
    $stmt = $conn->prepare("SELECT file_url FROM services WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($existing_file_url);
    $stmt->fetch();
    $file_url = $existing_file_url;
    $stmt->close();
}

// Begin a transaction to ensure atomicity
$conn->begin_transaction();

try {
    // Update the services table
    $stmt = $conn->prepare("UPDATE services SET name = ?, description = ?, price = ?, file_url = ?, duration = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("ssdsii", $name, $description, $price, $file_url, $duration, $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update service: " . $stmt->error);
    }

    // Delete existing branch associations
    $stmt = $conn->prepare("DELETE FROM service_branches WHERE service_id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete branch associations: " . $stmt->error);
    }

    // Insert new branch associations
    foreach ($branch_ids as $branch_id) {
        $stmt = $conn->prepare("INSERT INTO service_branches (service_id, branch_id) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }
        $stmt->bind_param("ii", $id, $branch_id);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert branch association: " . $stmt->error);
        }
    }

    // Delete existing staff associations
    $stmt = $conn->prepare("DELETE FROM service_staff WHERE service_id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete staff associations: " . $stmt->error);
    }

    // Insert new staff associations
    foreach ($staff_ids as $staff_id) {
        $stmt = $conn->prepare("INSERT INTO service_staff (service_id, staff_id) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }
        $stmt->bind_param("ii", $id, $staff_id);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert staff association: " . $stmt->error);
        }
    }

    // Commit the transaction
    $conn->commit();
    echo json_encode(['status' => 'success', 'message' => 'Service updated successfully']);
} catch (Exception $e) {
    // Rollback the transaction on error
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$conn->close();
?>