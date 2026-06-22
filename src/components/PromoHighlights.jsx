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

  const extractDateFin = (description) => {
    if (!description) return null;
    const match = description.match(/Fin : (\d{2}\/\d{2}\/\d{4})/);
    return match ? match[1] : null;
  };

  const extractOffre = (description) => {
    if (!description) return null;
    const match = description.match(/Offre : ([^|]+)/);
    return match ? match[1].trim() : null;
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
                <div className="skeleton-badge"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-product"></div>
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
            const offre = extractOffre(promo.description);
            const isFeatured = index === 0;

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
                
                <div className="highlight-badges">
                  <div className={`highlight-badge ${getBadgeColor(promo.type_promo)}`}>
                    {getBadgeLabel(promo.type_promo)}
                  </div>
                  {promo.famille && (
                    <div className="highlight-badge highlight-badge-famille">
                      {promo.famille}
                    </div>
                  )}
                </div>
                
                <h3 className="highlight-title">{promo.titre}</h3>
                
                <div className="highlight-product">
                  <span className="product-label">Produit</span>
                  <span className="product-name">{promo.produit}</span>
                </div>
                
                {offre && (
                  <div className="highlight-offer">
                    <span className="offer-label">Offre</span>
                    <span className="offer-value">{offre}</span>
                  </div>
                )}
                
                {dateFin && (
                  <div className="highlight-date">
                    <span className="date-label">Valable jusqu'au</span>
                    <span className="date-value">{dateFin}</span>
                  </div>
                )}
                
                <p className="highlight-description">{promo.description}</p>
                
                <a href="#" className="highlight-link">
                  Voir la promotion →
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