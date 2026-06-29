// import axios from 'axios';

// /**
//  * Central Axios instance.
//  * baseURL '/api' maps to http://localhost:5000/api via the Vite dev proxy.
//  * withCredentials sends the HttpOnly JWT cookie automatically.
//  */
// const api = axios.create({
//   baseURL: '/api',
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' },
// });

// // ── Request interceptor — attach stored token if present ──────────────────────
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('tf_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ── Response interceptor — unwrap { success, message, data } envelope ─────────
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Bubble up the server's message so callers can display it directly
//     const message =
//       error.response?.data?.message ||
//       error.message ||
//       'Something went wrong.';
//     return Promise.reject(new Error(message));
//   }
// );

// export default api;
import axios from 'axios';

const api = axios.create({
  // Use relative '/api' so Vite's dev proxy forwards requests to the backend.
  // This avoids CORS issues during local development.
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If the body is FormData, remove the default Content-Type so the browser
  // can set multipart/form-data with the correct boundary automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;