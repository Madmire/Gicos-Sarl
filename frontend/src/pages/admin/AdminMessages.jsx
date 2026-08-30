/**
 * Page gestion des messages admin
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Eye
} from 'lucide-react';
import { contactAPI } from '../../api';
import Loading from '../../components/Loading';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await contactAPI.getAll({ limit: 500 });
        setMessages(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      setMessages(prev => prev.map(m => 
        m.id === id ? { ...m, is_read: true } : m
      ));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    
    try {
      await contactAPI.delete(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await contactAPI.markAllAsRead();
      setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return <div className="p-8"><Loading /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `${unreadCount} message(s) non lu(s)`
              : 'Tous les messages ont été lus'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn-outline">
            <CheckCircle size={18} className="mr-2" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-1">
          <div className="card divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.is_read) {
                      handleMarkAsRead(message.id);
                    }
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id 
                      ? 'bg-primary-50' 
                      : 'hover:bg-gray-50'
                  } ${!message.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      message.is_read ? 'bg-gray-300' : 'bg-blue-500'
                    }`} />
                    <div className="flex-grow min-w-0">
                      <p className={`font-medium truncate ${
                        message.is_read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {message.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {message.email}
                      </p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun message</p>
              </div>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedMessage.name}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="flex items-center gap-2 hover:text-primary-600"
                    >
                      <Mail size={16} />
                      {selectedMessage.email}
                    </a>
                    {selectedMessage.phone && (
                      <a 
                        href={`tel:${selectedMessage.phone}`}
                        className="flex items-center gap-2 hover:text-primary-600"
                      >
                        <Phone size={16} />
                        {selectedMessage.phone}
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Calendar size={16} />
                {formatDate(selectedMessage.created_at)}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              {selectedMessage.property_id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Concernant l'annonce #{selectedMessage.property_id}
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="btn-primary"
                >
                  <Mail size={18} className="mr-2" />
                  Répondre par email
                </a>
                {selectedMessage.phone && (
                  <a 
                    href={`tel:${selectedMessage.phone}`}
                    className="btn-outline"
                  >
                    <Phone size={18} className="mr-2" />
                    Appeler
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Eye className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
