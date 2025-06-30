// Middleware for admin authentication
import { User } from '@/types';

// Super admin credentials come from environment variables
export const SUPER_ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
export const SUPER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'user';
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