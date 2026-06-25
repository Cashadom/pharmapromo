// src/routes/Login.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';
import './Login.css';

const TRIAL_DURATION_DAYS = 30;

export default function Login({ setPage }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Champs supplémentaires pour la création de compte
  const [nomLabo, setNomLabo] = useState('');
  const [telephone, setTelephone] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [siret, setSiret] = useState('');

  const resetMessages = () => setErrorMsg('');

  const switchMode = (newMode) => {
    setMode(newMode);
    resetMessages();
  };

  const checkTrialAndRedirect = async (userId) => {
    const { data: labo, error: laboError } = await supabase
      .from('laboratoires')
      .select('statut, trial_ends_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (laboError || !labo) {
      setErrorMsg("Aucun espace laboratoire n'est associé à ce compte.");
      setPage('login');
      return;
    }

    const trialEndsAt = labo.trial_ends_at ? new Date(labo.trial_ends_at) : null;
    const trialExpired = trialEndsAt ? trialEndsAt.getTime() < Date.now() : false;

    if (labo.statut === 'trial' && trialExpired) {
      setPage('pricing');
      return;
    }

    if (labo.statut === 'expired' || labo.statut === 'inactive') {
      setPage('pricing');
      return;
    }

    setPage('dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg('Email ou mot de passe incorrect.');
        setLoading(false);
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        setErrorMsg('Connexion impossible, merci de réessayer.');
        setLoading(false);
        return;
      }

      await checkTrialAndRedirect(userId);
    } catch (err) {
      setErrorMsg('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!nomLabo.trim()) {
      setErrorMsg('Le nom du laboratoire est requis.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(
          error.message?.toLowerCase().includes('already')
            ? 'Un compte existe déjà avec cet email.'
            : "Impossible de créer le compte. Vérifiez vos informations."
        );
        setLoading(false);
        return;
      }

      const userId = data?.user?.id;

      if (!userId) {
        setErrorMsg(
          'Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse avant de vous connecter.'
        );
        setLoading(false);
        return;
      }

      const now = new Date();
      const trialEndsAt = new Date(now);
      trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);

      const { error: insertError } = await supabase.from('laboratoires').insert({
        user_id: userId,
        nom: nomLabo.trim(),
        email,
        telephone: telephone.trim() || null,
        site_web: siteWeb.trim() || null,
        siret: siret.trim() || null,
        statut: 'trial',
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
      });

      if (insertError) {
        console.error('❌ Erreur insertion laboratoire:', insertError);
        setErrorMsg(
          "Le compte a été créé mais l'espace laboratoire n'a pas pu être initialisé. Contactez le support."
        );
        setLoading(false);
        return;
      }

      // ✅ Rediriger vers le dashboard
      setPage('dashboard');
    } catch (err) {
      console.error('❌ Erreur signup:', err);
      setErrorMsg('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <span className="login-blob login-blob-1"></span>
        <span className="login-blob login-blob-2"></span>
      </div>

      <div className="login-card">
        <button
          type="button"
          className="login-logo"
          onClick={() => setPage('home')}
          aria-label="PharmaPromo, retour à l'accueil"
        >
          <img src={logo} alt="PharmaPromo" className="login-logo-image" />
        </button>

        <h1 className="login-title">
          {isSignup ? 'Créer un compte laboratoire' : 'Connexion laboratoire'}
        </h1>
        <p className="login-subtitle">
          {isSignup 
            ? 'Créez votre espace laboratoire. Vos offres seront liées automatiquement à votre compte et vous bénéficiez de 30 jours d\'essai gratuit.'
            : 'Connectez-vous à votre espace laboratoire pour publier et suivre vos offres auprès des officines.'
          }
        </p>

        {errorMsg && <div className="login-error">{errorMsg}</div>}

        {isSignup ? (
          <form className="login-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label" htmlFor="nomLabo">
                Nom du laboratoire
              </label>
              <input
                id="nomLabo"
                type="text"
                className="form-input"
                placeholder="Ex. Laboratoires Bioderma"
                value={nomLabo}
                onChange={(e) => setNomLabo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="contact@laboratoire.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telephone">
                Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                className="form-input"
                placeholder="01 23 45 67 89"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="siteWeb">
                Site web <span className="form-optional">(optionnel)</span>
              </label>
              <input
                id="siteWeb"
                type="url"
                className="form-input"
                placeholder="https://www.laboratoire.fr"
                value={siteWeb}
                onChange={(e) => setSiteWeb(e.target.value)}
                autoComplete="url"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="siret">
                SIRET <span className="form-optional">(optionnel)</span>
              </label>
              <input
                id="siret"
                type="text"
                className="form-input"
                placeholder="Ex: 12345678901234"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mot de passe
              </label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  }
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <p className="login-trial-note">
              Essai gratuit de {TRIAL_DURATION_DAYS} jours, sans engagement.
            </p>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Création en cours…' : 'Créer mon compte laboratoire'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="contact@laboratoire.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mot de passe
              </label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  }
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        )}

        <div className="login-switch">
          {isSignup ? (
            <span>
              Déjà un compte ?{' '}
              <button type="button" className="login-link" onClick={() => switchMode('login')}>
                Se connecter
              </button>
            </span>
          ) : (
            <span>
              Pas encore de compte ?{' '}
              <button type="button" className="login-link" onClick={() => switchMode('signup')}>
                Créer un compte laboratoire
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}