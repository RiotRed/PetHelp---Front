import api from './api.ts';

export interface Raza {
  id?: number;
  nombre: string;
}

export const RazaService = {
  getAll: async () => {
    const response = await api.get('/api/razas');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/razas/${id}`);
    return response.data;
  },

  create: async (raza: Raza) => {
    const response = await api.post('/api/razas', raza);
    return response.data;
  },

  update: async (id: number, raza: Raza) => {
    const response = await api.put(`/api/razas/${id}`, raza);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/razas/${id}`);
    return response.data;
  },
}; 