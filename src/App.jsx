import { useState } from 'react';
import Home from './routes/Home';
import CreatePromotion from './routes/CreatePromotion';
import LabPricing from './routes/LabPricing';
import LabRegister from './routes/LabRegister';

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <>
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'create' && <CreatePromotion setPage={setPage} />}
      {page === 'pricing' && <LabPricing setPage={setPage} />}
      {page === 'lab-register' && <LabRegister setPage={setPage} />}
    </>
  );
}