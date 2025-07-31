import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">🐕 PetHelp</div>
        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '16px', color: '#666' }}>
                Bienvenido, {user?.nombre}
              </span>
              <button className="btn btn-primary" onClick={logout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={onLoginClick}>
                Iniciar Sesión
              </button>
              <button className="btn btn-secondary" onClick={onRegisterClick}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 