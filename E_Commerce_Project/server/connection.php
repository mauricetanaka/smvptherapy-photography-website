<?php
$servername = "localhost";
$username = "id22350310_root"; 
$password = "P@$$w0rd"; 
$dbname = "id22350310_ecommerce_php_project"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
