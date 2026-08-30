/**
 * Image avec fallback si URL invalide ou fichier absent (ex. redeploy Render)
 */

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const SafeImage = ({ src, alt = '', className = '', fallbackClassName = '' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gray-200 text-gray-400 ${fallbackClassName || className}`}
      >
        <ImageOff size={28} />
        <span className="text-xs px-2 text-center">Image indisponible</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default SafeImage;
