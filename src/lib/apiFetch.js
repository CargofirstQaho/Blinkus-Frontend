import { store } from '../redux/store';
import { clearUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Deduplicates concurrent refresh calls — all callers get the same promise
let _inflightRefresh = null;

async function doRefresh() {
  if (_inflightRefresh) return _inflightRefresh;
  _inflightRefresh = fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json().catch(() => null);
      return data?.data?.token ?? null;
    })
    .catch(() => null)
    .finally(() => { _inflightRefresh = null; });
  return _inflightRefresh;
}

export class SessionExpiredError extends Error {
  constructor() {
    super('session_expired');
    this.name = 'SessionExpiredError';
  }
}

/**
 * Drop-in replacement for fetch() in authenticated contexts.
 * Automatically adds Authorization header from localStorage.
 * On 401: silently tries to refresh the token and retries once.
 * If refresh fails: dispatches clearUser, shows one toast, throws SessionExpiredError.
 */
export async function apiFetch(url, options = {}) {
  const buildOpts = (token) => ({
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  const token = localStorage.getItem('blinkus_token');
  let res = await fetch(url, buildOpts(token));

  if (res.status !== 401) return res;

  // Access token expired — try silent refresh
  const newToken = await doRefresh();
  if (!newToken) {
    localStorage.removeItem('blinkus_token');
    store.dispatch(clearUser());
    toast.error('Session expired. Please sign in again.');
    throw new SessionExpiredError();
  }

  localStorage.setItem('blinkus_token', newToken);
  return fetch(url, buildOpts(newToken));
}
