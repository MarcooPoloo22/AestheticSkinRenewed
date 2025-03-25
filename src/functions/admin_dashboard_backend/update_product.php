<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get input data
$id = $conn->real_escape_string($_POST['id']);
$name = $conn->real_escape_string($_POST['name']);
$description = $conn->real_escape_string($_POST['description']);
$price = $conn->real_escape_string($_POST['price']);

// Retrieve user_id from session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "User not authenticated"]);
    exit;
}
$user_id = $_SESSION['user_id'];

try {
    // Get old data
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $oldData = $stmt->get_result()->fetch_assoc();
    
    if (!$oldData) {
        throw new Exception("Product not found");
    }

    // Handle file upload
    $fileUrl = $oldData['file_url'];
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $uploadFile = $uploadDir . basename($_FILES['file']['name']);
        if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
            $fileUrl = 'http://localhost/admin_dashboard_backend/' . $uploadFile;
        } else {
            throw new Exception("Failed to upload file");
        }
    }

    // Update product with user_id
    $stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, file_url=?, user_id=? WHERE id=?");
    $stmt->bind_param("ssdsii", $name, $description, $price, $fileUrl, $user_id, $id);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    // Log to audit
    $newData = json_encode([
        'name' => $name,
        'description' => $description,
        'price' => $price,
        'file_url' => $fileUrl
    ]);
    $oldDataJson = json_encode($oldData); // Store JSON-encoded old data in a variable
    
    $logStmt = $conn->prepare("INSERT INTO audit_logs (user_id, user_name, user_role, action_type, table_name, new_value, old_value) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)");
    $actionType = "UPDATE";
    $tableName = "products";
    $logStmt->bind_param("issssss", 
        $_SESSION['user_id'],
        $_SESSION['first_name'],
        $_SESSION['role'],
        $actionType,
        $tableName,
        $newData,
        $oldDataJson // Pass the variable instead of the function result
    );
    if (!$logStmt->execute()) {
        throw new Exception($logStmt->error);
    }

    echo json_encode(["message" => "Product updated successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>