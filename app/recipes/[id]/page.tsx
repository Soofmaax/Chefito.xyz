'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, ChefHat, Play, Heart, Share2, ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Image } from '@/components/ui/Image';
import { VoicePlayer } from '@/components/features/VoicePlayer';
import { VoiceGuidedCooking } from '@/components/features/VoiceGuidedCooking';
import { PremiumGate } from '@/components/features/PremiumGate';
import { useToast } from '@/components/ui/Toast';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { apiService } from '@/services/api';
import { Recipe } from '@/types';

export default function RecipeDetailPage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const { showToast } = useToast();
  const { isPremium, getFreeRecipesRemaining, markRecipeAsUsed } = useRevenueCat();

  useEffect(() => {
    if (params.id) {
      loadRecipe(params.id as string);
    }
  }, [params.id]);

  const loadRecipe = async (id: string) => {
    try {
      setLoading(true);
      const recipeData = await apiService.getRecipe(id);
      setRecipe(recipeData);
      
      // Mark recipe as used for free users (if they can access it)
      const recipeIndex = parseInt(id) - 1; // Assuming sequential IDs
      if (!isPremium && recipeIndex < 2) {
        markRecipeAsUsed();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Recipe Not Found',
        message: 'The requested recipe could not be loaded.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    showToast({
      type: 'success',
      title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      message: isFavorited ? 'Recipe removed from your favorites' : 'Recipe saved to your favorites',
    });
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share && recipe) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          showToast({
            type: 'success',
            title: 'Link Copied',
            message: 'Recipe link copied to clipboard',
          });
        }
      }
    } else if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Recipe link copied to clipboard',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading recipe..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
            <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
            <Link href="/recipes">
              <Button icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Recipes
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user can access this recipe
  const recipeIndex = parseInt(params.id as string) - 1;
  const canAccess = isPremium || recipeIndex < 2;

  // If user can't access, show premium gate
  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/recipes">
              <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Recipes
              </Button>
            </Link>
          </div>

          <PremiumGate feature="cette recette complète" showPreview={true}>
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
                  <p className="text-xl text-white/90">{recipe.description}</p>
                </div>
              </div>
            </div>
          </PremiumGate>
        </div>

        <Footer />
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/recipes">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Recipes
            </Button>
          </Link>
        </div>

        {/* Free Recipe Notice */}
        {!isPremium && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Free Recipe Access</h3>
                <p className="text-green-700 text-sm">
                  You're viewing one of your {getFreeRecipesRemaining() + 1} free recipes. 
                  <Link href="/pricing" className="underline ml-1">Upgrade to Premium</Link> for unlimited access.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recipe.difficulty]}`}>
                  {recipe.difficulty}
                </span>
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
              <p className="text-xl text-white/90">{recipe.description}</p>
            </div>
          </div>

          {/* Recipe Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card padding="sm" className="text-center">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Prep Time</div>
              <div className="font-bold">{recipe.prep_time}m</div>
            </Card>
            <Card padding="sm" className="text-center">
              <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Cook Time</div>
              <div className="font-bold">{recipe.cook_time}m</div>
            </Card>
            <Card padding="sm" className="text-center">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Servings</div>
              <div className="font-bold">{recipe.servings}</div>
            </Card>
            <Card padding="sm" className="text-center">
              <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total Time</div>
              <div className="font-bold">{totalTime}m</div>
            </Card>
          </div>


          {/* Video Tutorial */}
          {recipe.video_url && (
            <div className="mb-8">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <iframe src={recipe.video_url} title={`${recipe.title} video`} allowFullScreen className="absolute top-0 left-0 w-full h-full" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1 md:flex-none"
              icon={<Play className="w-5 h-5" />}
              onClick={() => setShowVoiceGuide(!showVoiceGuide)}
            >
              {showVoiceGuide ? 'Masquer le guidage' : 'Guidage vocal étape par étape'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleFavorite}
              icon={<Heart className={`w-5 h-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />}
            >
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleShare}
              icon={<Share2 className="w-5 h-5" />}
            >
              Share
            </Button>
          </div>

          {/* Voice Guided Cooking Component */}
          {showVoiceGuide && (
            <VoiceGuidedCooking recipe={recipe} className="mb-8" />
          )}

          {/* Simple Voice Player for Introduction */}
          {!showVoiceGuide && (
            <VoicePlayer 
              text={`Bienvenue dans la recette ${recipe.title}. Cette recette sert ${recipe.servings} personnes et prend environ ${totalTime} minutes à préparer. Cliquez sur "Guidage vocal étape par étape" pour commencer la cuisine assistée.`}
              className="mb-8"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex p-4 rounded-lg transition-colors ${
                      currentStep === index ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                      currentStep === index 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                      {currentStep === index && (
                        <div className="mt-3 flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))}
                            disabled={currentStep === recipe.steps.length - 1}
                          >
                            Next Step
                          </Button>
                          <VoicePlayer 
                            text={step}
                            showSettings={false}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {currentStep < recipe.steps.length - 1 && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                  >
                    Start from Beginning
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}