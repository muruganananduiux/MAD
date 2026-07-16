import axios from 'axios';

/**
 * Axios instance for all backend calls.
 *
 * REACT_APP_BACKEND_URL is baked-in at build time and must always be the
 * externally-reachable URL of the backend (see frontend/.env).
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ---- token storage --------------------------------------------------------
const TOKEN_KEY = 'mad_access_token';
const REFRESH_KEY = 'mad_refresh_token';
const USER_KEY = 'mad_user';

export const tokenStore = {
  get access() {
    return localStorage.getItem(TOKEN_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  get user() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(payload) {
    if (payload.token) localStorage.setItem(TOKEN_KEY, payload.token);
    if (payload.refreshToken) localStorage.setItem(REFRESH_KEY, payload.refreshToken);
    if (payload.user) localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ---- request interceptor: attach bearer -----------------------------------
api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- response interceptor: silent refresh on 401 --------------------------
let refreshing = null;

async function performRefresh() {
  const refreshToken = tokenStore.refresh;
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
  const payload = data?.data;
  if (!payload?.token) throw new Error('Refresh failed');
  tokenStore.set(payload);
  return payload.token;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';

    // Never try to refresh on auth endpoints themselves
    const isAuthEndpoint = url.includes('/auth/');
    if (status === 401 && !isAuthEndpoint && !original._retry) {
      original._retry = true;
      try {
        refreshing = refreshing || performRefresh();
        const newToken = await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        tokenStore.clear();
        // Broadcast so AuthContext can react (e.g., redirect to /login)
        window.dispatchEvent(new CustomEvent('mad:auth-expired'));
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// ---- helpers --------------------------------------------------------------
export const extractError = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

export { API_URL, BACKEND_URL };
export default api;
