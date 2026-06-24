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

        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-cta-secondary"
            onClick={() => setPage('login')}
          >
            Se connecter
          </button>
        </div>

      </div>
    </header>
  );
}