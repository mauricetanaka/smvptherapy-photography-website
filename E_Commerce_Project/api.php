<?php
// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Get the request parameters
$action = $_GET['action'] ?? '';

// Map actions to files
$actionMap = [
    'login' => 'login.php',
    'register' => 'register.php',
    'checkout' => 'checkout.php',
    'account' => 'account.php',
    'changePassword' => 'change_password.php',
    'sendMessage' => 'send_message.php',
    'adminApi' => 'admin_api.php',
    'cartAdding' => 'cartAdding.php',
    'paymentConfirmation' => 'payment-confirmation.php'
];

// Check if the action is valid
if (!array_key_exists($action, $actionMap)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
    exit;
}

// Include the corresponding file from the server directory
$file = __DIR__ . '/../server/' . $actionMap[$action];

if (!file_exists($file)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server file not found']);
    exit;
}

require_once $file;