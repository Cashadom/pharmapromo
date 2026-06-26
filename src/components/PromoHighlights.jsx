import React from 'react';
import './PromoHighlights.css';

export default function PromoHighlights({ promos, loading, setPage, setSelectedOfferId }) {
  const getBadgeColor = (type) => {
    switch(type) {
      case 'PERCENT':
        return 'badge-percent';
      case 'FREE_ITEM':
        return 'badge-free';
      case 'REORDER':
        return 'badge-reorder';
      case 'ORDER_THRESHOLD':
        return 'badge-threshold';
      case 'CLIENT_ONLY':
        return 'badge-client';
      case 'RETURN_EXPIRED':
        return 'badge-return';
      default:
        return 'badge-default';
    }
  };

  const getBadgeLabel = (type) => {
    switch(type) {
      case 'PERCENT':
        return 'Remise';
      case 'FREE_ITEM':
        return 'Offert';
      case 'REORDER':
        return 'Réassort';
      case 'ORDER_THRESHOLD':
        return 'Montant min.';
      case 'CLIENT_ONLY':
        return 'Client';
      case 'RETURN_EXPIRED':
        return 'Reprise';
      default:
        return '';
    }
  };

  const extractField = (description, label) => {
    if (!description) return null;
    const regex = new RegExp(`${label}\\s*:\\s*([^|]+)`, 'i');
    const match = description.match(regex);
    return match ? match[1].trim() : null;
  };

  const extractDateFin = (description) => {
    if (!description) return null;
    const match = description.match(/Fin\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
    return match ? match[1] : null;
  };

  const getTimeSinceLastView = (date) => {
    if (!date) return null;
    
    const now = new Date();
    const lastView = new Date(date);
    const diffMs = now - lastView;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'moins d\'une minute';
    if (diffMins === 1) return '1 minute';
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 heure';
    if (diffHours < 24) return `${diffHours} heures`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 jour';
    return `${diffDays} jours`;
  };

  // Afficher 12 offres
  const displayPromos = promos.slice(0, 12);

  if (loading) {
    return (
      <section className="highlights">
        <div className="highlights-container">
          <div className="highlights-header">
            <h2 className="highlights-title">A saisir en ce moment</h2>
            <p className="highlights-subtitle">Les dernières offres publiées par les laboratoires.</p>
          </div>
          <div className="highlights-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div key={n} className="highlight-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-offer"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-date"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-link"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (promos.length === 0) {
    return (
      <section className="highlights">
        <div className="highlights-container">
          <div className="highlights-header">
            <h2 className="highlights-title">A saisir en ce moment</h2>
            <p className="highlights-subtitle">Les dernières offres publiées par les laboratoires.</p>
          </div>
          <div className="highlights-empty">
            <div className="empty-card">
              <p>Aucune promotion mise en avant actuellement.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="highlights">
      <div className="highlights-container">
        <div className="highlights-header">
          <h2 className="highlights-title">A saisir en ce moment</h2>
          <p className="highlights-subtitle">Les dernières offres publiées par les laboratoires.</p>
        </div>

        <div className="highlights-grid">
          {displayPromos.map((promo) => {
            const dateFin = extractDateFin(promo.description);
            const offre = extractField(promo.description, 'Offre');
            const csp = extractField(promo.description, 'CSP');
            const condition = extractField(promo.description, 'Condition');
            const franco = extractField(promo.description, 'Franco');

            const hasDetails = csp || condition || franco;
            const timeSinceLastView = getTimeSinceLastView(promo.updated_at);

            const cardKey = `${promo.id}-${promo.updated_at || promo.created_at}`;

            return (
              <div key={cardKey} className="highlight-card">
                {/* 🔥 FAMILLE EN HAUT À DROITE */}
                {promo.famille && (
                  <span className="highlight-famille-top">{promo.famille}</span>
                )}

                {promo.image_url && (
                  <div className="highlight-image">
                    <img src={promo.image_url} alt={promo.titre} />
                  </div>
                )}

                <div className={`highlight-offer-banner ${getBadgeColor(promo.type_promo)}`}>
                  <span className="offer-banner-type">{getBadgeLabel(promo.type_promo)}</span>
                  <span className="offer-banner-value">{offre || promo.titre}</span>
                </div>

                <h3 className="highlight-product-name">{promo.produit}</h3>

                {dateFin && (
                  <div className="highlight-date">
                    <span className="date-label">Jusqu'au</span>
                    <span className="date-value">{dateFin}</span>
                  </div>
                )}

                {hasDetails && (
                  <div className="highlight-details">
                    {condition && (
                      <div className="detail-line">
                        <span className="detail-label">Condition</span>
                        <span className="detail-value">{condition}</span>
                      </div>
                    )}
                    {franco && (
                      <div className="detail-line">
                        <span className="detail-label">Franco</span>
                        <span className="detail-value">{franco}</span>
                      </div>
                    )}
                    {csp && (
                      <div className="detail-line">
                        <span className="detail-label">CSP</span>
                        <span className="detail-value">{csp}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="highlight-footer-meta">
                  {/* 🔥 LABORATOIRE SUPPRIMÉ */}
                  {timeSinceLastView && (
                    <span className="highlight-views">
                      👁️ Dernière consultation il y a {timeSinceLastView}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="highlight-link"
                  onClick={() => {
                    setSelectedOfferId(promo.id);
                    setPage('offer-detail');
                  }}
                >
                  <span>Voir la promotion</span>
                  <span className="link-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}