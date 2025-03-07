<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "admin_dashboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch promos
$sql = "SELECT * FROM promos";
$result = $conn->query($sql);

$promos = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $promos[] = $row;
    }
}

echo json_encode($promos);

$conn->close();
?>