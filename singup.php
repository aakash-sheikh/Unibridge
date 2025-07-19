<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$db = "campus_connect";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Input sanitization
$studentId = $conn->real_escape_string($_POST['studentId'] ?? '');
$studentName = $conn->real_escape_string($_POST['studentName'] ?? '');
$departmentName = $conn->real_escape_string($_POST['departmentName'] ?? '');
$firstMajor = $conn->real_escape_string($_POST['firstMajor'] ?? '');
$minor = $conn->real_escape_string($_POST['minor'] ?? '');
$fathersName = $conn->real_escape_string($_POST['fathersName'] ?? '');
$mothersName = $conn->real_escape_string($_POST['mothersName'] ?? '');
$email = $conn->real_escape_string($_POST['email'] ?? '');
$contact = $conn->real_escape_string($_POST['contact'] ?? '');
$earnedCredit = floatval($_POST['earnedCredit'] ?? 0.0);
$passwordRaw = $_POST['password'] ?? null;
$confirmPass = $_POST['confirmPassword'] ?? null;

// Validate passwords
if (!$passwordRaw || !$confirmPass) {
    die("Password fields are required.");
}
if ($passwordRaw !== $confirmPass) {
    die("Passwords do not match.");
}

// Check for duplicate
$checkStmt = $conn->prepare("SELECT studentId FROM students WHERE studentId = ?");
$checkStmt->bind_param("s", $studentId);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo "<script>alert('Student ID already registered. Please login.'); window.location.href='index.html';</script>";
    $checkStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// Hash password
$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

// Insert
$stmt = $conn->prepare("INSERT INTO students (
    studentId, studentName, departmentName, firstMajor, minor,
    fathersName, mothersName, email, password, contact, earnedCredit
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("ssssssssssd", $studentId, $studentName, $departmentName, $firstMajor, $minor,
    $fathersName, $mothersName, $email, $password, $contact, $earnedCredit);

if ($stmt->execute()) {
    echo "<script>alert('Student registered successfully!'); window.location.href='index.html';</script>";
} else {
    $error = $stmt->error;
    echo "<script>alert('Error: $error'); window.location.href='index.html';</script>";
}

$stmt->close();
$conn->close();
?>