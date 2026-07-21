import axios from 'axios';

// Базовий ЮРЛ бека
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const nextServer = axios.create({
  baseURL: BACKEND_URL + '/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});
