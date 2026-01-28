import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Toast from './components/Toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductPage from './pages/ProductPage';

function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  const handleAdminClick = () => {
    setShowAdmin(true);
  };

  const handleAdminLogout = () => {
    setShowAdmin(false);
    navigate('/');
  };

  const handleBackToStore = () => {
    setShowAdmin(false);
  };

  if (showAdmin) {
    return (
      <>
        <Toast />
        <Admin onLogout={handleAdminLogout} />
      </>
    );
  }

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Home onAdminClick={handleAdminClick} />} />
        <Route path="/product/:productId" element={<ProductPage onAdminClick={handleAdminClick} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}
