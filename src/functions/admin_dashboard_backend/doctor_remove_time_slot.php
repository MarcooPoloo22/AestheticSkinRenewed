<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: backend:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'audit_logger.php';
session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$doctorId = $data['doctor_id'] ?? null;
$timeSlot = $data['time_slot'] ?? null;

if (!$doctorId || !$timeSlot) {
    echo json_encode(['status' => 'error', 'message' => 'Doctor ID and time slot are required']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Connection failed: " . $conn->connect_error]));
}

// Get current slots
$stmt = $conn->prepare("SELECT available_slots FROM doctor_availability WHERE doctor_id = ?");
$stmt->bind_param("i", $doctorId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No availability found for this doctor']);
    exit;
}

$row = $result->fetch_assoc();
$currentSlots = json_decode($row['available_slots'], true) ?? [];
$updatedSlots = array_filter($currentSlots, function($slot) use ($timeSlot) {
    return $slot !== $timeSlot;
});

$updateStmt = $conn->prepare("UPDATE doctor_availability SET available_slots = ? WHERE doctor_id = ?");
$updatedSlotsJson = json_encode(array_values($updatedSlots));
$updateStmt->bind_param("si", $updatedSlotsJson, $doctorId);
$updateStmt->execute();
$updateStmt->close();
$stmt->close();

// Log the action
$user = $_SESSION['user'];
logAuditTrail(
    $conn,
    $user['id'],
    $user['first_name'],
    $user['role'],
    'UPDATE',
    'doctor_availability',
    null,
    ['doctor_id' => $doctorId, 'time_slot' => $timeSlot],
    "Removed time slot $timeSlot for doctor $doctorId"
);

echo json_encode(['status' => 'success', 'message' => 'Time slot removed successfully']);
$conn->close();
?>