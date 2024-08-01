<?php
session_start();
include 'connection.php';

// Check if the user is logged in as admin
if (!isset($_SESSION['user_id']) || $_SESSION['username'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'getUsers':
        $stmt = $conn->prepare("SELECT user_id, username, email FROM Users");
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    case 'getUser':
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT user_id, username, email FROM Users WHERE user_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc());
        break;

    case 'addUser':
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $password);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    case 'updateUser':
        $id = $_POST['userId'];
        $username = $_POST['username'];
        $email = $_POST['email'];
        $stmt = $conn->prepare("UPDATE Users SET username = ?, email = ? WHERE user_id = ?");
        $stmt->bind_param("ssi", $username, $email, $id);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    case 'deleteUser':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM Users WHERE user_id = ?");
        $stmt->bind_param("i", $id);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    case 'getServices':
        $stmt = $conn->prepare("SELECT service_id, name, description, price FROM Services");
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    case 'getService':
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT service_id, name, description, price FROM Services WHERE service_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc());
        break;

    case 'addService':
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        $stmt = $conn->prepare("INSERT INTO Services (name, description, price) VALUES (?, ?, ?)");
        $stmt->bind_param("ssd", $name, $description, $price);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    case 'updateService':
        $id = $_POST['serviceId'];
        $name = $_POST['name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        $stmt = $conn->prepare("UPDATE Services SET name = ?, description = ?, price = ? WHERE service_id = ?");
        $stmt->bind_param("ssdi", $name, $description, $price, $id);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    case 'deleteService':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM Services WHERE service_id = ?");
        $stmt->bind_param("i", $id);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    case 'getBookings':
        $stmt = $conn->prepare("SELECT booking_id, user_id, service_id, booking_date, status FROM Bookings");
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    case 'updateBookingStatus':
        $id = $_POST['id'];
        $status = $_POST['status'];
        $stmt = $conn->prepare("UPDATE Bookings SET status = ? WHERE booking_id = ?");
        $stmt->bind_param("si", $status, $id);
        $result = $stmt->execute();
        echo json_encode(['success' => $result]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

$conn->close();
?>
