<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your frontend
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Allow DELETE and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers
header("Content-Type: application/json"); // Set response content type

// Handle preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Return 200 OK for preflight requests
    exit();
}

// Only allow DELETE requests for actual deletions
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

// Get the user ID from the query parameters
$userId = isset($_GET['id']) ? $_GET['id'] : null;

// Validate the user ID
if (empty($userId)) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "User ID is required"]);
    exit();
}

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

try {
    // Create a PDO connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the SQL query to delete the user
    $sql = "DELETE FROM users WHERE id = :id";
    $stmt = $conn->prepare($sql);

    // Bind the user ID parameter
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);

    // Execute the query
    $stmt->execute();

    // Check if any rows were affected
    if ($stmt->rowCount() > 0) {
        http_response_code(200); // Success
        echo json_encode(["message" => "User deleted successfully"]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "User not found"]);
    }
} catch (PDOException $e) {
    // Log the error for debugging
    error_log("Database error: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} finally {
    $conn = null; // Close the database connection
}
?>