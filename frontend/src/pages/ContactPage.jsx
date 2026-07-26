/**
 * Page Contact
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      content: ['+221 77 000 00 00', '+221 33 000 00 00'],
      link: 'tel:+221770000000'
    },
    {
      icon: Mail,
      title: 'Email',
      content: ['contact@gicos.sn', 'info@gicos.sn'],
      link: 'mailto:contact@gicos.sn'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: ['Quartier Grand-Dakar', 'Dakar, Sénégal'],
      link: null
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: ['Lun - Ven: 8h - 18h', 'Sam: 9h - 14h'],
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Nous sommes à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans vos projets
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const Wrapper = item.link ? 'a' : 'div';
                const wrapperProps = item.link ? { href: item.link } : {};

                return (
                  <Wrapper
                    key={index}
                    {...wrapperProps}
                    className="card p-5 flex items-start gap-4 hover:shadow-soft-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      {item.content.map((line, i) => (
                        <p key={i} className="text-gray-600 text-sm">{line}</p>
                      ))}
                    </div>
                  </Wrapper>
                );
              })}
            </div>

            {/* Social media */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 hover:bg-primary-800 hover:text-white transition-colors"
                >
                  <Facebook size={22} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 hover:bg-primary-800 hover:text-white transition-colors"
                >
                  <Instagram size={22} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 hover:bg-primary-800 hover:text-white transition-colors"
                >
                  <Linkedin size={22} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <div className="card-premium overflow-hidden">
            <div className="aspect-[21/9] bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15434.890874788892!2d-17.45!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172f5b3c5bb71%3A0xb17c17d92d5f9356!2sGrand-Dakar%2C%20Dakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2sfr!4v1706000000000!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation GICOS"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
