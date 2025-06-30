'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, ChefHat, Crown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Loading, RecipeCardSkeleton } from '@/components/ui/Loading';
import { RecipeCard } from '@/components/features/RecipeCard';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { demoRecipes } from '@/data/demo-recipes';
import { Recipe } from '@/types';
import { RECIPE_DIFFICULTIES } from '@/constants';
import Link from 'next/link';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { isPremium, getFreeRecipesRemaining } = useRevenueCat();

  useEffect(() => {
    loadRecipes();
  }, [searchTerm, selectedDifficulty, currentPage]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setRecipes(demoRecipes);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage(1);
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (selectedDifficulty !== 'all' && recipe.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const freeRecipesRemaining = getFreeRecipesRemaining();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              Recipe Collection
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Discover beginner-friendly recipes with voice guidance
          </p>
        </div>

        {/* Subscription Status Banner */}
        {!isPremium && (
          <Card className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">
                    Free Plan - {freeRecipesRemaining} recipe{freeRecipesRemaining !== 1 ? 's' : ''} remaining
                  </h3>
                  <p className="text-orange-700">
                    Upgrade to Premium for unlimited access to all recipes with voice guidance
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button icon={<Crown className="w-4 h-4" />}>
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search for recipes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                {RECIPE_DIFFICULTIES.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Voice guidance available</span>
              </div>
              {!isPremium && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <Crown className="w-4 h-4" />
                  <span>Premium recipes locked</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  recipeIndex={index}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-gray-600">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                disabled={!hasMore}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedDifficulty('all');
              setCurrentPage(1);
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}