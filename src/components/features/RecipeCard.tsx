import React from 'react';
import Link from 'next/link';
import { Clock, Users, ChefHat, Play, Crown, Lock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Image } from '../ui/Image';
import { Recipe } from '@/types';
import { useRevenueCat } from '@/hooks/useRevenueCat';

interface RecipeCardProps {
  recipe: Recipe;
  showVoiceButton?: boolean;
  recipeIndex?: number; // For free tier limitation
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  showVoiceButton = true,
  recipeIndex = 0
}) => {
  const { isPremium, getFreeRecipesRemaining } = useRevenueCat();
  
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  const totalTime = recipe.prep_time + recipe.cook_time;
  
  // Check if this recipe is accessible for free users
  const isAccessible = isPremium || recipeIndex < 2;

  return (
    <Card className="overflow-hidden group h-full flex flex-col relative" hover>
      {/* Premium badge for locked recipes */}
      {!isAccessible && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Crown className="w-3 h-3" />
          <span>Premium</span>
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <Image
          src={recipe.image_url}
          alt={recipe.title}
          className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 ${
            !isAccessible ? 'filter grayscale opacity-60' : ''
          }`}
        />
        
        {/* Lock overlay for premium recipes */}
        {!isAccessible && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-white text-center">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Premium Required</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {totalTime}m
          </div>
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {recipe.servings}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 text-orange-600">
            <ChefHat className="w-4 h-4" />
            <span className="text-sm font-medium">Recipe</span>
          </div>
          <div className="flex items-center space-x-1">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {recipe.description}
        </p>
        
        {/* Free tier warning */}
        {!isPremium && !isAccessible && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 text-sm text-center">
              <Crown className="w-4 h-4 inline mr-1" />
              Upgrade to Premium for unlimited access
            </p>
          </div>
        )}
        
        <div className="flex space-x-2 mt-auto">
          {isAccessible ? (
            <>
              <Link href={`/recipes/${recipe.id}`} className="flex-1">
                <Button variant="primary" className="w-full">
                  View Recipe
                </Button>
              </Link>
              {showVoiceButton && (
                <Button 
                  variant="outline" 
                  size="md" 
                  className="px-3"
                  aria-label="Play voice instructions"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
            </>
          ) : (
            <Link href="/pricing" className="flex-1">
              <Button variant="outline" className="w-full" icon={<Crown className="w-4 h-4" />}>
                Unlock with Premium
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};