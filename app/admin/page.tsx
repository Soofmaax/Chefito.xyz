'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ChefHat, Plus, List, BarChart3, Users, Settings, Crown, Shield } from 'lucide-react';

export default function AdminPage() {
  const { isSuperAdmin, canManageRecipes, canManageUsers } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminGuard>
          <AdminHeader />
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
              {isSuperAdmin() ? (
                <Crown className="w-8 h-8 mr-3 text-orange-500" />
              ) : (
                <Shield className="w-8 h-8 mr-3 text-blue-500" />
              )}
              {isSuperAdmin() ? 'Complete Administration' : 'My Personal Space'}
            </h1>
            <p className="text-xl text-gray-600">
              {isSuperAdmin() 
                ? 'Complete management of the Chefito platform' 
                : 'Manage your profile and preferences'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recipe Management - Super Admin only */}
            {canManageRecipes() && (
              <>
                <Card className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">New Recipe</h3>
                  <p className="text-gray-600 mb-6">
                    Add a new recipe to the platform with all details
                  </p>
                  <Link href="/admin/recipes/new">
                    <Button className="w-full" icon={<ChefHat className="w-5 h-5" />}>
                      Create Recipe
                    </Button>
                  </Link>
                </Card>

                <Card className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <List className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Recipes</h3>
                  <p className="text-gray-600 mb-6">
                    Edit, delete or organize all platform recipes
                  </p>
                  <Link href="/admin/recipes/manage">
                    <Button variant="outline" className="w-full" icon={<List className="w-5 h-5" />}>
                      Manage Recipes
                    </Button>
                  </Link>
                </Card>
              </>
            )}

            {/* User Management - Super Admin only */}
            {canManageUsers() && (
              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Management</h3>
                <p className="text-gray-600 mb-6">
                  Administer user accounts and their permissions
                </p>
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full" icon={<Users className="w-5 h-5" />}>
                    Manage Users
                  </Button>
                </Link>
              </Card>
            )}

            {/* Personal Profile - All users */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">My Profile</h3>
              <p className="text-gray-600 mb-6">
                Manage your personal information and preferences
              </p>
              <Link href="/profile">
                <Button variant="outline" className="w-full" icon={<Settings className="w-5 h-5" />}>
                  Edit Profile
                </Button>
              </Link>
            </Card>

            {/* Statistics - Super Admin only */}
            {isSuperAdmin() && (
              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics</h3>
                <p className="text-gray-600 mb-6">
                  View platform usage statistics
                </p>
                <Button variant="outline" className="w-full" icon={<BarChart3 className="w-5 h-5" />}>
                  View Statistics
                </Button>
              </Card>
            )}

            {/* Browse Recipes - All users */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browse Recipes</h3>
              <p className="text-gray-600 mb-6">
                Discover all available recipes on the platform
              </p>
              <Link href="/recipes">
                <Button variant="outline" className="w-full" icon={<ChefHat className="w-5 h-5" />}>
                  View Recipes
                </Button>
              </Link>
            </Card>
          </div>

          {/* Usage Guide */}
          <Card className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isSuperAdmin() ? 'Super Administrator Guide' : 'User Guide'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isSuperAdmin() ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-orange-500" />
                      Super Admin Privileges
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Create, edit and delete all recipes</li>
                      <li>Manage all user accounts</li>
                      <li>Access complete statistics</li>
                      <li>Advanced platform configuration</li>
                      <li>Content moderation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🔐 Security</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Account protected by enhanced authentication</li>
                      <li>Automatic activity logs</li>
                      <li>Automatic backup of modifications</li>
                      <li>Exclusive access to critical functions</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-500" />
                      Your Permissions
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>View all public recipes</li>
                      <li>Edit your personal profile</li>
                      <li>Manage your culinary preferences</li>
                      <li>Save your favorite recipes</li>
                      <li>Use voice guidance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Personalized interface based on your tastes</li>
                      <li>History of your cooking sessions</li>
                      <li>Recommendations adapted to your level</li>
                      <li>Technical support via profile</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </Card>
        </AdminGuard>
      </div>

      <Footer />
    </div>
  );
}