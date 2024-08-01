<?php
session_start();
include 'connection.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Fetch user details
$sql = "SELECT username, email FROM Users WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Fetch previous sessions
$sql = "SELECT s.name as service_name, b.booking_date 
        FROM Bookings b 
        JOIN Services s ON b.service_id = s.service_id 
        WHERE b.user_id = ? 
        ORDER BY b.booking_date DESC 
        LIMIT 5";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$sessions = $result->fetch_all(MYSQLI_ASSOC);

$response = [
    "username" => $user['username'],
    "email" => $user['email'],
    "sessions" => $sessions
];

echo json_encode($response);

$conn->close();
?>