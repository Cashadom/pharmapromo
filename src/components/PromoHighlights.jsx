import React from 'react';
import './PromoHighlights.css';

export default function PromoHighlights({ promos, loading }) {
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

  // Extraction générique d'un champ "Label : valeur" depuis la description.
  // Robuste : renvoie null si absent, ne casse jamais l'affichage.
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

  if (loading) {
    return (
      <section className="highlights">
        <div className="highlights-container">
          <div className="highlights-header">
            <h2 className="highlights-title">Promotions à la une</h2>
            <p className="highlights-subtitle">Les dernières offres publiées par les laboratoires.</p>
          </div>
          <div className="highlights-grid">
            {[1, 2, 3].map((n) => (
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
            <h2 className="highlights-title">Promotions à la une</h2>
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
          <h2 className="highlights-title">Promotions à la une</h2>
          <p className="highlights-subtitle">Les dernières offres publiées par les laboratoires.</p>
        </div>

        <div className="highlights-grid">
          {promos.map((promo, index) => {
            const dateFin = extractDateFin(promo.description);
            const offre = extractField(promo.description, 'Offre');
            const csp = extractField(promo.description, 'CSP');
            const condition = extractField(promo.description, 'Condition');
            const franco = extractField(promo.description, 'Franco');
            const isFeatured = index === 0;

            const hasDetails = csp || condition || franco;

            return (
              <div key={promo.id} className={`highlight-card ${isFeatured ? 'card-featured' : ''}`}>
                {isFeatured && (
                  <div className="card-featured-badge">À la une</div>
                )}

                {promo.image_url && (
                  <div className="highlight-image">
                    <img src={promo.image_url} alt={promo.titre} />
                  </div>
                )}

                {/* Accroche principale : ce que le pharmacien cherche en premier */}
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
                  <span className="highlight-lab">{promo.titre}</span>
                  {promo.famille && (
                    <span className="highlight-famille">{promo.famille}</span>
                  )}
                </div>

                <a href="#" className="highlight-link">
                  <span>Voir la promotion</span>
                  <span className="link-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="highlights-footer">
          <button className="highlights-cta">Voir toutes les promotions</button>
        </div>
      </div>
    </section>
  );
}