import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { IncidenteService, Incidente } from '../services/IncidenteService.ts';

const IncidenteForm: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [incidenteForm, setIncidenteForm] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    tipo: '',
    severidad: '',
    fecha: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIncidenteForm({
      ...incidenteForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newIncidente: Incidente = {
        ...incidenteForm,
        usuarioid: user?.id,
        estado: 'Pendiente',
      };
      
      await IncidenteService.create(newIncidente);
      alert('Incidente reportado exitosamente');
      
      setShowForm(false);
      setIncidenteForm({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        tipo: '',
        severidad: '',
        fecha: '',
      });
    } catch (error) {
      console.error('Error creating incidente:', error);
      alert('Error al reportar el incidente');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '30px' }}>
      <h3>🚨 Reportar Incidente</h3>
      <button 
        className="btn btn-danger" 
        onClick={() => setShowForm(!showForm)}
        style={{ fontSize: '1.1rem', padding: '12px 24px' }}
      >
        {showForm ? '❌ Cancelar' : '🚨 Reportar Incidente'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Título del Incidente</label>
              <input
                type="text"
                name="titulo"
                className="form-input"
                value={incidenteForm.titulo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Incidente</label>
              <select
                name="tipo"
                className="form-input"
                value={incidenteForm.tipo}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Perro perdido">Perro perdido</option>
                <option value="Perro agresivo">Perro agresivo</option>
                <option value="Perro herido">Perro herido</option>
                <option value="Perro abandonado">Perro abandonado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Severidad</label>
              <select
                name="severidad"
                className="form-input"
                value={incidenteForm.severidad}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar severidad</option>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha del Incidente</label>
              <input
                type="datetime-local"
                name="fecha"
                className="form-input"
                value={incidenteForm.fecha}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                className="form-input"
                value={incidenteForm.ubicacion}
                onChange={handleInputChange}
                placeholder="Dirección o referencia"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descripción Detallada</label>
              <textarea
                name="descripcion"
                className="form-input"
                value={incidenteForm.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe el incidente con el mayor detalle posible..."
                required
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-danger" style={{ marginTop: '20px' }}>
            🚨 Reportar Incidente
          </button>
        </form>
      )}
    </div>
  );
};

export default IncidenteForm; 