import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar({ setPage }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage('home');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="navbar-logo"
          onClick={() => setPage('home')}
          aria-label="PharmaPromo, retour à l'accueil"
        >
          <img src={logo} alt="PharmaPromo" className="navbar-logo-image" />
        </button>

        <div className="navbar-actions">
          {session ? (
            <>
              <button
                type="button"
                className="navbar-cta-secondary"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <button
              type="button"
              className="navbar-cta-secondary"
              onClick={() => setPage('login')}
            >
              Se connecter
            </button>
          )}
        </div>
      </div>
    </header>
  );
}