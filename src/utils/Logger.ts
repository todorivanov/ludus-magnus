/**
 * Logger Utility
 * 
 * Centralized logging system with categorization and levels
 */

export enum LogCategory {
  SYSTEM = 'SYSTEM',
  COMBAT = 'COMBAT',
  UI = 'UI',
  STORE = 'STORE',
  ROUTER = 'ROUTER',
  AI = 'AI',
  PERFORMANCE = 'PERFORMANCE',
  LUDUS = 'LUDUS',
  TOURNAMENT = 'TOURNAMENT',
  FACILITY = 'FACILITY',
  ERROR = 'ERROR',
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private currentLevel: LogLevel = LogLevel.INFO;
  private enabledCategories: Set<LogCategory> = new Set(Object.values(LogCategory));
  private isDevelopment = import.meta.env.DEV;

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Enable specific categories
   */
  enableCategories(...categories: LogCategory[]): void {
    categories.forEach((cat) => this.enabledCategories.add(cat));
  }

  /**
   * Disable specific categories
   */
  disableCategories(...categories: LogCategory[]): void {
    categories.forEach((cat) => this.enabledCategories.delete(cat));
  }

  /**
   * Check if should log
   */
  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    return (
      this.isDevelopment &&
      level >= this.currentLevel &&
      this.enabledCategories.has(category)
    );
  }

  /**
   * Format log message
   */
  private format(category: LogCategory, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString().split('T')[1]?.slice(0, -1) || '';
    let formatted = `[${timestamp}] [${category}] ${message}`;
    
    if (data !== undefined) {
      formatted += ` ${JSON.stringify(data, null, 2)}`;
    }
    
    return formatted;
  }

  /**
   * Debug log
   */
  debug(category: LogCategory, message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG, category)) {
      // eslint-disable-next-line no-console
      console.debug(this.format(category, message, data));
    }
  }

  /**
   * Info log
   */
  info(category: LogCategory, message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO, category)) {
      // eslint-disable-next-line no-console
      console.info(this.format(category, message, data));
    }
  }

  /**
   * Warning log
   */
  warn(category: LogCategory, message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN, category)) {
      // eslint-disable-next-line no-console
      console.warn(this.format(category, message, data));
    }
  }

  /**
   * Error log
   */
  error(category: LogCategory, message: string, error?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR, category)) {
      // eslint-disable-next-line no-console
      console.error(this.format(category, message));
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  /**
   * Log performance metrics
   */
  perf(operation: string, duration: number): void {
    if (this.shouldLog(LogLevel.INFO, LogCategory.PERFORMANCE)) {
      const color = duration < 16 ? 'green' : duration < 50 ? 'yellow' : 'red';
      // eslint-disable-next-line no-console
      console.log(
        `%c[PERF] ${operation}: ${duration.toFixed(2)}ms`,
        `color: ${color}; font-weight: bold;`
      );
    }
  }

  /**
   * Profile function execution
   */
  async profile<T>(operation: string, fn: () => T | Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.perf(operation, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(LogCategory.PERFORMANCE, `${operation} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();
