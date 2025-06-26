// Middleware d'authentification admin
export const SUPER_ADMIN_EMAIL = 'contact@chefito.xyz';
export const SUPER_ADMIN_PASSWORD = 'S67JgXOcmZCxQw3I';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'user';
  permissions: string[];
}

export const checkAdminPermissions = (user: any): AdminUser | null => {
  if (!user) return null;
  
  // Super admin avec tous les droits
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
  
  // Utilisateurs normaux - lecture seule de leurs propres données
  return {
    id: user.id,
    email: user.email,
    role: 'user',
    permissions: [
      'profile:read',
      'profile:write',
      'recipes:read' // Lecture seule des recettes
    ]
  };
};

export const hasPermission = (adminUser: AdminUser | null, permission: string): boolean => {
  if (!adminUser) return false;
  return adminUser.permissions.includes(permission) || adminUser.role === 'super_admin';
};