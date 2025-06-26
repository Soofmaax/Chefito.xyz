'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder-image.jpg',
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <div className={clsx('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={clsx(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'filter grayscale',
          className
        )}
        {...props}
      />
    </div>
  );
};