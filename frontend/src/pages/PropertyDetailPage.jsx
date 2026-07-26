/**
 * Page de détail d'une annonce
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Sofa,
  ChefHat,
  Car,
  Trees,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { PageLoading } from '../components/Loading';
import { propertiesAPI, getImageUrl, formatPrice } from '../api';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertiesAPI.getById(id);
        setProperty(response.data);
      } catch (err) {
        setError('Annonce non trouvée');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <PageLoading />;

  if (error || !property) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Annonce non trouvée'}</h2>
        <Link to="/annonces" className="btn-primary">
          <ArrowLeft size={18} className="mr-2" />
          Retour aux annonces
        </Link>
      </div>
    );
  }

  const images = property.images?.map(img => getImageUrl(img.filename)) || [];
  
  const characteristics = [
    { icon: Maximize, label: 'Surface', value: property.surface ? `${property.surface} m²` : null },
    { icon: BedDouble, label: 'Chambres', value: property.bedrooms },
    { icon: Bath, label: 'Salles de bain', value: property.bathrooms },
    { icon: Sofa, label: 'Salons', value: property.living_rooms },
    { icon: ChefHat, label: 'Cuisines', value: property.kitchens },
    { icon: Car, label: 'Garage', value: property.garage ? 'Oui' : null },
    { icon: Trees, label: 'Jardin', value: property.garden ? 'Oui' : null },
  ].filter(c => c.value);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Link 
            to="/annonces" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux annonces
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image gallery */}
            <div className="card-premium overflow-hidden">
              <div className="relative aspect-[16/10] bg-gray-100">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-contain bg-gray-900"
                      style={{ objectFit: 'contain' }}
                    />
                    
                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Image counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image disponible
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`badge ${property.property_type === 'vente' ? 'badge-vente' : 'badge-location'}`}>
                    {property.property_type === 'vente' ? 'À vendre' : 'À louer'}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-primary-600 shadow-md' 
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Vue ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Title & Location */}
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  {property.category && (
                    <p className="text-primary-600 font-medium mb-2 capitalize">
                      {property.category}
                    </p>
                  )}
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                    {property.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                  <button className="p-3 bg-gray-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={20} className="text-primary-600" />
                <span>{property.city}</span>
              </div>
            </div>

            {/* Characteristics */}
            {characteristics.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                  Caractéristiques
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {characteristics.map((char, index) => {
                    const Icon = char.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{char.label}</p>
                          <p className="font-semibold text-gray-900">{char.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Right column - Price & Contact */}
          <div className="space-y-6">
            {/* Price card */}
            <div className="card-premium p-6 bg-primary-800 text-white sticky top-32">
              <p className="text-white/70 mb-2">Prix</p>
              <div className="text-3xl font-display font-bold mb-1">
                {formatPrice(property.price)}
              </div>
              {property.property_type === 'location' && (
                <p className="text-white/70">par mois</p>
              )}

              <div className="mt-6 pt-6 border-t border-white/20">
                <a 
                  href="tel:+221770000000"
                  className="btn-secondary w-full mb-3"
                >
                  <Phone size={18} className="mr-2" />
                  Appeler maintenant
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="card p-6">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-4">
                Intéressé par ce bien ?
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Remplissez ce formulaire et nous vous recontacterons rapidement.
              </p>
              <ContactForm propertyId={property.id} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
