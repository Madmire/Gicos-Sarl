/**
 * Composant formulaire de contact
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { contactAPI } from '../api';
import { ButtonLoading } from './Loading';

const ContactForm = ({ propertyId = null, compact = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await contactAPI.send({
        ...formData,
        property_id: propertyId,
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`${compact ? 'p-6' : 'p-8'} bg-emerald-50 rounded-2xl text-center`}>
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Message envoyé !</h3>
        <p className="text-gray-600 mb-4">
          Nous vous répondrons dans les plus brefs délais.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-primary-600 font-medium hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">Nom complet *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input"
          placeholder="Votre nom"
        />
      </div>

      <div className={compact ? '' : 'grid md:grid-cols-2 gap-4'}>
        <div>
          <label htmlFor="email" className="label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="label">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="+221 77 000 00 00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={compact ? 3 : 5}
          className="input resize-none"
          placeholder="Votre message..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <ButtonLoading />
        ) : (
          <>
            <Send size={18} className="mr-2" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
