<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit();
}

require_once 'audit_logger.php';

$host     = 'localhost';
$dbname   = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}

if (!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit();
}

$id = intval($_POST['id']);

// Get old appointment data first for audit trail
try {
    $getOldStmt = $conn->prepare("SELECT * FROM bookings WHERE id = :id");
    $getOldStmt->execute([':id' => $id]);
    $oldAppointment = $getOldStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$oldAppointment) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Appointment not found.']);
        exit();
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch appointment: ' . $e->getMessage()]);
    exit();
}

// Process input data
$user_id          = isset($_POST['user_id']) && $_POST['user_id'] !== '' ? intval($_POST['user_id']) : null;
$first_name       = isset($_POST['first_name']) ? htmlspecialchars($_POST['first_name']) : '';
$last_name        = isset($_POST['last_name'])  ? htmlspecialchars($_POST['last_name'])  : '';
$email            = isset($_POST['email'])      ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
$contact_no       = isset($_POST['contact_no']) ? htmlspecialchars($_POST['contact_no']) : '';
$service_type     = isset($_POST['service_type']) ? htmlspecialchars($_POST['service_type']) : '';
$branch_id        = isset($_POST['branch_id'])  ? intval($_POST['branch_id']) : 0;
$staff_id         = isset($_POST['staff_id'])   ? intval($_POST['staff_id'])  : 0;
$appointment_date = $_POST['appointment_date']  ?? '';
$appointment_time = $_POST['appointment_time']  ?? '';
$status           = isset($_POST['status']) ? htmlspecialchars($_POST['status']) : 'pending';
$rating           = isset($_POST['rating']) && $_POST['rating'] !== '' ? intval($_POST['rating']) : null;

// Validate status
$allowedStatus = ['pending', 'confirmed', 'cancelled'];
if (!in_array($status, $allowedStatus)) {
    $status = 'pending';
}

// Check slot availability
$sqlCheck = "SELECT COUNT(*) AS total_bookings FROM bookings 
             WHERE appointment_date = :appointment_date 
             AND appointment_time = :appointment_time 
             AND status != 'cancelled'
             AND id != :id";
$checkStmt = $conn->prepare($sqlCheck);
$checkStmt->execute([
    ':appointment_date' => $appointment_date,
    ':appointment_time' => $appointment_time,
    ':id' => $id
]);
$checkResult = $checkStmt->fetch(PDO::FETCH_ASSOC);

if ($checkResult['total_bookings'] >= 2) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'The selected time slot is fully booked.']);
    exit();
}

// Handle file upload
$oldFileUrl = $oldAppointment['file_url'];
$newFileUrl = null;

if (isset($_FILES['receipt_file']) && $_FILES['receipt_file']['error'] === UPLOAD_ERR_OK) {
    if (!is_dir('uploads')) {
        mkdir('uploads', 0777, true);
    }
    $tempPath     = $_FILES['receipt_file']['tmp_name'];
    $originalName = basename($_FILES['receipt_file']['name']);
    $newFileName  = uniqid('receipt_') . '_' . $originalName;
    $destination  = 'uploads/' . $newFileName;
    
    if (move_uploaded_file($tempPath, $destination)) {
        $newFileUrl = 'http://localhost/admin_dashboard_backend/' . $destination;
        // Optionally delete old file if exists
        if ($oldFileUrl) {
            $oldFilePath = str_replace('http://localhost/admin_dashboard_backend/', '', $oldFileUrl);
            if (file_exists($oldFilePath)) {
                @unlink($oldFilePath);
            }
        }
    }
}

$file_url = $newFileUrl ? $newFileUrl : $oldFileUrl;

// Update appointment
$sql = "UPDATE bookings SET
        user_id          = :user_id,
        first_name       = :first_name,
        last_name        = :last_name,
        email            = :email,
        contact_no       = :contact_no,
        service_type     = :service_type,
        branch_id        = :branch_id,
        staff_id         = :staff_id,
        appointment_date = :appointment_date,
        appointment_time = :appointment_time,
        status           = :status,
        file_url         = :file_url,
        rating           = :rating
        WHERE id = :id";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([
        ':user_id'          => $user_id,
        ':first_name'       => $first_name,
        ':last_name'        => $last_name,
        ':email'            => $email,
        ':contact_no'       => $contact_no,
        ':service_type'     => $service_type,
        ':branch_id'        => $branch_id,
        ':staff_id'         => $staff_id,
        ':appointment_date' => $appointment_date,
        ':appointment_time' => $appointment_time,
        ':status'           => $status,
        ':file_url'         => $file_url,
        ':rating'           => $rating,
        ':id'               => $id
    ]);

    // Get updated appointment for audit trail
    $getNewStmt = $conn->prepare("SELECT * FROM bookings WHERE id = :id");
    $getNewStmt->execute([':id' => $id]);
    $newAppointment = $getNewStmt->fetch(PDO::FETCH_ASSOC);

    // Log audit trail
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'bookings',
        $oldAppointment,
        $newAppointment,
        "Updated appointment for " . $newAppointment['email']
    );

    echo json_encode(['status' => 'success', 'message' => 'Appointment updated successfully!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Failed to update appointment: ' . $e->getMessage()
    ]);
}
?>