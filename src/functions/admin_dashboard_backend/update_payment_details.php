<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

// Get the input data
$data = json_decode(file_get_contents('php://input'), true);

try {
    // Validate input
    $requiredFields = [
        'gcash_number', 'gcash_name', 'gcash_amount',
        'paymaya_number', 'paymaya_name', 'paymaya_amount',
        'bank_name', 'bank_account_number', 'bank_account_name', 'bank_amount'
    ];
    
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Prepare and execute the update query
    $stmt = $conn->prepare("
        UPDATE payment_details SET
            gcash_number = ?,
            gcash_name = ?,
            gcash_amount = ?,
            paymaya_number = ?,
            paymaya_name = ?,
            paymaya_amount = ?,
            bank_name = ?,
            bank_account_number = ?,
            bank_account_name = ?,
            bank_amount = ?
        WHERE id = (SELECT id FROM (SELECT id FROM payment_details ORDER BY id DESC LIMIT 1) as temp)
    ");

    $stmt->bind_param(
        "ssssssssss",
        $data['gcash_number'],
        $data['gcash_name'],
        $data['gcash_amount'],
        $data['paymaya_number'],
        $data['paymaya_name'],
        $data['paymaya_amount'],
        $data['bank_name'],
        $data['bank_account_number'],
        $data['bank_account_name'],
        $data['bank_amount']
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update payment details: " . $stmt->error);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Payment details updated successfully'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>