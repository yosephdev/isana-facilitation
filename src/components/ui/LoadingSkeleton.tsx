import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  variant = 'text',
  lines = 1 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    card: 'h-32 w-full',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`${baseClasses} ${variants.text} ${
              index === lines - 1 ? 'w-3/4' : ''
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default LoadingSkeleton;