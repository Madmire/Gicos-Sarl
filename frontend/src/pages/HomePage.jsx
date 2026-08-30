/**
 * Page d'accueil
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2,
  Hammer,
  Zap,
  Grid3X3,
  Droplets,
  Paintbrush,
  Volume2,
  Users, 
  Award, 
  ThumbsUp,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import TestimonialForm from '../components/TestimonialForm';
import ContactForm from '../components/ContactForm';
import Loading from '../components/Loading';
import { propertiesAPI, servicesAPI, testimonialsAPI, galleryAPI, getImageUrl } from '../api';
import SafeImage from '../components/SafeImage';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [typedText, setTypedText] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    const text = 'GICOS Sarl';
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      setTypedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Building2, value: '45+', label: 'Biens traités' },
    { icon: Users, value: '180+', label: 'Clients accompagnés' },
    { icon: Award, value: '8+', label: 'Années d\'expérience' },
    { icon: ThumbsUp, value: '92%', label: 'Satisfaction client' },
  ];

  const featuredPillars = [
    {
      name: 'Achat & vente',
      description: 'Une sélection rigoureuse de biens résidentiels et professionnels, selon vos objectifs.',
      icon: Building2,
    },
    {
      name: 'Construction',
      description: 'Des projets structurés, suivis et livrés avec un souci constant d’excellence.',
      icon: Hammer,
    },
    {
      name: 'Travaux & finitions',
      description: 'Peinture, plomberie, électricité, aménagement et finitions de qualité.',
      icon: Zap,
    },
    {
      name: 'Conseil & gestion',
      description: 'Un accompagnement clair, transparent et orienté vers des décisions sûres.',
      icon: Users,
    },
  ];

  const expertiseCards = [
    { name: 'Acquisition', description: 'Recherche de biens adaptés à votre budget et à vos objectifs.', icon: Building2 },
    { name: 'Construction', description: 'Cadrage, suivi et réalisation d’ouvrages résidents et professionnels.', icon: Hammer },
    { name: 'Travaux & finitions', description: 'Electricité, plomberie, carrelage et finition soignée.', icon: Zap },
    { name: 'Conseil & suivi', description: 'Accompagnement jusqu’à la livraison et à la sécurisation de votre projet.', icon: Users },
  ];

  const whyChooseUs = [
    { title: 'Expertise locale', description: 'Une connaissance approfondie du marché immobilier burkinabè.' },
    { title: 'Service personnalisé', description: 'Un accompagnement sur mesure pour chaque projet.' },
    { title: 'Transparence', description: 'Des transactions claires et sécurisées.' },
    { title: 'Qualité garantie', description: 'Des biens soigneusement sélectionnés et vérifiés.' },
  ];

  const visibleTestimonials = testimonials.length > 0
    ? Array.from({ length: 3 }, (_, index) => testimonials[(testimonialIndex + index) % testimonials.length])
    : [];

  return (
    <div>
      {/* Hero Section (improved layout) */}
      <section className="relative min-h-[84vh] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="container-custom py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                Immobilier • Construction • Services
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                <span className="block">Bienvenue chez</span>
                <span className="hero-typewriter text-gold-400">{typedText}</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-6">
                Votre partenaire de confiance pour tous vos projets immobiliers,
                de construction et de services techniques au Burkina Faso.
              </p>
              {/* Search bar inspired by dar.ma */}
              <form
                className="bg-white p-4 rounded-xl shadow mt-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = new URLSearchParams();
                  if (searchType) q.set('type', searchType);
                  if (searchLocation) q.set('city', searchLocation);
                  navigate(`/annonces?${q.toString()}`);
                }}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">Type (Tous)</option>
                    <option value="vente">A vendre</option>
                    <option value="location">A louer</option>
                  </select>

                  <input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Ville, quartier..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />

                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium">
                    Rechercher
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link to="/annonces" className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold shadow-lg inline-flex items-center gap-2">
                  Voir les annonces
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="px-6 py-3 rounded-full bg-slate-800/50 border border-white/20 text-white font-medium inline-flex items-center gap-2">
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Right: hero image preview */}
            <div className="w-full flex justify-center md:justify-end">
              <div className="hero-image-panel w-full max-w-[560px] h-[420px]">
                <img src="/home1.png" alt="Maison moderne" className="hero-image-main hero-image-one" />
                <img src="/home2.png" alt="Maison en construction" className="hero-image-main hero-image-two" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '30px 30px'}} />
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

      <section className="section bg-white">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <p className="section-kicker">Ce que nous faisons</p>
            <h2 className="section-title">Des solutions immobilières et de construction sur mesure</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredPillars.map(({ name, description, icon: Icon }) => (
              <div key={name} className="premium-card group">
                <div className="premium-card-icon">
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <h3 className="premium-card-title">{name}</h3>
                <p className="premium-card-text">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise / approach cards */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="mb-12 grid items-end gap-4 lg:grid-cols-[1.1fr_2.5fr]">
            <h2 className="section-heading-title mb-0 text-left">Notre approche</h2>
            <p className="section-heading-copy mb-0 text-left">
              Une expertise globale pensée pour sécuriser et accompagner vos projets.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {expertiseCards.map(({ name, description, icon: Icon }) => (
              <div
                key={name}
                className="group rounded-3xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary-200"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-inner">
                  <Icon className="h-8 w-8" strokeWidth={2.2} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{name}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white">
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
                  onClick={() => navigate(`/services?s=${service.slug}`)}
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
                <Link
                  key={image.id}
                  to="/galerie"
                  className={`relative overflow-hidden rounded-2xl block ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <SafeImage
                    src={getImageUrl(image.filename)}
                    alt={image.title || 'Réalisation GICOS'}
                    className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
                  />
                </Link>
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
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Pourquoi choisir <span className="text-gold-400">GICOS Sarl</span> ?
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

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold-400/15 flex items-center justify-center">
                  <Award className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">Notre engagement</p>
                  <h3 className="font-display text-2xl font-bold text-white">Qualité & confiance</h3>
                </div>
              </div>

              <ul className="space-y-4 text-white/80">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-400 mt-1" />
                  <span>Accompagnement complet, de l’idée au suivi final.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-400 mt-1" />
                  <span>Des solutions adaptées à chaque besoin immobilier ou professionnel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-400 mt-1" />
                  <span>Un service réactif, clair et orienté satisfaction client.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white" id="temoignages">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="section-heading-title mx-auto max-w-3xl">Ce que les gens disent</h2>
            <p className="section-heading-copy mx-auto mt-4 max-w-4xl text-gray-500">
              Découvrez les avis de nos clients ou partagez votre propre expérience avec GICOS.
            </p>
          </div>

          {testimonials.length > 0 && (
            <div className="relative mb-12">
              <button
                type="button"
                onClick={() => setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-3xl text-gray-700 shadow-sm transition hover:border-gray-300 hover:text-gray-900"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="mx-14 grid gap-6 md:grid-cols-3">
                {visibleTestimonials.map((testimonial) => (
                  <TestimonialCard key={`${testimonial.id}-${testimonial.name}`} testimonial={testimonial} />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-3xl text-gray-700 shadow-sm transition hover:border-gray-300 hover:text-gray-900"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="mt-8 flex justify-center gap-3">
                {Array.from({ length: testimonials.length }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setTestimonialIndex(index)}
                    className={`h-3 w-3 rounded-full transition ${
                      index === testimonialIndex ? 'bg-[#1f2937]' : 'bg-gray-300'
                    }`}
                    aria-label={`Voir le témoignage ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mx-auto max-w-2xl">
            <TestimonialForm />
          </div>
        </div>
      </section>

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
                <a href="tel:+22666395254" className="flex items-center gap-4 text-gray-700 hover:text-primary-700 transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-gray-500">+226 66 39 52 54</p>
                  </div>
                </a>

                <a href="mailto:gicossarl10@gmail.com" className="flex items-center gap-4 text-gray-700 hover:text-primary-700 transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-500">gicossarl10@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-500">Koubri, Ouagadougou, Burkina Faso</p>
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
