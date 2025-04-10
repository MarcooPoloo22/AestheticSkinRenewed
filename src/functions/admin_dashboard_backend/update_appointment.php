<?php
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

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
    echo json_encode( [
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ] );
    exit();
}

// Use $_POST since FormData is sent from React
if ( !isset( $_POST[ 'id' ] ) ) {
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Invalid input data.' ] );
    exit();
}

$id = intval( $_POST[ 'id' ] );
$user_id = isset( $_POST[ 'user_id' ] ) && $_POST[ 'user_id' ] !== '' ? intval( $_POST[ 'user_id' ] ) : null;
$first_name = isset( $_POST[ 'first_name' ] ) ? htmlspecialchars( $_POST[ 'first_name' ] ) : '';
$last_name = isset( $_POST[ 'last_name' ] ) ? htmlspecialchars( $_POST[ 'last_name' ] ) : '';
$email = isset( $_POST[ 'email' ] ) ? filter_var( $_POST[ 'email' ], FILTER_SANITIZE_EMAIL ) : '';
$contact_no = isset( $_POST[ 'contact_no' ] ) ? htmlspecialchars( $_POST[ 'contact_no' ] ) : '';
$service_type = isset( $_POST[ 'service_type' ] ) ? htmlspecialchars( $_POST[ 'service_type' ] ) : '';
$branch_id = isset( $_POST[ 'branch_id' ] ) ? intval( $_POST[ 'branch_id' ] ) : 0;
$staff_id = isset( $_POST[ 'staff_id' ] ) ? intval( $_POST[ 'staff_id' ] ) : 0;
$appointment_date = $_POST[ 'appointment_date' ] ?? '';
$appointment_time = $_POST[ 'appointment_time' ] ?? '';
$status = isset( $_POST[ 'status' ] ) ? htmlspecialchars( $_POST[ 'status' ] ) : 'pending';

$allowedStatus = [ 'pending', 'confirmed', 'cancelled' ];
if ( !in_array( $status, $allowedStatus ) ) {
    $status = 'pending';
}

// Build dynamic update query
$updateQuery = 'UPDATE bookings SET 
    first_name = :first_name,
    last_name = :last_name,
    email = :email,
    contact_no = :contact_no,
    service_type = :service_type,
    branch_id = :branch_id,
    staff_id = :staff_id,
    appointment_date = :appointment_date,
    appointment_time = :appointment_time,
    status = :status';

$params = [
    ':first_name' => $first_name,
    ':last_name' => $last_name,
    ':email' => $email,
    ':contact_no' => $contact_no,
    ':service_type' => $service_type,
    ':branch_id' => $branch_id,
    ':staff_id' => $staff_id,
    ':appointment_date' => $appointment_date,
    ':appointment_time' => $appointment_time,
    ':status' => $status,
    ':id' => $id
];

// Only update user_id if explicitly provided
if ( $user_id !== null ) {
    $updateQuery .= ', user_id = :user_id';
    $params[ ':user_id' ] = $user_id;
}

$updateQuery .= ' WHERE id = :id';

try {
    $stmt = $conn->prepare( $updateQuery );
    $stmt->execute( $params );
    echo json_encode( [ 'status' => 'success', 'message' => 'Appointment updated successfully!' ] );
} catch ( PDOException $e ) {
    http_response_code( 500 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Failed to update appointment: ' . $e->getMessage() ] );
}
?>