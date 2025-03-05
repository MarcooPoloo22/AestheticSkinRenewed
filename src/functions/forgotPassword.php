<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\htdocs\error.log');

require __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit();
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit();
}

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log('Database Connection Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Email not found.']);
        exit();
    }

    $reset_token = bin2hex(random_bytes(32));
    $reset_token_expiry = date("Y-m-d H:i:s", strtotime("+1 hour"));

    $stmt = $conn->prepare("UPDATE users SET reset_token = :reset_token, reset_token_expiry = :reset_token_expiry WHERE id = :id");
    $stmt->execute([
        ':reset_token' => $reset_token,
        ':reset_token_expiry' => $reset_token_expiry,
        ':id' => $user['id'],
    ]);

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USERNAME'];
        $mail->Password   = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $_ENV['SMTP_PORT'];

        $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
        $mail->addAddress($email);

        $reset_link = "http://localhost/resetpassword?token=$reset_token";
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request';
        $mail->Body    = "
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <p><a href='$reset_link'>Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
        ";
        $mail->AltBody = "Click the link below to reset your password:\n\n$reset_link";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Password reset email sent.']);
    } catch (Exception $e) {
        error_log('PHPMailer Error: ' . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Failed to send password reset email.']);
    }
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to process your request.']);
}