import React from 'react';
import './LabBlock.css';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon6 from '../assets/icon6.png';

export default function LabBlock({ setPage }) {
  return (
    <section className="lab-block">
      <div className="lab-block-container">
        {/* Left content */}
        <div className="lab-block-left">
          <span className="lab-badge">Pour les laboratoires</span>
          
          <h2 className="lab-title">
            Vous êtes un laboratoire ?
          </h2>
          
          <p className="lab-description">
            Publiez vos promotions en quelques minutes et rendez vos offres visibles auprès des pharmacies.
          </p>
          
          <p className="lab-sub-description">
            Créez une promotion, choisissez vos dates de diffusion et suivez vos performances depuis un tableau de bord simple.
          </p>
          
          <div className="lab-features">
            <div className="lab-feature">
              <img src={icon1} alt="Rapidité" className="lab-feature-icon" />
              <div>
                <span className="lab-feature-title">Publication en moins de 2 minutes</span>
                <span className="lab-feature-description">Créez et publiez vos offres en quelques clics</span>
              </div>
            </div>
            
            <div className="lab-feature">
              <img src={icon2} alt="Visibilité" className="lab-feature-icon" />
              <div>
                <span className="lab-feature-title">Visible par les pharmacies</span>
                <span className="lab-feature-description">Touchez directement votre cible</span>
              </div>
            </div>
            
            <div className="lab-feature">
              <img src={icon6} alt="Statistiques" className="lab-feature-icon" />
              <div>
                <span className="lab-feature-title">Garanties de consultation</span>
                <span className="lab-feature-description">Analysez la performance de vos promotions</span>
              </div>
            </div>
          </div>
          
          <button className="lab-cta" onClick={() => setPage('create')}>
            Publier une promotion
          </button>
        </div>
        
        {/* Right illustration */}
        <div className="lab-block-right">
          <div className="lab-illustration">
            <div className="lab-stats">
              <div className="lab-stat-card lab-stat-views">
                <img src={icon2} alt="Vues" className="lab-stat-icon-img" />
                <div className="lab-stat-content">
                  <div className="lab-stat-number">+2 450</div>
                  <div className="lab-stat-label">Vues</div>
                </div>
              </div>
              
              <div className="lab-stat-card lab-stat-clicks">
                <img src={icon4} alt="Clics" className="lab-stat-icon-img" />
                <div className="lab-stat-content">
                  <div className="lab-stat-number">+320</div>
                  <div className="lab-stat-label">Clics</div>
                </div>
              </div>
              
              <div className="lab-stat-card lab-stat-consultations">
                <img src={icon5} alt="Consultations" className="lab-stat-icon-img" />
                <div className="lab-stat-content">
                  <div className="lab-stat-number">+95</div>
                  <div className="lab-stat-label">Consultations</div>
                </div>
              </div>
            </div>
            
            <div className="lab-promo-card">
              <div className="lab-promo-header">
                <span className="lab-promo-title">Promotion active</span>
                <span className="lab-promo-status">En ligne</span>
              </div>
              <div className="lab-promo-body">
                <div className="lab-promo-name">Produit A</div>
                <div className="lab-promo-offer">-20% sur toute la gamme</div>
                <div className="lab-promo-meta">
                  <span>📅 15 juin - 15 juillet</span>
                  <span className="promo-meta-views">
                    <img src={icon1} alt="Vues" className="promo-meta-icon" />
                    1 230 vues
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}