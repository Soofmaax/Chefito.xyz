// Middleware for admin authentication
import { User } from '@/types';

// Admin credentials should be stored in environment variables
export const SUPER_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@chefito.xyz';
export const SUPER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: string[];
}

export const checkAdminPermissions = (user: any): AdminUser | null => {
  if (!user) return null;
  
  // Super admin with all rights
  if (user.email === SUPER_ADMIN_EMAIL) {
    return {
      id: user.id || 'super-admin',
      email: user.email,
      role: 'super_admin',
      permissions: [
        'recipes:read',
        'recipes:write',
        'recipes:delete',
        'users:read',
        'users:write',
        'users:delete',
        'admin:full_access'
      ]
    };
  }
  
  // Check if user has admin role in their profile
  if (user.role === 'admin') {
    return {
      id: user.id,
      email: user.email,
      role: 'admin',
      permissions: [
        'recipes:read',
        'recipes:write',
        'users:read'
      ]
    };
  }
  
  // Regular users - read-only access to their own data
  return {
    id: user.id,
    email: user.email,
    role: 'user',
    permissions: [
      'profile:read',
      'profile:write',
      'recipes:read' // Read-only access to recipes
    ]
  };
};

export const hasPermission = (adminUser: AdminUser | null, permission: string): boolean => {
  if (!adminUser) return false;
  return adminUser.permissions.includes(permission) || adminUser.role === 'super_admin';
};