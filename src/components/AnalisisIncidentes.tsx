import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { IncidenteService, Incidente } from '../services/IncidenteService.ts';
import { PerroService, Perro } from '../services/PerroService.ts';
import { RazaService, Raza } from '../services/RazaService.ts';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalisisIncidentes: React.FC = () => {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [perros, setPerros] = useState<Perro[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [incidentesData, perrosData, razasData] = await Promise.all([
        IncidenteService.getAll(),
        PerroService.getAll(),
        RazaService.getAll(),
      ]);
      setIncidentes(incidentesData);
      setPerros(perrosData);
      setRazas(razasData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nombre de la raza
  const getRazaNombre = (razaid: number) => {
    const raza = razas.find(r => r.id === razaid);
    return raza?.nombre || 'Sin raza';
  };

  // Analizar incidentes por raza
  const analisisPorRaza = () => {
    const incidentesPorRaza: Record<string, number> = {};
    const perrosInvolucrados: Record<string, Perro[]> = {};

    console.log('=== ANÁLISIS DE INCIDENTES POR RAZA ===');
    console.log('Total de incidentes:', incidentes.length);
    console.log('Total de perros:', perros.length);

    // Para cada incidente, buscar perros que podrían estar involucrados
    incidentes.forEach((incidente, index) => {
      console.log(`\n--- Incidente ${index + 1}: ${incidente.titulo} ---`);
      console.log(`Ubicación: ${incidente.ubicacion}`);
      console.log(`Tipo: ${incidente.tipo}`);
      
      // Buscar perros en la ubicación del incidente o con características similares
      const perrosRelacionados = perros.filter(perro => {
        // Relacionar incidentes con perros basado en ubicación y tipo de incidente
        const ubicacionCoincide = perro.direccion.toLowerCase().includes(incidente.ubicacion.toLowerCase()) ||
                                 incidente.ubicacion.toLowerCase().includes(perro.direccion.toLowerCase());
        
        const comportamientoCoincide = perro.comportamiento.toLowerCase().includes(incidente.tipo.toLowerCase()) ||
                                     incidente.tipo.toLowerCase().includes(perro.comportamiento.toLowerCase());
        
        // Relación más específica basada en el tipo de incidente
        let relacionEspecifica = false;
        
        if (incidente.tipo.toLowerCase().includes('agresivo') && 
            perro.comportamiento.toLowerCase().includes('agresivo')) {
          relacionEspecifica = true;
        } else if (incidente.tipo.toLowerCase().includes('perdido') && 
                   perro.comportamiento.toLowerCase().includes('travieso')) {
          relacionEspecifica = true;
        } else if (incidente.tipo.toLowerCase().includes('herido') && 
                   perro.comportamiento.toLowerCase().includes('tímido')) {
          relacionEspecifica = true;
        }
        
        const esRelacionado = ubicacionCoincide || comportamientoCoincide || relacionEspecifica;
        
        if (esRelacionado) {
          console.log(`✅ Perro relacionado: ${perro.nombre} (${getRazaNombre(perro.razaid)})`);
          console.log(`   - Ubicación coincide: ${ubicacionCoincide}`);
          console.log(`   - Comportamiento coincide: ${comportamientoCoincide}`);
          console.log(`   - Relación específica: ${relacionEspecifica}`);
        }
        
        return esRelacionado;
      });

      console.log(`Perros relacionados encontrados: ${perrosRelacionados.length}`);

      // Contar por raza
      perrosRelacionados.forEach(perro => {
        const razaNombre = getRazaNombre(perro.razaid);
        incidentesPorRaza[razaNombre] = (incidentesPorRaza[razaNombre] || 0) + 1;
        
        if (!perrosInvolucrados[razaNombre]) {
          perrosInvolucrados[razaNombre] = [];
        }
        // Evitar duplicados
        if (!perrosInvolucrados[razaNombre].find(p => p.id === perro.id)) {
          perrosInvolucrados[razaNombre].push(perro);
        }
      });
    });

    console.log('\n=== RESUMEN POR RAZA ===');
    Object.entries(incidentesPorRaza).forEach(([raza, count]) => {
      console.log(`${raza}: ${count} incidentes`);
    });

    return { incidentesPorRaza, perrosInvolucrados };
  };

  // Analizar incidentes por tipo
  const analisisPorTipo = () => {
    const incidentesPorTipo: Record<string, number> = {};
    
    incidentes.forEach(incidente => {
      incidentesPorTipo[incidente.tipo] = (incidentesPorTipo[incidente.tipo] || 0) + 1;
    });

    return incidentesPorTipo;
  };

  // Analizar incidentes por severidad
  const analisisPorSeveridad = () => {
    const incidentesPorSeveridad: Record<string, number> = {};
    
    incidentes.forEach(incidente => {
      incidentesPorSeveridad[incidente.severidad] = (incidentesPorSeveridad[incidente.severidad] || 0) + 1;
    });

    return incidentesPorSeveridad;
  };

  const { incidentesPorRaza, perrosInvolucrados } = analisisPorRaza();
  const incidentesPorTipo = analisisPorTipo();
  const incidentesPorSeveridad = analisisPorSeveridad();

  // Ordenar razas por número de incidentes
  const razasOrdenadas = Object.entries(incidentesPorRaza)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10); // Top 10 razas

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>📊 Análisis de Incidentes</h2>
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
            📊 Análisis de Incidentes
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            margin: '10px 0 0 0',
            opacity: '0.9'
          }}>
            Identifica razas con mayor frecuencia de incidentes reportados
          </p>
        </div>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>📈 Resumen de Incidentes</h3>
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-number">{incidentes.length}</div>
              <div className="stats-label">Total de Incidentes</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{Object.keys(incidentesPorRaza).length}</div>
              <div className="stats-label">Razas Involucradas</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{Object.keys(incidentesPorTipo).length}</div>
              <div className="stats-label">Tipos de Incidentes</div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <h3>🐕 Razas con Más Incidentes</h3>
            <div className="chart-container">
              <Bar
                data={{
                  labels: razasOrdenadas.map(([raza]) => raza),
                  datasets: [{
                    label: 'Incidentes',
                    data: razasOrdenadas.map(([, count]) => count),
                    backgroundColor: '#ff6b6b',
                  }]
                }}
                options={{ 
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Número de Incidentes'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="stats-card">
            <h3>🚨 Tipos de Incidentes</h3>
            <div className="chart-container">
              <Pie
                data={{
                  labels: Object.keys(incidentesPorTipo),
                  datasets: [{
                    data: Object.values(incidentesPorTipo),
                    backgroundColor: ['#ff6b6b', '#ffa726', '#51cf66', '#667eea', '#ffd600'],
                  }]
                }}
              />
            </div>
          </div>

          <div className="stats-card">
            <h3>⚠️ Severidad de Incidentes</h3>
            <div className="chart-container">
              <Pie
                data={{
                  labels: Object.keys(incidentesPorSeveridad),
                  datasets: [{
                    data: Object.values(incidentesPorSeveridad),
                    backgroundColor: ['#51cf66', '#ffa726', '#ff6b6b', '#dc3545'],
                  }]
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>🔍 Detalle por Raza</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {razasOrdenadas.map(([raza, count]) => (
              <div key={raza} className="stats-card">
                <h4 style={{ 
                  margin: '0 0 10px 0', 
                  color: '#667eea',
                  fontSize: '1.1rem'
                }}>
                  {raza}
                </h4>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#ff6b6b',
                  marginBottom: '10px'
                }}>
                  {count} incidentes
                </div>
                
                {perrosInvolucrados[raza] && (
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <p><strong>Perros involucrados:</strong> {perrosInvolucrados[raza].length}</p>
                    <div style={{ marginTop: '10px' }}>
                      <p><strong>Perros de esta raza:</strong></p>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '5px',
                        marginTop: '5px'
                      }}>
                        {perrosInvolucrados[raza].slice(0, 3).map(perro => (
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
                        {perrosInvolucrados[raza].length > 3 && (
                          <span style={{
                            background: '#f0f0f0',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            +{perrosInvolucrados[raza].length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>📋 Lista de Incidentes Recientes</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {incidentes.slice(0, 10).map(incidente => (
              <div 
                key={incidente.id} 
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  background: '#f9f9f9'
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', color: '#667eea' }}>
                  {incidente.titulo}
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  <p><strong>Tipo:</strong> {incidente.tipo}</p>
                  <p><strong>Severidad:</strong> {incidente.severidad}</p>
                  <p><strong>Ubicación:</strong> {incidente.ubicacion}</p>
                  <p><strong>Fecha:</strong> {new Date(incidente.fecha).toLocaleDateString()}</p>
                  <p><strong>Descripción:</strong> {incidente.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisIncidentes; 