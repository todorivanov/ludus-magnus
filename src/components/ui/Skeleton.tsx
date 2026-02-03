import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  count = 1,
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    card: 'rounded-lg h-32',
  };

  const baseClasses = 'bg-roman-marble-700 shimmer';

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (count === 1) {
    return (
      <div
        className={clsx(baseClasses, variantClasses[variant], className)}
        style={style}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={clsx(baseClasses, variantClasses[variant], className)}
          style={{
            ...style,
            width: variant === 'text' && index === count - 1 ? '60%' : style.width,
          }}
        />
      ))}
    </div>
  );
};

// Common skeleton patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('card-roman p-4 space-y-3', className)}>
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="rectangular" height={100} />
    <Skeleton variant="text" count={2} />
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ 
  size = 48, 
  className 
}) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    <Skeleton variant="rectangular" height={40} className="bg-roman-marble-600" />
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={index} variant="rectangular" height={48} />
    ))}
  </div>
);
