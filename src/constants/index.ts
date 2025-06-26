export const APP_NAME = 'Chefito';
export const APP_DESCRIPTION = 'Smart Cooking Assistant Platform - Your beginner-friendly cooking companion with interactive recipes and voice guidance';
export const APP_CREATOR = 'Salwa Essafi';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/[id]',
  ABOUT: '/about',
  LEGAL: '/legal',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

export const API_ROUTES = {
  RECIPES: '/api/recipes',
  RECIPE_DETAIL: '/api/recipes/[id]',
  TTS: '/api/tts',
  USER_PROFILE: '/api/user/profile',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
} as const;

export const RECIPE_DIFFICULTIES = [
  'beginner',
  'intermediate', 
  'advanced',
] as const;

export const SKILL_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'professional',
] as const;

export const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher',
] as const;

export const VOICE_IDS = [
  { id: 'default', name: 'Default Voice' },
  { id: 'female', name: 'Female Voice' },
  { id: 'male', name: 'Male Voice' },
  { id: 'chef', name: 'Chef Voice' },
] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
} as const;

export const SUCCESS_MESSAGES = {
  RECIPE_CREATED: 'Recipe created successfully!',
  RECIPE_UPDATED: 'Recipe updated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ACCOUNT_CREATED: 'Account created successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Signed out successfully!',
} as const;