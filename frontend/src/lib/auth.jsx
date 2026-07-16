import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { tokenStore } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(tokenStore.user);
  const [ready, setReady] = useState(false);

  // On boot: if we have a token, verify with /auth/me and hydrate the user.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const token = tokenStore.access;
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (!cancelled) {
          const u = data?.data?.user;
          if (u) {
            setUser(u);
            tokenStore.set({ user: u });
          }
        }
      } catch {
        if (!cancelled) {
          tokenStore.clear();
          setUser(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  // React to token expiry broadcast from the axios interceptor.
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('mad:auth-expired', onExpired);
    return () => window.removeEventListener('mad:auth-expired', onExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const payload = data?.data;
    tokenStore.set(payload);
    setUser(payload.user);
    return payload.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    const auth = data?.data;
    tokenStore.set(auth);
    setUser(auth.user);
    return auth.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', { refreshToken: tokenStore.refresh });
    } catch {
      /* ignore; clear locally regardless */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      tokenStore.set({ user: next });
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isNgo: user?.role === 'ngo',
      login,
      register,
      logout,
      updateUser,
    }),
    [user, ready, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
