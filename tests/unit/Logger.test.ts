import { logger, LogCategory, LogLevel } from '@/utils/Logger';
import { describe, it, expect } from 'vitest';

describe('Logger', () => {
  it('should set log level', () => {
    logger.setLevel(LogLevel.DEBUG);
    expect(logger.currentLevel).toBe(LogLevel.DEBUG);
  });

  it('should enable and disable categories', () => {
    logger.enableCategories(LogCategory.AI);
    expect((logger as any).enabledCategories.has(LogCategory.AI)).toBe(true);
    logger.disableCategories(LogCategory.AI);
    expect((logger as any).enabledCategories.has(LogCategory.AI)).toBe(false);
  });

  it('should format log messages', () => {
    const msg = (logger as any).format(LogCategory.UI, 'Test message', { foo: 1 });
    expect(msg).toContain('Test message');
    expect(msg).toContain('foo');
  });

  it('should log performance metrics', () => {
    // Should not throw
    logger.perf('TestOp', 10);
    logger.perf('TestOp', 30);
    logger.perf('TestOp', 100);
  });

  it('should profile a sync function', async () => {
    const result = await logger.profile('SyncTest', () => 42);
    expect(result).toBe(42);
  });

  it('should profile an async function', async () => {
    const result = await logger.profile('AsyncTest', async () => {
      return new Promise((resolve) => setTimeout(() => resolve(99), 10));
    });
    expect(result).toBe(99);
  });

  it('should handle profile errors', async () => {
    await expect(
      logger.profile('ErrorTest', () => { throw new Error('fail'); })
    ).rejects.toThrow('fail');
  });
});
