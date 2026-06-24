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

  useEffect(() => {
    fetchPromos();
  }, []);

  async function fetchPromos() {
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

    setPromos(data || []);
    setLoading(false);
  }

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