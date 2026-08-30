/**
 * Page gestion des témoignages admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  Users
} from 'lucide-react';
import { testimonialsAPI } from '../../api';
import Loading, { ButtonLoading } from '../../components/Loading';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    is_active: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll(false, 500);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      content: '',
      rating: 5,
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      content: testimonial.content,
      rating: testimonial.rating,
      is_active: testimonial.is_active,
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await testimonialsAPI.update(editingId, formData);
      } else {
        await testimonialsAPI.create(formData);
      }
      resetForm();
      fetchTestimonials();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;

    try {
      await testimonialsAPI.delete(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="p-8"><Loading /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
          <p className="text-gray-600">Gérez les témoignages clients</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
          <Plus size={20} className="mr-2" />
          Nouveau témoignage
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingId ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                </h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="input"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="label">Rôle / Position</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="input"
                  placeholder="Client particulier"
                />
              </div>

              <div>
                <label className="label">Témoignage *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  className="input resize-none"
                  placeholder="L'expérience avec GICOS a été exceptionnelle..."
                />
              </div>

              <div>
                <label className="label">Note</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star
                        size={28}
                        className={star <= formData.rating 
                          ? 'text-gold-500 fill-gold-500' 
                          : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Afficher sur le site</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="btn-ghost flex-1">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <ButtonLoading /> : (
                    <>
                      <Save size={18} className="mr-2" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials list */}
      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className={`card p-6 ${!testimonial.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    {testimonial.role && (
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= testimonial.rating 
                      ? 'text-gold-500 fill-gold-500' 
                      : 'text-gray-300'}
                  />
                ))}
              </div>

              <p className="text-gray-600 italic line-clamp-3">
                "{testimonial.content}"
              </p>

              {!testimonial.is_active && (
                <span className="inline-block mt-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  En attente de validation
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 card p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun témoignage
            </h3>
            <p className="text-gray-500 mb-6">
              Ajoutez des témoignages clients pour renforcer votre crédibilité
            </p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
              <Plus size={20} className="mr-2" />
              Ajouter un témoignage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
