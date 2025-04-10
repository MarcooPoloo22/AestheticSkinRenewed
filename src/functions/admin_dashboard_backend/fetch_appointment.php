<?php
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header("Access-Control-Allow-Credentials: true");
header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

// Handle preflight OPTIONS request
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

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

try {
    $stmt = $conn->prepare( 'SELECT * FROM bookings' );
    $stmt->execute();
    $appointments = $stmt->fetchAll( PDO::FETCH_ASSOC );
    echo json_encode( $appointments );
} catch ( PDOException $e ) {
    http_response_code( 500 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Error fetching appointments.' ] );
}
?>