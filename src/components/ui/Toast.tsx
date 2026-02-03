import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'gold';
  title: string;
  message?: string;
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  icon,
  onDismiss,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const typeStyles = {
    success: {
      bg: 'bg-health-high/20 border-health-high',
      icon: '✓',
      iconColor: 'text-health-high',
    },
    error: {
      bg: 'bg-roman-crimson-600/20 border-roman-crimson-600',
      icon: '✕',
      iconColor: 'text-roman-crimson-400',
    },
    warning: {
      bg: 'bg-orange-500/20 border-orange-500',
      icon: '⚠',
      iconColor: 'text-orange-400',
    },
    info: {
      bg: 'bg-blue-500/20 border-blue-500',
      icon: 'ℹ',
      iconColor: 'text-blue-400',
    },
    gold: {
      bg: 'bg-roman-gold-600/20 border-roman-gold-600',
      icon: '★',
      iconColor: 'text-roman-gold-400',
    },
  };

  const styles = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm',
        'shadow-roman-lg min-w-[300px] max-w-[400px]',
        styles.bg
      )}
    >
      <span className={clsx('text-xl flex-shrink-0', styles.iconColor)}>
        {icon || styles.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-roman text-roman-marble-100">{title}</div>
        {message && (
          <div className="text-sm text-roman-marble-400 mt-1">{message}</div>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-roman-marble-500 hover:text-roman-marble-200 transition-colors"
      >
        ✕
      </button>
    </motion.div>
  );
};

// Toast Container and Context
interface ToastContextValue {
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Quick toast helpers
export const toast = {
  success: (title: string, message?: string) => ({ type: 'success' as const, title, message }),
  error: (title: string, message?: string) => ({ type: 'error' as const, title, message }),
  warning: (title: string, message?: string) => ({ type: 'warning' as const, title, message }),
  info: (title: string, message?: string) => ({ type: 'info' as const, title, message }),
  gold: (title: string, message?: string) => ({ type: 'gold' as const, title, message }),
};
