import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  user?: any;
  signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  user: null,
  signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    // Simulate fetching session from Supabase
    const fetchSession = async () => {
      // Replace with actual Supabase session fetching logic
      const supabaseSession = await supabase.auth.getSession();
      setSession(supabaseSession.data.session);
      setLoading(false);
    }
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    fetchSession();
    return () => {
      authListener.subscription.unsubscribe();
    }
  }
  , []);
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }
  const value: AuthContextType = {
    session,
    loading,
    user,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if(auth === undefined){
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
}

