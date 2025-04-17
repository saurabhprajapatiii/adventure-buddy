import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, authService, User, USING_MOCK_AUTH, MOCK_USERS } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // Add this for backward compatibility
  isAdmin: boolean;
  error?: Error | null; // Add this for backward compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Re-export for convenience
export { USING_MOCK_AUTH, MOCK_USERS };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Check for user on initial load
  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        
        // Check if we are using mock authentication
        if (USING_MOCK_AUTH) {
          const storedUser = localStorage.getItem('mockUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAdmin(!!parsedUser.isAdmin);
          }
          setIsLoading(false);
          return;
        }
        
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          // Get the full user profile from our users table
          const profile = await authService.getUserProfile(currentUser.id);
          
          if (profile) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              name: profile.name,
              avatar_url: profile.avatar_url,
              isAdmin: profile.isAdmin
            });
            
            setIsAdmin(!!profile.isAdmin);
          } else {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              isAdmin: false
            });
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
        setIsAdmin(false);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
    
    if (!USING_MOCK_AUTH) {
      // Set up auth state listener for Supabase
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const profile = await authService.getUserProfile(session.user.id);
            
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name,
                avatar_url: profile.avatar_url,
                isAdmin: profile.isAdmin
              });
              
              setIsAdmin(!!profile.isAdmin);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                isAdmin: false
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsAdmin(false);
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);
  
  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (USING_MOCK_AUTH) {
        // Mock authentication
        const mockUser = MOCK_USERS.find(u => u.email === email);
        if (!mockUser || password !== 'password') {
          throw new Error('Invalid email or password');
        }
        
        // Store the user in localStorage to persist the session
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAdmin(!!mockUser.isAdmin);
        
        toast.success('Signed in successfully');
        navigate('/dashboard');
        return;
      }
      
      // Real authentication with Supabase
      await authService.signIn(email, password);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error instanceof Error ? error : new Error(error.message || 'Failed to sign in'));
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up user
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (USING_MOCK_AUTH) {
        // Mock signup (just create a new user object)
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name,
          isAdmin: false
        };
        
        toast.success('Account created! You can now sign in.');
        navigate('/signin');
        return;
      }
      
      // Real signup with Supabase
      await authService.signUp(email, password, name);
      toast.success('Account created! Please check your email for confirmation.');
      navigate('/signin');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error instanceof Error ? error : new Error(error.message || 'Failed to create account'));
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out user
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      if (USING_MOCK_AUTH) {
        // Mock sign out
        localStorage.removeItem('mockUser');
        setUser(null);
        setIsAdmin(false);
        
        toast.success('Signed out successfully');
        navigate('/');
        return;
      }
      
      // Real sign out with Supabase
      await authService.signOut();
      setUser(null);
      setIsAdmin(false);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error : new Error(error.message || 'Failed to sign out'));
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isLoading,
    loading: isLoading, // Add alias for backward compatibility
    isAdmin,
    error,
    signIn,
    signUp,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
