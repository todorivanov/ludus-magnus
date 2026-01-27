/**
 * Helper Utilities
 * 
 * Common utility functions used throughout the application
 */

/**
 * Generate unique ID
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Random float between min and max
 */
export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Random element from array
 */
export const randomElement = <T>(array: T[]): T => {
  return array[randomInt(0, array.length - 1)] as T;
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp as T;
  }
  return shuffled;
};

/**
 * Format number with commas
 */
export const formatNumber = (num?: number): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format gold amount
 */
export const formatGold = (amount: number): string => {
  return `${formatNumber(amount)} 🪙`;
};

/**
 * Calculate percentage
 */
export const percentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate win rate
 */
export const calculateWinRate = (wins: number, losses: number): number => {
  const total = wins + losses;
  if (total === 0) return 0;
  return percentage(wins, total);
};

/**
 * Delay/sleep function
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Pluralize word
 */
export const pluralize = (word: string, count: number): string => {
  return count === 1 ? word : `${word}s`;
};

/**
 * Format time duration
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Format timestamp
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate experience required for level
 */
export const getXPRequired = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Calculate level from XP
 */
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  let xpRequired = 0;

  while (xp >= xpRequired) {
    level++;
    xpRequired += getXPRequired(level);
  }

  return level - 1;
};

/**
 * Linear interpolation
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Ease in-out cubic
 */
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Calculate distance between two points
 */
export const distance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Check if two ranges overlap
 */
export const rangesOverlap = (
  min1: number,
  max1: number,
  min2: number,
  max2: number
): boolean => {
  return min1 <= max2 && min2 <= max1;
};
