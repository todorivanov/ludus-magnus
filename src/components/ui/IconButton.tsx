import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Tooltip } from './Tooltip';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'gold' | 'crimson' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  disabled?: boolean;
  active?: boolean;
  badge?: number | string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'default',
  size = 'md',
  tooltip,
  disabled = false,
  active = false,
  badge,
  className,
}) => {
  const variantClasses = {
    default: clsx(
      'bg-roman-marble-700 border-roman-marble-600 text-roman-marble-300',
      'hover:bg-roman-marble-600 hover:text-roman-marble-100',
      active && 'bg-roman-bronze-600 border-roman-bronze-500 text-roman-marble-100'
    ),
    gold: clsx(
      'bg-roman-gold-600/20 border-roman-gold-600 text-roman-gold-400',
      'hover:bg-roman-gold-600/30',
      active && 'bg-roman-gold-600 text-roman-marble-900'
    ),
    crimson: clsx(
      'bg-roman-crimson-600/20 border-roman-crimson-600 text-roman-crimson-400',
      'hover:bg-roman-crimson-600/30',
      active && 'bg-roman-crimson-600 text-roman-marble-100'
    ),
    ghost: clsx(
      'bg-transparent border-transparent text-roman-marble-400',
      'hover:bg-roman-marble-700 hover:text-roman-marble-200',
      active && 'text-roman-gold-400'
    ),
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const button = (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-lg border',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon}
      {badge !== undefined && (
        <span className={clsx(
          'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1',
          'flex items-center justify-center',
          'text-xs font-bold rounded-full',
          'bg-roman-crimson-600 text-white'
        )}>
          {badge}
        </span>
      )}
    </motion.button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{button}</Tooltip>;
  }

  return button;
};
