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

  // 🔥 Fonction extractField réintégrée
  const extractField = (description, label) => {
    if (!description) return null;
    const regex = new RegExp(`${label}\\s*:\\s*([^|]+)`, 'i');
    const match = description.match(regex);
    return match ? match[1].trim() : null;
  };

  // 🔥 Fonction getOfferText sans doublon
  const getOfferText = (promo) => {
    // Si la description contient déjà "Offre :", on l'extrait
    if (promo.description) {
      const match = promo.description.match(/Offre\s*:\s*([^|]+)/i);
      if (match) return match[1].trim();
    }

    // Sinon, on génère à partir des champs
    if (promo.type_promo === 'PERCENT' && promo.remise_valeur) {
      return `-${promo.remise_valeur} %`;
    }

    if (promo.type_promo === 'FREE_ITEM' && promo.unite_offerte) {
      return `${promo.unite_offerte} unités offertes`;
    }

    if (promo.type_promo === 'ORDER_THRESHOLD' && promo.montant_minimum) {
      return `Dès ${promo.montant_minimum} €`;
    }

    if (promo.type_promo === 'RETURN_EXPIRED') {
      return 'Reprise des périmés';
    }

    return 'Conditions sur demande';
  };

  // 🔥 Fonction extractDateFin améliorée
  const extractDateFin = (promo) => {
    // 1. Essayer depuis la description avec plusieurs formats
    if (promo.description) {
      // Format: "Fin : JJ/MM/AAAA"
      let match = promo.description.match(/Fin\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
      if (match) return match[1];

      // Format: "Jusqu'au JJ/MM/AAAA"
      match = promo.description.match(/Jusqu'au\s*(\d{2}\/\d{2}\/\d{4})/i);
      if (match) return match[1];

      // Format: "Date fin: JJ/MM/AAAA"
      match = promo.description.match(/Date\s*fin\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
      if (match) return match[1];
    }

    // 2. Utiliser le champ date_fin de la base
    if (promo.date_fin) {
      const date = new Date(promo.date_fin);
      if (!isNaN(date)) {
        return date.toLocaleDateString('fr-FR');
      }
    }

    return null;
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

  // Header commun
  const renderHeader = () => (
    <div className="highlights-header">
      <h2 className="highlights-title">A saisir en ce moment</h2>
      <p className="highlights-subtitle">Les dernières offres publiées par les laboratoires.</p>
    </div>
  );

  if (loading) {
    return (
      <section className="highlights">
        <div className="highlights-container">
          {renderHeader()}
          <div className="highlights-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div key={n} className="highlight-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-offer"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-date"></div>
                <div className="skeleton-condition"></div>
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
          {renderHeader()}
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
        {renderHeader()}

        <div className="highlights-grid">
          {displayPromos.map((promo) => {
            const dateFin = extractDateFin(promo);
            const condition = extractField(promo.description, 'Condition');
            const franco = extractField(promo.description, 'Franco');
            const csp = extractField(promo.description, 'CSP');

            // Construire les détails uniquement avec des valeurs non vides
            const details = [];
            if (condition) details.push({ label: 'Condition', value: condition });
            if (franco) details.push({ label: 'Franco', value: franco });
            if (csp) details.push({ label: 'CSP', value: csp });

            const hasDetails = details.length > 0;
            const timeSinceLastView = getTimeSinceLastView(promo.updated_at);

            const cardKey = `${promo.id}-${promo.updated_at || promo.created_at}`;

            // 🔥 Texte de l'offre sans doublon
            const offerText = getOfferText(promo);

            return (
              <div key={cardKey} className="highlight-card">
                {/* 🔥 Famille en haut à droite */}
                {promo.famille && (
                  <span className="highlight-famille-top">{promo.famille}</span>
                )}

                {/* 🔥 Image */}
                {promo.image_url && (
                  <div className="highlight-image">
                    <img src={promo.image_url} alt={promo.produit} />
                  </div>
                )}

                {/* 🔥 Offre : badge type + texte */}
                <div className="highlight-offer">
                  <span className={`offer-badge ${getBadgeColor(promo.type_promo)}`}>
                    {getBadgeLabel(promo.type_promo)}
                  </span>
                  <span className="offer-text">{offerText}</span>
                </div>

                {/* 🔥 Nom du produit (titre principal) */}
                <h3 className="highlight-product-name">{promo.produit}</h3>

                {/* 🔥 Date */}
                {dateFin && (
                  <div className="highlight-date">
                    <span className="date-icon">📅</span>
                    <span className="date-text">Jusqu'au {dateFin}</span>
                  </div>
                )}

                {/* 🔥 Détails (uniquement si renseignés) */}
                {hasDetails && (
                  <div className="highlight-details">
                    {details.map((detail, index) => (
                      <div key={index} className="detail-line">
                        <span className="detail-label">{detail.label}</span>
                        <span className="detail-value">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 🔥 Footer : vue + bouton */}
                <div className="highlight-footer">
                  {timeSinceLastView && (
                    <span className="highlight-views">
                      👁️ Consultée il y a {timeSinceLastView}
                    </span>
                  )}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}