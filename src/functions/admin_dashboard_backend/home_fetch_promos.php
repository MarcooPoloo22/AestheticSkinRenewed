<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

try {
    // Query to get active promos
    $sql = "SELECT 
                id, 
                name, 
                description, 
                file_url, 
                price, 
                duration,
                start_date,
                end_date
            FROM promos
            ORDER BY created_at DESC";
    
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query error: " . $conn->error);
    }

    $promos = [];
    while($row = $result->fetch_assoc()) {
        $promos[] = [
            'id' => $row['id'],
            'title' => $row['name'],
            'description' => $row['description'],
            'image' => $row['file_url'],
            'price' => $row['price'],
            'duration' => $row['duration'],
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date']
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $promos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>