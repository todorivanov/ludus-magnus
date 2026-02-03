import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circular' | 'rounded' | 'square';
  border?: boolean;
  borderColor?: 'default' | 'gold' | 'crimson' | 'success';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'circular',
  border = false,
  borderColor = 'default',
  status,
  className,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const borderColorClasses = {
    default: 'border-roman-marble-600',
    gold: 'border-roman-gold-500',
    crimson: 'border-roman-crimson-500',
    success: 'border-health-high',
  };

  const statusColors = {
    online: 'bg-health-high',
    offline: 'bg-roman-marble-500',
    busy: 'bg-roman-crimson-500',
    away: 'bg-orange-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const getFallbackInitials = () => {
    if (fallback) return fallback;
    if (alt) {
      return alt
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  return (
    <div className={clsx('relative inline-flex', className)}>
      <div
        className={clsx(
          'flex items-center justify-center bg-roman-marble-700 overflow-hidden',
          sizeClasses[size],
          variantClasses[variant],
          border && 'border-2',
          border && borderColorClasses[borderColor]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-roman font-bold text-roman-marble-400">
            {getFallbackInitials()}
          </span>
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-roman-marble-900',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};

// Avatar group for stacked avatars
interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string; fallback?: string }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'md',
  className,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const overlapClasses = {
    xs: '-ml-2',
    sm: '-ml-3',
    md: '-ml-4',
    lg: '-ml-5',
    xl: '-ml-6',
  };

  return (
    <div className={clsx('flex items-center', className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          border
          className={index > 0 ? overlapClasses[size] : ''}
        />
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center bg-roman-marble-700 rounded-full border-2 border-roman-marble-900',
            'font-roman font-bold text-roman-marble-300',
            sizeToClass(size),
            overlapClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

function sizeToClass(size: AvatarProps['size']): string {
  const classes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };
  return classes[size || 'md'];
}
