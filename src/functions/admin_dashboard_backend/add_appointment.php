<?php
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: POST, OPTIONS' );

if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO( "mysql:host=$host;dbname=$dbname", $username, $password );
    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
} catch ( PDOException $e ) {
    http_response_code( 500 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Database connection failed.' ] );
    exit();
}

$input = file_get_contents( 'php://input' );
$data = json_decode( $input, true );

if ( !$data ) {
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Invalid input data.' ] );
    exit();
}

$name = htmlspecialchars( $data[ 'name' ] );
$email = filter_var( $data[ 'email' ], FILTER_SANITIZE_EMAIL );
$contact_no = htmlspecialchars( $data[ 'contactNumber' ] );
$branch = htmlspecialchars( $data[ 'branch' ] );
$service = htmlspecialchars( $data[ 'service' ] );
$preferredStaff = htmlspecialchars( $data[ 'preferredStaff' ] );
$dateAndTime = $data[ 'dateAndTime' ];
// expecting a datetime-local string

// Convert to separate date and time fields for the bookings table
$date = date( 'Y-m-d', strtotime( $dateAndTime ) );
$time = date( 'H:i:s', strtotime( $dateAndTime ) );

// Optional: Check if the time slot is already full ( for example, max 2 appointments per slot )
$stmt = $conn->prepare( "SELECT COUNT(*) as total_bookings FROM bookings WHERE appointment_date = :appointment_date AND appointment_time = :appointment_time AND status != 'cancelled'" );
$stmt->execute( [
    ':appointment_date' => $date,
    ':appointment_time' => $time
] );
$result = $stmt->fetch( PDO::FETCH_ASSOC );

if ( $result[ 'total_bookings' ] >= 2 ) {
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'The selected time slot is fully booked.' ] );
    exit();
}

// Insert the new appointment
$stmt = $conn->prepare( "INSERT INTO bookings (first_name, email, contact_no, service_type, appointment_date, appointment_time, status) VALUES (:first_name, :email, :contact_no, :service_type, :appointment_date, :appointment_time, 'pending')" );
try {
    $stmt->execute( [
        ':first_name' => $name,
        ':email' => $email,
        ':contact_no' => $contact_no,
        ':service_type' => $service,
        ':appointment_date' => $date,
        ':appointment_time' => $time
    ] );
    echo json_encode( [ 'status' => 'success', 'message' => 'Appointment booked successfully!' ] );
} catch ( PDOException $e ) {
    http_response_code( 500 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Failed to book appointment.' ] );
}
?>