import React, { useState } from 'react';
import './PromoDirectory.css';

/**
 * Extrait les champs structurés de la description.
 * Format attendu : "Offre: ... | CSP: ... | Condition: ... | Date début: ... | Date fin: ... | Famille: ..."
 * Robuste aux variations d'accents/casse/ordre. Ne plante jamais si un champ manque.
 */
function parseDescriptionFields(description) {
  const result = {
    offre: null,
    csp: null,
    condition: null,
    dateDebut: null,
    dateFin: null,
    famille: null,
  };

  if (!description) return result;

  const segments = description.split('|').map((s) => s.trim()).filter(Boolean);

  segments.forEach((segment) => {
    const sepIndex = segment.indexOf(':');
    if (sepIndex === -1) return;

    const rawKey = segment.slice(0, sepIndex).trim();
    const value = segment.slice(sepIndex + 1).trim();

    const key = rawKey
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (key.includes('offre')) result.offre = value;
    else if (key.includes('csp')) result.csp = value;
    else if (key.includes('condition')) result.condition = value;
    else if (key.includes('debut')) result.dateDebut = value;
    else if (key.includes('fin')) result.dateFin = value;
    else if (key.includes('famille')) result.famille = value;
  });

  return result;
}

// Fonction pour vérifier si une offre est proche de la date de fin (dans les 7 jours)
function isExpiringSoon(dateFin) {
  if (!dateFin) return false;
  
  // Tenter de parser la date au format DD/MM/YYYY
  const parts = dateFin.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  
  const endDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Si l'offre se termine dans les 7 jours et est encore valide
  return diffDays >= 0 && diffDays <= 7;
}

export default function PromoDirectory({ promos, loading }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filterOptions = [
    { value: 'ALL', label: 'Tous' },
    { value: 'PERCENT', label: '%' },
    { value: 'FREE_ITEM', label: 'Offert' },
    { value: 'REORDER', label: 'Réassort' },
    { value: 'ORDER_THRESHOLD', label: 'Montant minimum' }
  ];

  const getBadgeColor = (type) => {
    switch (type) {
      case 'PERCENT':
        return 'badge-percent';
      case 'FREE_ITEM':
        return 'badge-free';
      case 'REORDER':
        return 'badge-reorder';
      case 'ORDER_THRESHOLD':
        return 'badge-threshold';
      default:
        return 'badge-default';
    }
  };

  const getBadgeLabel = (type) => {
    switch (type) {
      case 'PERCENT':
        return '%';
      case 'FREE_ITEM':
        return 'Offert';
      case 'REORDER':
        return 'Réassort';
      case 'ORDER_THRESHOLD':
        return 'Montant min.';
      default:
        return '';
    }
  };

  const filteredPromos = activeFilter === 'ALL'
    ? promos
    : promos.filter(promo => promo.type_promo === activeFilter);

  if (loading) {
    return (
      <section id="promo-directory" className="directory">
        <div className="directory-container">
          <div className="directory-header">
            <h2 className="directory-title">Toutes les promotions actives</h2>
            <p className="directory-subtitle">Retrouvez toutes les offres laboratoires actuellement disponibles.</p>
          </div>
          <div className="directory-list">
            <div className="directory-list-head" aria-hidden="true">
              <span>Promotion</span>
              <span>Type</span>
              <span>Famille</span>
              <span>Offre</span>
              <span>Date fin</span>
              <span></span>
            </div>
            <div className="directory-rows">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="promo-row skeleton">
                  <div className="row-cell row-cell-main">
                    <div className="skeleton-bar skeleton-title-bar"></div>
                    <div className="skeleton-bar skeleton-product-bar"></div>
                  </div>
                  <div className="row-cell">
                    <div className="skeleton-bar skeleton-badge-bar"></div>
                  </div>
                  <div className="row-cell">
                    <div className="skeleton-bar skeleton-small-bar"></div>
                  </div>
                  <div className="row-cell">
                    <div className="skeleton-bar skeleton-small-bar"></div>
                  </div>
                  <div className="row-cell">
                    <div className="skeleton-bar skeleton-small-bar"></div>
                  </div>
                  <div className="row-cell row-cell-action">
                    <div className="skeleton-bar skeleton-link-bar"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="promo-directory" className="directory">
      <div className="directory-container">
        <div className="directory-header">
          <h2 className="directory-title">Toutes les promotions actives</h2>
          <p className="directory-subtitle">Retrouvez toutes les offres laboratoires actuellement disponibles.</p>
        </div>

        <div className="directory-filters">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              className={`filter-btn ${activeFilter === filter.value ? 'filter-active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredPromos.length === 0 ? (
          <div className="directory-empty">
            <div className="empty-card">
              <p>Aucune promotion active actuellement.</p>
            </div>
          </div>
        ) : (
          <div className="directory-list">
            <div className="directory-list-head" aria-hidden="true">
              <span>Promotion</span>
              <span>Type</span>
              <span>Famille</span>
              <span>Offre</span>
              <span>Date fin</span>
              <span></span>
            </div>

            <div className="directory-rows" role="list">
              {filteredPromos.map((promo) => {
                const fields = parseDescriptionFields(promo.description);
                const expiringSoon = isExpiringSoon(fields.dateFin);

                const metaParts = [
                  fields.csp && `CSP : ${fields.csp}`,
                  fields.condition,
                  fields.dateDebut && `Dès le ${fields.dateDebut}`
                ].filter(Boolean);
                const metaLine = metaParts.length ? metaParts.join(' · ') : null;

                return (
                  <div key={promo.id} className={`promo-row ${expiringSoon ? 'expiring-soon' : ''}`} role="listitem">
                    {expiringSoon && (
                      <div className="expiring-badge">
                        <span className="expiring-dot"></span>
                        Se termine bientôt
                      </div>
                    )}
                    <div className="row-cell row-cell-main">
                      <h3 className="row-title">{promo.titre}</h3>
                      <div className="row-product">
                        <span className="row-product-label">Produit :</span>
                        <span className="row-product-name">{promo.produit}</span>
                      </div>
                      {metaLine && <p className="row-meta">{metaLine}</p>}
                    </div>

                    <div className="row-cell" data-label="Type">
                      <span className={`row-badge ${getBadgeColor(promo.type_promo)}`}>
                        {getBadgeLabel(promo.type_promo)}
                      </span>
                    </div>

                    <div className="row-cell" data-label="Famille">
                      <span className="row-famille">{fields.famille || '—'}</span>
                    </div>

                    <div className="row-cell" data-label="Offre">
                      <span className="row-offre">{fields.offre || '—'}</span>
                    </div>

                    <div className="row-cell" data-label="Date fin">
                      <span className={`row-date ${expiringSoon ? 'date-expiring' : ''}`}>
                        {fields.dateFin || '—'}
                      </span>
                    </div>

                    <div className="row-cell row-cell-action">
                      <a href="#" className="row-link">
                        <span>Voir</span>
                        <span className="link-arrow" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}