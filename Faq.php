<!DOCTYPE html>
<html>
<head>
  <title>ASRFaqPage</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">

  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      padding: 4px 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .navbar .ASRlogo img {
      height: 85px;
      margin-right: 10px;
    }
    .navbar .nav-links {
      display: flex;
      gap: 20px;
    }
    .navbar .nav-links a {
      text-decoration: none;
      color: #444;
      font-size: 20px;
    }
    .navbar .nav-links a:hover {
      color: #007BFF;
    }
    .navbar .login-btn {
      padding: 5px 15px;
      border: 1px solid #444;
      background-color: transparent;
      color: #444;
      border-radius: 5px;
      cursor: pointer;
      font-size: 20px;
      text-decoration: none;
    }
    .navbar .login-btn:hover {
      background-color: #f0f0f0;
    }
    .ASRImage1 {
      position: relative;
      text-align: center;
      margin: 0;
    }
    .ASRImage1 img {
      width: 100%;
      height: auto;
    }
    
  </style>
</head>
<body>
  <div class="navbar">
    <div class="ASRlogo">
      <img src="ASR Logo.png" alt="Logo" />
    </div>
    <div class="nav-links">
      <a href="HomePage.php">Home</a>
      <a href="ServicePage.php">Services</a>
      <a href="ProductsPage.php">Products</a>
      <a href="Faq.php">FAQ</a>
      <a href="Contacts.php">Contact Us</a>
    </div>
    <a href="Login.php" class="login-btn">Login</a>
  </div>