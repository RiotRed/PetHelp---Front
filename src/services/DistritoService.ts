import api from './api';

export interface Distrito {
  id?: number;
  nombre: string;
}

export const DistritoService = {
  getAll: async () => {
    const response = await api.get('/api/distritos');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/distritos/${id}`);
    return response.data;
  },

  create: async (distrito: Distrito) => {
    const response = await api.post('/api/distritos', distrito);
    return response.data;
  },

  update: async (id: number, distrito: Distrito) => {
    const response = await api.put(`/api/distritos/${id}`, distrito);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/distritos/${id}`);
    return response.data;
  },
}; 