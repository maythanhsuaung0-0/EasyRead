import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router, useRouter } from 'expo-router';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  user?: any;
  signInWithGoogle?: () => Promise<void>;
  signInWithEmail?: (email: string, password: string) => Promise<void>;
  setUser?: (user: any) => void;
  signOut?: () => Promise<void>;
}
interface User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  profile: string | undefined;
}
const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  user: null,
  signInWithGoogle: async () => { },
  signInWithEmail: async () => { },
  setUser: () => { },
  signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter()
  useEffect(() => {
    // Simulate fetching session from Supabase
    const fetchSession = async () => {
      // Replace with actual Supabase session fetching logic
      try {
      const supabaseSession = await supabase.auth.getSession();
      setSession(supabaseSession?.data?.session);
      setLoading(false);
      } catch (error) {
        console.error('Error while fetching session:', error);
        setLoading(false);
      }

    }
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const { id, user_metadata } = session?.user || {};
        console.log('avatar_url', user_metadata?.avatar_url);
        setUser({
          id: id,
          name: user_metadata?.full_name,
          email: session?.user.email || '',
          profile: user_metadata?.avatar_url,
        }
        );
        setLoading(false);
      }
    );
    fetchSession();
    if (user) {
      router.push('/protected');
    }
    return () => {
      authListener.subscription.unsubscribe();
    }
  }
    , []);
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      console.log('Google Sign-In data:', data?.user);
      if (data?.idToken) {
        // HANDSHAKE: Send Google token to Supabase
        const { data: sbData, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: data.idToken,
        });
        if (error) throw error;
        const userData = sbData.user;
        setUser({
          id: userData.id,
          name: userData.user_metadata?.full_name,
          email: userData.email,
          profile: userData.user_metadata?.avatar_url,
        });
        router
        console.log('Supabase Sign-In data:', sbData.user);
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    const userData = await supabase.auth.getUser();
    setUser({
      id: userData.data.user?.id,
      name: userData.data.user?.user_metadata?.full_name,
      email: userData.data.user?.email,
      profile: userData.data.user?.user_metadata?.avatar_url,
    });

    if (error) console.error('Error during sign-in:', error)
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }
  const value: AuthContextType = {
    session,
    loading,
    user,
    signInWithGoogle,
    signInWithEmail,
    setUser,
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
  if (auth === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
}

