<?php


// Retrieve the form data from the AJAX request
$email = $_POST['email'];
$message = $_POST['message'];

// Validate the form data (optional)
if (empty($email) || empty($message)) {
    echo "Please fill in all fields.";
    exit;
}

// Email configuration
$to = "your_email@example.com"; // Replace with the photographer's email address
$subject = "New Message from Contact Form";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Email body
$body = "You have received a new message from the Contact Us form:\n\n";
$body .= "Email: $email\n\n";
$body .= "Message:\n$message";

// Send the email
if (mail($to, $subject, $body, $headers)) {
    echo "Your message has been sent successfully!";
} else {
    echo "Sorry, there was a problem sending your message. Please try again later.";
}
?>