'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';
import * as Purchases from 'purchases-js';

interface RevenueCatState {
  isLoading: boolean;
  isPremium: boolean;
  isConfigured: boolean;
  packages: any[];
}

export const useRevenueCat = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [state, setState] = useState<RevenueCatState>({
    isLoading: true,
    isPremium: false,
    isConfigured: false,
    packages: []
  });

  // Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
        
        if (!apiKey || apiKey === 'your_revenuecat_public_api_key') {
          setState({
            isLoading: false,
            isPremium: false,
            isConfigured: false,
            packages: []
          });
          return;
        }

        // Initialize RevenueCat
        Purchases.configure({
          apiKey,
          appUserID: user?.id,
          logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
        });

        // Get customer info
        if (user?.id) {
          const customerInfo = await Purchases.getCustomerInfo();
          const isPremium = customerInfo.entitlements.active.premium !== undefined;
          
          // Get available packages
          const offerings = await Purchases.getOfferings();
          const packages = offerings.current?.availablePackages || [];
          
          setState({
            isLoading: false,
            isPremium,
            isConfigured: true,
            packages
          });
        } else {
          setState({
            isLoading: false,
            isPremium: false,
            isConfigured: true,
            packages: []
          });
        }
      } catch (error) {
        setState({
          isLoading: false,
          isPremium: false,
          isConfigured: false,
          packages: []
        });
      }
    };

    if (user?.id) {
      initializeRevenueCat();
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPremium: false
      }));
    }
  }, [user?.id]);

  // Purchase package
  const purchasePackage = useCallback(async (packageToPurchase: any) => {
    if (!state.isConfigured) {
      showToast({
        type: 'error',
        title: 'Service unavailable',
        message: 'The subscription service is not properly configured.',
      });
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Make the purchase
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      const isPremium = customerInfo.entitlements.active.premium !== undefined;

      setState(prev => ({
        ...prev,
        isPremium,
        isLoading: false,
      }));

      showToast({
        type: 'success',
        title: '🎉 Welcome to Chefito Premium!',
        message: 'Your subscription is now active. Enjoy all recipes!',
      });

      return true;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (error.code !== Purchases.PURCHASE_CANCELLED_ERROR) {
        showToast({
          type: 'error',
          title: 'Purchase failed',
          message: error.message || 'An error occurred during purchase. Please try again.',
        });
      }
      
      return false;
    }
  }, [state.isConfigured, showToast]);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    if (!state.isConfigured) {
      showToast({
        type: 'error',
        title: 'Service unavailable',
        message: 'The restore service is not properly configured.',
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const { customerInfo } = await Purchases.restorePurchases();
      const isPremium = customerInfo.entitlements.active.premium !== undefined;

      setState(prev => ({
        ...prev,
        isPremium,
        isLoading: false,
      }));

      if (isPremium) {
        showToast({
          type: 'success',
          title: 'Purchases Restored',
          message: 'Your premium subscription has been restored.',
        });
      } else {
        showToast({
          type: 'info',
          title: 'No subscription found',
          message: 'No active subscription was found for this account.',
        });
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      showToast({
        type: 'error',
        title: 'Restore failed',
        message: error.message || 'Unable to restore purchases. Please try again.',
      });
    }
  }, [state.isConfigured, showToast]);

  // Get premium package
  const getPremiumPackage = useCallback(() => {
    if (!state.isConfigured || state.packages.length === 0) {
      return null;
    }
    
    // Find the monthly premium package
    return state.packages.find(pkg => pkg.identifier === 'premium_monthly') || state.packages[0];
  }, [state.isConfigured, state.packages]);

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
    }
  }, [state.isPremium]);

  // Reset free recipe count (for testing purposes)
  const resetFreeRecipes = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chefito-used-recipes');
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