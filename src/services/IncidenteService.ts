import api from './api.ts';

export interface Incidente {
  id?: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  tipo: string;
  severidad: string;
  fecha: string;
  usuarioid?: number;
  estado?: string;
}

export const IncidenteService = {
  getAll: async () => {
    const response = await api.get('/api/incidentes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/incidentes/${id}`);
    return response.data;
  },

  create: async (incidente: Incidente) => {
    const response = await api.post('/api/incidentes', incidente);
    return response.data;
  },

  update: async (id: number, incidente: Incidente) => {
    const response = await api.put(`/api/incidentes/${id}`, incidente);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/incidentes/${id}`);
    return response.data;
  },

  getByUsuario: async (usuarioid: number) => {
    const response = await api.get(`/api/incidentes/usuario/${usuarioid}`);
    return response.data;
  },

  getByTipo: async (tipo: string) => {
    const response = await api.get(`/api/incidentes/tipo/${tipo}`);
    return response.data;
  },
}; 