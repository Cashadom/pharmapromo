import React from 'react';
import './Footer.css';
import logo from '../assets/logo1.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={logo} alt="PharmaPromo" className="footer-logo" />
            <p className="footer-tagline">
              Toutes les promotions laboratoires, enfin au même endroit.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-column-title">Navigation</h4>
              <ul className="footer-list">
                <li><a href="#">Promotions</a></li>
                <li><a href="#">Laboratoires</a></li>
                <li><a href="#">Comment ça marche</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Contact</h4>
              <ul className="footer-list">
                <li><a href="tel:0695368383">06 95 36 83 83</a></li>
                <li><a href="mailto:contact@pharmapromo.fr">contact@pharmapromo.fr</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Légal</h4>
              <ul className="footer-list">
                <li><a href="#">Mentions légales</a></li>
                <li><a href="#">Politique de confidentialité</a></li>
                <li><a href="#">CGU</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} PharmaPromo. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}