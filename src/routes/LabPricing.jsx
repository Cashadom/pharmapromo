import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './LabPricing.css';
import icon7 from '../assets/icon7.png';
import icon8 from '../assets/icon8.png';
import icon9 from '../assets/icon9.png';

export default function LabPricing({ setPage }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCtaClick = () => {
    if (session) {
      // Si déjà connecté, aller au dashboard
      setPage('dashboard');
    } else {
      // Sinon, aller à la page de connexion
      setPage('login');
    }
  };

  const handleCardCtaClick = () => {
    if (session) {
      setPage('dashboard');
    } else {
      setPage('login');
    }
  };

  if (loading) {
    return (
      <section className="pricing-page">
        <div className="pricing-container">
          <div className="pricing-back-wrapper">
            <button className="pricing-back-button" onClick={() => setPage('home')}>
              ← Retour à l'accueil
            </button>
          </div>
          <div className="pricing-hero">
            <p>Chargement...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pricing-page">
      {/* Fond décoratif animé - ronds comme dans Hero */}
      <div className="pricing-bg" aria-hidden="true">
        <span className="blob blob-1"></span>
        <span className="blob blob-2"></span>
        <span className="blob blob-3"></span>
        <span className="blob blob-4"></span>
        <span className="blob blob-5"></span>
        <span className="blob blob-6"></span>
        <span className="blob blob-7"></span>
      </div>

      <div className="pricing-container">
        {/* Bouton Retour à l'accueil */}
        <div className="pricing-back-wrapper">
          <button 
            className="pricing-back-button"
            onClick={() => setPage('home')}
          >
            ← Retour à l'accueil
          </button>
        </div>

        {/* Hero section */}
        <div className="pricing-hero">
          <span className="pricing-badge">1 mois offert</span>
          <h1 className="pricing-title">
            Diffusez vos promotions<br />
            auprès des pharmacies.
          </h1>
          <p className="pricing-subtitle">
            1 mois offert. Puis <strong>49.99 € HT / mois</strong>.<br />
            Sans engagement.
          </p>
          <button 
            className="pricing-cta"
            onClick={handleCtaClick}
          >
            {session ? 'Accéder à mon espace' : 'Répertorier mon laboratoire'}
          </button>
        </div>

        {/* Advantages */}
        <div className="pricing-advantages">
          <div className="advantage-card">
            <img src={icon7} alt="Promotions" className="advantage-icon-img" />
            <h3 className="advantage-title">Jusqu'à 10 promotions actives</h3>
            <p className="advantage-description">
              Publiez jusqu'à 10 promotions simultanément pour toucher les pharmacies.
            </p>
          </div>
          <div className="advantage-card">
            <img src={icon8} alt="Photos" className="advantage-icon-img" />
            <h3 className="advantage-title">Photos produits incluses</h3>
            <p className="advantage-description">
              Mettez en valeur vos produits avec des images de qualité professionnelle.
            </p>
          </div>
          <div className="advantage-card">
            <img src={icon9} alt="Visibilité" className="advantage-icon-img" />
            <h3 className="advantage-title">Visibilité pharmacies</h3>
            <p className="advantage-description">
              Touchez plus de 18 000 officines et développez votre réseau.
            </p>
          </div>
        </div>

        {/* Pricing card */}
        <div className="pricing-card-wrapper">
          <div className="pricing-card">
            <div className="pricing-card-badge">ESSAI GRATUIT</div>
            <div className="pricing-card-content">
              <div className="pricing-card-period">30 jours</div>
              <div className="pricing-card-price">0 €</div>
              <div className="pricing-card-divider"></div>
              <div className="pricing-card-then">Puis</div>
              <div className="pricing-card-price-full">49.99 € <span className="price-unit">/ mois</span></div>
              <ul className="pricing-card-features">
                <li>Jusqu'à 10 promotions actives</li>
                <li>Photos produits incluses</li>
                <li>Visibilité officines</li>
                <li>Sans engagement</li>
              </ul>
              <button 
                className="pricing-card-cta"
                onClick={handleCardCtaClick}
              >
                {session ? 'Accéder à mon espace' : 'Commencer gratuitement'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="pricing-footer">
          <p>Aucune carte bancaire requise pour l'essai gratuit.</p>
        </div>
      </div>
    </section>
  );
}