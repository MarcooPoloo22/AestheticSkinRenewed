import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ title, description, image, updated, link, id }) => {
  const navigate = useNavigate();
  const MAX_WORDS = 15; // Reduced for more consistent sizing

  const truncateDescription = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > MAX_WORDS) {
      return words.slice(0, MAX_WORDS).join(' ') + '...';
    }
    return text;
  };

  const handleClick = (e) => {
    if (e.target.classList.contains('see-more-link') || 
        e.target.classList.contains('book-now-btn')) {
      return;
    }
    if (link) {
      navigate(link);
    }
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/booking?serviceId=${id}&type=${title.includes('Surgery') ? 'Surgery' : 'Service'}`);
  };

  return (
    <div
      className="card mb-4 mx-auto shadow-sm"
      style={{ 
        width: "100%", 
        height: "220px", 
        cursor: "pointer",
        display: "flex",
        flexDirection: "row"
      }}
      onClick={handleClick}
    >
      <div style={{ 
        width: "40%",
        height: "100%",
        overflow: "hidden"
      }}>
        <img
          src={image || './assets/default-image.jpg'}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>
      <div style={{ 
        width: "60%",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <h5 style={{ 
            fontSize: "1.1rem",
            marginBottom: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {title}
          </h5>
          <p style={{
            fontSize: "0.9rem",
            marginBottom: "10px",
            height: "60px",
            overflow: "hidden"
          }}>
            {truncateDescription(description)}
            {description && description.split(' ').length > MAX_WORDS && (
              <span 
                className="see-more-link text-primary"
                onClick={() => navigate(link)}
                style={{ cursor: 'pointer', marginLeft: "5px" }}
              >
                See More
              </span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <small className="text-muted">{updated}</small>
          <button 
            className="btn btn-sm btn-primary book-now-btn"
            onClick={handleBookNow}
          >
            {title.includes('Product') ? 'Buy Now' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;