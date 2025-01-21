<!DOCTYPE html>
<html>
<head>
  <title>ASRHomePage</title>
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
    .book-now-btn {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #A0522D; 
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 30px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .book-now-btn:hover {
      background-color: #8B4513; 
    }
    h1 {
      font-size: 36px;
      margin: 30px 0;
    }
    .PromPackage {
      margin: 40px auto;
      max-width: 90%;
    }
    .card {
      width: 100%; 
    }
    .card img {
      height: 200px; 
      object-fit: cover; 
    }
    .row {
      margin: 0; 
    }
  </style>
</head>
<body>
  <div class="navbar">
    <div class="ASRlogo">
      <img src="ASR Logo.png" alt="Logo" />
    </div>
    <div class="nav-links">
      <a href="homepage.php">Home</a>
      <a href="ServicesPage.php">Services</a>
      <a href="ProductsPage.php">Products</a>
      <a href="Faq.php">FAQ</a>
      <a href="Contacts.php">Contact Us</a>
    </div>
    <button class="login-btn">Login</button>
  </div>
  <div class="ASRImage1">
    <img src="spamassage.jpg" alt="Main Image" />
    <button class="book-now-btn">Book Now</button>
  </div> 
  <div class="PromPackage">
    <h1>Promos/Packages</h1>
    <div class="row d-flex justify-content-center">
      <div class="col-md-4 d-flex justify-content-center mb-4">
        <div class="card">
          <img src="..." class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">Title</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 d-flex justify-content-center mb-4">
        <div class="card">
          <img src="..." class="card-img-top" alt="...">
          <div class="card-body">
          <p class="card-text">Title</p>
          <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 d-flex justify-content-center mb-4">
        <div class="card">
          <img src="..." class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">Title</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
