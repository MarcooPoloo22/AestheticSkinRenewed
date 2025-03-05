<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP(); // Send using SMTP
    $mail->Host       = 'smtp.gmail.com'; // Set the SMTP server (e.g., smtp.gmail.com for Gmail)
    $mail->SMTPAuth   = true; // Enable SMTP authentication
    $mail->Username   = 'aestheticskinrenewed1@gmail.com'; // SMTP username (your email address)
    $mail->Password   = 'asrkatipunan1'; // SMTP password (your email password or app password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
    $mail->Port       = 587; // TCP port to connect to (587 for TLS, 465 for SSL)

    // Recipients
    $mail->setFrom('your-email@gmail.com', 'Your Name'); 
    $mail->addAddress('recipient-email@example.com', 'Recipient Name'); 

    // Content
    $mail->isHTML(true); // Set email format to HTML
    $mail->Subject = 'Test Email';
    $mail->Body    = 'This is a <b>test email</b> sent using PHPMailer.';
    $mail->AltBody = 'This is a test email sent using PHPMailer.'; 

    // Send the email
    $mail->send();
    echo 'Email has been sent!';
} catch (Exception $e) {
    echo "Email could not be sent. Error: {$mail->ErrorInfo}";
}