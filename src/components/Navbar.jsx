import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar({ setPage }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        <button
          type="button"
          className="navbar-logo"
          onClick={() => setPage('home')}
          aria-label="PharmaPromo, retour à l'accueil"
        >
          <img
            src={logo}
            alt="PharmaPromo"
            className="navbar-logo-image"
          />
        </button>

        <nav className="navbar-links">
          <a href="#promotions">Promotions</a>
          <a href="#annuaire">Annuaire</a>
          <button
            type="button"
            className="navbar-link-nav"
            onClick={() => setPage('pricing')}
          >
            Laboratoires
          </button>
        </nav>

        <div className="navbar-actions">

          <button
            type="button"
            className="navbar-link-button"
            onClick={() => setPage('home')}
          >
            Accueil
          </button>

          <button
            type="button"
            className="navbar-cta"
            onClick={() => setPage('create')}
          >
            Publier une promotion
          </button>

        </div>

      </div>
    </header>
  );
}