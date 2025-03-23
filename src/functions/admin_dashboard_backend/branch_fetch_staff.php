<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000"); // Explicitly allow requests from the frontend
header("Access-Control-Allow-Credentials: true"); // Allow credentials (cookies)
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

try {
    // Get branch IDs from the query parameter
    if (!isset($_GET['branch_ids'])) {
        http_response_code(400);
        throw new Exception('Branch IDs are required');
    }

    $branchIds = explode(",", $_GET['branch_ids']);
    
    // Validate and sanitize branch IDs
    $branchIds = array_filter(array_map('intval', $branchIds));
    if (empty($branchIds)) {
        http_response_code(400);
        throw new Exception('Invalid branch IDs');
    }

    // Prepare and execute query
    $branchIdsString = implode(",", $branchIds);
    $sql = "SELECT staff.id, staff.name, branches.name AS branch_name 
            FROM staff 
            JOIN branches ON staff.branch_id = branches.id 
            WHERE staff.branch_id IN ($branchIdsString)";
    $result = $conn->query($sql);

    if (!$result) {
        http_response_code(500);
        throw new Exception('Query failed: ' . $conn->error);
    }

    $staff = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $staff[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'branch_name' => $row['branch_name']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $staff
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>