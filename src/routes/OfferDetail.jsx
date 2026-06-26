import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './OfferDetail.css';
import emailIcon from '../assets/email.png';

export default function OfferDetail({ setPage, offerId }) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOffer() {
      if (!offerId) {
        setError('Aucune offre sélectionnée');
        setLoading(false);
        return;
      }

      console.log('🔄 Mise à jour de la consultation pour offre:', offerId);

      // 1. Mettre à jour updated_at (dernière consultation)
      const { error: updateError } = await supabase
        .from('promotions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', offerId);

      if (updateError) {
        console.error('❌ Erreur mise à jour updated_at:', updateError);
      } else {
        console.log('✅ updated_at mis à jour avec succès');
      }

      // 2. Récupérer les données de l'offre avec le laboratoire
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          laboratoires (
            nom,
            email,
            telephone,
            logo_url,
            site_web
          )
        `)
        .eq('id', offerId)
        .single();

      if (error) {
        console.error(error);
        setError('Offre non trouvée');
        setLoading(false);
        return;
      }

      console.log('📦 Offre chargée:', data.produit);
      setOffer(data);
      setLoading(false);
    }

    fetchOffer();
  }, [offerId]);

  function getConditionLabel(value) {
    switch (value) {
      case 'ALL':
        return 'Toutes les officines';
      case 'REORDER':
        return 'Réassort (clients existants)';
      case 'IMPLANTATION':
        return 'Implantation (nouveaux clients)';
      default:
        return value || '—';
    }
  }

  function getTypeLabel(type) {
    switch (type) {
      case 'PERCENT':
        return 'Remise (%)';
      case 'FREE_ITEM':
        return 'Unité offerte';
      case 'RETURN_EXPIRED':
        return 'Reprise périmés';
      case 'ORDER_THRESHOLD':
        return 'Montant minimum commande';
      default:
        return type || '—';
    }
  }

  function getVisibilityLabel(mode) {
    switch (mode) {
      case 'PUBLIC':
        return 'Offre publique';
      case 'SEMI_PRIVATE':
        return 'Offre semi-privée';
      case 'PRIVATE':
        return 'Offre privée';
      default:
        return '—';
    }
  }

  function getOfferSummary() {
    switch (offer?.type_promo) {
      case 'PERCENT':
        return offer.remise_valeur ? `${offer.remise_valeur}% de remise` : 'Remise';
      case 'FREE_ITEM':
        return offer.unite_offerte ? `${offer.unite_offerte} unités offertes` : 'Unités offertes';
      case 'ORDER_THRESHOLD':
        return offer.montant_minimum ? `Commande minimum : ${offer.montant_minimum}€` : 'Montant minimum';
      case 'RETURN_EXPIRED':
        return 'Reprise périmés';
      default:
        return '';
    }
  }

  function getMailtoLink() {
    if (!offer) return '#';
    
    // Email du laboratoire (destinataire)
    const laboEmail = offer.laboratoires?.email || '';
    
    // Objet professionnel avec PharmaPromo, produit et EAN
    const subject = encodeURIComponent(
      `PharmaPromo - ${offer.produit}${offer.csp ? ` - ${offer.csp}` : ''} - Demande d'informations`
    );
    
    // Corps du message
    const body = encodeURIComponent(
      `Bonjour,\n\nJe suis pharmacien(ne) et je souhaite obtenir plus d'informations sur votre offre :\n\n` +
      `Produit : ${offer.produit}\n` +
      `Code EAN : ${offer.csp || 'Non renseigné'}\n` +
      `Type d'offre : ${getTypeLabel(offer.type_promo)}\n` +
      `Conditions : ${getConditionLabel(offer.condition_client)}\n` +
      `Famille : ${offer.famille || 'Non renseignée'}\n` +
      `Valable jusqu'au : ${offer.date_fin ? new Date(offer.date_fin).toLocaleDateString('fr-FR') : 'Non renseignée'}\n\n` +
      `Pouvez-vous me contacter pour me communiquer les conditions détaillées ?\n\n` +
      `Cordialement,\n` +
      `[Nom de la pharmacie]\n` +
      `[Téléphone]\n` +
      `[Email]`
    );
    
    // L'email du laboratoire est bien le destinataire
    return `mailto:${laboEmail}?subject=${subject}&body=${body}`;
  }

  if (loading) {
    return (
      <section className="offer-detail-page">
        <div className="offer-detail-container">
          <button 
            className="offer-detail-back" 
            onClick={() => {
              setPage('offres');
              setTimeout(() => {
                window.location.reload();
              }, 200);
            }}
          >
            ← Retour aux offres
          </button>
          <div className="offer-detail-skeleton">
            <div className="skeleton-block skeleton-image"></div>
            <div className="skeleton-block skeleton-title"></div>
            <div className="skeleton-block skeleton-text"></div>
            <div className="skeleton-block skeleton-text"></div>
            <div className="skeleton-block skeleton-text"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !offer) {
    return (
      <section className="offer-detail-page">
        <div className="offer-detail-container">
          <button 
            className="offer-detail-back" 
            onClick={() => {
              setPage('offres');
              setTimeout(() => {
                window.location.reload();
              }, 200);
            }}
          >
            ← Retour aux offres
          </button>
          <div className="offer-detail-error">
            <h2>Offre non trouvée</h2>
            <p>L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="offer-detail-page">
      <div className="offer-detail-container">
        <button 
          className="offer-detail-back" 
          onClick={() => {
            setPage('offres');
            setTimeout(() => {
              window.location.reload();
            }, 200);
          }}
        >
          ← Retour aux offres
        </button>

        <div className="offer-detail-card">
          {offer.image_url && (
            <div className="offer-detail-image">
              <img src={offer.image_url} alt={offer.produit} />
            </div>
          )}

          <div className="offer-detail-content">
            <div className="offer-detail-header">
              <h1 className="offer-detail-title">{offer.produit}</h1>
              <div className="offer-detail-badges">
                <span className={`offer-detail-badge badge-${offer.type_promo?.toLowerCase() || 'default'}`}>
                  {getTypeLabel(offer.type_promo)}
                </span>
                {offer.visibility_mode && (
                  <span className={`offer-detail-badge badge-${offer.visibility_mode?.toLowerCase() || 'default'}`}>
                    {getVisibilityLabel(offer.visibility_mode)}
                  </span>
                )}
              </div>
            </div>

            <div className="offer-detail-lab">
              {offer.laboratoires?.logo_url && (
                <img 
                  src={offer.laboratoires.logo_url} 
                  alt={offer.laboratoires.nom} 
                  className="offer-detail-lab-logo" 
                />
              )}
              <span className="offer-detail-lab-name">
                {offer.laboratoires?.nom || offer.titre || 'Laboratoire'}
              </span>
            </div>

            <div className="offer-detail-grid">
              <div className="offer-detail-item">
                <span className="offer-detail-label">Type d'offre</span>
                <span className="offer-detail-value">{getOfferSummary()}</span>
              </div>
              <div className="offer-detail-item">
                <span className="offer-detail-label">Condition client</span>
                <span className="offer-detail-value">{getConditionLabel(offer.condition_client)}</span>
              </div>
              <div className="offer-detail-item">
                <span className="offer-detail-label">Famille</span>
                <span className="offer-detail-value">{offer.famille || '—'}</span>
              </div>
              {offer.csp && (
                <div className="offer-detail-item">
                  <span className="offer-detail-label">Code EAN</span>
                  <span className="offer-detail-value">{offer.csp}</span>
                </div>
              )}
              <div className="offer-detail-item">
                <span className="offer-detail-label">Valable jusqu'au</span>
                <span className="offer-detail-value">
                  {offer.date_fin ? new Date(offer.date_fin).toLocaleDateString('fr-FR') : '—'}
                </span>
              </div>
            </div>

            {offer.description && (
              <div className="offer-detail-description">
                <h3>Description</h3>
                <p>{offer.description}</p>
              </div>
            )}

            <div className="offer-detail-contact">
              <a href={getMailtoLink()} className="offer-detail-contact-btn">
                <img src={emailIcon} alt="Email" className="offer-detail-contact-icon" />
                Contacter le fournisseur
              </a>
              {offer.laboratoires?.telephone && (
                <a href={`tel:${offer.laboratoires.telephone}`} className="offer-detail-phone">
                  📞 {offer.laboratoires.telephone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}