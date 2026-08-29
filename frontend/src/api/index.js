/**
 * Configuration et service API
 * GICOS - Galaxie Immobilière Construction et Services
 */

import axios from 'axios';

// En prod (Vercel) : VITE_API_URL = URL Render sans slash final
// En local : proxy Vite vers /api et /uploads
const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gicos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gicos_token');
      // Redirection vers login si nécessaire
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================

export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  
  register: (username, password) =>
    api.post('/auth/register', { username, password }),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  changePassword: (oldPassword, newPassword) =>
    api.post('/auth/change-password', null, {
      params: { old_password: oldPassword, new_password: newPassword }
    }),
};

// ==================== Properties API ====================

export const propertiesAPI = {
  getAll: (params = {}) =>
    api.get('/properties/', { params }),
  
  getById: (id) =>
    api.get(`/properties/${id}`),
  
  getRecent: (limit = 6) =>
    api.get('/properties/recent', { params: { limit } }),
  
  getFeatured: (limit = 6) =>
    api.get('/properties/featured', { params: { limit } }),
  
  getCities: () =>
    api.get('/properties/cities'),
  
  getCategories: () =>
    api.get('/properties/categories'),
  
  getCount: (params = {}) =>
    api.get('/properties/count', { params }),
  
  create: (data) =>
    api.post('/properties/', data),
  
  update: (id, data) =>
    api.put(`/properties/${id}`, data),
  
  delete: (id) =>
    api.delete(`/properties/${id}`),
  
  uploadImages: (propertyId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return api.post(`/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteImage: (propertyId, imageId) =>
    api.delete(`/properties/${propertyId}/images/${imageId}`),
  
  setPrimaryImage: (propertyId, imageId) =>
    api.put(`/properties/${propertyId}/images/${imageId}/primary`),
};

// ==================== Gallery API ====================

export const galleryAPI = {
  getAll: (params = {}) =>
    api.get('/gallery/', { params }),
  
  getById: (id) =>
    api.get(`/gallery/${id}`),
  
  getTypes: () =>
    api.get('/gallery/types'),
  
  getCount: (imageType = null) =>
    api.get('/gallery/count', { params: { image_type: imageType } }),
  
  upload: (files, imageType, title = null, description = null) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('image_type', imageType);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    
    return api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  update: (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.put(`/gallery/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  delete: (id) =>
    api.delete(`/gallery/${id}`),
  
  deleteMultiple: (ids) =>
    api.delete('/gallery/', { data: ids }),
};

// ==================== Services API ====================

export const servicesAPI = {
  getAll: (activeOnly = true) =>
    api.get('/services/', { params: { active_only: activeOnly } }),
  
  getBySlug: (slug) =>
    api.get(`/services/${slug}`),
  
  create: (data) =>
    api.post('/services/', data),
  
  update: (id, data) =>
    api.put(`/services/${id}`, data),
  
  delete: (id) =>
    api.delete(`/services/${id}`),
  
  reorder: (order) =>
    api.put('/services/reorder', order),
};

// ==================== Contact API ====================

export const contactAPI = {
  send: (data) =>
    api.post('/contact/', data),
  
  getAll: (params = {}) =>
    api.get('/contact/', { params }),
  
  getUnreadCount: () =>
    api.get('/contact/count'),
  
  markAsRead: (id) =>
    api.put(`/contact/${id}/read`),
  
  markAllAsRead: () =>
    api.put('/contact/read-all'),
  
  delete: (id) =>
    api.delete(`/contact/${id}`),
};

// ==================== Testimonials API ====================

export const testimonialsAPI = {
  getAll: (activeOnly = true, limit = 10) =>
    api.get('/testimonials/', { params: { active_only: activeOnly, limit } }),
  
  getById: (id) =>
    api.get(`/testimonials/${id}`),
  
  create: (data) =>
    api.post('/testimonials/', data),
  
  update: (id, data) =>
    api.put(`/testimonials/${id}`, data),
  
  delete: (id) =>
    api.delete(`/testimonials/${id}`),
};

// ==================== Utilitaires ====================

// URL pour les images (Cloudinary absolue, ou /uploads via API)
export const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const path = `/uploads/${filename}`;
  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
};

// Formateur de prix
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default api;
