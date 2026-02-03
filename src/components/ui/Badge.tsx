import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'crimson' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className,
}) => {
  const variantClasses = {
    default: 'bg-roman-marble-600 text-roman-marble-200 border-roman-marble-500',
    gold: 'bg-roman-gold-600/20 text-roman-gold-400 border-roman-gold-500',
    crimson: 'bg-roman-crimson-600/20 text-roman-crimson-400 border-roman-crimson-500',
    success: 'bg-health-high/20 text-health-high border-health-high',
    warning: 'bg-orange-500/20 text-orange-400 border-orange-500',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500',
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded border',
        variantClasses[variant],
        sizeClasses[size],
        pulse && variant === 'gold' && 'pulse-gold',
        pulse && variant === 'crimson' && 'pulse-crimson',
        className
      )}
    >
      {children}
    </span>
  );
};
