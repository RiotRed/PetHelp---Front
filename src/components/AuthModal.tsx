import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UsuarioService, Usuario } from '../services/UsuarioService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    direccion: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }

        const newUser: Usuario = {
          email: formData.email,
          nombre: formData.nombre,
          direccion: formData.direccion,
          password: formData.password,
          dueño: true,
        };

        await UsuarioService.create(newUser);
        login(newUser);
        onClose();
      } else {
        const user = await UsuarioService.login(formData.email, formData.password);
        if (user) {
          login(user);
          onClose();
        } else {
          setError('Credenciales incorrectas');
        }
      }
    } catch (error) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-input"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {error && (
            <div style={{ color: 'red', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal; 