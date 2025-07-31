import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick, onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard', public: true },
    { id: 'perros-por-dueno', label: '👤 Perros por Dueño', public: true },
    { id: 'mapa-densidad', label: '🗺️ Mapa de Densidad', public: true },
    { id: 'analisis-incidentes', label: '📊 Análisis Incidentes', public: false },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
          🐕 PetHelp
        </div>
        
        <nav className="nav-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {navItems.map(item => (
            (item.public || isAuthenticated) && (
              <button
                key={item.id}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentPage === item.id ? '#667eea' : '#666',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: currentPage === item.id ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.label}
              </button>
            )
          ))}
        </nav>

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