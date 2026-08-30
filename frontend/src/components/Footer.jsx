/**
 * Composant Footer
 * Pied de page du site GICOS
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { contactAPI } from '../api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null); // success | error | loading

  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos annonces', path: '/annonces' },
    { name: 'Nos services', path: '/services' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Témoignages', path: '/#temoignages' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    { name: 'Immobilier', slug: 'immobilier' },
    { name: 'Construction', slug: 'construction' },
    { name: 'Électricité', slug: 'electricite' },
    { name: 'Carrelage', slug: 'carrelage' },
    { name: 'Plomberie', slug: 'plomberie' },
    { name: 'Peinture / Staff', slug: 'peinture' },
    { name: 'Sonorisation', slug: 'sonorisation' },
  ];

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    setNewsletterStatus('loading');
    try {
      await contactAPI.send({
        name: 'Newsletter',
        email: value,
        phone: '',
        message: `Inscription newsletter depuis le site GICOS.\nEmail: ${value}`,
      });
      setNewsletterStatus('success');
      setEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <footer className="bg-gray-900">
      {/* Newsletter section */}
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
            {newsletterStatus === 'success' ? (
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-3 rounded-lg">
                <CheckCircle size={18} className="text-emerald-300" />
                <span>Inscription enregistrée. Merci !</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-3 w-full lg:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="flex-1 lg:w-72 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="px-6 py-3 bg-gold-500 text-gray-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-60"
                >
                  {newsletterStatus === 'loading' ? '...' : "S'inscrire"}
                </button>
              </form>
            )}
          </div>
          {newsletterStatus === 'error' && (
            <p className="text-center lg:text-right text-red-200 text-sm mt-3">
              Impossible d’enregistrer l’inscription. Réessayez ou écrivez-nous.
            </p>
          )}
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
                href="https://wa.me/22666395254"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a 
                href="mailto:gicossarl10@gmail.com"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors text-white"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a 
                href="tel:+22666395254"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors text-white"
                aria-label="Téléphone"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    <ArrowRight size={14} className="text-primary-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Nos services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link 
                    to={`/services?s=${service.slug}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    <ArrowRight size={14} className="text-primary-500" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a 
                  href="tel:+22666395254" 
                  className="flex items-start gap-3 hover:text-primary-400 transition-colors"
                >
                  <Phone size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>+226 66 39 52 54</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/22666395254"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-primary-400 transition-colors"
                >
                  <MessageCircle size={20} className="text-primary-500 flex-shrink-0" />
                  <span>WhatsApp</span>
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
