<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['id']) || empty($data['first_name']) || empty($data['last_name']) || empty($data['email']) || empty($data['role'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Hash password if provided
    if (!empty($data['password'])) {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
    } else {
        $data['password'] = null; // Ensure it's null if not provided
    }

    $sql = "UPDATE users SET 
            first_name = :first_name, 
            middle_initial = :middle_initial, 
            last_name = :last_name, 
            email = :email, 
            contact_no = :contact_no, 
            role = :role, 
            password = COALESCE(NULLIF(:password, ''), password) 
            WHERE id = :id";

    $stmt = $conn->prepare($sql);

    // Handle optional fields
    $middle_initial = !empty($data['middle_initial']) ? $data['middle_initial'] : null;
    $contact_no = !empty($data['contact_no']) ? $data['contact_no'] : null;

    $stmt->bindParam(':first_name', $data['first_name']);
    $stmt->bindParam(':middle_initial', $middle_initial);
    $stmt->bindParam(':last_name', $data['last_name']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':contact_no', $contact_no);
    $stmt->bindParam(':role', $data['role']);
    $stmt->bindParam(':password', $data['password']);
    $stmt->bindParam(':id', $data['id']);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(["message" => "User updated successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found or no changes made"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} finally {
    $conn = null;
}
?>