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
      className="card mb-3 mx-auto cursor-pointer"
      style={{ maxWidth: "540px", cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={image}
            className="img-fluid rounded-start w-100 h-100"
            alt={title}
          />
        </div>
        <div className="col-md-8 shadow-sm" style={{ minHeight: "150px" }}>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-body-secondary">
                Last updated {updated}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
