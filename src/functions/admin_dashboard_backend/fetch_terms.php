<?php
header("Access-Control-Allow-Origin: backend:3000");
header("Content-Type: application/json; charset=UTF-8");
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

try {
    $stmt = $conn->prepare("SELECT terms_condition FROM site_policies LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode(["content" => $data['terms_condition']]);
    } else {
        echo json_encode(["content" => "Terms and conditions not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

$conn->close();
?>