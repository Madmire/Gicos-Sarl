/**
 * Page Services
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Hammer, 
  Zap, 
  Grid3X3, 
  Droplet, 
  Paintbrush, 
  Volume2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { PageLoading } from '../components/Loading';
import { servicesAPI } from '../api';

const iconMap = {
  building: Building2,
  hammer: Hammer,
  zap: Zap,
  grid: Grid3X3,
  droplet: Droplet,
  paintbrush: Paintbrush,
  'volume-2': Volume2,
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState(null);
  const detailsRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll(true);
        setServices(response.data);
        if (response.data.length > 0) {
          const slug = searchParams.get('s');
          const fromQuery = slug
            ? response.data.find((s) => s.slug === slug)
            : null;
          setActiveService(fromQuery || response.data[0]);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchParams]);

  const handleServiceClick = (service) => {
    setActiveService(service);
    if (window.innerWidth < 1024 && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const parseFeatures = (features) => {
    try {
      return features ? JSON.parse(features) : [];
    } catch {
      return [];
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Nos Services
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Une gamme complète de services pour répondre à tous vos besoins 
            en immobilier, construction et équipements techniques
          </p>
        </div>
      </div>

      {/* Services overview */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Building2;
              const isActive = activeService?.id === service.id;
              
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-800 text-white shadow-premium scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-gold-400' : 'text-primary-600'}`} />
                  <p className="font-medium text-sm">{service.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service details */}
      <section className="section" ref={detailsRef}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Building2;
              const features = parseFeatures(service.features);
              const isActive = activeService?.id === service.id;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className={`lg:col-span-2 grid lg:grid-cols-2 gap-8 items-center card-premium p-8 transition-all duration-500 ${
                    isActive ? 'opacity-100' : 'hidden'
                  }`}
                >
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary-700" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                          {service.name}
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      {service.full_description || service.short_description}
                    </p>

                    {features.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-4">Nos prestations :</h4>
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visual */}
                  <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
                    <Icon className="w-32 h-32 text-primary-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All services grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Tous nos services</h2>
            <p className="section-subtitle">
              Cliquez sur un service pour en savoir plus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Building2;
              const features = parseFeatures(service.features);

              return (
                <div 
                  key={service.id} 
                  className="card p-6 hover:shadow-premium transition-all duration-300 cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary-700" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 mb-5 line-clamp-2">
                    {service.short_description}
                  </p>

                  {features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {features.length > 3 && (
                        <li className="text-sm text-primary-600 font-medium">
                          + {features.length - 3} autres prestations
                        </li>
                      )}
                    </ul>
                  )}

                  <button className="flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors mt-auto">
                    En savoir plus
                    <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Besoin d'un de nos services ?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès maintenant pour discuter de votre projet. 
            Notre équipe est à votre écoute pour vous accompagner.
          </p>
          <Link to="/contact" className="btn-secondary inline-flex">
            Contactez-nous
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
