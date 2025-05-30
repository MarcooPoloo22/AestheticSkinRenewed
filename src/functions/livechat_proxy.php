<?php
header( 'Content-Type: application/json' );
header( 'Access-Control-Allow-Origin: https://teal-seahorse-572802.hostingersite.com' );
header( 'Access-Control-Allow-Credentials: true' );
header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );

// Preflight for CORS
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

// CONFIG — Prefer storing in env file or config.php
$LIVECHAT_ACCOUNT_ID = 'a058cc9e-d5dd-48cb-af64-f858e6090772';
$LIVECHAT_PAT = 'us-south1:R2ENigLOFuMUKuTL63ott3hTmTs';
// Move to a secure config in production

// Get action
$action = $_GET[ 'action' ] ?? '';
if ( !$action ) {
    http_response_code( 400 );
    echo json_encode( [ 'error' => 'No action specified' ] );
    exit();
}

// Construct LiveChat API URL
$url = "https://api.livechatinc.com/v3.5/agent/action/{$action}";

// Prepare headers
$headers = [
    'Authorization: Basic ' . base64_encode( "{$LIVECHAT_ACCOUNT_ID}:{$LIVECHAT_PAT}" ),
    'Content-Type: application/json'
];

// Get payload
$payload = file_get_contents( 'php://input' );

// Initialize CURL
$ch = curl_init( $url );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );

// Execute request
$response = curl_exec( $ch );
$httpCode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );

// Error or success
if ( curl_errno( $ch ) ) {
    echo json_encode( [ 'error' => curl_error( $ch ) ] );
} else {
    http_response_code( $httpCode );
    echo $response;
}
curl_close( $ch );