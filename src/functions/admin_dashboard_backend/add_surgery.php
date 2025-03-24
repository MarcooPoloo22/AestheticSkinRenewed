<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Add this line

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = $_POST;
$file = $_FILES['image'] ?? null;

try {
    if (
        isset($data['title'], $data['description'], $data['price'], $data['start_date'], 
              $data['end_date'], $data['duration'], $data['branch_ids'], $data['staff_ids']) &&
        !empty($data['title']) &&
        !empty($data['description']) &&
        !empty($data['price']) &&
        !empty($data['start_date']) &&
        !empty($data['end_date']) &&
        !empty($data['duration']) &&
        !empty($data['branch_ids']) &&
        !empty($data['staff_ids'])
    ) {
        // Validate and sanitize input data
        $title = htmlspecialchars($data['title']);
        $description = htmlspecialchars($data['description']);
        $price = floatval($data['price']);
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];
        $duration = intval($data['duration']);
        $branchIds = json_decode($data['branch_ids'], true);
        $staffIds = json_decode($data['staff_ids'], true);

        // Validate JSON data
        if (!is_array($branchIds)) {
            throw new Exception("Invalid branch IDs format");
        }
        if (!is_array($staffIds)) {
            throw new Exception("Invalid staff IDs format");
        }

        // Handle image upload
        $imageUrl = null;
        if ($file && $file['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/surgeries/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $fileName = uniqid() . '-' . basename($file['name']);
            $filePath = $uploadDir . $fileName;
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                $imageUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;
            } else {
                throw new Exception("Failed to upload image");
            }
        }

        // Insert surgery
        $stmt = $conn->prepare("INSERT INTO surgeries (title, description, price, image_url, start_date, end_date, duration) VALUES (?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("ssdsssi", $title, $description, $price, $imageUrl, $startDate, $endDate, $duration);

        if (!$stmt->execute()) {
            throw new Exception("Error adding surgery: " . $stmt->error);
        }

        $surgeryId = $stmt->insert_id;
        $stmt->close();

        // Insert branches
        $stmt = $conn->prepare("INSERT INTO surgery_branches (surgery_id, branch_id) VALUES (?, ?)");
        foreach ($branchIds as $branchId) {
            $branchId = intval($branchId);
            if ($branchId <= 0) throw new Exception("Invalid branch ID");
            $stmt->bind_param("ii", $surgeryId, $branchId);
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert branch: " . $stmt->error);
            }
        }

        // Insert staff
        $stmt = $conn->prepare("INSERT INTO surgery_staff (surgery_id, staff_id) VALUES (?, ?)");
        foreach ($staffIds as $staffId) {
            $staffId = intval($staffId);
            if ($staffId <= 0) throw new Exception("Invalid staff ID");
            $stmt->bind_param("ii", $surgeryId, $staffId);
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert staff: " . $stmt->error);
            }
        }

        echo json_encode(["message" => "Surgery added successfully"]);
    } else {
        throw new Exception("Invalid or incomplete data received");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>