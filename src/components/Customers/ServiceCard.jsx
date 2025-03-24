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
  className="card mb-4 mx-auto h-100 shadow-sm"
  style={{ maxWidth: "100%", height: "220px", cursor: "pointer" }}
  onClick={handleClick}
>
  <div className="row g-0 h-100">
    <div className="col-md-4">
      <div className="service-img-wrapper h-100">
        <img
          src={image}
          alt={title}
          className="service-img"
        />
      </div>
    </div>
    <div className="col-md-8 d-flex align-items-center">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">
          <small className="text-muted">{updated}</small>
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default ServiceCard;