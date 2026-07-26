/**
 * Composant carte de témoignage
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const { name, role, content, rating } = testimonial;

  return (
    <div className="card p-6 h-full flex flex-col">
      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-primary-200" />
      </div>

      {/* Contenu */}
      <p className="text-gray-600 italic flex-grow mb-6">
        "{content}"
      </p>

      {/* Étoiles */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={index < rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}
          />
        ))}
      </div>

      {/* Auteur */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-700 font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
