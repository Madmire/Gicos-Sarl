/**
 * Composant carte de temoignage
 * GICOS - Galaxie Immobiliere Construction et Services
 */

import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const { name, role, content, rating } = testimonial;
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[1.75rem] border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-5 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < rating ? 'fill-[#f06d4d] text-[#f06d4d]' : 'text-gray-300'}
            />
          ))}
        </div>

        <p className="text-lg leading-relaxed text-gray-700">
          "{content}"
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f06d4d] text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900">{name}</p>
          {role && <p className="text-base text-gray-500">{role}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
