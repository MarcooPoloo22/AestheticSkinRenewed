<?php
session_start();

header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Access-Control-Allow-Credentials: true' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

// Handle preflight
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

// Check if user is logged in
if ( !isset( $_SESSION[ 'user' ] ) ) {
    echo json_encode( [ 'status' => 'error', 'message' => 'User not logged in.' ] );
    exit();
}

$user = $_SESSION[ 'user' ];
$userId = $user[ 'id' ];
// or use $user[ 'email' ] if your bookings table references email

try {
    $conn = new PDO( 'mysql:host=localhost;dbname=asr', 'root', '' );
    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    // If you store user_id in bookings:
    $stmt = $conn->prepare( 'SELECT * FROM bookings WHERE user_id = :userId' );
    // If you only store email in bookings:
    // $stmt = $conn->prepare( 'SELECT * FROM bookings WHERE email = :email' );

    $stmt->execute( [ ':userId' => $userId ] );
    // or $stmt->execute( [ ':email' => $user[ 'email' ] ] );

    $bookings = $stmt->fetchAll( PDO::FETCH_ASSOC );

    echo json_encode( [
        'status' => 'success',
        'bookings' => $bookings
    ] );
} catch ( PDOException $e ) {
    echo json_encode( [ 'status' => 'error', 'message' => $e->getMessage() ] );
}