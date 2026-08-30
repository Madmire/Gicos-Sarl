/**
 * Page formulaire d'annonce admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Star,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { propertiesAPI, getImageUrl } from '../../api';
import SafeImage from '../../components/SafeImage';
import { ButtonLoading, PageLoading } from '../../components/Loading';

const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    property_type: 'vente',
    category: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    living_rooms: '',
    kitchens: '',
    garage: false,
    garden: false,
    featured: false,
  });

  // Charger les données en mode édition
  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        try {
          const response = await propertiesAPI.getById(id);
          const prop = response.data;
          setFormData({
            title: prop.title || '',
            description: prop.description || '',
            price: prop.price || '',
            city: prop.city || '',
            property_type: prop.property_type || 'vente',
            category: prop.category || '',
            surface: prop.surface || '',
            rooms: prop.rooms || '',
            bedrooms: prop.bedrooms || '',
            bathrooms: prop.bathrooms || '',
            living_rooms: prop.living_rooms || '',
            kitchens: prop.kitchens || '',
            garage: prop.garage || false,
            garden: prop.garden || false,
            featured: prop.featured || false,
          });
          setImages(prop.images || []);
        } catch (error) {
          alert('Erreur lors du chargement de l\'annonce');
          navigate('/admin/annonces');
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Créer les URLs de prévisualisation
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Préparer les données
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        surface: formData.surface ? parseFloat(formData.surface) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        living_rooms: formData.living_rooms ? parseInt(formData.living_rooms) : null,
        kitchens: formData.kitchens ? parseInt(formData.kitchens) : null,
      };

      let propertyId = id;

      if (isEdit) {
        await propertiesAPI.update(id, data);
      } else {
        const response = await propertiesAPI.create(data);
        propertyId = response.data.id;
      }

      // Upload des nouvelles images
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        await propertiesAPI.uploadImages(propertyId, selectedFiles);
      }

      navigate('/admin/annonces');
    } catch (error) {
      console.error('Erreur:', error);
      const detail = error.response?.data?.detail;
      alert(typeof detail === 'string' ? detail : 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    
    try {
      await propertiesAPI.deleteImage(id, imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await propertiesAPI.setPrimaryImage(id, imageId);
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
    } catch (error) {
      alert('Erreur');
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/annonces"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Modifiez les informations de l\'annonce' : 'Créez une nouvelle annonce immobilière'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations principales */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Informations principales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Ex: Belle villa avec piscine"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="Description détaillée du bien..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Prix (FCFA) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="input"
                    placeholder="50000000"
                  />
                </div>
                <div>
                  <label className="label">Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Ouagadougou"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Type *</label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    <option value="vente">Vente</option>
                    <option value="location">Location</option>
                  </select>
                </div>
                <div>
                  <label className="label">Catégorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select"
                  >
                    <option value="">Sélectionner</option>
                    <option value="maison">Maison</option>
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="terrain">Terrain</option>
                    <option value="bureau">Bureau</option>
                    <option value="commerce">Commerce</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Caractéristiques</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Surface (m²)</label>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Pièces</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Chambres</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Salles de bain</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Salons</label>
                <input
                  type="number"
                  name="living_rooms"
                  value={formData.living_rooms}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Cuisines</label>
                <input
                  type="number"
                  name="kitchens"
                  value={formData.kitchens}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="garage"
                  checked={formData.garage}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Garage</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="garden"
                  checked={formData.garden}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Jardin</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">Mettre en avant</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Images</h2>

            {/* Images existantes (mode édition) */}
            {images.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Images actuelles</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <SafeImage
                        src={getImageUrl(image.filename)}
                        alt=""
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      {image.is_primary && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-gold-500 text-white text-xs rounded-lg flex items-center gap-1">
                          <Star size={12} fill="currentColor" />
                          Principal
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(image.id)}
                            className="p-2 bg-white rounded-lg hover:bg-gold-100"
                            title="Définir comme principale"
                          >
                            <Star size={18} className="text-gold-600" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-2 bg-white rounded-lg hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prévisualisation des nouvelles images */}
            {previewUrls.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Nouvelles images à ajouter</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt=""
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload zone */}
            <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Cliquez pour ajouter des images</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG jusqu'à 10 Mo</p>
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
            
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full mb-3"
            >
              {saving ? (
                <>
                  <ButtonLoading />
                  <span className="ml-2">
                    {uploadingImages ? 'Upload des images...' : 'Enregistrement...'}
                  </span>
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {isEdit ? 'Mettre à jour' : 'Créer l\'annonce'}
                </>
              )}
            </button>

            <Link to="/admin/annonces" className="btn-ghost w-full">
              Annuler
            </Link>

            {isEdit && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  to={`/annonces/${id}`}
                  target="_blank"
                  className="text-primary-600 text-sm font-medium hover:underline"
                >
                  Voir l'annonce sur le site →
                </Link>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;
