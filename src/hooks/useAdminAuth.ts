'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { checkAdminPermissions, hasPermission, AdminUser, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '@/middleware/adminAuth';
import { useToast } from '@/components/ui/Toast';

export const useAdminAuth = () => {
  const { user, signIn } = useAuth();
  const { showToast } = useToast();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const admin = checkAdminPermissions(user);
      setAdminUser(admin);
    } else {
      setAdminUser(null);
    }
    setLoading(false);
  }, [user]);

  const signInAsAdmin = async (email: string, password: string) => {
    try {
      // Check super admin credentials
      if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
        // Sign in with super admin credentials
        await signIn(email, password);
        
        showToast({
          type: 'success',
          title: '🔐 Super Admin Access',
          message: 'Welcome to the complete administration interface!',
        });
        
        return true;
      } else {
        // Regular user sign in
        await signIn(email, password);
        
        showToast({
          type: 'info',
          title: '👤 User Access',
          message: 'Limited access to your personal profile.',
        });
        
        return true;
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Sign In Failed',
        message: 'Incorrect email or password.',
      });
      return false;
    }
  };

  const isSuperAdmin = (): boolean => {
    return adminUser?.role === 'super_admin';
  };

  const canManageRecipes = (): boolean => {
    return hasPermission(adminUser, 'recipes:write');
  };

  const canManageUsers = (): boolean => {
    return hasPermission(adminUser, 'users:write');
  };

  const canDeleteContent = (): boolean => {
    return hasPermission(adminUser, 'recipes:delete') || hasPermission(adminUser, 'users:delete');
  };

  return {
    adminUser,
    loading,
    isSuperAdmin,
    canManageRecipes,
    canManageUsers,
    canDeleteContent,
    signInAsAdmin,
    hasPermission: (permission: string) => hasPermission(adminUser, permission),
  };
};