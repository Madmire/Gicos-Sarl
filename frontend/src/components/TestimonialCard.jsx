/**
 * Composant carte de temoignage
 * GICOS - Galaxie Immobiliere Construction et Services
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const { name, role, content, rating } = testimonial;

  return (
    <div className="card p-6">
      {/* Quote icon */}
      <Quote className="w-10 h-10 text-primary-200 mb-4" />
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}
          />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-600 mb-6 line-clamp-4">
        "{content}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-700 font-bold text-lg">
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
