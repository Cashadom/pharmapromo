import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Offres.css';

export default function Offres({ setPage }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamille, setSelectedFamille] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allFamilles, setAllFamilles] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const ITEMS_PER_PAGE = 50;

  const typeOptions = [
    { value: 'PERCENT', label: 'Remise (%)' },
    { value: 'FREE_ITEM', label: 'Unité offerte' },
    { value: 'RETURN_EXPIRED', label: 'Reprise périmés' },
    { value: 'ORDER_THRESHOLD', label: 'Montant minimum' }
  ];

  useEffect(() => {
    fetchFamilles();
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [searchTerm, selectedFamille, selectedType, currentPage]);

  async function fetchFamilles() {
    const { data, error } = await supabase
      .from('promotions')
      .select('famille')
      .not('famille', 'is', null)
      .order('famille');

    if (!error && data) {
      const unique = [...new Set(data.map(p => p.famille).filter(Boolean))];
      setAllFamilles(unique);
    }
  }

  async function fetchTypes() {
    const { data, error } = await supabase
      .from('promotions')
      .select('type_promo')
      .not('type_promo', 'is', null);

    if (!error && data) {
      const unique = [...new Set(data.map(p => p.type_promo).filter(Boolean))];
      setAllTypes(unique);
    }
  }

  async function fetchPromos() {
    setLoading(true);
    setNoResults(false);

    let query = supabase
      .from('promotions')
      .select('*', { count: 'exact' })
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (searchTerm.trim()) {
      query = query.ilike('titre', `%${searchTerm.trim()}%`);
    }

    if (selectedFamille) {
      query = query.eq('famille', selectedFamille);
    }

    if (selectedType) {
      query = query.eq('type_promo', selectedType);
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setPromos(data || []);
    setTotalCount(count || 0);
    setNoResults(data?.length === 0 && count === 0);
    setLoading(false);
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
        return 'Min.';
      default:
        return '';
    }
  };

  function parseDescriptionFields(description) {
    const result = {
      offre: null,
      condition: null,
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
      else if (key.includes('condition')) result.condition = value;
      else if (key.includes('fin')) result.dateFin = value;
      else if (key.includes('famille')) result.famille = value;
    });

    return result;
  }

  function isExpiringSoon(dateFin) {
    if (!dateFin) return false;
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
    return diffDays >= 0 && diffDays <= 7;
  }

  const getConditionLabel = (value) => {
    switch (value) {
      case 'ALL':
        return 'Toutes officines';
      case 'REORDER':
        return 'Réassort';
      case 'IMPLANTATION':
        return 'Implantation';
      default:
        return value || '—';
    }
  };

  // Reset filters
  function resetFilters() {
    setSearchTerm('');
    setSelectedFamille('');
    setSelectedType('');
    setCurrentPage(1);
  }

  if (loading) {
    return (
      <section className="offres-page">
        <div className="offres-container">
          <div className="offres-header">
            <button className="offres-back" onClick={() => setPage('home')}>
              ← Retour à l'accueil
            </button>
            <h1 className="offres-title">Toutes les offres laboratoires</h1>
            <p className="offres-subtitle">Découvrez toutes les promotions disponibles.</p>
          </div>
          <div className="offres-table-wrapper">
            <div className="offres-table">
              <div className="offres-table-head">
                <span>Produit</span>
                <span>Laboratoire</span>
                <span>Famille</span>
                <span>Offre</span>
                <span>Cible</span>
                <span>Fin</span>
                <span></span>
              </div>
              <div className="offres-table-body">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div key={n} className="offre-row-skeleton">
                    <div className="skeleton-bar skeleton-thumb"></div>
                    <div className="skeleton-bar skeleton-text"></div>
                    <div className="skeleton-bar skeleton-text"></div>
                    <div className="skeleton-bar skeleton-badge"></div>
                    <div className="skeleton-bar skeleton-text"></div>
                    <div className="skeleton-bar skeleton-text"></div>
                    <div className="skeleton-bar skeleton-link"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="offres-page">
      <div className="offres-container">
        <div className="offres-header">
          <button className="offres-back" onClick={() => setPage('home')}>
            ← Retour à l'accueil
          </button>
          <div className="offres-header-top">
            <h1 className="offres-title">Toutes les offres laboratoires</h1>
            <span className="offres-count">{totalCount} offres disponibles</span>
          </div>
        </div>

        <div className="offres-filters">
          <div className="offres-search">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="offres-filter-group">
            <select
              className="filter-select"
              value={selectedFamille}
              onChange={(e) => {
                setSelectedFamille(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Toutes les familles</option>
              {allFamilles.map((famille) => (
                <option key={famille} value={famille}>{famille}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tous les types</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {(searchTerm || selectedFamille || selectedType) && (
              <button className="filter-reset-btn" onClick={resetFilters}>
                × Effacer les filtres
              </button>
            )}
          </div>
        </div>

        {noResults || promos.length === 0 ? (
          <div className="offres-empty">
            <div className="empty-card">
              <p>Aucune promotion ne correspond à vos critères.</p>
              {(searchTerm || selectedFamille || selectedType) && (
                <button className="empty-reset-btn" onClick={resetFilters}>
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="offres-table-wrapper">
              <div className="offres-table">
                <div className="offres-table-head">
                  <span>Produit</span>
                  <span>Laboratoire</span>
                  <span>Famille</span>
                  <span>Offre</span>
                  <span>Cible</span>
                  <span>Fin</span>
                  <span></span>
                </div>
                <div className="offres-table-body">
                  {promos.map((promo) => {
                    const fields = parseDescriptionFields(promo.description);
                    const expiringSoon = isExpiringSoon(fields.dateFin);

                    return (
                      <div key={promo.id} className={`offre-row ${expiringSoon ? 'expiring' : ''}`}>
                        <div className="offre-cell cell-product">
                          {promo.image_url ? (
                            <img src={promo.image_url} alt={promo.produit} className="offre-thumb" />
                          ) : (
                            <div className="offre-thumb-placeholder"></div>
                          )}
                          <span className="offre-product-name">{promo.produit}</span>
                        </div>
                        <div className="offre-cell cell-lab">
                          <span className="offre-lab">{promo.titre}</span>
                        </div>
                        <div className="offre-cell cell-famille">
                          <span className="offre-famille">{fields.famille || '—'}</span>
                        </div>
                        <div className="offre-cell cell-offre">
                          <span className={`offre-badge ${getBadgeColor(promo.type_promo)}`}>
                            {getBadgeLabel(promo.type_promo)}
                          </span>
                          <span className="offre-offer-value">{fields.offre || ''}</span>
                        </div>
                        <div className="offre-cell cell-cible">
                          <span className="offre-cible">{getConditionLabel(promo.condition_client)}</span>
                        </div>
                        <div className="offre-cell cell-fin">
                          <span className={`offre-date ${expiringSoon ? 'date-expiring' : ''}`}>
                            {fields.dateFin || '—'}
                          </span>
                          {expiringSoon && (
                            <span className="offre-expiring-dot"></span>
                          )}
                        </div>
                        <div className="offre-cell cell-action">
                          <a href="#" className="offre-link">
                            Voir →
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="offres-pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Précédent
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}