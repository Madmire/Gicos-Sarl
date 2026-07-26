/**
 * Composant Footer
 * Pied de page du site GICOS
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos annonces', path: '/annonces' },
    { name: 'Nos services', path: '/services' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    'Immobilier',
    'Construction',
    'Électricité',
    'Carrelage',
    'Plomberie',
    'Peinture / Staff',
    'Sonorisation',
  ];

  return (
    <footer className="bg-gray-900">
      {/* Newsletter section - Flowbite style */}
      <div className="bg-primary-800">
        <div className="container-custom py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Restez informé de nos nouvelles offres
              </h3>
              <p className="text-primary-200">
                Inscrivez-vous à notre newsletter pour recevoir nos dernières annonces
              </p>
            </div>
            <form className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 lg:w-72 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-gold-500 text-gray-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section principale - Flowbite dark style */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1">
                <img src="/logo.png" alt="GICOS" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-white">GICOS</h2>
                <p className="text-xs text-gray-400">Galaxie Immobiliere</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Votre partenaire de confiance pour tous vos projets immobiliers, de construction et de services au Burkina Faso.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 hover:text-primary-400 transition-colors"
                  >
                    <ArrowRight size={14} className="text-primary-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Nos services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link 
                    to="/services"
                    className="flex items-center gap-2 hover:text-primary-400 transition-colors"
                  >
                    <ArrowRight size={14} className="text-primary-500" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+22666395254" 
                  className="flex items-start gap-3 hover:text-primary-400 transition-colors"
                >
                  <Phone size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block">+226 66 39 52 54</span>
                    <span className="block">+226 25 00 00 00</span>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:gicossarl10@gmail.com" 
                  className="flex items-center gap-3 hover:text-primary-400 transition-colors"
                >
                  <Mail size={20} className="text-primary-500 flex-shrink-0" />
                  <span>gicossarl10@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
                <span>Ouagadougou, Burkina Faso<br />Koubri</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright - Flowbite style */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} <span className="font-semibold text-white">GICOS</span> - Galaxie Immobilière Construction et Services SARL. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <Link to="/politique-confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
