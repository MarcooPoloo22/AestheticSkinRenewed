import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Customers/ServiceCard";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the backend
    fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched products:", data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));

    // Add a dummy product for testing
    const dummyProduct = {
      id: "dummy1", 
      name: "Spa Product Dummy",
      description: "This is a dummy product for testing purposes.",
      price: "1500.00",
      file_url: "/assets/spa_products.jpg",
    };

    setProducts((prevProducts) => [dummyProduct, ...prevProducts]);
  }, []);

  const handleCardClick = (product) => {
    navigate(`/details/product/${product.id}`, { state: { product } });
  };

  return (
    <>
      <div className="service-header" style={{ backgroundImage: "url('./assets/spa_products.jpg')" }}>
        <div className="overlay">
          <h1 className="service-title">Our Products</h1>
        </div>
      </div>
      <div className="container my-4">
        <div className="row"></div>
        <div className="row mt-3">
          {products.map((product) => (
            <div className="col-md-12 col-lg-6" key={product.id} onClick={() => handleCardClick(product)}>
              <Card
                title={product.name}
                description={product.description}
                image={product.file_url} // Use the file_url from the backend
                updated={`Price: ₱${parseFloat(product.price).toLocaleString()}`} // Display the price with the Peso sign and formatting
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductsPage;