import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

// Used only in server-side code (route handlers, serverApi), so the
// server-only variable is preferred and the public one is just a fallback.
export const api = axios.create({
  baseURL:
    process.env.NEXT_BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
});
