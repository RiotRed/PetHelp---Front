import api from './api';

export interface Perro {
  id?: number;
  nombre: string;
  distritoid: number;
  razaid: number;
  tamanio: string;
  comportamiento: string;
  color: string;
  genero: string;
  edad: number;
  vacunado: boolean;
  esterilizado: boolean;
  usuarioid?: number;
  direccion: string;
  distrito?: string;
  raza?: string;
  usuario?: string;
}

export const PerroService = {
  getAll: async () => {
    const response = await api.get('/api/perros');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/perros/${id}`);
    return response.data;
  },

  create: async (perro: Perro) => {
    const response = await api.post('/api/perros', perro);
    return response.data;
  },

  update: async (id: number, perro: Perro) => {
    const response = await api.put(`/api/perros/${id}`, perro);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/perros/${id}`);
    return response.data;
  },
}; 