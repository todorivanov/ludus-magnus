import React from 'react';
import { clsx } from 'clsx';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'gold' | 'subtle';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'default',
  label,
  className,
}) => {
  const variantClasses = {
    default: 'from-transparent via-roman-bronze-600 to-transparent',
    gold: 'from-transparent via-roman-gold-500 to-transparent',
    subtle: 'from-transparent via-roman-marble-600 to-transparent',
  };

  if (orientation === 'vertical') {
    return (
      <div className={clsx('w-px h-full bg-gradient-to-b', variantClasses[variant], className)} />
    );
  }

  if (label) {
    return (
      <div className={clsx('flex items-center gap-4', className)}>
        <div className={clsx('flex-1 h-px bg-gradient-to-r', variantClasses[variant])} />
        <span className="text-roman-marble-500 text-xs uppercase tracking-wider font-roman">
          {label}
        </span>
        <div className={clsx('flex-1 h-px bg-gradient-to-r', variantClasses[variant])} />
      </div>
    );
  }

  return (
    <div className={clsx('h-px bg-gradient-to-r', variantClasses[variant], className)} />
  );
};
