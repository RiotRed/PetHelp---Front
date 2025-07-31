import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import AuthModal from './components/AuthModal.tsx';

const App: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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

  return (
    <AuthProvider>
      <div>
        <Header 
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
        />
        <Dashboard />
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