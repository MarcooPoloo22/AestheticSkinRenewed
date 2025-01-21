<!DOCTYPE html>
<html>
<head>
  <title>ASRServicesPage</title>
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
    .products-container {
      max-width: 90%;
      margin: 0 auto;
      padding-top: 30px; 
    }
    .page-title {
      margin: 20px 0;
      font-size: 36px;
    }
    .search-bar {
      text-align: right;
      margin-bottom: 20px;
    }
    .search-bar input {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 250px;
    }
    .card img {
      height: 200px;
      object-fit: cover;
    }
    .card {
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="navbar">
    <div class="ASRlogo">
      <img src="ASR Logo.png" alt="Logo" />
    </div>
    <div class="nav-links"> 
      <a href="Homepage.php">Home</a>
      <a href="ServicePage.php">Services</a>
      <a href="ProductsPage.php">Products</a>
      <a href="#FAQ">FAQ</a>
      <a href="#Contacts">Contact Us</a>
    </div>
    <button class="login-btn">Login</button>
  </div>

  
  <div class="products-container">
    <div class="row">
      <div class="col-6">
        <h1 class="page-title">Our Services</h1>
      </div>
      <div class="col-6 search-bar">
        <input type="text" placeholder="Search">
      </div>
    </div>

    
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <img src="path-to-image.jpg" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <p class="card-title">Text</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <img src="path-to-image.jpg" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <p class="card-title">Text</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <img src="path-to-image.jpg" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <p class="card-title">Text</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <img src="path-to-image.jpg" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <p class="card-title">Text</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <img src="path-to-image.jpg" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <p class="card-title">Text</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <img src="path-to-image.jpg" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <p class="card-title">Text</p>
            <p class="card-text">$0</p>
            <p class="card-text">Body Text</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="js/bootstrap.bundle.min.js"></script>
</body>
</html>
