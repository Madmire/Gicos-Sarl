/**
 * Page gestion des services admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { 
  Wrench,
  Edit,
  Save,
  X
} from 'lucide-react';
import { servicesAPI } from '../../api';
import Loading, { ButtonLoading } from '../../components/Loading';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll(false);
        setServices(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleEdit = (service) => {
    setEditingId(service.id);
    setEditForm({
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      features: service.features || '[]',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await servicesAPI.update(editingId, editForm);
      setServices(prev => prev.map(s => 
        s.id === editingId 
          ? { ...s, ...editForm }
          : s
      ));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const parseFeatures = (features) => {
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  const formatFeatures = (featuresArray) => {
    return JSON.stringify(featuresArray, null, 2);
  };

  if (loading) return <div className="p-8"><Loading /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-600">Gérez les textes et descriptions de vos services</p>
      </div>

      {/* Services list */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                  <p className="text-sm text-gray-500">/{service.slug}</p>
                </div>
              </div>
              
              {editingId !== service.id && (
                <button
                  onClick={() => handleEdit(service)}
                  className="btn-ghost p-2"
                >
                  <Edit size={20} />
                </button>
              )}
            </div>

            {editingId === service.id ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Description courte</label>
                  <textarea
                    value={editForm.short_description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, short_description: e.target.value }))}
                    rows={2}
                    className="input resize-none"
                  />
                </div>

                <div>
                  <label className="label">Description complète</label>
                  <textarea
                    value={editForm.full_description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_description: e.target.value }))}
                    rows={4}
                    className="input resize-none"
                  />
                </div>

                <div>
                  <label className="label">Prestations (JSON)</label>
                  <textarea
                    value={editForm.features}
                    onChange={(e) => setEditForm(prev => ({ ...prev, features: e.target.value }))}
                    rows={6}
                    className="input resize-none font-mono text-sm"
                    placeholder='["Prestation 1", "Prestation 2"]'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: ["Prestation 1", "Prestation 2", ...]
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="btn-ghost"
                  >
                    <X size={18} className="mr-2" />
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? (
                      <ButtonLoading />
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Description courte</p>
                  <p className="text-gray-700">{service.short_description || 'Non définie'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Description complète</p>
                  <p className="text-gray-700">{service.full_description || 'Non définie'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Prestations</p>
                  <ul className="space-y-1">
                    {parseFeatures(service.features).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                    {parseFeatures(service.features).length === 0 && (
                      <li className="text-gray-400">Aucune prestation définie</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
