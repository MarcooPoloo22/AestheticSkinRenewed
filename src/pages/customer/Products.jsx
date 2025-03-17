import React, { useState, useEffect } from "react";
import Card from "../../components/Customers/ServiceCard";
import ProductHead from "../../components/Customers/productshead";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched products:", data); // Debugging
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <>
      <ProductHead />
      <div className="container my-4">
        <div className="row"></div>

        <div className="row mt-3">
          {products.map((product) => (
            <div className="col-md-12 col-lg-6" key={product.id}>
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