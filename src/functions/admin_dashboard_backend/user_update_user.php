<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Allow PUT and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers
header("Content-Type: application/json"); // Set response content type

// Handle preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Return 200 OK for preflight requests
    exit();
}

// Only allow PUT requests for actual updates
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

// Get the raw input data from the request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate the input data
if (empty($data['id']) || empty($data['first_name']) || empty($data['last_name']) || empty($data['email']) || empty($data['role'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the SQL query to update the user
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

    // Bind the parameters
    $stmt->bindParam(':first_name', $data['first_name']);
    $stmt->bindParam(':middle_initial', $data['middle_initial']);
    $stmt->bindParam(':last_name', $data['last_name']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':contact_no', $data['contact_no']);
    $stmt->bindParam(':role', $data['role']);
    $stmt->bindParam(':password', $data['password']); // Only update password if provided
    $stmt->bindParam(':id', $data['id']);

    // Execute the query
    $stmt->execute();

    // Check if any rows were affected
    if ($stmt->rowCount() > 0) {
        http_response_code(200); // Success
        echo json_encode(["message" => "User updated successfully"]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "User not found or no changes made"]);
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} finally {
    $conn = null; // Close the database connection
}
?>