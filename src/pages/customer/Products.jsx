import React, { useState, useEffect } from "react";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const MAX_LETTERS = 100;
  const MAX_WORDS = 15;

  useEffect(() => {
    fetch('http://localhost/admin_dashboard_backend/fetch_products.php')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const truncateDescription = (description) => {
    if (!description) return '';
    
    const words = description.split(' ');
    if (words.length > MAX_WORDS) {
      return words.slice(0, MAX_WORDS).join(' ') + '...';
    }
    
    if (description.length > MAX_LETTERS) {
      return description.substring(0, MAX_LETTERS) + '...';
    }
    
    return description;
  };

  const shouldShowSeeMore = (description) => {
    if (!description) return false;
    return description.split(' ').length > MAX_WORDS || description.length > MAX_LETTERS;
  };

  const handleCardClick = (product, e) => {
    if (e.target.classList.contains('see-more-link')) {
      return;
    }
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <>
      <div className="service-header" style={{ backgroundImage: "url('./assets/spa_products.jpg')" }}>
        <div className="overlay">
          <h1 className="service-title">Our Products</h1>
        </div>
      </div>
      <div className="container my-4">
        <div className="row mt-3">
          {products.map((product) => (
            <div className="col-md-12 col-lg-6 mb-4" key={product.id}>
              <div 
                className="card mx-auto shadow-sm"
                style={{ 
                  width: "100%", 
                  minHeight: "220px",
                  maxHeight: "400px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "row",
                  overflow: "hidden"
                }}
                onClick={(e) => handleCardClick(product, e)}
              >
                <div style={{ 
                  width: "40%", 
                  minHeight: "220px",
                  overflow: "hidden",
                  flexShrink: 0
                }}>
                  <img
                    src={product.file_url || './assets/default-image.jpg'}
                    alt={product.name}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }}
                    onError={(e) => {
                      e.target.src = './assets/default-image.jpg';
                    }}
                  />
                </div>
                <div style={{ 
                  width: "60%",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto"
                }}>
                  <h5 style={{ 
                    fontSize: "1.1rem",
                    marginBottom: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {product.name}
                  </h5>
                  <div style={{
                    flexGrow: 1,
                    overflow: "hidden",
                    marginBottom: "10px"
                  }}>
                    <p style={{ fontSize: "0.9rem" }}>
                      {truncateDescription(product.description)}
                      {shouldShowSeeMore(product.description) && (
                        <span 
                          className="see-more-link text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowModal(true);
                          }}
                          style={{ cursor: 'pointer', marginLeft: "5px" }}
                        >
                          See More
                        </span>
                      )}
                    </p>
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    <small className="text-muted">Price: ₱{parseFloat(product.price).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'white',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                <div style={{ flex: 1, minHeight: '300px' }}>
                  <img
                    src={selectedProduct.file_url || './assets/default-image.jpg'}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.src = './assets/default-image.jpg';
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <h2 style={{ marginTop: 0 }}>{selectedProduct.name}</h2>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <p style={{ whiteSpace: 'pre-line' }}>{selectedProduct.description}</p>
                  </div>
                  <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
                    Price: ₱{parseFloat(selectedProduct.price).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsPage;