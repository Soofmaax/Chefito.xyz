'use client';

import React, { useState } from 'react';
import { User, Settings, Heart, Clock, ChefHat, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { SKILL_LEVELS, DIETARY_RESTRICTIONS } from '@/constants';

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || 'Demo User',
    email: user?.email || 'demo@chefito.xyz',
    skillLevel: user?.skill_level || 'beginner',
    dietaryRestrictions: user?.dietary_restrictions || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDietaryChange = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
    });
    setLoading(false);
  };

  // Mock stats for demo
  const stats = {
    recipesCompleted: 12,
    favoriteRecipes: 8,
    cookingHours: 24,
    memberSince: 'January 2025',
  };

  const recentActivity = [
    { action: 'Completed Perfect Scrambled Eggs', time: '2 hours ago' },
    { action: 'Favorited Simple Pasta with Garlic Oil', time: '1 day ago' },
    { action: 'Started Basic Vegetable Stir-Fry', time: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your account and cooking preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-orange-500" />
                Personal Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    name="skillLevel"
                    value={formData.skillLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {SKILL_LEVELS.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </form>
            </Card>

            {/* Cooking Preferences */}
            <Card className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-green-500" />
                Cooking Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dietary Restrictions
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {DIETARY_RESTRICTIONS.map((restriction) => (
                      <label key={restriction} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dietaryRestrictions.includes(restriction)}
                          onChange={() => handleDietaryChange(restriction)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{restriction}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button>
                  Update Preferences
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats & Activity */}
          <div className="space-y-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-500" />
                Cooking Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <ChefHat className="w-4 h-4 mr-2" />
                    Recipes Completed
                  </span>
                  <span className="font-bold text-orange-600">{stats.recipesCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorite Recipes
                  </span>
                  <span className="font-bold text-red-600">{stats.favoriteRecipes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Cooking Hours
                  </span>
                  <span className="font-bold text-green-600">{stats.cookingHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-bold">{stats.memberSince}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}