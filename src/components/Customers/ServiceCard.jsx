import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ title, description, image, updated, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      className="card mb-3 mx-auto"
      style={{ maxWidth: "540px", cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="row g-0">
      <div className="col-md-4">
        <div className="service-img-wrapper">
           <img
            src={image}
            alt={title}
<<<<<<< HEAD
            className="service-img"
           />
=======
            style={{ height: "200px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8 shadow-sm" style={{ minHeight: "200px" }}>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-body-secondary">
                {updated}
              </small>
            </p>
          </div>
>>>>>>> bb0e63f8de9669f82529b23fbfd7eeedfa702c30
        </div>
      </div>

      <div className="col-md-8 d-flex align-items-center" style={{ minHeight: "150px" }}>
        <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">
        <small className="text-body-secondary">{updated}</small>
      </p>
    </div>
  </div>
      </div>
    </div>
  );
};

export default ServiceCard;