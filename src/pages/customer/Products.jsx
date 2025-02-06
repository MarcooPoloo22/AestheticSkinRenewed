import React from "react";
import Card from "../../components/Customers/ServiceCard";

const products = [
  {
    id: 1,
    title: "Facial Treatments",
    description: "Rejuvenate your skin with our luxurious facials.",
    image: "../assets/spa_massage.jpg",
    updated: "3 mins ago",
  },
  {
    id: 2,
    title: "Massage Therapy",
    description: "Relax your body and mind with therapeutic massages.",
    image: "../assets/spa_massage.jpg",
    updated: "10 mins ago",
  },
  {
    id: 3,
    title: "Skin Rejuvenation",
    description: "Advanced treatments for glowing, youthful skin.",
    image: "../assets/spa_massage.jpg",
    updated: "15 mins ago",
  },
  {
    id: 4,
    title: "Body Scrubs",
    description: "Exfoliate your skin for a smooth and refreshed feel.",
    image: "../assets/spa_massage.jpg",
    updated: "1 hour ago",
  },
  {
    id: 5,
    title: "Hair Treatments",
    description: "Revive and restore your hair with specialized treatments.",
    image: "../assets/spa_massage.jpg",
    updated: "2 hours ago",
  },
  {
    id: 6,
    title: "Nail Services",
    description: "Indulge in luxurious manicures and pedicures.",
    image: "../assets/spa_massage.jpg",
    updated: "5 hours ago",
  },
];

function ProductsPage() {
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-6">
          <h1 className="page-title">Our Products</h1>
        </div>
      </div>

      <div className="row mt-3">
        {products.map((products) => (
          <div className="col-md-12 col-lg-6" key={products.id}>
            <Card
              title={products.title}
              description={products.description}
              image={products.image}
              updated={products.updated}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
