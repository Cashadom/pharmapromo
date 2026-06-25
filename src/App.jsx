import { useState } from 'react';
import Home from './routes/Home';
import CreatePromotion from './routes/CreatePromotion';
import LabPricing from './routes/LabPricing';
import LabRegister from './routes/LabRegister';
import Mentions from './routes/Mentions';
import Offres from './routes/Offres';
import OfferDetail from './routes/OfferDetail';
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  return (
    <>
      {page === 'home' && (
        <Home 
          setPage={setPage} 
          setSelectedOfferId={setSelectedOfferId} 
        />
      )}
      {page === 'create' && <CreatePromotion setPage={setPage} />}
      {page === 'pricing' && <LabPricing setPage={setPage} />}
      {page === 'lab-register' && <LabRegister setPage={setPage} />}
      {page === 'mentions' && <Mentions setPage={setPage} />}
      {page === 'offres' && (
        <Offres 
          setPage={setPage} 
          setSelectedOfferId={setSelectedOfferId}
        />
      )}
      {page === 'offer-detail' && (
        <OfferDetail 
          setPage={setPage} 
          offerId={selectedOfferId}
        />
      )}
      {page === 'login' && <Login setPage={setPage} />}
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
    </>
  );
}