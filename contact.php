<?php
// contact-handler.php
header('Content-Type: application/json');

// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================
$recipientEmail = 'css-030-22@must.ac.mw'; // YOUR RECIPIENT
$siteName = 'WeClean Services';

// SMTP Configuration (use your actual SMTP credentials)
$smtpConfig = [
    'host' => 'smtp.gmail.com',        // or your university's SMTP server
    'port' => 587,
    'username' => 'your-email@gmail.com', // SMTP username
    'password' => 'your-app-password',    // SMTP password
    'encryption' => 'tls'                 // or 'ssl' for port 465
];

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Helper: sanitize text input
function cleanInput(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

// Collect + sanitize fields
$fullName = cleanInput($_POST['fullName'] ?? '');
$email = cleanInput($_POST['email'] ?? '');
$phone = cleanInput($_POST['phone'] ?? '');
$service = cleanInput($_POST['service'] ?? '');
$message = cleanInput($_POST['message'] ?? '');

// Server-side validation
$errors = [];

if (mb_strlen($fullName) < 2) {
    $errors['fullName'] = 'Please enter your full name.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}

if (!preg_match('/^[0-9+()\s-]{7,}$/', $phone)) {
    $errors['phone'] = 'Please enter a valid phone number.';
}

$allowedServices = ['Residential Cleaning', 'Office Cleaning', 'Industrial Cleaning', 'Specialized Cleaning'];
if (!in_array($service, $allowedServices, true)) {
    $errors['service'] = 'Please select a valid service.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Validation failed.', 'errors' => $errors]);
    exit;
}

// Prepare email content
$subject = "New cleaning request from {$fullName}";
$body = "You have a new enquiry from the {$siteName} website.\n\n"
      . "Name: {$fullName}\n"
      . "Email: {$email}\n"
      . "Phone: {$phone}\n"
      . "Service requested: {$service}\n\n"
      . "Message:\n{$message}\n";

// Log enquiry to file (backup)
$logLine = sprintf(
    "[%s] %s <%s> | %s | %s\n",
    date('Y-m-d H:i:s'),
    $fullName,
    $email,
    $phone,
    $service
);
@file_put_contents(__DIR__ . '/submissions.log', $logLine, FILE_APPEND | LOCK_EX);

// ============================================
// METHOD 1: PHPMailer with SMTP (RECOMMENDED)
// ============================================
function sendWithPHPMailer($recipient, $subject, $body, $fromEmail, $fromName, $smtpConfig) {
    try {
        // Check if PHPMailer is installed
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            // Try to autoload
            require_once __DIR__ . '/vendor/autoload.php';
        }
        
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            throw new Exception('PHPMailer not installed. Please run: composer require phpmailer/phpmailer');
        }

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtpConfig['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $smtpConfig['username'];
        $mail->Password = $smtpConfig['password'];
        $mail->SMTPSecure = $smtpConfig['encryption'] === 'ssl' 
            ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS 
            : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtpConfig['port'];
        $mail->SMTPDebug = 0; // Set to 2 for debugging
        
        // Recipients
        $mail->setFrom($smtpConfig['username'], $fromName);
        $mail->addAddress($recipient); // css-030-22@must.ac.mw
        $mail->addReplyTo($fromEmail, $fromName);
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;
        
        $mail->send();
        return ['success' => true, 'message' => 'Email sent successfully'];
        
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// ============================================
// METHOD 2: Native PHP mail() (Fallback)
// ============================================
function sendWithNativeMail($recipient, $subject, $body, $fromEmail, $fromName) {
    $headers = [
        'From: ' . $fromName . ' <no-reply@wecleanservices.com>',
        'Reply-To: ' . $fromEmail,
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return @mail($recipient, $subject, $body, implode("\r\n", $headers));
}

// ============================================
// SEND THE EMAIL
// ============================================
$emailSent = false;
$errorMessage = '';

// Try PHPMailer first
if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    $result = sendWithPHPMailer(
        $recipientEmail, 
        $subject, 
        $body, 
        $email, 
        $fullName, 
        $smtpConfig
    );
    
    if ($result['success']) {
        $emailSent = true;
    } else {
        $errorMessage = $result['error'];
    }
}

// Fallback to native mail() if PHPMailer failed or not installed
if (!$emailSent) {
    $emailSent = sendWithNativeMail($recipientEmail, $subject, $body, $email, $fullName);
    if (!$emailSent) {
        $errorMessage = 'Both SMTP and native mail() failed';
    }
}

// ============================================
// RESPONSE
// ============================================
if ($emailSent) {
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! We will get back to you shortly.',
        'delivered_to' => $recipientEmail
    ]);
} else {
    // Log the error but still return success to user
    error_log("Email delivery failed for {$recipientEmail}: {$errorMessage}");
    echo json_encode([
        'success' => true, 
        'message' => 'Request received. We will contact you shortly.'
    ]);
}
?>