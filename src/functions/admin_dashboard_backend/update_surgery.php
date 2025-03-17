<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'admin_dashboard';
$username = 'root';
$password = '';

try {
    // Create database connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get form data
    $id = $_POST['id'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $start_date = $_POST['start_date'];
    $start_time = $_POST['start_time'];
    $end_date = $_POST['end_date'];
    $end_time = $_POST['end_time'];
    $price = $_POST['price'];
    $image = isset($_FILES['image']) ? $_FILES['image']['name'] : null;
    $image_tmp = isset($_FILES['image']) ? $_FILES['image']['tmp_name'] : null;

    if ($image) {
        // Move uploaded file to a directory
        $upload_dir = "uploads/";
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        move_uploaded_file($image_tmp, $upload_dir . $image);

        // Update with image
        $stmt = $conn->prepare("UPDATE surgery_appointments SET title = :title, description = :description, start_date = :start_date, start_time = :start_time, end_date = :end_date, end_time = :end_time, price = :price, image = :image WHERE id = :id");
        $stmt->execute([
            ':title' => $title,
            ':description' => $description,
            ':start_date' => $start_date,
            ':start_time' => $start_time,
            ':end_date' => $end_date,
            ':end_time' => $end_time,
            ':price' => $price,
            ':image' => $image,
            ':id' => $id,
        ]);
    } else {
        // Update without image
        $stmt = $conn->prepare("UPDATE surgery_appointments SET title = :title, description = :description, start_date = :start_date, start_time = :start_time, end_date = :end_date, end_time = :end_time, price = :price WHERE id = :id");
        $stmt->execute([
            ':title' => $title,
            ':description' => $description,
            ':start_date' => $start_date,
            ':start_time' => $start_time,
            ':end_date' => $end_date,
            ':end_time' => $end_time,
            ':price' => $price,
            ':id' => $id,
        ]);
    }

    echo json_encode(["message" => "Surgery appointment updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update appointment: " . $e->getMessage()]);
}
?>