
import { createClient } from '@supabase/supabase-js';

// Supabase credentials should be stored in environment variables
// Use default values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example-placeholder-supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enable mock authentication for testing
export const USING_MOCK_AUTH = true;

// Mock user data for demo purposes
export const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Demo User',
    isAdmin: false
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    isAdmin: true
  }
];

// Database type definitions
export type Adventure = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  cost: number;
  type: string;
  rating: number;
  location_name: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  relevanceScore?: number;
}

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  isAdmin?: boolean;
}

// Authentication service
export const authService = {
  // Get current user
  getCurrentUser: async () => {
    try {
      if (USING_MOCK_AUTH) {
        const storedUser = localStorage.getItem('mockUser');
        return storedUser ? JSON.parse(storedUser) : null;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Sign up with email and password
  signUp: async (email: string, password: string, name: string) => {
    if (USING_MOCK_AUTH) {
      // Check if email already exists
      if (MOCK_USERS.some(user => user.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Mock signup success
      return { user: { id: `user-${Date.now()}`, email, name } };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Create user profile in the users table
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        name: name
      });
    }
    
    return data;
  },
  
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (USING_MOCK_AUTH) {
      // Find the mock user
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (!mockUser || password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      return { user: mockUser };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Sign out
  signOut: async () => {
    if (USING_MOCK_AUTH) {
      localStorage.removeItem('mockUser');
      return true;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return true;
  },
  
  // Get user profile
  getUserProfile: async (userId: string) => {
    if (USING_MOCK_AUTH) {
      // Find the mock user by ID
      const mockUser = MOCK_USERS.find(u => u.id === userId);
      return mockUser || null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    if (USING_MOCK_AUTH) {
      // For mock mode, just log the update
      console.log('Mock update profile:', { userId, updates });
      return updates;
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Get all users (for admin panel)
  getAllUsers: async (): Promise<User[]> => {
    if (USING_MOCK_AUTH) {
      return MOCK_USERS;
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },
  
  // Delete a user (for admin panel)
  deleteUser: async (userId: string): Promise<void> => {
    if (USING_MOCK_AUTH) {
      console.log('Mock delete user:', userId);
      return;
    }
    
    try {
      // First delete user's relationships in user_adventures table
      const { error: adventuresError } = await supabase
        .from('user_adventures')
        .delete()
        .eq('user_id', userId);
      
      if (adventuresError) {
        console.error('Error deleting user adventures:', adventuresError);
        throw adventuresError;
      }
      
      // Then delete from the users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (userError) {
        console.error('Error deleting user:', userError);
        throw userError;
      }
      
      // Finally delete from auth.users (requires admin privileges in Supabase)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        throw authError;
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
};

// Adventure service functions
export const adventureService = {
  // Subscribe to real-time adventure updates
  subscribeToAdventures: (callback: (adventure: Adventure) => void) => {
    const subscription = supabase
      .channel('adventures-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'adventures'
      }, (payload) => {
        callback(payload.new as Adventure);
      })
      .subscribe();
    
    return subscription;
  },

  // Get all adventures with optional filtering
  async getAdventures(filters: any = {}) {
    let query = supabase.from('adventures').select('*');
    
    // Apply filters if provided
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    
    if (filters.duration) {
      query = query.lte('duration', filters.duration);
    }
    
    if (filters.budget) {
      query = query.lte('cost', filters.budget);
    }
    
    if (filters.searchQuery) {
      // Fix variable redeclaration issue by using searchQueryLower
      const searchQueryLower = filters.searchQuery.toLowerCase();
      query = query.or(`title.ilike.%${searchQueryLower}%,description.ilike.%${searchQueryLower}%,location_name.ilike.%${searchQueryLower}%`);
    }
    
    // Apply sorting
    if (filters.sortBy && filters.sortDirection) {
      query = query.order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching adventures:', error);
      return [];
    }
    
    return data;
  },
  
  // Get a single adventure by ID
  async getAdventureById(id: string) {
    const { data, error } = await supabase
      .from('adventures')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching adventure:', error);
      return null;
    }
    
    return data;
  },
  
  // Save user's favorite adventure
  async saveUserAdventure(userId: string, adventureId: string) {
    const { data, error } = await supabase
      .from('user_adventures')
      .insert([
        { user_id: userId, adventure_id: adventureId, is_saved: true }
      ]);
    
    if (error) {
      console.error('Error saving adventure:', error);
      return false;
    }
    
    return true;
  },
  
  // Mark adventure as completed
  async markAdventureCompleted(userId: string, adventureId: string) {
    const { data, error } = await supabase
      .from('user_adventures')
      .upsert([
        { 
          user_id: userId, 
          adventure_id: adventureId, 
          is_completed: true,
          completed_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error marking adventure as completed:', error);
      return false;
    }
    
    return true;
  },
  
  // Get user's saved adventures
  async getUserSavedAdventures(userId: string) {
    if (USING_MOCK_AUTH) {
      return [
        {
          adventure_id: "adventure-1",
          adventures: {
            title: "Mountain Trekking",
            description: "Experience the thrill of mountain climbing with expert guides.",
            imageUrl: "/placeholder.svg",
            duration: 3,
            cost: 5000,
            type: "Adventure",
            location_name: "Himalayan Range"
          }
        },
        {
          adventure_id: "adventure-2",
          adventures: {
            title: "Beach Retreat",
            description: "Relax on pristine beaches with crystal clear waters.",
            imageUrl: "/placeholder.svg",
            duration: 5,
            cost: 8000,
            type: "Relaxation",
            location_name: "Goa Beaches"
          }
        }
      ];
    }
    
    const { data, error } = await supabase
      .from('user_adventures')
      .select(`
        adventure_id,
        adventures(*)
      `)
      .eq('user_id', userId)
      .eq('is_saved', true);
    
    if (error) {
      console.error('Error fetching saved adventures:', error);
      return [];
    }
    
    return data;
  },
  
  // Get user's completed adventures
  async getUserCompletedAdventures(userId: string) {
    if (USING_MOCK_AUTH) {
      return [
        {
          adventure_id: "adventure-3",
          completed_at: new Date().toISOString(),
          adventures: {
            title: "Desert Safari",
            description: "Experience the magic of desert nights under stars.",
            imageUrl: "/placeholder.svg",
            duration: 2,
            cost: 3000,
            type: "Exploration",
            location_name: "Rajasthan"
          }
        }
      ];
    }
    
    const { data, error } = await supabase
      .from('user_adventures')
      .select(`
        adventure_id,
        completed_at,
        adventures(*)
      `)
      .eq('user_id', userId)
      .eq('is_completed', true);
    
    if (error) {
      console.error('Error fetching completed adventures:', error);
      return [];
    }
    
    return data;
  },
  
  // Create a new adventure
  async createAdventure(adventure: Omit<Adventure, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('adventures')
      .insert([adventure])
      .select();
    
    if (error) {
      console.error('Error creating adventure:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Update an adventure
  async updateAdventure(id: string, updates: Partial<Adventure>) {
    const { data, error } = await supabase
      .from('adventures')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating adventure:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Delete an adventure
  async deleteAdventure(id: string) {
    const { error } = await supabase
      .from('adventures')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting adventure:', error);
      throw error;
    }
    
    return true;
  },
  
  // Get adventure categories
  async getAdventureTypes() {
    const { data, error } = await supabase
      .from('adventures')
      .select('type')
      .order('type');
    
    if (error) {
      console.error('Error fetching adventure types:', error);
      return [];
    }
    
    // Get unique values
    const types = data.map(item => item.type);
    return [...new Set(types)];
  },
  
  // Remove user's saved adventure
  async removeUserSavedAdventure(userId: string, adventureId: string) {
    if (USING_MOCK_AUTH) {
      console.log('Mock remove saved adventure:', { userId, adventureId });
      return true;
    }
    
    const { error } = await supabase
      .from('user_adventures')
      .update({ is_saved: false })
      .match({ user_id: userId, adventure_id: adventureId });
    
    if (error) {
      console.error('Error removing saved adventure:', error);
      return false;
    }
    
    return true;
  },
  
  // Unmark adventure as completed
  async unmarkAdventureCompleted(userId: string, adventureId: string) {
    const { error } = await supabase
      .from('user_adventures')
      .update({ 
        is_completed: false,
        completed_at: null
      })
      .match({ user_id: userId, adventure_id: adventureId });
    
    if (error) {
      console.error('Error unmarking adventure as completed:', error);
      return false;
    }
    
    return true;
  },
  
  // Get total count of completed adventures (for admin dashboard)
  getCompletedAdventuresCount: async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('user_adventures')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true);
      
      if (error) {
        console.error('Error counting completed adventures:', error);
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getCompletedAdventuresCount:', error);
      return 0;
    }
  },
  
  // Get analytics data for admin dashboard
  getAdventureAnalytics: async () => {
    try {
      // Get all adventures to calculate stats
      const { data: adventures, error } = await supabase
        .from('adventures')
        .select('*');
      
      if (error) {
        console.error('Error fetching adventure analytics:', error);
        throw error;
      }
      
      // Calculate various metrics
      const totalAdventures = adventures.length;
      const avgRating = adventures.reduce((sum, adv) => sum + adv.rating, 0) / 
        (totalAdventures || 1);
      
      // Count adventures by type
      const adventureTypes = adventures.reduce((acc, adv) => {
        acc[adv.type] = (acc[adv.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        totalAdventures,
        avgRating,
        adventureTypes
      };
    } catch (error) {
      console.error('Error in getAdventureAnalytics:', error);
      throw error;
    }
  },
  
  // Export adventures data (for admin panel)
  exportAdventuresCSV: async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('adventures')
        .select('*');
      
      if (error) {
        console.error('Error exporting adventures:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return "No data to export";
      }
      
      // Create CSV header
      const headers = Object.keys(data[0]).join(',');
      
      // Create CSV rows
      const rows = data.map(adv => {
        return Object.values(adv).map(val => {
          // Handle strings with commas by wrapping in quotes
          if (typeof val === 'string' && val.includes(',')) {
            return `"${val}"`;
          }
          return val;
        }).join(',');
      }).join('\n');
      
      return `${headers}\n${rows}`;
    } catch (error) {
      console.error('Error in exportAdventuresCSV:', error);
      throw error;
    }
  }
};
