/**
 * Pages Mentions légales et Politique de confidentialité
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalLayout = ({ title, children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-primary-800 text-white py-12">
      <div className="container-custom">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-4 text-sm">
          <ArrowLeft size={16} />
          Retour à l’accueil
        </Link>
        <h1 className="font-display text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </div>
    <div className="container-custom py-12">
      <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 prose prose-slate">
        {children}
      </div>
    </div>
  </div>
);

export const MentionsLegalesPage = () => (
  <LegalLayout title="Mentions légales">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">Éditeur du site</h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      <strong>GICOS SARL</strong> — Galaxie Immobilière Construction et Services<br />
      Siège : Koubri, Ouagadougou, Burkina Faso<br />
      Téléphone : <a href="tel:+22666395254" className="text-primary-700">+226 66 39 52 54</a><br />
      Email : <a href="mailto:gicossarl10@gmail.com" className="text-primary-700">gicossarl10@gmail.com</a>
    </p>

    <h2 className="text-xl font-semibold text-gray-900 mb-3">Objet</h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Le présent site présente les activités, services et annonces immobilières de GICOS SARL.
      Les informations sont fournies à titre indicatif et peuvent être mises à jour sans préavis.
    </p>

    <h2 className="text-xl font-semibold text-gray-900 mb-3">Propriété intellectuelle</h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Les textes, logos, images et contenus du site sont protégés. Toute reproduction non autorisée
      est interdite sans accord préalable de GICOS SARL.
    </p>

    <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
    <p className="text-gray-600 leading-relaxed">
      Pour toute question relative au site, utilisez la{' '}
      <Link to="/contact" className="text-primary-700 font-medium">page Contact</Link>.
    </p>
  </LegalLayout>
);

export const ConfidentialitePage = () => (
  <LegalLayout title="Politique de confidentialité">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">Données collectées</h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Lorsque vous utilisez le formulaire de contact, la newsletter ou l’assistant en ligne,
      nous pouvons collecter : nom, email, téléphone et message. Ces données servent uniquement
      à répondre à vos demandes et à vous accompagner dans vos projets.
    </p>

    <h2 className="text-xl font-semibold text-gray-900 mb-3">Utilisation</h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Vos informations ne sont pas vendues à des tiers. Elles sont accessibles à l’équipe GICOS
      pour le suivi commercial et le service client.
    </p>

    <h2 className="text-xl font-semibold text-gray-900 mb-3">Conservation</h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Les messages sont conservés le temps nécessaire au traitement de votre demande,
      puis archivés ou supprimés selon les besoins opérationnels de l’entreprise.
    </p>

    <h2 className="text-xl font-semibold text-gray-900 mb-3">Vos droits</h2>
    <p className="text-gray-600 leading-relaxed">
      Pour consulter, corriger ou supprimer vos données, contactez-nous à{' '}
      <a href="mailto:gicossarl10@gmail.com" className="text-primary-700">gicossarl10@gmail.com</a>
      {' '}ou via la <Link to="/contact" className="text-primary-700 font-medium">page Contact</Link>.
    </p>
  </LegalLayout>
);
