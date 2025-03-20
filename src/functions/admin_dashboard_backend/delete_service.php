<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Allow DELETE and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Respond to preflight request with 200 OK
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admin_dashboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get the request body
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(['status' => 'error', 'message' => 'Service id is required']);
    exit;
}

// Begin a transaction to ensure atomicity
$conn->begin_transaction();

try {
    // Delete from service_branches
    $stmt = $conn->prepare("DELETE FROM service_branches WHERE service_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from service_branches: " . $stmt->error);
    }

    // Delete from service_staff
    $stmt = $conn->prepare("DELETE FROM service_staff WHERE service_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from service_staff: " . $stmt->error);
    }

    // Delete from services
    $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from services: " . $stmt->error);
    }

    // Commit the transaction
    $conn->commit();
    echo json_encode(['status' => 'success', 'message' => 'Service deleted successfully']);
} catch (Exception $e) {
    // Rollback the transaction on error
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$conn->close();
?>