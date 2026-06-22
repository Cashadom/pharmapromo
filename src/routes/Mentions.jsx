import React from 'react';
import './Mentions.css';

export default function Mentions({ setPage }) {
  return (
    <section className="mentions-page">
      <div className="mentions-container">
        <button 
          className="mentions-back"
          onClick={() => setPage('home')}
        >
          ← Retour à l'accueil
        </button>

        <div className="mentions-header">
          <h1 className="mentions-title">Mentions légales</h1>
          <p className="mentions-subtitle">
            Informations légales relatives à l'utilisation de PharmaPromo.
          </p>
        </div>

        <div className="mentions-card">
          {/* Section 1 - Éditeur */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">1. Éditeur du site</h2>
            <p className="mentions-text">
              PharmaPromo<br />
              Projet pilote SaaS B2B dédié à la centralisation des promotions laboratoires pour pharmacies d'officine.
            </p>
            <p className="mentions-text">
              <strong>Responsable de publication :</strong> Cyril Ragonet
            </p>
            <p className="mentions-text">
              <strong>Email de contact :</strong> contact@pharmapromo.fr
            </p>
            <p className="mentions-text">
              <strong>Adresse :</strong> à compléter
            </p>
            <p className="mentions-text">
              <strong>SIRET :</strong> à compléter
            </p>
          </div>

          {/* Section 2 - Hébergement */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">2. Hébergement</h2>
            <p className="mentions-text">
              Le site est hébergé par :
            </p>
            <p className="mentions-text">
              <strong>Netlify, Inc.</strong><br />
              44 Montgomery Street, Suite 300<br />
              San Francisco, CA 94104<br />
              États-Unis
            </p>
            <p className="mentions-text">
              <strong>Infrastructure applicative et base de données :</strong> Supabase
            </p>
          </div>

          {/* Section 3 - Objet du service */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">3. Objet du service</h2>
            <p className="mentions-text">
              PharmaPromo permet aux laboratoires, fabricants, distributeurs ou prestataires du secteur officinal de référencer leurs offres promotionnelles, produits et documents commerciaux à destination des pharmacies.
            </p>
            <p className="mentions-text">
              Les pharmacies peuvent consulter gratuitement les promotions actives publiées sur la plateforme.
            </p>
          </div>

          {/* Section 4 - Accès au service */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">4. Accès au service</h2>
            <p className="mentions-text">
              La consultation des promotions est gratuite pour les pharmacies.
            </p>
            <p className="mentions-text">
              La publication d'offres par les laboratoires peut être soumise à inscription, essai gratuit ou abonnement payant.
            </p>
          </div>

          {/* Section 5 - Responsabilité */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">5. Responsabilité</h2>
            <p className="mentions-text">
              Les informations publiées sur PharmaPromo sont fournies par les laboratoires ou annonceurs.
            </p>
            <p className="mentions-text">
              PharmaPromo ne garantit pas l'exactitude, la disponibilité, les conditions commerciales ou la validité réglementaire des offres publiées.
            </p>
            <p className="mentions-text">
              Chaque laboratoire reste responsable du contenu, des visuels, des prix, des remises, des conditions commerciales et de la conformité réglementaire de ses promotions.
            </p>
          </div>

          {/* Section 6 - Données personnelles */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">6. Données personnelles</h2>
            <p className="mentions-text">
              Les données collectées via les formulaires sont utilisées uniquement pour :
            </p>
            <ul className="mentions-list">
              <li>contacter les laboratoires inscrits</li>
              <li>créer un espace laboratoire</li>
              <li>gérer les demandes commerciales</li>
              <li>améliorer le service</li>
            </ul>
            <p className="mentions-text">
              Les données ne sont pas revendues à des tiers.
            </p>
            <p className="mentions-text">
              L'utilisateur peut demander la modification ou la suppression de ses données en contactant :<br />
              <strong>contact@pharmapromo.fr</strong>
            </p>
          </div>

          {/* Section 7 - Cookies */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">7. Cookies</h2>
            <p className="mentions-text">
              Dans sa version pilote, PharmaPromo n'utilise pas de cookies publicitaires.
            </p>
            <p className="mentions-text">
              Des cookies ou technologies nécessaires au bon fonctionnement technique du site peuvent être utilisés.
            </p>
          </div>

          {/* Section 8 - Propriété intellectuelle */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">8. Propriété intellectuelle</h2>
            <p className="mentions-text">
              La marque PharmaPromo, les textes, interfaces, éléments graphiques et composants du site sont protégés.
            </p>
            <p className="mentions-text">
              Toute reproduction ou réutilisation non autorisée est interdite.
            </p>
            <p className="mentions-text">
              Les marques, logos et visuels produits éventuellement publiés restent la propriété de leurs titulaires respectifs.
            </p>
          </div>

          {/* Section 9 - Phase pilote */}
          <div className="mentions-section">
            <h2 className="mentions-section-title">9. Phase pilote</h2>
            <p className="mentions-text">
              PharmaPromo est actuellement en version pilote.
            </p>
            <p className="mentions-text">
              Certaines fonctionnalités peuvent évoluer, être modifiées, supprimées ou réservées à certains utilisateurs pendant la phase de test.
            </p>
          </div>

          {/* Section 10 - Contact */}
          <div className="mentions-section mentions-section-last">
            <h2 className="mentions-section-title">10. Contact</h2>
            <p className="mentions-text">
              Pour toute question :
            </p>
            <p className="mentions-text">
              <strong>contact@pharmapromo.fr</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}