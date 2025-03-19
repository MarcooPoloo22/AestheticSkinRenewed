<?php
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
header( 'Access-Control-Max-Age: 3600' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

// Handle preflight ( OPTIONS ) requests
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

error_reporting( E_ALL );
ini_set( 'display_errors', 0 );
ini_set( 'log_errors', 1 );
ini_set( 'error_log', 'C:\xampp\htdocs\error.log' );

error_log( 'Script started.' );

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ );
$dotenv->load();

$input = file_get_contents( 'php://input' );
error_log( 'Raw Input: ' . $input );

$data = json_decode( $input, true );

if ( !$data ) {
    error_log( 'Invalid JSON input: ' . json_last_error_msg() );
    http_response_code( 400 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Invalid input data.' ] );
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
    error_log( 'Database Connection Error: ' . $e->getMessage() );
    http_response_code( 500 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Database connection failed.' ] );
    exit();
}

if ( $_SERVER[ 'REQUEST_METHOD' ] === 'POST' ) {
    $first_name = htmlspecialchars( $data[ 'first_name' ] );
    $middle_initial = htmlspecialchars( $data[ 'middle_initial' ] );
    $last_name = htmlspecialchars( $data[ 'last_name' ] );
    $email = filter_var( $data[ 'email' ], FILTER_SANITIZE_EMAIL );
    $password = password_hash( $data[ 'password' ], PASSWORD_DEFAULT );
    $contact_no = htmlspecialchars( $data[ 'contact_no' ] );

    if ( !$email ) {
        error_log( 'Invalid email address: ' . $data[ 'email' ] );
        http_response_code( 400 );
        echo json_encode( [ 'status' => 'error', 'message' => 'Invalid email address.' ] );
        exit();
    }

    $verification_token = bin2hex( random_bytes( 32 ) );

    try {
        $stmt = $conn->prepare( "
            INSERT INTO users (first_name, middle_initial, last_name, email, password, contact_no, verification_token)
            VALUES (:first_name, :middle_initial, :last_name, :email, :password, :contact_no, :verification_token)
        " );
        $stmt->execute( [
            ':first_name' => $first_name,
            ':middle_initial' => $middle_initial,
            ':last_name' => $last_name,
            ':email' => $email,
            ':password' => $password,
            ':contact_no' => $contact_no,
            ':verification_token' => $verification_token
        ] );

        $mail = new PHPMailer( true );

        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV[ 'SMTP_HOST' ];
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV[ 'SMTP_USERNAME' ];
            $mail->Password   = $_ENV[ 'SMTP_PASSWORD' ];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $_ENV[ 'SMTP_PORT' ];

            $mail->setFrom( $_ENV[ 'SMTP_FROM_EMAIL' ], $_ENV[ 'SMTP_FROM_NAME' ] );
            $mail->addAddress( $email );

            $verificationLink = "http://localhost/verifyemail.php?token=$verification_token";
            $mail->isHTML( true );
            $mail->Subject = 'Verify Your Email Address';
            $mail->Body    = "
                <h2>Email Verification</h2>
                <p>Thank you for registering! Please click the link below to verify your email address:</p>
                <p><a href='$verificationLink'>Verify Email</a></p>
                <p>If you did not create an account, please ignore this email.</p>
            ";
            $mail->AltBody = "Thank you for registering! Please click the link below to verify your email address:\n\n$verificationLink";

            $mail->send();
            echo json_encode( [ 'status' => 'success', 'message' => 'Registration successful! Please check your email to verify your account.' ] );
        } catch ( Exception $e ) {
            error_log( 'PHPMailer Error: ' . $e->getMessage() );
            echo json_encode( [ 'status' => 'error', 'message' => 'Failed to send verification email.' ] );
        }
    } catch ( PDOException $e ) {
        error_log( 'Database Error: ' . $e->getMessage() );
        echo json_encode( [ 'status' => 'error', 'message' => 'Failed to create account: ' . $e->getMessage() ] );
    }
} else {
    error_log( 'Invalid request method: ' . $_SERVER[ 'REQUEST_METHOD' ] );
    http_response_code( 405 );
    echo json_encode( [ 'status' => 'error', 'message' => 'Invalid request method.' ] );
}
?>