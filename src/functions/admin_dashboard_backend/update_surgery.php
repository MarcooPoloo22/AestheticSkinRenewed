<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admin_dashboard";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

try {
    $data = $_POST;
    $file = $_FILES['image'] ?? null;

    if (!isset($data['id'], $data['title'], $data['description'], $data['price'], 
          $data['start_date'], $data['end_date'], $data['duration'], 
          $data['branch_ids'], $data['staff_ids'])) {
        throw new Exception("Invalid data received");
    }

    $id = intval($data['id']);
    $title = htmlspecialchars($data['title']);
    $description = htmlspecialchars($data['description']);
    $price = floatval($data['price']);
    $startDate = $data['start_date'];
    $endDate = $data['end_date'];
    $duration = intval($data['duration']);
    $branchIds = json_decode($data['branch_ids'], true);
    $staffIds = json_decode($data['staff_ids'], true);

    if (!is_array($branchIds)) throw new Exception("Invalid branch IDs format");
    if (!is_array($staffIds)) throw new Exception("Invalid staff IDs format");

    // Handle image upload
    $imageUrl = null;
    if ($file && $file['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/surgeries/';
        $fileName = uniqid() . '-' . basename($file['name']);
        $filePath = $uploadDir . $fileName;
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $imageUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;
        }
    }

    // Update surgery
    $sql = "UPDATE surgeries SET 
            title = ?, 
            description = ?, 
            price = ?, 
            " . ($imageUrl ? "image_url = ?, " : "") . "
            start_date = ?, 
            end_date = ?, 
            duration = ? 
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);

    if ($imageUrl) {
        $stmt->bind_param("ssdsssii", $title, $description, $price, $imageUrl, $startDate, $endDate, $duration, $id);
    } else {
        $stmt->bind_param("ssdssii", $title, $description, $price, $startDate, $endDate, $duration, $id);
    }

    if (!$stmt->execute()) {
        throw new Exception("Error updating surgery: " . $stmt->error);
    }

    // Update relationships
    $conn->query("DELETE FROM surgery_branches WHERE surgery_id = $id");
    $conn->query("DELETE FROM surgery_staff WHERE surgery_id = $id");

    $stmt = $conn->prepare("INSERT INTO surgery_branches (surgery_id, branch_id) VALUES (?, ?)");
    foreach ($branchIds as $branchId) {
        $branchId = intval($branchId);
        if ($branchId <= 0) throw new Exception("Invalid branch ID");
        $stmt->bind_param("ii", $id, $branchId);
        if (!$stmt->execute()) throw new Exception("Failed to insert branch: " . $stmt->error);
    }

    $stmt = $conn->prepare("INSERT INTO surgery_staff (surgery_id, staff_id) VALUES (?, ?)");
    foreach ($staffIds as $staffId) {
        $staffId = intval($staffId);
        if ($staffId <= 0) throw new Exception("Invalid staff ID");
        $stmt->bind_param("ii", $id, $staffId);
        if (!$stmt->execute()) throw new Exception("Failed to insert staff: " . $stmt->error);
    }

    echo json_encode(["message" => "Surgery updated successfully"]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>