import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'health' | 'stamina' | 'fame' | 'gold' | 'default';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'health':
        if (percentage > 60) return 'bg-health-high';
        if (percentage > 30) return 'bg-health-medium';
        if (percentage > 10) return 'bg-health-low';
        return 'bg-health-critical';
      case 'stamina':
        if (percentage > 60) return 'bg-stamina-high';
        if (percentage > 30) return 'bg-stamina-medium';
        return 'bg-stamina-low';
      case 'fame':
        if (percentage > 75) return 'bg-fame-legendary';
        if (percentage > 50) return 'bg-fame-gold';
        if (percentage > 25) return 'bg-fame-silver';
        return 'bg-fame-bronze';
      case 'gold':
        return 'bg-gradient-to-r from-roman-gold-600 to-roman-gold-400';
      default:
        return 'bg-roman-bronze-500';
    }
  };

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1 text-xs text-roman-marble-400">
          <span>{label}</span>
          <span>{Math.round(value)} / {max}</span>
        </div>
      )}
      <div className={clsx('progress-bar', sizeStyles[size])}>
        <div
          className={clsx('progress-bar-fill', getVariantColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
