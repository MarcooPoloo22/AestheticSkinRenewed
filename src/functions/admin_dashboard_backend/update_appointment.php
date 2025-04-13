<?php
session_start();

header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

if ( !isset( $_SESSION[ 'user' ] ) ) {
    http_response_code( 401 );
    echo json_encode( [ 'status' => 'error', 'message' => 'User is not logged in.' ] );
    exit();
}

require_once 'audit_logger.php';

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

$conn = mysqli_connect( $host, $username, $password, $dbname );
if ( mysqli_connect_errno() ) {
    http_response_code( 500 );
    echo json_encode( [
        'status'  => 'error',
        'message' => 'Database connection failed: ' . mysqli_connect_error()
    ] );
    exit();
}

if ( !isset( $_POST[ 'id' ] ) ) {
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Invalid input data.' ] );
    exit();
}

$id = intval( $_POST[ 'id' ] );

$getOldStmt = mysqli_prepare( $conn, 'SELECT * FROM bookings WHERE id = ?' );
mysqli_stmt_bind_param( $getOldStmt, 'i', $id );
mysqli_stmt_execute( $getOldStmt );
$result = mysqli_stmt_get_result( $getOldStmt );
$oldAppointment = mysqli_fetch_assoc( $result );

if ( !$oldAppointment ) {
    http_response_code( 404 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Appointment not found.' ] );
    exit();
}

$user_id          = isset( $_POST[ 'user_id' ] ) && $_POST[ 'user_id' ] !== '' ? intval( $_POST[ 'user_id' ] ) : null;
$first_name       = htmlspecialchars( $_POST[ 'first_name' ] ?? '' );
$last_name        = htmlspecialchars( $_POST[ 'last_name' ] ?? '' );
$email            = filter_var( $_POST[ 'email' ] ?? '', FILTER_SANITIZE_EMAIL );
$contact_no       = htmlspecialchars( $_POST[ 'contact_no' ] ?? '' );
$service_type     = htmlspecialchars( $_POST[ 'service_type' ] ?? '' );
$branch_id        = intval( $_POST[ 'branch_id' ] ?? 0 );
$staff_id         = intval( $_POST[ 'staff_id' ] ?? 0 );
$appointment_date = $_POST[ 'appointment_date' ] ?? '';
$appointment_time = $_POST[ 'appointment_time' ] ?? '';
$status           = in_array( $_POST[ 'status' ] ?? 'pending', [ 'pending', 'confirmed', 'cancelled' ] ) ? $_POST[ 'status' ] : 'pending';
$rating           = isset( $_POST[ 'rating' ] ) && $_POST[ 'rating' ] !== '' ? intval( $_POST[ 'rating' ] ) : null;

$checkStmt = mysqli_prepare( $conn, "SELECT COUNT(*) AS total_bookings FROM bookings WHERE appointment_date = ? AND appointment_time = ? AND status != 'cancelled' AND id != ?" );
mysqli_stmt_bind_param( $checkStmt, 'ssi', $appointment_date, $appointment_time, $id );
mysqli_stmt_execute( $checkStmt );
$checkResult = mysqli_fetch_assoc( mysqli_stmt_get_result( $checkStmt ) );

if ( $checkResult[ 'total_bookings' ] >= 2 ) {
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'The selected time slot is fully booked.' ] );
    exit();
}

$file_url = $oldAppointment[ 'file_url' ];

if ( isset( $_FILES[ 'receipt_file' ] ) && $_FILES[ 'receipt_file' ][ 'error' ] === UPLOAD_ERR_OK ) {
    if ( !is_dir( 'uploads' ) ) mkdir( 'uploads', 0777, true );
    $tempPath = $_FILES[ 'receipt_file' ][ 'tmp_name' ];
    $originalName = basename( $_FILES[ 'receipt_file' ][ 'name' ] );
    $newFileName = uniqid( 'receipt_' ) . '_' . $originalName;
    $destination = 'uploads/' . $newFileName;

    if ( move_uploaded_file( $tempPath, $destination ) ) {
        $file_url = 'http://localhost/admin_dashboard_backend/' . $destination;
        if ( $oldAppointment[ 'file_url' ] ) @unlink( str_replace( 'http://localhost/admin_dashboard_backend/', '', $oldAppointment[ 'file_url' ] ) );
    }
}

$sql = 'UPDATE bookings SET user_id=?, first_name=?, last_name=?, email=?, contact_no=?, service_type=?, branch_id=?, staff_id=?, appointment_date=?, appointment_time=?, status=?, file_url=?, rating=? WHERE id=?';
$stmt = mysqli_prepare( $conn, $sql );

mysqli_stmt_bind_param( $stmt, 'isssssiissssii', $user_id, $first_name, $last_name, $email, $contact_no, $service_type, $branch_id, $staff_id, $appointment_date, $appointment_time, $status, $file_url, $rating, $id );

if ( mysqli_stmt_execute( $stmt ) ) {
    $getNewStmt = mysqli_prepare( $conn, 'SELECT * FROM bookings WHERE id = ?' );
    mysqli_stmt_bind_param( $getNewStmt, 'i', $id );
    mysqli_stmt_execute( $getNewStmt );
    $newAppointment = mysqli_fetch_assoc( mysqli_stmt_get_result( $getNewStmt ) );

    $user = $_SESSION[ 'user' ];
    logAuditTrail( $conn, $user[ 'id' ], $user[ 'first_name' ], $user[ 'role' ], 'UPDATE', 'bookings', $oldAppointment, $newAppointment, 'Updated appointment for ' . $newAppointment[ 'email' ] );

    echo json_encode( [ 'status' => 'success', 'message' => 'Appointment updated successfully!' ] );
} else {
    http_response_code( 500 );
    echo json_encode( [
        'status'  => 'error',
        'message' => 'Failed to update appointment: ' . mysqli_error( $conn )
    ] );
}

mysqli_close( $conn );
?>