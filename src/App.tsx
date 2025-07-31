import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import PerrosPorDueño from './components/PerrosPorDueño.tsx';
import MapaDensidadCanina from './components/MapaDensidadCanina.tsx';
import AnalisisIncidentes from './components/AnalisisIncidentes.tsx';
import AuthModal from './components/AuthModal.tsx';

const App: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'perros-por-dueno':
        return <PerrosPorDueño />;
      case 'mapa-densidad':
        return <MapaDensidadCanina />;
      case 'analisis-incidentes':
        return <AnalisisIncidentes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <div>
        <Header 
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
        {renderCurrentPage()}
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          mode={authMode}
        />
      </div>
    </AuthProvider>
  );
};

export default App; 