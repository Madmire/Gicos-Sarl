/**
 * Tableau de bord admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Image, 
  MessageSquare, 
  TrendingUp,
  Plus,
  Eye,
  ArrowRight
} from 'lucide-react';
import { propertiesAPI, galleryAPI, contactAPI } from '../../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    gallery: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsCount, galleryCount, messagesCount, recentProps] = await Promise.all([
          propertiesAPI.getCount(),
          galleryAPI.getCount(),
          contactAPI.getUnreadCount(),
          propertiesAPI.getRecent(5)
        ]);
        
        setStats({
          properties: propsCount.data.count,
          gallery: galleryCount.data.count,
          unreadMessages: messagesCount.data.unread_count
        });
        setRecentProperties(recentProps.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Annonces', 
      value: stats.properties, 
      icon: Building2, 
      color: 'bg-blue-500',
      link: '/admin/annonces'
    },
    { 
      title: 'Images galerie', 
      value: stats.gallery, 
      icon: Image, 
      color: 'bg-emerald-500',
      link: '/admin/galerie'
    },
    { 
      title: 'Messages non lus', 
      value: stats.unreadMessages, 
      icon: MessageSquare, 
      color: 'bg-amber-500',
      link: '/admin/messages'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue dans l'espace d'administration GICOS</p>
        </div>
        <Link to="/admin/annonces/nouvelle" className="btn-primary">
          <Plus size={20} className="mr-2" />
          Nouvelle annonce
        </Link>
      </div>

      {/* Stats cards - TailAdmin style */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={index} 
              to={stat.link}
              className="data-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-bodydark2">{stat.title}</span>
                  <h4 className="text-3xl font-bold text-black mt-2">{stat.value}</h4>
                </div>
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-success font-medium">Voir plus</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent properties */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Annonces récentes</h2>
            <Link to="/admin/annonces" className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>

          {recentProperties.length > 0 ? (
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/admin/annonces/${property.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-gray-900 truncate">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.city}</p>
                  </div>
                  <span className={`badge ${property.property_type === 'vente' ? 'badge-vente' : 'badge-location'}`}>
                    {property.property_type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune annonce pour le moment
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h2>
          
          <div className="space-y-3">
            <Link 
              to="/admin/annonces/nouvelle"
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Plus className="w-5 h-5 text-primary-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ajouter une annonce</p>
                <p className="text-sm text-gray-500">Créer une nouvelle annonce immobilière</p>
              </div>
            </Link>

            <Link 
              to="/admin/galerie"
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Image className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Gérer la galerie</p>
                <p className="text-sm text-gray-500">Ajouter des images à la galerie</p>
              </div>
            </Link>

            <Link 
              to="/"
              target="_blank"
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                <Eye className="w-5 h-5 text-violet-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Voir le site</p>
                <p className="text-sm text-gray-500">Ouvrir le site public dans un nouvel onglet</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
