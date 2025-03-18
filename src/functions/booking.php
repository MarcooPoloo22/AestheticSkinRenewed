<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\htdocs\error.log');

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit();
}

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log('Database Connection Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = isset($data['user_id']) ? $data['user_id'] : null; // NULL for guest customers
    $first_name = htmlspecialchars($data['first_name']);
    $last_name = htmlspecialchars($data['last_name']);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $contact_no = htmlspecialchars($data['contact_no']);
    $service_type = htmlspecialchars($data['service_type']);
    $appointment_date = $data['appointment_date'];
    $appointment_time = $data['appointment_time'];

    // Validate input
    if (!$first_name || !$last_name || !$email || !$contact_no || !$service_type || !$appointment_date || !$appointment_time) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit();
    }

    // Check staff availability
    try {
        $stmt = $conn->prepare("
            SELECT COUNT(*) as total_bookings
            FROM bookings
            WHERE appointment_date = :appointment_date
            AND appointment_time = :appointment_time
            AND status != 'cancelled'
        ");
        $stmt->execute([
            ':appointment_date' => $appointment_date,
            ':appointment_time' => $appointment_time,
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['total_bookings'] >= 2) { // Adjust based on staff capacity
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'The selected time slot is fully booked.']);
            exit();
        }
    } catch (PDOException $e) {
        error_log('Database Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to check staff availability.']);
        exit();
    }

    // Insert the booking
    try {
        $stmt = $conn->prepare("
            INSERT INTO bookings (user_id, first_name, last_name, email, contact_no, service_type, appointment_date, appointment_time, status)
            VALUES (:user_id, :first_name, :last_name, :email, :contact_no, :service_type, :appointment_date, :appointment_time, 'pending')
        ");
        $stmt->execute([
            ':user_id' => $user_id,
            ':first_name' => $first_name,
            ':last_name' => $last_name,
            ':email' => $email,
            ':contact_no' => $contact_no,
            ':service_type' => $service_type,
            ':appointment_date' => $appointment_date,
            ':appointment_time' => $appointment_time,
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Appointment booked successfully!']);
    } catch (PDOException $e) {
        error_log('Database Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to book appointment.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}