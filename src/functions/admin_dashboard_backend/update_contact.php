<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input data."]);
    exit();
}

$host = 'localhost';
$dbname = 'admin_dashboard';
$username = 'root';
$password = '';

$phone = $input['phone'];
$facebook = $input['facebook'];
$instagram = $input['instagram'];
$twitter = $input['twitter'];

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("UPDATE contact_info SET phone = :phone, facebook = :facebook, instagram = :instagram, twitter = :twitter");
    $stmt->execute([
        ':phone' => $phone,
        ':facebook' => $facebook,
        ':instagram' => $instagram,
        ':twitter' => $twitter,
    ]);

    echo json_encode(["message" => "Contact information updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update contact information: " . $e->getMessage()]);
}
?>