/**
 * Page gestion de la galerie admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  Filter,
  X,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { galleryAPI, getImageUrl } from '../../api';
import Loading, { ButtonLoading } from '../../components/Loading';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  
  // Upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadType, setUploadType] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Selection state
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await galleryAPI.getTypes();
        setTypes(response.data);
        if (response.data.length > 0) {
          setUploadType(response.data[0].value);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchTypes();
  }, []);

  const fetchImages = async () => {
    try {
      const params = activeFilter
        ? { image_type: activeFilter, limit: 500 }
        : { limit: 500 };
      const response = await galleryAPI.getAll(params);
      setImages(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeFilter]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setShowUploadModal(true);
  };

  const clearUploadSelection = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowUploadModal(false);
  };

  const handleUpload = async () => {
    if (!uploadType || selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      await galleryAPI.upload(selectedFiles, uploadType);
      clearUploadSelection();
      fetchImages();
    } catch (error) {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    
    try {
      await galleryAPI.delete(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    if (!window.confirm(`Supprimer ${selectedImages.length} image(s) ?`)) return;
    
    try {
      await galleryAPI.deleteMultiple(selectedImages);
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
      setSelectionMode(false);
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const toggleImageSelection = (id) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galerie</h1>
          <p className="text-gray-600">Gérez les images de votre galerie</p>
        </div>
        <label className="btn-primary cursor-pointer">
          <Upload size={20} className="mr-2" />
          Ajouter des images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter size={18} />
            <span className="text-sm font-medium">Filtrer:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === ''
                  ? 'bg-primary-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tout
            </button>
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setActiveFilter(type.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === type.value
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Selection mode toggle */}
          <div className="ml-auto flex items-center gap-4">
            {selectionMode && selectedImages.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-red-600 text-sm font-medium hover:underline flex items-center gap-2"
              >
                <Trash2 size={16} />
                Supprimer ({selectedImages.length})
              </button>
            )}
            <button
              onClick={() => {
                setSelectionMode(!selectionMode);
                setSelectedImages([]);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectionMode
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectionMode ? 'Annuler' : 'Sélectionner'}
            </button>
          </div>
        </div>
      </div>

      {/* Images grid */}
      <div className="card p-6">
        {loading ? (
          <Loading />
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer ${
                  selectionMode && selectedImages.includes(image.id)
                    ? 'ring-4 ring-primary-500'
                    : ''
                }`}
                onClick={() => selectionMode && toggleImageSelection(image.id)}
              >
                <img
                  src={getImageUrl(image.filename)}
                  alt={image.title || ''}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge catégorie */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
                    {types.find(t => t.value === image.image_type)?.label || image.image_type}
                  </span>
                </div>

                {/* Selection checkbox */}
                {selectionMode && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedImages.includes(image.id)
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-white/80 border-gray-300'
                  }`}>
                    {selectedImages.includes(image.id) && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                  </div>
                )}

                {/* Delete button (non-selection mode) */}
                {!selectionMode && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.id);
                      }}
                      className="p-3 bg-white rounded-xl hover:bg-red-50"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune image
            </h3>
            <p className="text-gray-500">
              {activeFilter 
                ? 'Aucune image dans cette catégorie' 
                : 'Commencez par ajouter des images à la galerie'}
            </p>
          </div>
        )}
      </div>

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Ajouter des images
                </h3>
                <button
                  onClick={clearUploadSelection}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Category selection */}
              <div>
                <label className="label">Catégorie *</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="select"
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div>
                <p className="label">{selectedFiles.length} image(s) sélectionnée(s)</p>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={clearUploadSelection}
                className="btn-ghost flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary flex-1"
              >
                {uploading ? (
                  <>
                    <ButtonLoading />
                    <span className="ml-2">Upload...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} className="mr-2" />
                    Télécharger
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
