import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
});

// export const api = axios.create({
//   baseURL:
//     process.env.NEXT_BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL,
//   withCredentials: true,
// });
