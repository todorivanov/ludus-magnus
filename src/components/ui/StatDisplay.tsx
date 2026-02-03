import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Tooltip } from './Tooltip';

interface StatDisplayProps {
  label: string;
  value: number | string;
  maxValue?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'gold' | 'health' | 'stamina' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
  tooltip?: string;
  change?: number;
  className?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  maxValue,
  icon,
  variant = 'default',
  size = 'md',
  showBar = false,
  tooltip,
  change,
  className,
}) => {
  const variantColors = {
    default: 'text-roman-marble-200',
    gold: 'text-roman-gold-400',
    health: 'text-health-high',
    stamina: 'text-stamina-full',
    danger: 'text-roman-crimson-400',
  };

  const barColors = {
    default: 'bg-roman-bronze-500',
    gold: 'bg-roman-gold-500',
    health: 'bg-health-high',
    stamina: 'bg-stamina-full',
    danger: 'bg-roman-crimson-500',
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const valueSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex items-center gap-1 text-roman-marble-500 uppercase tracking-wide">
        {icon && <span className="text-lg">{icon}</span>}
        <span className={sizeClasses[size]}>{label}</span>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={clsx('font-roman font-bold', variantColors[variant], valueSizeClasses[size])}>
          {value}
        </span>
        {maxValue !== undefined && (
          <span className="text-roman-marble-500">/ {maxValue}</span>
        )}
        {change !== undefined && change !== 0 && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'text-xs font-medium',
              change > 0 ? 'text-health-high' : 'text-roman-crimson-400'
            )}
          >
            {change > 0 ? '+' : ''}{change}
          </motion.span>
        )}
      </div>

      {showBar && maxValue && typeof value === 'number' && (
        <div className="mt-1 h-1.5 bg-roman-marble-700 rounded-full overflow-hidden">
          <motion.div
            className={clsx('h-full rounded-full', barColors[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${(value / maxValue) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
};

// Stat grid for displaying multiple stats
interface StatGridProps {
  stats: Array<{
    label: string;
    value: number | string;
    icon?: React.ReactNode;
    tooltip?: string;
  }>;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({
  stats,
  columns = 3,
  className,
}) => {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={clsx('grid gap-4', columnClasses[columns], className)}>
      {stats.map((stat, index) => (
        <StatDisplay
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          tooltip={stat.tooltip}
          size="sm"
        />
      ))}
    </div>
  );
};
