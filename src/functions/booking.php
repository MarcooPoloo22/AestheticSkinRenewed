<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1); // Enable error display for debugging
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\htdocs\error.log');

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['date']) && isset($_GET['staff_id'])) {
    $date = filter_input(INPUT_GET, 'date', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $staff_id = filter_input(INPUT_GET, 'staff_id', FILTER_SANITIZE_NUMBER_INT);

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid date format.']);
        exit();
    }

    try {
        $stmt = $conn->prepare("
            SELECT DATE_FORMAT(appointment_time, '%h:%i %p') as appointment_time
            FROM bookings
            WHERE appointment_date = :date
            AND staff_id = :staff_id
            AND status != 'cancelled'
        ");
        $stmt->execute([
            ':date' => $date,
            ':staff_id' => $staff_id,
        ]);
        $bookedSlots = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(['status' => 'success', 'booked_slots' => $bookedSlots]);
    } catch (PDOException $e) {
        error_log('Database Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch booked slots.']);
    }
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = isset($data['user_id']) ? $data['user_id'] : null;
    $first_name = htmlspecialchars($data['first_name']);
    $last_name = htmlspecialchars($data['last_name']);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $contact_no = htmlspecialchars($data['contact_no']);
    $service_type = htmlspecialchars($data['service_type']);
    $branch_id = htmlspecialchars($data['branch_id']);
    $staff_id = htmlspecialchars($data['staff_id']);
    $appointment_date = $data['appointment_date'];
    $appointment_time = $data['appointment_time'];

    // Validate input
    if (!$first_name || !$last_name || !$email || !$contact_no || !$service_type || !$branch_id || !$staff_id || !$appointment_date || !$appointment_time) {
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
            AND staff_id = :staff_id
            AND status != 'cancelled'
        ");
        $stmt->execute([
            ':appointment_date' => $appointment_date,
            ':appointment_time' => $appointment_time,
            ':staff_id' => $staff_id,
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['total_bookings'] >= 1) { // Adjust based on staff capacity
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
            INSERT INTO bookings (user_id, first_name, last_name, email, contact_no, service_type, branch_id, staff_id, appointment_date, appointment_time, status)
            VALUES (:user_id, :first_name, :last_name, :email, :contact_no, :service_type, :branch_id, :staff_id, :appointment_date, :appointment_time, 'pending')
        ");
        $stmt->execute([
            ':user_id' => $user_id,
            ':first_name' => $first_name,
            ':last_name' => $last_name,
            ':email' => $email,
            ':contact_no' => $contact_no,
            ':service_type' => $service_type,
            ':branch_id' => $branch_id,
            ':staff_id' => $staff_id,
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