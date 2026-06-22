import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import './LabRegister.css';
import icon10 from '../assets/icon10.png';
import icon11 from '../assets/icon11.png';
import icon5 from '../assets/icon5.png';
import icon12 from '../assets/icon12.png';

export default function LabRegister({ setPage }) {
  const [form, setForm] = useState({
    nom: '',
    contact: '',
    email: '',
    telephone: '',
    site_web: '',
    identifiant_pro: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.nom.trim() || !form.email.trim()) {
      alert('Veuillez remplir le nom du laboratoire et l\'email.');
      return;
    }

    setLoading(true);

    // Calcul de la date de fin d'essai (30 jours) - format DATE
    const dateFinTrial = new Date();
    dateFinTrial.setDate(dateFinTrial.getDate() + 30);
    const dateFinTrialFormatted = dateFinTrial.toISOString().split('T')[0];

    const dataToInsert = {
      nom: form.nom.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      telephone: form.telephone.trim(),
      site_web: form.site_web.trim(),
      identifiant_pro: form.identifiant_pro.trim(),
      statut: 'trial',
      source: 'pricing',
      abonnement: 'trial',
      actif: true,
      date_fin_trial: dateFinTrialFormatted
    };

    console.log('Données à insérer:', dataToInsert);

    const { data, error } = await supabase
      .from('laboratoires')
      .insert([dataToInsert])
      .select();

    console.log('Réponse Supabase:', { data, error });

    if (error) {
      console.error('Erreur Supabase détaillée:', error);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('Détails:', error.details);
      alert('Erreur: ' + error.message + (error.details ? ' (' + error.details + ')' : ''));
      setLoading(false);
      return;
    }

    console.log('Insertion réussie:', data);

    setSubmitted(true);
    setForm({
      nom: '',
      contact: '',
      email: '',
      telephone: '',
      site_web: '',
      identifiant_pro: ''
    });
    setLoading(false);
  }

  if (submitted) {
    return (
      <section className="register-page register-success">
        <div className="register-container">
          <div className="register-success-content">
            <div className="register-success-icon">✓</div>
            <h1 className="register-success-title">
              Votre demande a bien été enregistrée.
            </h1>
            <p className="register-success-text">
              Nous allons créer votre espace laboratoire.<br />
              Vous recevrez un email de confirmation sous 24h.
            </p>
            <button 
              className="register-success-cta"
              onClick={() => setPage('home')}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="register-page">
      <div className="register-container">
        <div className="register-grid">
          {/* Left - Form */}
          <div className="register-left">
            <button 
              className="register-back"
              onClick={() => setPage('pricing')}
            >
              ← Retour
            </button>

            <h1 className="register-title">Répertorier mon laboratoire</h1>
            <p className="register-subtitle">
              Créez votre espace en quelques minutes et commencez à diffuser vos promotions.
            </p>

            <form onSubmit={submit} className="register-form">
              <div className="register-group">
                <label htmlFor="nom" className="register-label">Nom du laboratoire</label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Ex: Laboratoire Dupont Pharma"
                  value={form.nom}
                  onChange={update}
                  className="register-input"
                  required
                />
              </div>

              <div className="register-group">
                <label htmlFor="contact" className="register-label">Nom du contact</label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={form.contact}
                  onChange={update}
                  className="register-input"
                />
              </div>

              <div className="register-group">
                <label htmlFor="email" className="register-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ex: contact@dupont-pharma.fr"
                  value={form.email}
                  onChange={update}
                  className="register-input"
                  required
                />
              </div>

              <div className="register-group">
                <label htmlFor="telephone" className="register-label">Téléphone</label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="Ex: 01 23 45 67 89"
                  value={form.telephone}
                  onChange={update}
                  className="register-input"
                />
              </div>

              <div className="register-group">
                <label htmlFor="site_web" className="register-label">Site internet</label>
                <input
                  id="site_web"
                  name="site_web"
                  type="url"
                  placeholder="Ex: https://www.dupont-pharma.fr"
                  value={form.site_web}
                  onChange={update}
                  className="register-input"
                />
              </div>

              <div className="register-group">
                <label htmlFor="identifiant_pro" className="register-label">Identifiant professionnel</label>
                <input
                  id="identifiant_pro"
                  name="identifiant_pro"
                  type="text"
                  placeholder="SIRET, numéro formateur ou identifiant entreprise"
                  value={form.identifiant_pro}
                  onChange={update}
                  className="register-input"
                />
              </div>

              <button type="submit" className="register-submit" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Créer mon accès gratuit'}
              </button>
            </form>
          </div>

          {/* Right - Illustration */}
          <div className="register-right">
            <div className="register-illustration">
              <div className="register-illustration-card card-lab">
                <img src={icon10} alt="Laboratoire" className="card-icon-img" />
                <span className="card-label">Laboratoire</span>
              </div>
              <div className="register-illustration-card card-products">
                <img src={icon11} alt="Produits" className="card-icon-img" />
                <span className="card-label">Produits</span>
              </div>
              <div className="register-illustration-card card-promos">
                <img src={icon12} alt="Promotions" className="card-icon-img" />
                <span className="card-label">Promotions</span>
              </div>
              <div className="register-illustration-card card-documents">
                <img src={icon5} alt="Documents" className="card-icon-img" />
                <span className="card-label">Documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}