export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  dietary_restrictions: string[];
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  steps: string[];
  ingredients: string[];
  voice_url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prep_time: number; // minutes
  cook_time: number; // minutes
  servings: number;
  tags: string[];
  category?: string;
  cuisine?: string;
  variants?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface VoiceSettings {
  voice_id: string;
  speed: number;
  volume: number;
  enabled: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface AIAssistantRequest {
  recipeId: string;
  stepNumber: number;
  question: string;
}

export interface AIAssistantResponse {
  success: boolean;
  answer: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}