/**
 * Composant carte de service
 * GICOS - Galaxie Immobiliere Construction et Services
 */

import React from 'react';
import { 
  Building2, 
  Hammer, 
  Zap, 
  Droplet, 
  Paintbrush, 
  Volume2,
  Grid3X3,
  CheckCircle
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
  const { name, short_description, icon, features } = service;
  
  const Icon = iconMap[icon] || Building2;
  
  let featuresList = [];
  try {
    featuresList = JSON.parse(features || '[]');
  } catch (e) {
    featuresList = [];
  }

  return (
    <div 
      className="card p-6 hover:shadow-soft-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-800 transition-colors">
        <Icon className="w-7 h-7 text-primary-700 group-hover:text-white transition-colors" />
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-800 transition-colors">
        {name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {short_description}
      </p>
      
      {featuresList.length > 0 && (
        <ul className="space-y-2">
          {featuresList.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={14} className="text-primary-600 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceCard;
