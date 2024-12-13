import React from 'react';
import './propertyCard.css';

const PropertyCard = ({ title, image, price, location }) => {
  return (
    <div className="property-card">
      <img src={image} alt={title} />
      <div className="property-info">
        <h3>{title}</h3>
        <p>{location}</p>
        <p><strong>{price}</strong>/night</p>
      </div>
    </div>
  );
};

export default PropertyCard;