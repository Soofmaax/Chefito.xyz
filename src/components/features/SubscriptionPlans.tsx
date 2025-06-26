'use client';

import React, { useState } from 'react';
import { Check, Crown, Zap, ChefHat, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';
import { useRevenueCat } from '@/hooks/useRevenueCat';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Chefito Free',
    price: 0,
    period: 'month',
    description: 'Perfect for discovering Chefito',
    icon: <ChefHat className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    features: [
      { text: '2 recipes with voice guidance', included: true },
      { text: 'Step-by-step instructions', included: true },
      { text: 'Intuitive interface', included: true },
      { text: 'Community support', included: true },
      { text: 'Unlimited recipes', included: false },
      { text: 'Complete voice guidance', included: false },
      { text: 'All categories', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Chefito Premium',
    price: 19.99,
    period: 'month',
    description: 'Complete access to all features',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    popular: true,
    features: [
      { text: 'Unlimited access to all recipes', included: true },
      { text: 'Complete voice guidance', included: true },
      { text: 'All cuisine categories', included: true },
      { text: 'Detailed instructions', included: true },
      { text: 'Favorites and history', included: true },
      { text: 'Hands-free mode', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access to new recipes', included: true },
    ],
  },
];

export const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const { showToast } = useToast();
  
  const {
    isLoading,
    isPremium,
    isConfigured,
    purchasePackage,
    restorePurchases,
    getPremiumPackage,
    getFreeRecipesRemaining,
    resetFreeRecipes,
  } = useRevenueCat();

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      showToast({
        type: 'success',
        title: 'Free account activated!',
        message: `You can now access ${getFreeRecipesRemaining()} recipes with voice guidance.`,
      });
      return;
    }

    // Get the premium package
    const premiumPackage = getPremiumPackage();
    
    if (!premiumPackage) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Unable to load subscription options. Please try again.',
      });
      return;
    }

    // Purchase the package
    const success = await purchasePackage(premiumPackage);
    
    if (success) {
      console.log('✅ Premium subscription activated');
    }
  };

  const handleRestorePurchases = async () => {
    await restorePurchases();
  };

  // Show current subscription status
  const getSubscriptionStatus = () => {
    if (isPremium) {
      return (
        <div className="text-center mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Crown className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-800">You're Premium! 🎉</h3>
          <p className="text-green-600">Enjoy unlimited access to all recipes</p>
        </div>
      );
    }

    const remainingRecipes = getFreeRecipesRemaining();
    return (
      <div className="text-center mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <ChefHat className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-blue-800">Free Plan</h3>
        <p className="text-blue-600">
          {remainingRecipes > 0 
            ? `${remainingRecipes} recipe${remainingRecipes > 1 ? 's' : ''} remaining`
            : 'Upgrade to Premium for unlimited access'
          }
        </p>
      </div>
    );
  };

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 to-green-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Chefito Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start free or unlock complete access with Premium
          </p>
          
          {/* Subscription Status */}
          {getSubscriptionStatus()}
        </div>

        {/* Configuration Status */}
        {!isConfigured && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ⚠️ Subscription service unavailable
            </h3>
            <p className="text-red-700 text-sm">
              RevenueCat is not properly configured. Please check your API key.
            </p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-orange-500 shadow-xl scale-105' 
                  : selectedPlan === plan.id 
                    ? 'ring-2 ring-orange-300 shadow-lg' 
                    : 'hover:shadow-lg'
              }`}
              hover={false}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 text-sm font-medium">
                  ⭐ Recommended
                </div>
              )}
              
              <div className={`pt-${plan.popular ? '12' : '6'} pb-6`}>
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `€${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 text-lg">/month</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <span className={`${
                        feature.included ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  disabled={!isConfigured || (isPremium && plan.id === 'premium')}
                  icon={plan.id !== 'free' ? <Crown className="w-5 h-5" /> : <ChefHat className="w-5 h-5" />}
                >
                  {isPremium && plan.id === 'premium' 
                    ? 'Already Premium ✓' 
                    : plan.id === 'free' 
                      ? 'Start Free' 
                      : 'Upgrade to Premium'
                  }
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Restore Purchases Button */}
        {isConfigured && !isPremium && (
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={handleRestorePurchases}
              loading={isLoading}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Restore Purchases
            </Button>
          </div>
        )}

        {/* Value Proposition */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Chefito Premium?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎤</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Voice Guidance</h4>
              <p className="text-gray-600 text-sm">Step-by-step audio instructions for hands-free cooking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Recipes</h4>
              <p className="text-gray-600 text-sm">Access to our complete collection of recipes for all skill levels</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Support</h4>
              <p className="text-gray-600 text-sm">Priority assistance and early access to new recipes</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">What's included in the free plan?</h4>
              <p className="text-gray-600 text-sm">Access to 2 complete recipes with voice guidance to discover Chefito.</p>
            </div>
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm">Yes, you can cancel your Premium subscription anytime through your account settings.</p>
            </div>
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">How does voice guidance work?</h4>
              <p className="text-gray-600 text-sm">Our system reads step-by-step instructions while you cook, hands-free.</p>
            </div>
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Are purchases synchronized?</h4>
              <p className="text-gray-600 text-sm">Yes, your subscriptions are linked to your account and synced across all devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};