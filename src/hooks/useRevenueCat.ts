'use client';
export const useRevenueCat = () => {
  return {
    isLoading: false,
    isPremium: false,
    isConfigured: false,
    customerInfo: null,
    purchasePackage: async () => false,
    restorePurchases: async () => {},
    getPremiumPackage: () => null,
    canAccessPremiumContent: () => false,
    getFreeRecipesRemaining: () => 2,
    markRecipeAsUsed: () => {},
    resetFreeRecipes: () => {}
  };
};
