// src/routes/Dashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';
import timeIcon from '../assets/time.png';

export default function Dashboard({ setPage }) {
  const [loading, setLoading] = useState(true);
  const [labo, setLabo] = useState(null);
  const [promos, setPromos] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      setPage('login');
      return;
    }

    setUser(authData.user);
    await fetchLabo(authData.user.id);
  }

  async function fetchLabo(userId) {
    const { data, error } = await supabase
      .from('laboratoires')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      setError('Aucun laboratoire trouvé pour ce compte.');
      setLoading(false);
      return;
    }

    setLabo(data);

    if (data.statut === 'expired' || 
        (data.statut === 'trial' && data.trial_ends_at && new Date(data.trial_ends_at) < new Date())) {
      setPage('pricing');
      return;
    }

    await fetchPromos(data.id);
    setLoading(false);
  }

  async function fetchPromos(laboId) {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('laboratoire_id', laboId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement promos:', error);
      setPromos([]);
      return;
    }

    setPromos(data || []);
  }

  function getDaysRemaining() {
    if (!labo?.trial_ends_at) return 0;
    const end = new Date(labo.trial_ends_at);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  function getStatusLabel() {
    if (labo?.statut === 'active') return { label: 'Abonnement actif', color: 'success' };
    if (labo?.statut === 'trial') {
      const days = getDaysRemaining();
      if (days <= 3 && days > 0) return { label: `Essai se termine dans ${days} jours`, color: 'warning' };
      if (days === 0) return { label: 'Essai terminé', color: 'danger' };
      return { label: `Essai gratuit`, color: 'info' };
    }
    if (labo?.statut === 'expired') return { label: 'Essai terminé', color: 'danger' };
    return { label: labo?.statut || '—', color: 'default' };
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-stats">
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
            </div>
            <div className="skeleton-table"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !labo) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-error">
            <h2>Une erreur est survenue</h2>
            <p>{error || 'Laboratoire non trouvé'}</p>
            <button className="btn-primary" onClick={() => setPage('home')}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusLabel();
  const daysRemaining = getDaysRemaining();
  const activePromos = promos.filter(p => p.active).length;
  const totalPromos = promos.length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-back-wrapper">
          <button 
            className="dashboard-back-button"
            onClick={() => setPage('home')}
          >
            ← Retour à l'accueil
          </button>
        </div>

        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">
              Bonjour, <span className="dashboard-lab-name">{labo.nom}</span>
            </h1>
            <p className="dashboard-subtitle">
              Gérez vos offres visibles auprès des officines.
            </p>
          </div>
          <button 
            className="dashboard-cta"
            onClick={() => setPage('create')}
          >
            + Créer une promotion
          </button>
        </div>

        <div className="dashboard-status-card">
          <div className="status-info">
            <span className={`status-badge status-${status.color}`}>
              {status.label}
            </span>
            {labo.statut === 'trial' && daysRemaining > 0 && (
              <span className="status-days">
                Il vous reste <strong>{daysRemaining}</strong> jour{daysRemaining > 1 ? 's' : ''} d'essai
              </span>
            )}
            {labo.statut === 'trial' && daysRemaining === 0 && (
              <button 
                className="status-cta"
                onClick={() => setPage('pricing')}
              >
                Activer l'abonnement
              </button>
            )}
            {labo.statut === 'expired' && (
              <button 
                className="status-cta"
                onClick={() => setPage('pricing')}
              >
                Activer l'abonnement
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{activePromos}</div>
            <div className="stat-label">Offres actives</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalPromos}</div>
            <div className="stat-label">Total des offres</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-card">
              <img src={timeIcon} alt="Statut" className="stat-icon-img" />
            </div>
            <div className="stat-label">{labo.statut === 'active' ? 'Actif' : labo.statut === 'trial' ? 'Essai' : 'Expiré'}</div>
          </div>
        </div>

        <div className="dashboard-promos">
          <div className="dashboard-promos-header">
            <h3 className="dashboard-promos-title">Mes dernières offres</h3>
            <button 
              className="dashboard-promos-link"
              onClick={() => setPage('offres')}
            >
              Voir toutes mes offres →
            </button>
          </div>

          {promos.length === 0 ? (
            <div className="dashboard-empty">
              <p>Aucune promotion publiée.</p>
              <button 
                className="btn-primary"
                onClick={() => setPage('create')}
              >
                Créer ma première offre
              </button>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Type</th>
                    <th>Visibilité</th>
                    <th>Date fin</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.slice(0, 5).map((promo) => (
                    <tr key={promo.id}>
                      <td className="cell-product">{promo.produit}</td>
                      <td className="cell-type">
                        <span className={`badge-${promo.type_promo?.toLowerCase() || 'default'}`}>
                          {promo.type_promo === 'PERCENT' ? '%' :
                           promo.type_promo === 'FREE_ITEM' ? 'Offert' :
                           promo.type_promo === 'ORDER_THRESHOLD' ? 'Min.' : '—'}
                        </span>
                      </td>
                      <td className="cell-visibility">
                        {promo.visibility_mode === 'PUBLIC' ? 'Publique' :
                         promo.visibility_mode === 'SEMI_PRIVATE' ? 'Semi-privée' :
                         promo.visibility_mode === 'PRIVATE' ? 'Privée' : '—'}
                      </td>
                      <td className="cell-date">
                        {promo.date_fin ? new Date(promo.date_fin).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="cell-status">
                        <span className={`status-dot ${promo.active ? 'active' : 'inactive'}`}>
                          {promo.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <button 
                          className="action-btn action-view"
                          onClick={() => {
                            setSelectedOfferId(promo.id);
                            setPage('offer-detail');
                          }}
                        >
                          Voir
                        </button>
                        <button 
                          className="action-btn action-edit"
                          onClick={() => {}}
                        >
                          Modifier
                        </button>
                        <button 
                          className="action-btn action-toggle"
                          onClick={async () => {
                            const { error } = await supabase
                              .from('promotions')
                              .update({ active: !promo.active })
                              .eq('id', promo.id);
                            if (!error) {
                              fetchPromos(labo.id);
                            }
                          }}
                        >
                          {promo.active ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {promos.length > 5 && (
                <div className="dashboard-table-footer">
                  <button 
                    className="see-all-link"
                    onClick={() => setPage('offres')}
                  >
                    Voir les {promos.length} offres →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}