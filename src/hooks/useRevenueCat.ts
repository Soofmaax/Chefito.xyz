'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/Toast';
import Purchases, { CustomerInfo, PurchasesPackage } from 'purchases-js';

interface RevenueCatState {
  isLoading: boolean;
  isPremium: boolean;
  isConfigured: boolean;
  customerInfo: CustomerInfo | null;
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
          console.warn('RevenueCat API key not configured. Running in demo mode.');
          setState({
            isLoading: false,
            isPremium: false,
            isConfigured: false,
            customerInfo: null
          });
          return;
        }

        // Initialize RevenueCat SDK
        Purchases.configure({
          apiKey,
          appUserID: user?.id
        });

        // Get customer info
        const customerInfo = await Purchases.getCustomerInfo();
        
        // Check if user has premium entitlement
        const isPremium = typeof customerInfo.entitlements.active.premium !== 'undefined';
        
        setState({
          isLoading: false,
          isPremium,
          isConfigured: true,
          customerInfo
        });
      } catch (error) {
        console.error('RevenueCat initialization failed:', error);
        setState({
          isLoading: false,
          isPremium: false,
          isConfigured: false,
          customerInfo: null
        });
      }
    };

    initializeRevenueCat();
  }, [user?.id]);

  // Get premium package
  const getPremiumPackage = useCallback((): PurchasesPackage | null => {
    if (!state.isConfigured) return null;
    
    try {
      // This would normally fetch from RevenueCat, but we're returning a mock for now
      return {
        identifier: 'premium_monthly',
        packageType: 'MONTHLY',
        product: {
          identifier: 'premium_monthly',
          description: 'Chefito Premium Monthly',
          title: 'Premium Monthly',
          price: 19.99,
          priceString: '19,99€',
          currencyCode: 'EUR'
        }
      } as PurchasesPackage;
    } catch (error) {
      console.error('Error getting premium package:', error);
      return null;
    }
  }, [state.isConfigured]);

  // Purchase package
  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    if (!state.isConfigured) {
      showToast({
        type: 'error',
        title: 'Service unavailable',
        message: 'The subscription service is not configured.',
      });
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Purchase the package
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      // Check if the purchase was successful
      const isPremium = typeof customerInfo.entitlements.active.premium !== 'undefined';
      
      setState(prev => ({
        ...prev,
        isPremium,
        isLoading: false,
        customerInfo
      }));

      if (isPremium) {
        showToast({
          type: 'success',
          title: 'Welcome to Chefito Premium!',
          message: 'Your subscription is now active. Enjoy all recipes!',
        });
        return true;
      } else {
        showToast({
          type: 'error',
          title: 'Subscription failed',
          message: 'Your subscription could not be activated.',
        });
        return false;
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Check if user canceled
      if (error.code === Purchases.ErrorCode.purchaseCancelledError) {
        showToast({
          type: 'info',
          title: 'Purchase canceled',
          message: 'You canceled the subscription process.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Purchase error',
          message: error.message || 'An error occurred during purchase.',
        });
      }
      
      return false;
    }
  }, [state.isConfigured, showToast]);

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<void> => {
    if (!state.isConfigured) {
      showToast({
        type: 'error',
        title: 'Service unavailable',
        message: 'The restore service is not configured.',
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Restore purchases
      const { customerInfo } = await Purchases.restorePurchases();
      
      // Check if user has premium entitlement
      const isPremium = typeof customerInfo.entitlements.active.premium !== 'undefined';
      
      setState(prev => ({
        ...prev,
        isPremium,
        isLoading: false,
        customerInfo
      }));

      if (isPremium) {
        showToast({
          type: 'success',
          title: 'Purchases restored',
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
      console.error('Restore failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      showToast({
        type: 'error',
        title: 'Restore error',
        message: error.message || 'Failed to restore purchases.',
      });
    }
  }, [state.isConfigured, showToast]);

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