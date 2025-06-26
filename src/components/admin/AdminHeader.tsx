'use client';

import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card } from '@/components/ui/Card';
import { Crown, User } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();

  if (!adminUser) return null;

  return (
    <Card className={`mb-6 ${isSuperAdmin() ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSuperAdmin() ? 'bg-orange-500' : 'bg-blue-500'
        }`}>
          {isSuperAdmin() ? (
            <Crown className="w-6 h-6 text-white" />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${
            isSuperAdmin() ? 'text-orange-800' : 'text-blue-800'
          }`}>
            {isSuperAdmin() ? '👑 Super Administrator' : '👤 User'}
          </h3>
          <p className={`text-sm ${
            isSuperAdmin() ? 'text-orange-700' : 'text-blue-700'
          }`}>
            Signed in as: <strong>{adminUser.email}</strong>
          </p>
          <div className="flex items-center space-x-2 mt-2">
            {adminUser.permissions.map((permission) => (
              <span
                key={permission}
                className={`px-2 py-1 text-xs rounded-full ${
                  isSuperAdmin() 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};