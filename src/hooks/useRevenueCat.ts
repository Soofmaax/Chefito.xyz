'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';

// Simplified RevenueCat hook without external dependencies
interface RevenueCatState {
  isLoading: boolean;
  isPremium: boolean;
  isConfigured: boolean;
}

export const useRevenueCat = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [state, setState] = useState<RevenueCatState>({
    isLoading: false,
    isPremium: false,
    isConfigured: false, // Set to false since we don't have RevenueCat configured
  });

  // Initialize (simplified version)
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
        
        if (!apiKey || apiKey === 'your_revenuecat_public_api_key') {
          console.warn('⚠️ RevenueCat API key not configured. Running in demo mode.');
          setState({
            isLoading: false,
            isPremium: false,
            isConfigured: false,
          });
          return;
        }

        // For now, we'll simulate the configuration
        console.log('🚀 RevenueCat would be initialized here with API key');
        
        setState({
          isLoading: false,
          isPremium: false, // Default to free
          isConfigured: true,
        });
      } catch (error) {
        console.error('❌ RevenueCat initialization failed:', error);
        setState({
          isLoading: false,
          isPremium: false,
          isConfigured: false,
        });
      }
    };

    initializeRevenueCat();
  }, [user?.id]);

  // Simplified purchase function
  const purchasePackage = useCallback(async (packageToPurchase: any) => {
    if (!state.isConfigured) {
      showToast({
        type: 'error',
        title: 'Service indisponible',
        message: 'Le service d\'abonnement n\'est pas encore configuré.',
      });
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Simulate purchase process
      console.log('💳 Simulating purchase for package:', packageToPurchase);
      
      // In a real implementation, this would call RevenueCat
      await new Promise(resolve => setTimeout(resolve, 2000));

      setState(prev => ({
        ...prev,
        isPremium: true,
        isLoading: false,
      }));

      showToast({
        type: 'success',
        title: '🎉 Bienvenue dans Chefito Premium !',
        message: 'Votre abonnement est maintenant actif. Profitez de toutes les recettes !',
      });

      return true;
    } catch (error: any) {
      console.error('❌ Purchase failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      showToast({
        type: 'error',
        title: 'Erreur d\'achat',
        message: 'Une erreur est survenue lors de l\'achat. Veuillez réessayer.',
      });
      
      return false;
    }
  }, [state.isConfigured, showToast]);

  // Simplified restore function
  const restorePurchases = useCallback(async () => {
    if (!state.isConfigured) {
      showToast({
        type: 'error',
        title: 'Service indisponible',
        message: 'Le service de restauration n\'est pas encore configuré.',
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      console.log('🔄 Simulating restore purchases...');
      
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      showToast({
        type: 'info',
        title: 'Aucun abonnement trouvé',
        message: 'Aucun abonnement actif n\'a été trouvé pour ce compte.',
      });
    } catch (error) {
      console.error('❌ Restore failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      showToast({
        type: 'error',
        title: 'Erreur de restauration',
        message: 'Impossible de restaurer les achats. Veuillez réessayer.',
      });
    }
  }, [state.isConfigured, showToast]);

  // Get premium package (mock)
  const getPremiumPackage = useCallback(() => {
    return {
      identifier: 'premium_monthly',
      packageType: 'monthly',
      product: {
        identifier: 'premium_monthly',
        description: 'Chefito Premium Monthly',
        title: 'Premium Monthly',
        price: 19.99,
        priceString: '19,99€',
        currencyCode: 'EUR',
      },
    };
  }, []);

  // Check if user can access premium content
  const canAccessPremiumContent = useCallback((): boolean => {
    return state.isPremium;
  }, [state.isPremium]);

  // Get remaining free recipes count
  const getFreeRecipesRemaining = useCallback((): number => {
    if (state.isPremium) return Infinity;
    
    // Free plan users get 2 recipes
    if (typeof window !== 'undefined') {
      const usedRecipes = parseInt(localStorage.getItem('chefito-used-recipes') || '0');
      return Math.max(0, 2 - usedRecipes);
    }
    return 2;
  }, [state.isPremium]);

  // Mark a recipe as used (for free users)
  const markRecipeAsUsed = useCallback(() => {
    if (state.isPremium) return; // Premium users have unlimited access
    
    if (typeof window !== 'undefined') {
      const usedRecipes = parseInt(localStorage.getItem('chefito-used-recipes') || '0');
      localStorage.setItem('chefito-used-recipes', (usedRecipes + 1).toString());
      console.log('📊 Recipe marked as used. Total used:', usedRecipes + 1);
    }
  }, [state.isPremium]);

  // Reset free recipe count (for testing purposes)
  const resetFreeRecipes = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chefito-used-recipes');
      console.log('🔄 Free recipe count reset');
    }
  }, []);

  return {
    ...state,
    purchasePackage,
    restorePurchases,
    getPremiumPackage,
    canAccessPremiumContent,
    getFreeRecipesRemaining,
    markRecipeAsUsed,
    resetFreeRecipes,
  };
};