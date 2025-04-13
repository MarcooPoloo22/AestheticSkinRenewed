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

// Use $_POST since FormData is sent from React
if (!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit();
}

$id               = intval($_POST['id']);
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

// rating
$rating = isset($_POST['rating']) && $_POST['rating'] !== '' ? intval($_POST['rating']) : null;

// Allowed status values are only 'pending', 'confirmed', and 'cancelled'
$allowedStatus = ['pending', 'confirmed', 'cancelled'];
if (!in_array($status, $allowedStatus)) {
    $status = 'pending';
}

// ----- SLOT AVAILABILITY CHECK -----
$sqlCheck = "
  SELECT COUNT(*) AS total_bookings 
  FROM bookings 
  WHERE appointment_date = :appointment_date 
    AND appointment_time = :appointment_time 
    AND status != 'cancelled'
    AND id != :id
";
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

// ----- FILE HANDLING -----
// 1) Fetch current file_url from DB in case no new file is uploaded
$oldFileUrl = null;
try {
    $q = $conn->prepare('SELECT file_url FROM bookings WHERE id = :id LIMIT 1');
    $q->execute([':id' => $id]);
    $oldFileUrl = $q->fetchColumn();
} catch (PDOException $e) {
    // If we can't fetch, just continue with null
}

// 2) Check if we have a new upload for receipt_file
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
    }
}

// 3) Decide which file_url to save
$file_url = $newFileUrl ? $newFileUrl : $oldFileUrl;

$sql = "
  UPDATE bookings
     SET user_id          = :user_id,
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
   WHERE id = :id
";

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

    echo json_encode(['status' => 'success', 'message' => 'Appointment updated successfully!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Failed to update appointment: ' . $e->getMessage()
    ]);
}