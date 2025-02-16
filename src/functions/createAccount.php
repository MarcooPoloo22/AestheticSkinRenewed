<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents('debug.log', print_r($data, true), FILE_APPEND);

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    file_put_contents('error.log', "Database connection failed: " . $e->getMessage(), FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = htmlspecialchars($data['first_name']);
    $middle_initial = htmlspecialchars($data['middle_initial']);
    $last_name = htmlspecialchars($data['last_name']);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $contact_no = htmlspecialchars($data['contact_no']);

    try {
        $stmt = $conn->prepare("
            INSERT INTO users (first_name, middle_initial, last_name, email, password, contact_no)
            VALUES (:first_name, :middle_initial, :last_name, :email, :password, :contact_no)
        ");
        $stmt->execute([
            ':first_name' => $first_name,
            ':middle_initial' => $middle_initial,
            ':last_name' => $last_name,
            ':email' => $email,
            ':password' => $password,
            ':contact_no' => $contact_no
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Account created successfully!']);
    } catch (PDOException $e) {
        file_put_contents('error.log', "Database error: " . $e->getMessage(), FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Failed to create account: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}