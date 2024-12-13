import React from 'react';
import PropertyCard from '../PropertyCard/PropertyCard';
import './propertyLists.css';

const PropertyList = () => {
  const properties = [
    {
      id: 1,
      title: 'Beautiful Beach House',
      image: 'https://via.placeholder.com/300',
      price: '$150',
      location: 'Miami Beach',
    },
    {
      id: 2,
      title: 'Cozy Mountain Cabin',
      image: 'https://via.placeholder.com/300',
      price: '$120',
      location: 'Aspen',
    },
    {
      id: 3,
      title: 'Modern Apartment in the City',
      image: 'https://via.placeholder.com/300',
      price: '$100',
      location: 'New York',
    },
  ];

  return (
    <div className="property-list">
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          title={property.title}
          image={property.image}
          price={property.price}
          location={property.location}
        />
      ))}
    </div>
  );
};

export default PropertyList;