'use client';

import React from 'react';
import { Crown, Lock, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import Link from 'next/link';

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
  showPreview?: boolean;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ 
  children, 
  feature = "this feature",
  showPreview = false 
}) => {
  const { 
    isPremium, 
    canAccessPremiumContent, 
    getFreeRecipesRemaining,
    isLoading 
  } = useRevenueCat();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If user has premium access, show the content
  if (canAccessPremiumContent()) {
    return <>{children}</>;
  }

  // Check if user still has free recipes remaining
  const freeRecipesRemaining = getFreeRecipesRemaining();
  
  if (freeRecipesRemaining > 0) {
    return <>{children}</>;
  }

  // Show premium gate
  return (
    <div className="relative">
      {/* Preview content (blurred) */}
      {showPreview && (
        <div className="filter blur-sm pointer-events-none opacity-50">
          {children}
        </div>
      )}
      
      {/* Premium gate overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center p-8`}>
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Premium Content
          </h3>
          
          <p className="text-gray-600 mb-6">
            To access {feature}, upgrade to Chefito Premium and unlock:
          </p>
          
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Unlimited access to all recipes</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Complete voice guidance</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Priority support</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link href="/pricing">
              <Button className="w-full" icon={<Crown className="w-5 h-5" />}>
                Upgrade to Premium - €19.99/month
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">
              Or continue with the free plan (2 recipes)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};