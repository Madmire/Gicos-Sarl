/**
 * Formulaire public de témoignage client
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState } from 'react';
import { Send, CheckCircle, Star } from 'lucide-react';
import { testimonialsAPI } from '../api';
import { ButtonLoading } from './Loading';

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await testimonialsAPI.submit({
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        content: formData.content.trim(),
        rating: formData.rating,
      });
      setSuccess(true);
      setFormData({ name: '', role: '', content: '', rating: 5 });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError('Veuillez vérifier les champs du formulaire.');
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Merci pour votre témoignage !</h3>
        <p className="mb-4 text-gray-600">
          Votre avis a été reçu. Il sera publié après validation par notre équipe.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="font-medium text-primary-600 hover:underline"
        >
          Laisser un autre témoignage
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Partagez votre expérience</h3>
        <p className="mt-1 text-sm text-gray-500">
          Votre avis aide d&apos;autres clients à nous faire confiance.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="testimonial-name" className="label">Nom complet *</label>
          <input
            type="text"
            id="testimonial-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            className="input"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="testimonial-role" className="label">Profession / contexte</label>
          <input
            type="text"
            id="testimonial-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input"
            placeholder="Ex. Propriétaire, Investisseur..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="testimonial-content" className="label">Votre témoignage *</label>
        <textarea
          id="testimonial-content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          minLength={10}
          rows={4}
          className="input resize-none"
          placeholder="Décrivez votre expérience avec GICOS..."
        />
      </div>

      <div>
        <span className="label">Note *</span>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
              className="rounded-lg p-1 transition hover:scale-110"
              aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                className={star <= formData.rating ? 'fill-[#f06d4d] text-[#f06d4d]' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <ButtonLoading />
            <span className="ml-2">Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send size={18} className="mr-2" />
            Envoyer mon témoignage
          </>
        )}
      </button>
    </form>
  );
};

export default TestimonialForm;
