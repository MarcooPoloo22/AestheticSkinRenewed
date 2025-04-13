<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host     = 'localhost';
$dbname   = 'asr';
$username = 'root';
$password = '';

// Connect using MySQLi
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Gather POST data
$user_id          = isset($_POST['user_id']) && $_POST['user_id'] !== '' ? intval($_POST['user_id']) : null;
$first_name       = $_POST['first_name']       ?? null;
$last_name        = $_POST['last_name']        ?? null;
$email            = $_POST['email']            ?? null;
$contact_no       = $_POST['contact_no']       ?? null;
$service_type     = $_POST['service_type']     ?? null;
$branch_id        = isset($_POST['branch_id']) ? intval($_POST['branch_id']) : null;
$staff_id         = isset($_POST['staff_id'])  ? intval($_POST['staff_id'])  : null;
$appointment_date = $_POST['appointment_date'] ?? null;
$appointment_time = $_POST['appointment_time'] ?? null;

// rating
$rating = isset($_POST['rating']) && $_POST['rating'] !== '' ? intval($_POST['rating']) : null;

// Basic validation
if (
    !$first_name || !$last_name || !$email || !$contact_no ||
    !$service_type || !$branch_id || !$staff_id ||
    !$appointment_date || !$appointment_time
) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit();
}

// ---------------------
// 1) Check slot availability
// Max 2 appointments for the same date/time unless they are cancelled
// ---------------------
$sqlCheck = "
  SELECT COUNT(*) AS total_bookings
  FROM bookings
  WHERE appointment_date = ?
    AND appointment_time = ?
    AND status != 'cancelled'
";
$checkStmt = $conn->prepare($sqlCheck);
if (!$checkStmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare slot check statement: ' . $conn->error]);
    exit();
}
$checkStmt->bind_param('ss', $appointment_date, $appointment_time);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$row = $checkResult->fetch_assoc();
$existingCount = $row['total_bookings'] ?? 0;

if ($existingCount >= 2) {
    http_response_code(400);
    echo json_encode(['error' => 'The selected time slot is fully booked.']);
    exit();
}

// ---------------------
// 2) Handle the uploaded file, if any
// ---------------------
$newFileUrl = null;
if (
    isset($_FILES['receipt_file']) &&
    $_FILES['receipt_file']['error'] === UPLOAD_ERR_OK
) {
    // Ensure uploads folder exists
    if (!is_dir('uploads')) {
        mkdir('uploads', 0777, true);
    }

    $tempPath     = $_FILES['receipt_file']['tmp_name'];
    $originalName = basename($_FILES['receipt_file']['name']);

    // e.g. "receipt_63f90..._originalFileName.jpg"
    $newFileName = uniqid('receipt_') . '_' . $originalName;
    $destination = 'uploads/' . $newFileName;

    if (move_uploaded_file($tempPath, $destination)) {
        // e.g. "http://localhost/admin_dashboard_backend/uploads/receipt_..."
        $newFileUrl = 'http://localhost/admin_dashboard_backend/' . $destination;
    }
}

// 3) Prepare final $file_url
$file_url = $newFileUrl; // can be null if no file was uploaded

// ---------------------
// 4) Insert with rating + file_url
// We'll let "status" default to 'pending'
// ---------------------
$sqlInsert = "
  INSERT INTO bookings (
    user_id,
    first_name,
    last_name,
    email,
    contact_no,
    service_type,
    branch_id,
    staff_id,
    appointment_date,
    appointment_time,
    status,
    file_url,
    rating
  ) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
";

$insertStmt = $conn->prepare($sqlInsert);
if (!$insertStmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare insert statement: ' . $conn->error]);
    exit();
}

// Binding the parameters
$insertStmt->bind_param(
    'isssssiisssi',
    $user_id,
    $first_name,
    $last_name,
    $email,
    $contact_no,
    $service_type,
    $branch_id,
    $staff_id,
    $appointment_date,
    $appointment_time,
    $file_url,
    $rating
);

if ($insertStmt->execute()) {
    echo json_encode(['message' => 'Appointment added successfully.']);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Failed to add appointment.']);
}

$insertStmt->close();
$conn->close();