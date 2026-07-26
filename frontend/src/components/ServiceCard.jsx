/**
 * Composant carte de service
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React from 'react';
import { 
  Building2, 
  Hammer, 
  Zap, 
  Grid3X3, 
  Droplet, 
  Paintbrush, 
  Volume2,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  building: Building2,
  hammer: Hammer,
  zap: Zap,
  grid: Grid3X3,
  droplet: Droplet,
  paintbrush: Paintbrush,
  'volume-2': Volume2,
};

const ServiceCard = ({ service, onClick }) => {
  const { name, icon, short_description, features } = service;
  
  const IconComponent = iconMap[icon] || Building2;
  
  // Parser les features s'ils sont en JSON string
  let featuresList = [];
  try {
    featuresList = features ? JSON.parse(features) : [];
  } catch {
    featuresList = [];
  }

  return (
    <div className="card p-6 h-full flex flex-col">
      {/* Icône */}
      <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-5">
        <IconComponent className="w-7 h-7 text-primary-700" />
      </div>

      {/* Titre */}
      <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
        {name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-5 flex-grow">
        {short_description}
      </p>

      {/* Liste des prestations */}
      {featuresList.length > 0 && (
        <ul className="space-y-2 mb-6">
          {featuresList.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Bouton */}
      <button
        onClick={onClick}
        className="flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors mt-auto"
      >
        En savoir plus
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default ServiceCard;
