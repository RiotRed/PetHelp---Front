import React, { useState, useEffect } from 'react';
import { PerroService, Perro } from '../services/PerroService.ts';
import { DistritoService, Distrito } from '../services/DistritoService.ts';

const MapaDensidadCanina: React.FC = () => {
  const [perros, setPerros] = useState<Perro[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [perrosData, distritosData] = await Promise.all([
        PerroService.getAll(),
        DistritoService.getAll(),
      ]);
      setPerros(perrosData);
      setDistritos(distritosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular densidad por distrito
  const densidadPorDistrito = distritos.map(distrito => {
    const perrosEnDistrito = perros.filter(perro => perro.distritoid === distrito.id);
    const densidad = perrosEnDistrito.length;
    
    // Determinar el nivel de densidad
    let nivelDensidad = 'Baja';
    let color = '#51cf66';
    
    if (densidad >= 10) {
      nivelDensidad = 'Alta';
      color = '#ff6b6b';
    } else if (densidad >= 5) {
      nivelDensidad = 'Media';
      color = '#ffa726';
    }
    
    return {
      ...distrito,
      densidad,
      nivelDensidad,
      color,
      perros: perrosEnDistrito
    };
  });

  // Ordenar por densidad (mayor a menor)
  const distritosOrdenados = densidadPorDistrito.sort((a, b) => b.densidad - a.densidad);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>🗺️ Mapa de Densidad Canina</h2>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          padding: '30px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            margin: '0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🗺️ Mapa de Densidad Canina
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            margin: '10px 0 0 0',
            opacity: '0.9'
          }}>
            Visualiza las zonas con mayor concentración de perros
          </p>
        </div>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>📊 Resumen de Densidad</h3>
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-number">{perros.length}</div>
              <div className="stats-label">Total de Perros</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{distritos.length}</div>
              <div className="stats-label">Distritos</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">
                {Math.round(perros.length / distritos.length)}
              </div>
              <div className="stats-label">Promedio por Distrito</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>🗺️ Densidad por Distrito</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {distritosOrdenados.map(distrito => (
              <div 
                key={distrito.id} 
                className="stats-card" 
                style={{ 
                  border: `3px solid ${distrito.color}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: distrito.color,
                  color: 'white',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  borderBottomLeftRadius: '8px'
                }}>
                  {distrito.nivelDensidad}
                </div>
                
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#667eea',
                  fontSize: '1.2rem'
                }}>
                  {distrito.nombre}
                </h4>
                
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: distrito.color, marginBottom: '10px' }}>
                  {distrito.densidad} perros
                </div>
                
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  <p><strong>Densidad:</strong> {distrito.densidad} perros registrados</p>
                  <p><strong>Nivel:</strong> {distrito.nivelDensidad}</p>
                  
                  {distrito.perros.length > 0 && (
                    <div style={{ marginTop: '15px' }}>
                      <p><strong>Perros en este distrito:</strong></p>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '5px',
                        marginTop: '5px'
                      }}>
                        {distrito.perros.slice(0, 5).map(perro => (
                          <span 
                            key={perro.id}
                            style={{
                              background: '#f0f0f0',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {perro.nombre}
                          </span>
                        ))}
                        {distrito.perros.length > 5 && (
                          <span style={{
                            background: '#f0f0f0',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            +{distrito.perros.length - 5} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>🎨 Leyenda</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#ff6b6b', 
                borderRadius: '4px' 
              }}></div>
              <span>Alta densidad (10+ perros)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#ffa726', 
                borderRadius: '4px' 
              }}></div>
              <span>Media densidad (5-9 perros)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#51cf66', 
                borderRadius: '4px' 
              }}></div>
              <span>Baja densidad (0-4 perros)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaDensidadCanina; 