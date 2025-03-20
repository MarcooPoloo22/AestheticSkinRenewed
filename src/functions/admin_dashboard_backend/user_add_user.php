<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$required = ['first_name', 'last_name', 'email', 'password', 'contact_no', 'role'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        die(json_encode(["error" => "$field is required"]));
    }
}

// Hash password
$hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users 
    (first_name, middle_initial, last_name, email, password, contact_no, role) 
    VALUES (?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("sssssss", 
    $data['first_name'],
    $data['middle_initial'],
    $data['last_name'],
    $data['email'],
    $hashed_password,
    $data['contact_no'],
    $data['role']
);

if ($stmt->execute()) {
    echo json_encode(["success" => "User created successfully"]);
} else {
    echo json_encode(["error" => "Error creating user: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>