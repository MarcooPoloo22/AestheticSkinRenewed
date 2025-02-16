<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents('login_debug.log', print_r($data, true), FILE_APPEND);

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';
$port = '3306'; 

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    file_put_contents('login_error.log', "Database connection failed: " . $e->getMessage(), FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];

    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            if (password_verify($password, $user['password'])) {
                echo json_encode(['status' => 'success', 'message' => 'Login successful!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        }
    } catch (PDOException $e) {
        file_put_contents('login_error.log', "Database error: " . $e->getMessage(), FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Failed to login: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}