import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import './PromoDirectory.css';

export default function PromoDirectory({ setPage }) {
  const [email, setEmail] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [city, setCity] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError('Veuillez saisir votre email professionnel.');
      setLoading(false);
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Veuillez saisir un email valide.');
      setLoading(false);
      return;
    }

    if (!consent) {
      setError('Veuillez accepter de recevoir les offres par email.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.trim().toLowerCase(),
          pharmacy_name: pharmacyName.trim() || null,
          city: city.trim() || null,
          consent: consent,
          source: 'homepage_directory_box',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Erreur insertion newsletter:', insertError);
        
        // Si l'email existe déjà, on ne bloque pas
        if (insertError.code === '23505') { // Duplicate key
          setSubmitted(true);
          setLoading(false);
          return;
        }
        
        setError('Une erreur est survenue. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="directory">
        <div className="directory-container">
          <div className="directory-box">
            <div className="directory-success">
              <div className="success-icon">✓</div>
              <h2 className="directory-title">Merci !</h2>
              <p className="directory-success-text">
                Vous recevrez les prochaines offres PharmaPromo par email.
              </p>
              <p className="directory-success-sub">
                Désinscription possible à tout moment.
              </p>
              <button 
                className="directory-cta-link"
                onClick={() => setPage('offres')}
              >
                Voir toutes les offres →
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="directory">
      {/* Fonds animés */}
      <div className="directory-bg" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      <div className="directory-container">
        <div className="directory-box">
          <div className="directory-box-gradient"></div>

          <div className="directory-header">
            <button 
              className="directory-see-all-btn"
              onClick={() => setPage('offres')}
            >
              Voir toutes les offres →
            </button>
          </div>

          <h2 className="directory-title">Recevoir les offres par courriel</h2>
          <p className="directory-subtitle">
            Recevez les dernières promotions laboratoires directement dans votre boîte mail, sans chercher dans vos emails.
          </p>

          {error && (
            <div className="directory-error">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="directory-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email professionnel *</label>
              <input
                id="email"
                type="email"
                className="directory-input"
                placeholder="pharmacie@officine.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pharmacy" className="form-label">Nom de la pharmacie</label>
                <input
                  id="pharmacy"
                  type="text"
                  className="directory-input"
                  placeholder="Pharmacie Centrale"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city" className="form-label">Ville</label>
                <input
                  id="city"
                  type="text"
                  className="directory-input"
                  placeholder="Lyon"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkbox-text">
                  J’accepte de recevoir les offres laboratoires publiées sur PharmaPromo.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="directory-button"
              disabled={loading}
            >
              {loading ? 'Inscription en cours...' : 'Recevoir les offres'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}