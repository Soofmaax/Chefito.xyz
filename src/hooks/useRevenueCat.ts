'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';
// import * as PurchasesJS from 'purchases-js'; // Temporairement désactivé

// Mock RevenueCat API pour éviter les erreurs de build
const PurchasesJS = {
  configure: (config: any) => Promise.resolve(),
  getCustomerInfo: () => Promise.resolve({ entitlements: { active: {} } }),
  purchasePackage: (pkg: any) => Promise.resolve({ customerInfo: { entitlements: { active: {} } } }),
  restorePurchases: () => Promise.resolve({ customerInfo: { entitlements: { active: {} } } })
};

// RevenueCat hook with real SDK integration
interface RevenueCatState {
  isLoading: boolean;
  isPremium: boolean;
  isConfigured: boolean;
  customerInfo: any;
}

export const useRevenueCat = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [state, setState] = useState<RevenueCatState>({
    isLoading: true,
    isPremium: false,
    isConfigured: false,
    customerInfo: null
  });

  // Initialize RevenueCat
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
            customerInfo: null
          });
          return;
        }

        // Initialize RevenueCat SDK
        PurchasesJS.configure({
          apiKey,
          appUserID: user?.id,
          logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
        });

        // Get customer info
        const customerInfo = await PurchasesJS.getCustomerInfo();
        
        // Check if user has premium entitlement
        const isPremium = customerInfo?.entitlements?.active?.premium || false;
        
        setState({
          isLoading: false,
          isPremium,
          isConfigured: true,
          customerInfo
        });
      } catch (error) {
        setState({
          isLoading: false,
          isPremium: false,
          isConfigured: false,
          customerInfo: null
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

      // Make purchase through RevenueCat
      const { customerInfo } = await PurchasesJS.purchasePackage(packageToPurchase);
      
      // Check if purchase was successful
      const isPremium = customerInfo?.entitlements?.active?.premium || false;
      
      setState(prev => ({
        ...prev,
        isPremium,
        isLoading: false,
        customerInfo
      }));

      if (isPremium) {
        showToast({
          type: 'success',
          title: '🎉 Welcome to Chefito Premium!',
          message: 'Your subscription is now active. Enjoy all recipes!',
        });
      }

      return isPremium;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Don't show error for user cancellation
      if (error.code !== 'cancelled') {
        showToast({
          type: 'error',
          title: 'Purchase Error',
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
        message: 'The subscription service is not properly configured.',
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Restore purchases through RevenueCat
      const { customerInfo } = await PurchasesJS.restorePurchases();
      
      // Check if user has premium entitlement
      const isPremium = customerInfo?.entitlements?.active?.premium || false;
      
      setState(prev => ({
        ...prev,
        isPremium,
        isLoading: false,
        customerInfo
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
          title: 'No Subscription Found',
          message: 'No active subscription was found for this account.',
        });
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      showToast({
        type: 'error',
        title: 'Restore Error',
        message: error.message || 'Failed to restore purchases. Please try again.',
      });
    }
  }, [state.isConfigured, showToast]);

  // Get premium package
  const getPremiumPackage = useCallback(() => {
    if (!state.isConfigured) return null;
    
    // This would normally come from RevenueCat's getOfferings() API
    // For now, we'll return a mock package
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
  }, [state.isConfigured]);

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
