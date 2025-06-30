'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { RecipeCard } from '@/components/features/RecipeCard';
import { demoRecipes } from '@/data/demoRecipes';

export default function DemoRecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold text-gray-900">Demo Recipes</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">A handful of sample recipes to explore the design.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} recipeIndex={index} hrefPrefix="/demo-recipes" />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
