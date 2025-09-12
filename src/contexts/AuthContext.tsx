// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  isAdmin: boolean | null;    // null = still checking
  loadingSession: boolean;    // rehydrate session
  loadingAdmin: boolean;      // admin DB check in progress
  signIn: (email: string, password: string) => Promise<{ error: any; isAdmin?: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // initial session rehydrate
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('[Auth] getSession error', err);
        setUser(null);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // auth state listener (synchronous only)
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] onAuthStateChange', event);
      setUser(session?.user ?? null);
      // do NOT do DB calls here
    });
    return () => data?.subscription?.unsubscribe();
  }, []);

  // admin check helper (no caching, always authoritative)
  const checkAdmin = async (u: User | null) => {
    if (!u) {
      setIsAdmin(false);
      return false;
    }
    setLoadingAdmin(true);
    try {
      console.log('[Auth] checking admin for', u.email);
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('email', u.email)
        .single();

      if (error || !data) {
        setIsAdmin(false);
        return false;
      }
      const ok = data.role === 'admin';
      setIsAdmin(ok);
      return ok;
    } catch (err) {
      console.error('[Auth] admin check error', err);
      setIsAdmin(false);
      return false;
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Run admin check automatically when user becomes available (not in auth callback)
  useEffect(() => {
    // skip if no user
    if (!user) {
      setIsAdmin(false);
      return;
    }
    // run check but don't block UI — ProtectedRoute will wait on loadingAdmin
    checkAdmin(user).catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.email]);

  // signIn returns isAdmin so caller can navigate immediately after login
  const signIn = async (email: string, password: string) => {
    console.log('[Auth] signIn', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    // rehydrate session and run admin check synchronously so caller gets result
    try {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;
      setUser(u);
      const admin = await checkAdmin(u);
      return { error: null, isAdmin: admin };
    } catch (err) {
      console.error('[Auth] post-signin error', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('[Auth] signOut');
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loadingSession,
        loadingAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
