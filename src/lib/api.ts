import axios from 'axios';

/**
 * Central Axios instance.
 * baseURL '/api' maps to http://localhost:5000/api via the Vite dev proxy.
 * withCredentials sends the HttpOnly JWT cookie automatically.
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach stored token if present ──────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — unwrap { success, message, data } envelope ─────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bubble up the server's message so callers can display it directly
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;
