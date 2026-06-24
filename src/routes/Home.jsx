import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PromoHighlights from '../components/PromoHighlights';
import PromoDirectory from '../components/PromoDirectory';
import LabBlock from '../components/LabBlock';
import Footer from '../components/Footer';

export default function Home({ setPage, setSelectedOfferId }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPromos() {
    console.log('🔄 Chargement des promos...');
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    console.log('📦 Promos chargées:', data?.length || 0);
    // Afficher les dates updated_at pour vérifier
    data?.forEach(p => console.log(`📅 ${p.produit}: ${p.updated_at}`));
    setPromos(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPromos();
  }, []);

  // Recharger quand on revient à la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👀 Page visible, rechargement...');
        fetchPromos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleFocus = () => {
      console.log('🎯 Focus, rechargement...');
      fetchPromos();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <>
      <Navbar setPage={setPage} />

      <Hero setPage={setPage} />

      <PromoHighlights
        promos={promos.slice(0, 6)}
        loading={loading}
        setPage={setPage}
        setSelectedOfferId={setSelectedOfferId}
      />

      <PromoDirectory
        promos={promos}
        loading={loading}
        setPage={setPage}
      />

      <LabBlock setPage={setPage} />

      <Footer setPage={setPage} />
    </>
  );
}