/**
 * Page liste des annonces admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Building2
} from 'lucide-react';
import { propertiesAPI, getImageUrl, formatPrice } from '../../api';
import Loading from '../../components/Loading';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProperties = async () => {
    try {
      const params = search ? { search } : {};
      const response = await propertiesAPI.getAll(params);
      setProperties(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    
    try {
      await propertiesAPI.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
          <p className="text-gray-600">Gérez vos annonces immobilières</p>
        </div>
        <Link to="/admin/annonces/nouvelle" className="btn-primary">
          <Plus size={20} className="mr-2" />
          Nouvelle annonce
        </Link>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Properties list - TailAdmin Table Style */}
      <div className="admin-table">
        {loading ? (
          <div className="p-8">
            <Loading />
          </div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-stroke">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Annonce</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Ville</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-black">Prix</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {property.primary_image ? (
                            <img
                              src={getImageUrl(property.primary_image)}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-black truncate max-w-[200px]">
                            {property.title}
                          </p>
                          {property.category && (
                            <p className="text-sm text-bodydark2 capitalize">{property.category}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-bodydark">{property.city}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        property.property_type === 'vente' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-primary-100 text-primary-700'
                      }`}>
                        {property.property_type === 'vente' ? 'Vente' : 'Location'}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-black">
                      {formatPrice(property.price)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/annonces/${property.id}`}
                          target="_blank"
                          className="p-2 text-bodydark2 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/annonces/${property.id}`}
                          className="p-2 text-bodydark2 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-bodydark2 hover:text-meta-1 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-bodydark2 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">
              Aucune annonce
            </h3>
            <p className="text-bodydark2 mb-6">
              Commencez par créer votre première annonce
            </p>
            <Link to="/admin/annonces/nouvelle" className="btn-primary">
              <Plus size={20} className="mr-2" />
              Créer une annonce
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;
