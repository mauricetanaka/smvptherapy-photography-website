<?php
session_start();

// In a real-world scenario, you'd verify the payment with your payment gateway here

if ($_GET['status'] == 'success') {
    // Clear the cart
    unset($_SESSION['cart']);
    
    // Update the booking status in your database
    // ...

    echo "Payment successful! Your booking is confirmed.";
} else {
    echo "Payment failed. Please try again.";
}
?>