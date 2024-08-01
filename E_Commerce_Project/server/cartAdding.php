<?php

session_start();
include 'connection.php';

// Checking if the user is logged in
if (!isset($_SESSION['username'])) {
    header('Location: login.html');
    exit;
}
// Retrieve the cart data from the session
$cartItems = [
    [
        'name' => 'Session Booking',
        'price' => 100
    ]
];
// Update the cart data with the selected date
if (isset($_POST['sessionDate'])) {
    $sessionDate = $_POST['sessionDate'];
    // Update the cart item with the selected date
}
// Calculate the total
$total = 0;
foreach ($cartItems as $item) {
    $total += $item['price'];
}
?>