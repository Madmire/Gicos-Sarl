/**
 * Application principale GICOS
 * Galaxie Immobilière Construction et Services
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages publiques
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import { MentionsLegalesPage, ConfidentialitePage } from './pages/LegalPages';

// Pages admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyForm from './pages/admin/AdminPropertyForm';
import AdminGallery from './pages/admin/AdminGallery';
import AdminServices from './pages/admin/AdminServices';
import AdminMessages from './pages/admin/AdminMessages';
import AdminTestimonials from './pages/admin/AdminTestimonials';

// Composant de chargement
import { PageLoading } from './components/Loading';

/**
 * Route protégée pour l'administration
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/**
 * Routes de l'application
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="annonces" element={<PropertiesPage />} />
        <Route path="annonces/:id" element={<PropertyDetailPage />} />
        <Route path="galerie" element={<GalleryPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="politique-confidentialite" element={<ConfidentialitePage />} />
      </Route>

      {/* Page de connexion admin */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Routes admin protégées */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="annonces" element={<AdminProperties />} />
        <Route path="annonces/nouvelle" element={<AdminPropertyForm />} />
        <Route path="annonces/:id" element={<AdminPropertyForm />} />
        <Route path="galerie" element={<AdminGallery />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="temoignages" element={<AdminTestimonials />} />
      </Route>

      {/* 404 - Page non trouvée */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
              <a href="/" className="btn-primary">
                Retour à l'accueil
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

/**
 * Composant principal de l'application
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
