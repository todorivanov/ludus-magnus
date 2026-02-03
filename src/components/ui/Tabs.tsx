import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  }, [onChange]);

  const baseClasses = 'relative flex items-center gap-2 px-4 py-2 font-roman text-sm uppercase tracking-wider transition-all duration-200';

  const variantClasses = {
    default: {
      container: 'flex gap-1 p-1 bg-roman-marble-800 rounded-lg border border-roman-marble-700',
      tab: 'rounded',
      active: 'bg-roman-bronze-600 text-roman-marble-100',
      inactive: 'text-roman-marble-400 hover:text-roman-marble-200 hover:bg-roman-marble-700',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'rounded-full',
      active: 'bg-roman-gold-600 text-roman-marble-900',
      inactive: 'bg-roman-marble-800 text-roman-marble-400 hover:bg-roman-marble-700 hover:text-roman-marble-200',
    },
    underline: {
      container: 'flex border-b border-roman-marble-700',
      tab: '',
      active: 'text-roman-gold-400 border-b-2 border-roman-gold-400 -mb-px',
      inactive: 'text-roman-marble-400 hover:text-roman-marble-200',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={clsx(styles.container, className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          disabled={tab.disabled}
          className={clsx(
            baseClasses,
            styles.tab,
            activeTab === tab.id ? styles.active : styles.inactive,
            tab.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={clsx(
              'ml-1 px-1.5 py-0.5 text-xs rounded-full',
              activeTab === tab.id 
                ? 'bg-white/20 text-current' 
                : 'bg-roman-marble-600 text-roman-marble-300'
            )}>
              {tab.badge}
            </span>
          )}
          {activeTab === tab.id && variant === 'default' && (
            <motion.div
              layoutId="activeTabBg"
              className="absolute inset-0 bg-roman-bronze-600 rounded -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className,
}) => {
  if (id !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
