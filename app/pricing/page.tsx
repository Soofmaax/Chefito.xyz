import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { SubscriptionPlans } from '@/components/features/SubscriptionPlans';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <SubscriptionPlans />

      <Footer />
    </div>
  );
}