'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          Perhaps you'd like to go back to the home page?
        </p>
        
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full" icon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => window.history.back()}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
}