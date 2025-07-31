import axios from 'axios';

const API_BASE_URL = 'https://pethelp-back-g2cqfabrandde2ad.canadacentral-01.azurewebsites.net';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 