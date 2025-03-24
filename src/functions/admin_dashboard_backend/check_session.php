<?php
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );

header( 'Access-Control-Max-Age: 3600' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
header( 'Access-Control-Allow-Credentials: true' );

error_reporting( E_ALL );
ini_set( 'display_errors', 0 );
ini_set( 'log_errors', 1 );
ini_set( 'error_log', 'C:\xampp\htdocs\error.log' );

// Handle preflight requests
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}
session_set_cookie_params( [
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => 'localhost',
    'secure'   => false,    // true if you use HTTPS
    'httponly' => true,
    'samesite' => 'None'    // <<< Allow cross‑origin cookies
] );

session_start();

// Database connection
$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $pdo = new PDO( "mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password );
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
} catch ( PDOException $e ) {
    die( json_encode( [ 'authenticated' => false, 'error' => 'Database connection failed' ] ) );
}

$authenticated = false;

if (
    isset( $_SESSION[ 'user_id' ], $_SESSION[ 'role' ], $_SESSION[ 'ip' ], $_SESSION[ 'user_agent' ] ) &&
    ( $_SESSION[ 'role' ] === 'admin' || $_SESSION[ 'role' ] === 'employee' ) &&
    $_SESSION[ 'ip' ] === $_SERVER[ 'REMOTE_ADDR' ] &&
    $_SESSION[ 'user_agent' ] === $_SERVER[ 'HTTP_USER_AGENT' ]
) {
    // Verify user exists and role matches
    $stmt = $pdo->prepare( 'SELECT id FROM users WHERE id = :id AND role = :role' );
    $stmt->execute( [ ':id' => $_SESSION[ 'user_id' ], ':role' => $_SESSION[ 'role' ] ] );

    if ( $stmt->fetch( PDO::FETCH_ASSOC ) ) {
        $authenticated = true;
    }
}

if ( !$authenticated ) {
    session_unset();
    session_destroy();
}

echo json_encode( [ 'authenticated' => $authenticated ] );
exit();
?>