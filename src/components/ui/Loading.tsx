import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <Loader2 className={clsx('animate-spin text-orange-500', sizeClasses[size])} />
      {text && (
        <p className={clsx('mt-4 text-gray-600', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-200 rounded', className)} />
);

export const RecipeCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <LoadingSkeleton className="w-full h-48" />
    <div className="p-6">
      <LoadingSkeleton className="h-4 w-20 mb-2" />
      <LoadingSkeleton className="h-6 w-3/4 mb-2" />
      <LoadingSkeleton className="h-4 w-full mb-4" />
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-10 flex-1" />
        <LoadingSkeleton className="h-10 w-12" />
      </div>
    </div>
  </div>
);