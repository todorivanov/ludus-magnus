import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'elevated';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  onClick,
  hoverable = false,
}) => {
  const baseStyles = 'rounded-lg p-4';
  
  const variantStyles = {
    default: 'card-roman',
    gold: 'card-roman-gold',
    elevated: 'card-roman shadow-roman-lg',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        hoverable && 'cursor-pointer hover:scale-[1.02] transition-transform',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={clsx('font-roman text-xl text-roman-gold-500', className)}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={clsx('text-roman-marble-200', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={clsx('mt-4 pt-4 border-t border-roman-marble-700', className)}>
    {children}
  </div>
);
