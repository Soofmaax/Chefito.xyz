import React from 'react';
import { Loading } from '@/components/ui/Loading';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading size="lg" text="Loading Chefito..." />
    </div>
  );
}