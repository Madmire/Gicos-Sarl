/**
 * Composant carte d'annonce immobilière
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize, BedDouble, Bath } from 'lucide-react';
import { getImageUrl, formatPrice } from '../api';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    price,
    city,
    property_type,
    category,
    surface,
    rooms,
    bedrooms,
    bathrooms,
    primary_image
  } = property;

  return (
    <Link to={`/annonces/${id}`} className="card group">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {primary_image ? (
          <img
            src={getImageUrl(primary_image)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
        
        {/* Badge type */}
        <div className="absolute top-4 left-4">
          <span className={`badge ${property_type === 'vente' ? 'badge-vente' : 'badge-location'}`}>
            {property_type === 'vente' ? 'À vendre' : 'À louer'}
          </span>
        </div>

        {/* Prix */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-primary-800 font-bold text-lg">
              {formatPrice(price)}
            </span>
            {property_type === 'location' && (
              <span className="text-gray-500 text-sm"> / mois</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Catégorie */}
        {category && (
          <p className="text-primary-600 text-sm font-medium mb-1 capitalize">
            {category}
          </p>
        )}

        {/* Titre */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-primary-800 transition-colors">
          {title}
        </h3>

        {/* Localisation */}
        <div className="flex items-center gap-1.5 text-gray-500 mb-4">
          <MapPin size={16} className="text-primary-600" />
          <span className="text-sm">{city}</span>
        </div>

        {/* Caractéristiques */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          {surface && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Maximize size={16} />
              <span className="text-sm">{surface} m²</span>
            </div>
          )}
          {bedrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <BedDouble size={16} />
              <span className="text-sm">{bedrooms} ch.</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bath size={16} />
              <span className="text-sm">{bathrooms} sdb</span>
            </div>
          )}
          {rooms && !bedrooms && !bathrooms && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Maximize size={16} />
              <span className="text-sm">{rooms} pièces</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
