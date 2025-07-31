import api from './api';

export interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  direccion: string;
  password: string;
  dueño: boolean;
}

export const UsuarioService = {
  getAll: async () => {
    const response = await api.get('/api/usuarios');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },

  create: async (usuario: Usuario) => {
    const response = await api.post('/api/usuarios', usuario);
    return response.data;
  },

  update: async (id: number, usuario: Usuario) => {
    const response = await api.put(`/api/usuarios/${id}`, usuario);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.get('/api/usuarios');
    const usuarios = response.data;
    const usuario = usuarios.find((u: Usuario) => u.email === email && u.password === password);
    return usuario;
  },
}; 