<?php
// Set session cookie parameters
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => 'localhost',
    'secure'   => false,    // Set to true if using HTTPS
    'httponly' => true,
    'samesite' => 'None'     // Allow cross‑origin cookies
]);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    exit(0);
}

session_start();

// Set response headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

// Check if the user is logged in
if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit();
}

// Return user profile data stored in session
echo json_encode(['status' => 'success', 'user' => $_SESSION['user']]);
?>
