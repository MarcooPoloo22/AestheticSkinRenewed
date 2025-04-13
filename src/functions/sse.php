<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "asr";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    echo "event: error\n";
    echo "data: " . json_encode([
        'error' => 'Database connection failed',
        'message' => $conn->connect_error
    ]) . "\n\n";
    ob_flush();
    flush();
    exit;
}

try {
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;
    $lastEventId = isset($_GET['lastEventId']) ? intval($_GET['lastEventId']) : 0;

    if ($userId <= 0) {
        http_response_code(400);
        exit;
    }

    while (true) {
        $stmt = $conn->prepare("
            SELECT 
                id,
                first_name,
                last_name,
                service_type,
                appointment_date,
                appointment_time,
                status,
                created_at
            FROM bookings 
            WHERE user_id = ? 
            AND status = 'cancelled'
            AND id > ?
            ORDER BY id DESC
            LIMIT 1
        ");

        $stmt->bind_param("ii", $userId, $lastEventId);
        $stmt->execute();
        $result = $stmt->get_result();
        $booking = $result->fetch_assoc();

        if ($booking) {
            $eventData = [
                'id' => $booking['id'],
                'message' => "Booking Cancelled: {$booking['service_type']}",
                'details' => [
                    'date' => date('F j, Y', strtotime($booking['appointment_date'])),
                    'time' => date('g:i A', strtotime($booking['appointment_time']))
                ]
            ];

            echo "id: {$booking['id']}\n";
            echo "event: booking-update\n";
            echo "data: " . json_encode($eventData) . "\n\n";
            $lastEventId = $booking['id'];
        }

        ob_flush();
        flush();

        if (connection_aborted()) break;
        sleep(5);
    }

} catch (Exception $e) {
    echo "event: error\n";
    echo "data: " . json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]) . "\n\n";
    ob_flush();
    flush();
} finally {
    $conn->close();
}