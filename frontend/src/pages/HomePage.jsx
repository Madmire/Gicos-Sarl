/**
 * Page d'accueil
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Award, 
  ThumbsUp,
  Phone,
  Mail,
  MapPin,
  CheckCircle
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import ContactForm from '../components/ContactForm';
import Loading from '../components/Loading';
import { propertiesAPI, servicesAPI, testimonialsAPI, galleryAPI, getImageUrl } from '../api';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, servicesRes, testimonialsRes, galleryRes] = await Promise.all([
          propertiesAPI.getRecent(6),
          servicesAPI.getAll(true),
          testimonialsAPI.getAll(true, 3),
          galleryAPI.getAll({ limit: 8 })
        ]);
        setProperties(propsRes.data);
        setServices(servicesRes.data);
        setTestimonials(testimonialsRes.data);
        setGalleryImages(galleryRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: Building2, value: '150+', label: 'Biens vendus' },
    { icon: Users, value: '500+', label: 'Clients satisfaits' },
    { icon: Award, value: '10+', label: 'Années d\'expérience' },
    { icon: ThumbsUp, value: '98%', label: 'Satisfaction client' },
  ];

  const whyChooseUs = [
    { title: 'Expertise locale', description: 'Une connaissance approfondie du marché immobilier sénégalais.' },
    { title: 'Service personnalisé', description: 'Un accompagnement sur mesure pour chaque projet.' },
    { title: 'Transparence', description: 'Des transactions claires et sécurisées.' },
    { title: 'Qualité garantie', description: 'Des biens soigneusement sélectionnés et vérifiés.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Immobilier • Construction • Sonorisation
            </div>

            {/* Logo et nom */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in-up animate-delay-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-premium">
                <span className="text-primary-800 font-bold text-3xl">G</span>
              </div>
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white">GICOS</h1>
                <p className="text-white/70">Galaxie Immobilière Construction et Services</p>
              </div>
            </div>

            {/* Titre principal */}
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up animate-delay-200">
              Trouvez votre <br/>
              <span className="text-gold-400">bien idéal</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-white/80 mb-10 max-w-xl animate-fade-in-up animate-delay-300">
              Votre partenaire de confiance pour tous vos projets immobiliers, 
              de construction et de services au Sénégal.
            </p>

            {/* Boutons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <Link to="/annonces" className="btn-secondary">
                Voir les annonces
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-800">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative -mt-16 z-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-3xl shadow-premium p-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <div className="font-display text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos Services</h2>
            <p className="section-subtitle">
              Une gamme complète de services pour répondre à tous vos besoins
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.slice(0, 8).map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">
              Tous nos services
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="section-title">Annonces récentes</h2>
              <p className="text-gray-600 max-w-xl">
                Découvrez nos dernières opportunités immobilières sélectionnées pour vous
              </p>
            </div>
            <Link to="/annonces" className="btn-outline self-start md:self-auto">
              Voir toutes les annonces
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune annonce disponible pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview */}
      {galleryImages.length > 0 && (
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Nos Réalisations</h2>
              <p className="section-subtitle">
                Découvrez quelques-unes de nos réalisations à travers notre galerie
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.slice(0, 8).map((image, index) => (
                <div 
                  key={image.id} 
                  className={`relative overflow-hidden rounded-2xl ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <img
                    src={getImageUrl(image.filename)}
                    alt={image.title || 'Réalisation GICOS'}
                    className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/galerie" className="btn-primary">
                Voir toute la galerie
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="section bg-primary-800 text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Pourquoi choisir <span className="text-gold-400">GICOS</span> ?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Depuis plus de 10 ans, nous accompagnons nos clients dans la réalisation 
                de leurs projets immobiliers et de construction avec professionnalisme et engagement.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <Icon className="w-10 h-10 mx-auto mb-3 text-gold-400" />
                      <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Ce que disent nos clients</h2>
              <p className="section-subtitle">
                La satisfaction de nos clients est notre plus belle récompense
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="section bg-gray-50" id="contact">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title">Contactez-nous</h2>
              <p className="text-gray-600 mb-8">
                Vous avez un projet immobilier ou une question ? N'hésitez pas à nous contacter. 
                Notre équipe est à votre disposition pour vous accompagner.
              </p>

              <div className="space-y-6">
                <a href="tel:+221770000000" className="flex items-center gap-4 text-gray-700 hover:text-primary-700 transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-gray-500">+221 77 000 00 00</p>
                  </div>
                </a>

                <a href="mailto:contact@gicos.sn" className="flex items-center gap-4 text-gray-700 hover:text-primary-700 transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-500">contact@gicos.sn</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-500">Dakar, Sénégal - Quartier Grand-Dakar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium p-8">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
