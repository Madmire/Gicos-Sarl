/**
 * Composant Navbar - Style Flowbite
 * Navigation principale du site GICOS
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Écouter le scroll pour changer le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Annonces', path: '/annonces' },
    { name: 'Services', path: '/services' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/95 backdrop-blur-md'
    }`}>
      {/* Top bar - Flowbite style */}
      <div className="hidden lg:block bg-primary-900 text-white">
        <div className="container-custom flex justify-between items-center py-2.5 text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+22666395254" className="flex items-center gap-2 hover:text-gold-400 transition-colors group">
              <Phone size={14} className="group-hover:animate-pulse" />
              <span>+226 66 39 52 54</span>
            </a>
            <a href="mailto:gicossarl10@gmail.com" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <Mail size={14} />
              <span>gicossarl10@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-primary-200">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></span>
            Votre partenaire immobilier de confiance au Burkina Faso
          </div>
        </div>
      </div>

      {/* Main navbar - Flowbite style */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl overflow-hidden">
                <img src="/logo.png" alt="GICOS" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg lg:text-xl text-gray-900">GICOS</h1>
                <p className="text-[10px] lg:text-xs text-gray-500 hidden sm:block">Immobilier - Construction - Services</p>
              </div>
            </Link>

            {/* Navigation desktop - Flowbite style */}
            <div className="hidden lg:flex items-center">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        isActive(link.path)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button - Flowbite style */}
            <div className="hidden lg:flex items-center gap-3">
              <Link 
                to="/annonces" 
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 transition-all"
              >
                Voir les annonces
              </Link>
            </div>

            {/* Mobile menu button - Flowbite style */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Flowbite style */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg">
          <div className="container-custom py-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 px-4 text-sm text-gray-600">
                <Phone size={16} className="text-primary-600" />
                <a href="tel:+22666395254" className="hover:text-primary-700">+226 66 39 52 54</a>
              </div>
              <Link 
                to="/annonces" 
                className="block w-full text-center px-5 py-3 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800"
              >
                Voir les annonces
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
