import React, { useState, useEffect } from 'react';
import { PerroService, Perro } from '../services/PerroService.ts';
import { UsuarioService, Usuario } from '../services/UsuarioService.ts';
import { RazaService, Raza } from '../services/RazaService.ts';

const PerrosPorDueño: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perros, setPerros] = useState<Perro[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usuariosData, razasData, perrosData] = await Promise.all([
        UsuarioService.getAll(),
        RazaService.getAll(),
        PerroService.getAll(),
      ]);
      setUsuarios(usuariosData);
      setRazas(razasData);
      console.log('Perros cargados:', perrosData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

    const handleUsuarioChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const usuarioid = e.target.value;
    setSelectedUsuario(usuarioid);
    
    if (usuarioid) {
      setLoading(true);
      
      try {
        // Hacer llamada a la API para obtener todos los perros
        const allPerrosFromAPI = await PerroService.getAll();
        console.log('Perros obtenidos de la API:', allPerrosFromAPI);
        console.log('Usuario seleccionado ID:', usuarioid);
        
        // Filtrar perros que pertenecen al usuario seleccionado
        const perrosDelUsuario = allPerrosFromAPI.filter(perro => {
          console.log(`Perro ${perro.nombre}: usuarioid = ${perro.usuarioid}, tipo = ${typeof perro.usuarioid}`);
          
          // Verificar que el perro tenga un usuarioid válido y que coincida con el usuario seleccionado
          const perroTieneDueño = perro.usuarioid !== null && perro.usuarioid !== undefined && perro.usuarioid > 0;
          const esDelUsuario = perro.usuarioid === parseInt(usuarioid);
          
          console.log(`Perro ${perro.nombre}: tiene dueño = ${perroTieneDueño}, es del usuario = ${esDelUsuario}`);
          return perroTieneDueño && esDelUsuario;
        });
        
        console.log('Perros del usuario encontrados:', perrosDelUsuario);
        
        // Mostrar información de debugging
        console.log('=== RESUMEN DE DEBUGGING ===');
        console.log(`Usuario seleccionado ID: ${usuarioid}`);
        console.log(`Total de perros en la API: ${allPerrosFromAPI.length}`);
        console.log(`Perros con dueño (usuarioid > 0): ${allPerrosFromAPI.filter(p => p.usuarioid && p.usuarioid > 0).length}`);
        console.log(`Perros sin dueño (usuarioid null/0): ${allPerrosFromAPI.filter(p => !p.usuarioid || p.usuarioid === 0).length}`);
        console.log(`Perros encontrados para este usuario: ${perrosDelUsuario.length}`);
        
        setPerros(perrosDelUsuario);
      } catch (error) {
        console.error('Error al obtener perros:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setPerros([]);
    }
  };

  const getRazaNombre = (razaid: number) => {
    const raza = razas.find(r => r.id === razaid);
    return raza?.nombre || 'Sin raza';
  };

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
            🐕 Perros por Dueño
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            margin: '10px 0 0 0',
            opacity: '0.9'
          }}>
            Consulta los perros registrados por cada dueño
          </p>
        </div>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>👤 Seleccionar Dueño</h3>
          <div className="form-group">
            <label className="form-label">Dueño:</label>
            <select
              className="form-input"
              value={selectedUsuario}
              onChange={handleUsuarioChange}
            >
              <option value="">Seleccionar un dueño</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} ({usuario.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="card">
            <p>Cargando perros...</p>
          </div>
        )}

        {!loading && selectedUsuario && (
          <div className="card">
            <h3>🐕 Perros del Dueño</h3>
            {(() => {
              const usuarioSeleccionado = usuarios.find(u => u.id === parseInt(selectedUsuario));
              return (
                <>
                  {usuarioSeleccionado && (
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '15px', 
                      borderRadius: '8px', 
                      marginBottom: '20px',
                      border: '2px solid #667eea'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#667eea' }}>
                        👤 Información del Dueño
                      </h4>
                      <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                        <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</p>
                        <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                        <p><strong>Total de perros:</strong> {perros.length}</p>
                      </div>
                    </div>
                  )}
                  
                  {perros.length === 0 ? (
                    <p>Este dueño no tiene perros registrados.</p>
                  ) : (
                    <div className="stats-grid">
                      {perros.map(perro => (
                        <div key={perro.id} className="stats-card" style={{ textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: '#667eea' }}>
                            {perro.nombre}
                          </h4>
                          <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                            <p><strong>Raza:</strong> {getRazaNombre(perro.razaid)}</p>
                            <p><strong>Tamaño:</strong> {perro.tamanio}</p>
                            <p><strong>Color:</strong> {perro.color}</p>
                            <p><strong>Género:</strong> {perro.genero}</p>
                            <p><strong>Edad:</strong> {perro.edad} años</p>
                            <p><strong>Comportamiento:</strong> {perro.comportamiento}</p>
                            <p><strong>Dirección:</strong> {perro.direccion}</p>
                            <div style={{ marginTop: '10px' }}>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '0.8rem',
                                marginRight: '8px',
                                backgroundColor: perro.vacunado ? '#51cf66' : '#ff6b6b',
                                color: 'white'
                              }}>
                                {perro.vacunado ? '✅ Vacunado' : '❌ No vacunado'}
                              </span>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '0.8rem',
                                backgroundColor: perro.esterilizado ? '#51cf66' : '#ff6b6b',
                                color: 'white'
                              }}>
                                {perro.esterilizado ? '✅ Esterilizado' : '❌ No esterilizado'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerrosPorDueño; 