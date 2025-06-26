'use client';

import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, Crown } from 'lucide-react';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  requiredPermission,
  fallback
}) => {
  const { adminUser, loading, hasPermission, isSuperAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Not connected
  if (!adminUser) {
    return fallback || (
      <Card className="max-w-md mx-auto text-center">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Restricted Access</h2>
        <p className="text-gray-600 mb-6">
          You must be signed in to access this section.
        </p>
        <Link href="/auth/login">
          <Button>Sign In</Button>
        </Link>
      </Card>
    );
  }

  // Permission check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <Card className="max-w-md mx-auto text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don&apos;t have the necessary permissions for this action.
        </p>
        {!isSuperAdmin() && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <Crown className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-blue-800 text-sm">
              <strong>User account:</strong> You can only view and edit your personal profile.
            </p>
          </div>
        )}
        <Link href="/profile">
          <Button variant="outline">Go to Profile</Button>
        </Link>
      </Card>
    );
  }

  return <>{children}</>;
};