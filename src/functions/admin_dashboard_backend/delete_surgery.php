<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Add this line

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = $data['id'];
    $conn->query("DELETE FROM surgery_branches WHERE surgery_id = $id");
    $conn->query("DELETE FROM surgery_staff WHERE surgery_id = $id");
    $conn->query("DELETE FROM surgeries WHERE id = $id");
    echo json_encode(["message" => "Surgery deleted successfully"]);
} else {
    echo json_encode(["error" => "Surgery ID not provided"]);
}
$conn->close();
?>