'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <AlertTriangle className="w-16 h-16 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          
          <Link href="/">
            <Button
              variant="outline"
              className="w-full"
              icon={<Home className="w-4 h-4" />}
            >
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}