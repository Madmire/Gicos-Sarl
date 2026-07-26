/**
 * Page de liste des annonces
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid, List } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import Loading, { PageLoading } from '../components/Loading';
import { propertiesAPI } from '../api';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Filtres
  const [filters, setFilters] = useState({
    property_type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    rooms: searchParams.get('rooms') || '',
    search: searchParams.get('q') || '',
  });

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          propertiesAPI.getCities(),
          propertiesAPI.getCategories()
        ]);
        setCities(citiesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchInitialData();
  }, []);

  // Charger les annonces
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Construire les paramètres
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });

        const [propsRes, countRes] = await Promise.all([
          propertiesAPI.getAll(params),
          propertiesAPI.getCount(params)
        ]);
        setProperties(propsRes.data);
        setTotalCount(countRes.data.count);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Mettre à jour l'URL
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key === 'property_type' ? 'type' : key === 'search' ? 'q' : key, value);
    } else {
      newParams.delete(key === 'property_type' ? 'type' : key === 'search' ? 'q' : key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      property_type: '',
      city: '',
      category: '',
      min_price: '',
      max_price: '',
      rooms: '',
      search: '',
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Nos Annonces
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Découvrez notre sélection de biens immobiliers à vendre et à louer
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white shadow-soft sticky top-20 md:top-28 z-30">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-12"
              />
            </div>

            {/* Quick filters */}
            <div className="hidden md:flex items-center gap-3">
              <select
                value={filters.property_type}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
                className="select w-auto"
              >
                <option value="">Tous types</option>
                <option value="vente">À vendre</option>
                <option value="location">À louer</option>
              </select>

              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="select w-auto"
              >
                <option value="">Toutes villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="select w-auto"
              >
                <option value="">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            {/* More filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-ghost gap-2 ${showFilters ? 'bg-primary-50' : ''}`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Plus de filtres</span>
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-red-600 font-medium text-sm hover:underline flex items-center gap-1"
              >
                <X size={16} />
                Effacer
              </button>
            )}
          </div>

          {/* Extended filters */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="md:hidden">
                <label className="label">Type</label>
                <select
                  value={filters.property_type}
                  onChange={(e) => handleFilterChange('property_type', e.target.value)}
                  className="select"
                >
                  <option value="">Tous types</option>
                  <option value="vente">À vendre</option>
                  <option value="location">À louer</option>
                </select>
              </div>

              <div className="md:hidden">
                <label className="label">Ville</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="select"
                >
                  <option value="">Toutes villes</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Prix minimum</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Prix maximum</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Pièces minimum</label>
                <select
                  value={filters.rooms}
                  onChange={(e) => handleFilterChange('rooms', e.target.value)}
                  className="select"
                >
                  <option value="">Peu importe</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{totalCount}</span> annonce(s) trouvée(s)
          </p>
        </div>

        {/* Properties grid */}
        {loading ? (
          <PageLoading />
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
