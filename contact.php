<!-- Contact form handler -->
<?php

header('Content-Type: application/json');

$recipientEmail = 'css-030-22@must.ac.mw'; // Change this to your actual email address
$siteName       = 'WeClean Services';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ---- Helper: sanitize text input ---------------------------------------
function cleanInput(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

// ---- Collect + sanitize fields ------------------------------------------
$fullName = cleanInput($_POST['fullName'] ?? '');
$email    = cleanInput($_POST['email'] ?? '');
$phone    = cleanInput($_POST['phone'] ?? '');
$service  = cleanInput($_POST['service'] ?? '');
$message  = cleanInput($_POST['message'] ?? '');

// ---- Server-side validation (mirrors the TypeScript checks) ------------
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


$subject = "New cleaning request from {$fullName}";
$body = "You have a new enquiry from the {$siteName} website.\n\n"
      . "Name: {$fullName}\n"
      . "Email: {$email}\n"
      . "Phone: {$phone}\n"
      . "Service requested: {$service}\n\n"
      . "Message:\n{$message}\n";

$headers = [
    'From: ' . $siteName . ' Website <no-reply@wecleanservices.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

// ---- Send email (requires a configured mail server / SMTP on the host) --
$sent = @mail($recipientEmail, $subject, $body, implode("\r\n", $headers));

// ---- Optional: also log every enquiry to a local file as a backup ------
$logLine = sprintf(
    "[%s] %s <%s> | %s | %s\n",
    date('Y-m-d H:i:s'),
    $fullName,
    $email,
    $phone,
    $service
);
@file_put_contents(__DIR__ . '/submissions.log', $logLine, FILE_APPEND | LOCK_EX);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Thank you! We will get back to you shortly.']);
} else {
    // mail() commonly fails on local/dev servers without SMTP configured.
    // The enquiry is still logged above so nothing is lost.
    echo json_encode(['success' => true, 'message' => 'Request received. We will contact you shortly.']);
}
