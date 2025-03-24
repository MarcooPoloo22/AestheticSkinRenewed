<?php
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: DELETE, OPTIONS' );

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

if ( !$data || !isset( $data[ 'id' ] ) ) {
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Invalid input data.' ] );
    exit();
}

$id = intval( $data[ 'id' ] );

$stmt = $conn->prepare( 'DELETE FROM bookings WHERE id = :id' );
try {
    $stmt->execute( [ ':id' => $id ] );
    echo json_encode( [ 'status' => 'success', 'message' => 'Appointment deleted successfully!' ] );
} catch ( PDOException $e ) {
    http_response_code( 500 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Failed to delete appointment.' ] );
}
?>