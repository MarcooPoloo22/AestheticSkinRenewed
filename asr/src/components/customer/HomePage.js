import React from "react";
import '../../css/customer/HomePage.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className= "ASRlogo">
                <img src="../../Images/customer/ASR Logo.png" alt="Logo" />
            </div>
            <div className="nav-links">
            <a href="HomePage.js">Home</a>
            <a href="ServicePage.php">Services</a>
            <a href="ProductsPage.php">Products</a>
            <a href="Faq.php">FAQ</a>
            <a href="Contacts.php">Contact Us</a>
            </div>
            <a href ="Login.js" className="login-btn">Login</a>
        </nav>
    );
};

const MainSection = () => {
    return (
        <div className="ASRImage1">
            <img src="../../Images/customer/spamassage.jpg" alt="Main Image" />
            <button className="book-now-btn">Book Now</button>
        </div>
    );
};

const PromosPackages = () => {
  return (
    <div>
      <h1 className="h1promo">Promos/Packages</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
          gap: '1rem',
        }}
      >

        <div className="card" style={{ width: '18rem' }}>
          <img src="../../Images/customer/spaface.jpg" className="card-img-top" alt="image" />
          <div className="card-body">
            <h5 className="card-title">Text_Placeholder</h5>
            <p className="card-text">Price_Placeholder</p>
            <p className="card-text">BodyText_Placeholder</p>
          </div>
        </div>


        <div className="card" style={{ width: '18rem' }}>
          <img src="../../Images/customer/spaface.jpg" className="card-img-top" alt="image" />
          <div className="card-body">
            <h5 className="card-title">Text_Placeholder</h5>
            <p className="card-text">Price_Placeholder</p>
            <p className="card-text">BodyText_Placeholder</p>
          </div>
        </div>

        <div className="card" style={{ width: '18rem' }}>
          <img src="../../Images/customer/spaface.jpg" className="card-img-top" alt="image" />
          <div className="card-body">
            <h5 className="card-title">Text_Placeholder</h5>
            <p className="card-text">Price_Placeholder</p>
            <p className="card-text">BodyText_Placeholder</p>
          </div>
        </div>

       
        <div className="card" style={{ width: '18rem' }}>
          <img src="../../Images/customer/spaface.jpg" className="card-img-top" alt="image" />
          <div className="card-body">
            <h5 className="card-title">Text_Placeholder</h5>
            <p className="card-text">Price_Placeholder</p>
            <p className="card-text">BodyText_Placeholder</p>
          </div>
        </div>

     
        <div className="card" style={{ width: '18rem' }}>
          <img src="../../Images/customer/spaface.jpg" className="card-img-top" alt="image" />
          <div className="card-body">
            <h5 className="card-title">Text_Placeholder</h5>
            <p className="card-text">Price_Placeholder</p>
            <p className="card-text">BodyText_Placeholder</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromosPackages;


export {Navbar, MainSection, PromosPackages};
