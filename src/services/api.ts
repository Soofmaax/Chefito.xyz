import { Recipe, User, PaginatedResponse } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Recipe API service - connects to your PostgreSQL VPS
export const recipeApi = {
  async getRecipes(options: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
  } = {}): Promise<PaginatedResponse<Recipe>> {
    const { page = 1, limit = 12, search, category, difficulty } = options;

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
      });

      const response = await fetch(`/api/recipes?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError('Failed to fetch recipes', response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch recipes', 500);
    }
  },

  async getRecipe(id: string): Promise<Recipe> {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Recipe not found', 404);
        }
        throw new ApiError('Failed to fetch recipe', response.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch recipe', 500);
    }
  },

  async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new ApiError('Failed to create recipe', response.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create recipe', 500);
    }
  },

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Recipe not found', 404);
        }
        throw new ApiError('Failed to update recipe', response.status);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update recipe', 500);
    }
  },

  async deleteRecipe(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Recipe not found', 404);
        }
        throw new ApiError('Failed to delete recipe', response.status);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete recipe', 500);
    }
  },
};

// Auth API service using Supabase
export const authApi = {
  async signUp(email: string, password: string, fullName: string): Promise<User> {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('🔧 Demo mode: Simulating sign up');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Math.random().toString(36).substr(2, 9),
        email,
        full_name: fullName,
        skill_level: 'beginner',
        dietary_restrictions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            skill_level: 'beginner',
            dietary_restrictions: [],
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return {
        id: data.user?.id || '',
        email,
        full_name: fullName,
        skill_level: 'beginner',
        dietary_restrictions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new ApiError(error.message || 'Failed to sign up', 400);
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    if (!isSupabaseConfigured()) {
      // Demo mode
      console.log('🔧 Demo mode: Simulating sign in');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: '1',
        email,
        full_name: 'Demo User',
        skill_level: 'beginner',
        dietary_restrictions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      return profile || {
        id: '1',
        email,
        full_name: 'User',
        skill_level: 'beginner',
        dietary_restrictions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new ApiError(error.message || 'Failed to sign in', 400);
    }
  },
};

// TTS API service
export const ttsApi = {
  async generateSpeech(text: string, voiceId: string = 'default'): Promise<Blob> {
    try {
      const response = await fetch('/api/tts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError('TTS service unavailable', response.status);
      }

      return await response.blob();
    } catch (error) {
      console.error('TTS error:', error);
      // Return empty blob as fallback
      return new Blob([''], { type: 'audio/mpeg' });
    }
  },
};

// Export for backward compatibility
export const apiService = {
  getRecipes: recipeApi.getRecipes.bind(recipeApi),
  getRecipe: recipeApi.getRecipe.bind(recipeApi),
  createRecipe: recipeApi.createRecipe.bind(recipeApi),
  updateRecipe: recipeApi.updateRecipe.bind(recipeApi),
  deleteRecipe: recipeApi.deleteRecipe.bind(recipeApi),
  signUp: authApi.signUp.bind(authApi),
  signIn: authApi.signIn.bind(authApi),
  generateSpeech: ttsApi.generateSpeech.bind(ttsApi),
};