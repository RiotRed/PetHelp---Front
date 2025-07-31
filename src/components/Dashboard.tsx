import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext.tsx';
import { PerroService, Perro } from '../services/PerroService.ts';
import { RazaService, Raza } from '../services/RazaService.ts';
import { DistritoService, Distrito } from '../services/DistritoService.ts';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [perros, setPerros] = useState<Perro[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPerroForm, setShowPerroForm] = useState(false);
  const [perroForm, setPerroForm] = useState({
    nombre: '',
    distritoid: 1,
    razaid: 1,
    tamanio: '',
    comportamiento: '',
    color: '',
    genero: '',
    edad: 0,
    vacunado: false,
    esterilizado: false,
    direccion: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [perrosData, razasData, distritosData] = await Promise.all([
        PerroService.getAll(),
        RazaService.getAll(),
        DistritoService.getAll(),
      ]);
      setPerros(perrosData);
      setRazas(razasData);
      setDistritos(distritosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizarEdad = (edad: number) => {
    if (edad < 2) return 'Cachorro';
    if (edad < 7) return 'Adulto';
    return 'Senior';
  };

  const handlePerroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPerro: Perro = {
        ...perroForm,
        usuarioid: user?.id,
      };
      await PerroService.create(newPerro);
      setShowPerroForm(false);
      setPerroForm({
        nombre: '',
        distritoid: 1,
        razaid: 1,
        tamanio: '',
        comportamiento: '',
        color: '',
        genero: '',
        edad: 0,
        vacunado: false,
        esterilizado: false,
        direccion: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating perro:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPerroForm({
      ...perroForm,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Dashboard</h2>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const porRaza = perros.reduce((acc, perro) => {
    const raza = razas.find(r => r.id === perro.razaid)?.nombre || 'Sin raza';
    acc[raza] = (acc[raza] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const porEdad = perros.reduce((acc, perro) => {
    const categoria = categorizarEdad(perro.edad);
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const porTamaño = perros.reduce((acc, perro) => {
    acc[perro.tamanio] = (acc[perro.tamanio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const porGenero = perros.reduce((acc, perro) => {
    acc[perro.genero] = (acc[perro.genero] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container">
      <div className="card">
        <h2>📊 Dashboard General</h2>
        
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-number">{perros.length}</div>
            <div className="stats-label">Total de Perros</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{razas.length}</div>
            <div className="stats-label">Razas Registradas</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{distritos.length}</div>
            <div className="stats-label">Distritos</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <h3>Perros por Raza</h3>
            <div className="chart-container">
              <Pie
                data={{
                  labels: Object.keys(porRaza),
                  datasets: [{
                    data: Object.values(porRaza),
                    backgroundColor: ['#51cf66', '#ffa726', '#ff6b6b', '#667eea', '#ffd600', '#00bcd4'],
                  }]
                }}
              />
            </div>
          </div>

          <div className="stats-card">
            <h3>Categorías de Edad</h3>
            <div className="chart-container">
              <Bar
                data={{
                  labels: Object.keys(porEdad),
                  datasets: [{
                    label: 'Cantidad',
                    data: Object.values(porEdad),
                    backgroundColor: '#667eea',
                  }]
                }}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          <div className="stats-card">
            <h3>Perros por Tamaño</h3>
            <div className="chart-container">
              <Bar
                data={{
                  labels: Object.keys(porTamaño),
                  datasets: [{
                    label: 'Cantidad',
                    data: Object.values(porTamaño),
                    backgroundColor: '#51cf66',
                  }]
                }}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          <div className="stats-card">
            <h3>Perros por Género</h3>
            <div className="chart-container">
              <Pie
                data={{
                  labels: Object.keys(porGenero),
                  datasets: [{
                    data: Object.values(porGenero),
                    backgroundColor: ['#ff6b6b', '#667eea'],
                  }]
                }}
              />
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="card">
            <h3>🐕 Registrar Nuevo Perro</h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowPerroForm(!showPerroForm)}
            >
              {showPerroForm ? 'Cancelar' : 'Registrar Perro'}
            </button>

            {showPerroForm && (
              <form onSubmit={handlePerroSubmit} style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Nombre del Perro</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-input"
                      value={perroForm.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Raza</label>
                    <select
                      name="razaid"
                      className="form-input"
                      value={perroForm.razaid}
                      onChange={handleInputChange}
                      required
                    >
                      {razas.map(raza => (
                        <option key={raza.id} value={raza.id}>
                          {raza.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Distrito</label>
                    <select
                      name="distritoid"
                      className="form-input"
                      value={perroForm.distritoid}
                      onChange={handleInputChange}
                      required
                    >
                      {distritos.map(distrito => (
                        <option key={distrito.id} value={distrito.id}>
                          {distrito.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tamaño</label>
                    <select
                      name="tamanio"
                      className="form-input"
                      value={perroForm.tamanio}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar tamaño</option>
                      <option value="Pequeño">Pequeño</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Grande">Grande</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Comportamiento</label>
                    <select
                      name="comportamiento"
                      className="form-input"
                      value={perroForm.comportamiento}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar comportamiento</option>
                      <option value="Amistoso">Amistoso</option>
                      <option value="Tranquilo">Tranquilo</option>
                      <option value="Agresivo">Agresivo</option>
                      <option value="Juguetón">Juguetón</option>
                      <option value="Tímido">Tímido</option>
                      <option value="Protector">Protector</option>
                      <option value="Travieso">Travieso</option>
                      <option value="Cariñoso">Cariñoso</option>
                      <option value="Fiel">Fiel</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <input
                      type="text"
                      name="color"
                      className="form-input"
                      value={perroForm.color}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Género</label>
                    <select
                      name="genero"
                      className="form-input"
                      value={perroForm.genero}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Macho">Macho</option>
                      <option value="Hembra">Hembra</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Edad (años)</label>
                    <input
                      type="number"
                      name="edad"
                      className="form-input"
                      value={perroForm.edad}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      className="form-input"
                      value={perroForm.direccion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        name="vacunado"
                        checked={perroForm.vacunado}
                        onChange={handleInputChange}
                      />
                      Vacunado
                    </label>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        name="esterilizado"
                        checked={perroForm.esterilizado}
                        onChange={handleInputChange}
                      />
                      Esterilizado
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
                  Registrar Perro
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 