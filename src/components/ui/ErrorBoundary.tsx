'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      this.logErrorToService(error, errorInfo);
    }
    
    this.setState({ errorInfo });
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // In production, this would send the error to your monitoring service
    // Example: Sentry.captureException(error, { contexts: { errorInfo } });
    
    // For now, just log to console in a production-friendly way
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };
    
    // This would be replaced with actual error reporting in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Application error:', JSON.stringify(errorData));
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <div className="text-orange-500 mb-4">
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
                onClick={() => window.location.reload()}
                className="w-full"
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Refresh Page
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}