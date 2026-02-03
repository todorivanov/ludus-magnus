import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'crimson' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-roman font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'btn-roman',
    gold: 'btn-roman-gold',
    crimson: 'btn-roman-crimson',
    ghost: 'bg-transparent border border-roman-marble-600 text-roman-marble-200 hover:bg-roman-marble-800 hover:border-roman-marble-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isLoading && 'opacity-70 cursor-wait',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
