/**
 * Page Galerie
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { Images } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import { PageLoading } from '../components/Loading';
import { galleryAPI, getImageUrl } from '../api';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await galleryAPI.getTypes();
        setTypes(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const params = activeFilter ? { image_type: activeFilter } : {};
        const response = await galleryAPI.getAll(params);
        setImages(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [activeFilter]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
  };

  const lightboxImages = images.map(img => getImageUrl(img.filename));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Notre Galerie
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Découvrez nos réalisations dans les domaines de l'immobilier, 
            la construction et les services techniques
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-soft sticky top-20 md:top-28 z-30">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter('')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeFilter === ''
                  ? 'bg-primary-800 text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tout
            </button>
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setActiveFilter(type.value)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  activeFilter === type.value
                    ? 'bg-primary-800 text-white shadow-soft'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="container-custom py-8">
        {loading ? (
          <PageLoading />
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-soft aspect-square"
              >
                <img
                  src={getImageUrl(image.filename)}
                  alt={image.title || 'Image galerie'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                
                {/* Badge catégorie */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-800">
                    {types.find(t => t.value === image.image_type)?.label || image.image_type}
                  </span>
                </div>

                {/* Zoom icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Images className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune image dans cette catégorie
            </h3>
            <p className="text-gray-500">
              Essayez de sélectionner une autre catégorie
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={() => setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1))}
          onNext={() => setLightboxIndex(prev => (prev === lightboxImages.length - 1 ? 0 : prev + 1))}
        />
      )}
    </div>
  );
};

export default GalleryPage;
