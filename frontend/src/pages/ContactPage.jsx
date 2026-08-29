/**
 * Page Contact
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      content: ['+226 66 39 52 54'],
      link: 'tel:+22666395254'
    },
    {
      icon: Mail,
      title: 'Email',
      content: ['gicossarl10@gmail.com'],
      link: 'mailto:gicossarl10@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: ['Koubri', 'Ouagadougou, Burkina Faso'],
      link: null
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: ['Lun - Ven: 8h - 18h', 'Sam: 9h - 15h'],
      link: null
    }
  ];

  const socialLinks = [
    {
      label: 'WhatsApp',
      href: 'https://wa.me/22666395254',
      icon: MessageCircle,
      className: 'hover:bg-emerald-600',
    },
    {
      label: 'Email',
      href: 'mailto:gicossarl10@gmail.com',
      icon: Mail,
      className: 'hover:bg-primary-800',
    },
    {
      label: 'Téléphone',
      href: 'tel:+22666395254',
      icon: Phone,
      className: 'hover:bg-primary-800',
    },
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

            {/* Social / contact rapide */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nous joindre rapidement</h3>
              <div className="flex gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={item.label}
                      className={`w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 hover:text-white transition-colors ${item.className}`}
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62178.35307367945!2d-1.5870855!3d12.3714277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebe6c951862c1%3A0x4d7d1b4d8a1b4e20!2sOuagadougou%2C%20Burkina%20Faso!5e0!3m2!1sfr!2sfr!4v1706000000000!5m2!1sfr!2sfr"
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
