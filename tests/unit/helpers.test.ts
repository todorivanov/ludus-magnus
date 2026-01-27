import * as helpers from '@/utils/helpers';
import { describe, it, expect, vi } from 'vitest';

describe('helpers', () => {
  it('generateId returns unique string', () => {
    const id1 = helpers.generateId('foo');
    const id2 = helpers.generateId('foo');
    expect(id1).not.toBe(id2);
    expect(id1).toContain('foo');
  });

  it('clamp clamps values', () => {
    expect(helpers.clamp(5, 1, 10)).toBe(5);
    expect(helpers.clamp(-1, 0, 10)).toBe(0);
    expect(helpers.clamp(20, 0, 10)).toBe(10);
  });

  it('randomInt returns value in range', () => {
    for (let i = 0; i < 10; i++) {
      const val = helpers.randomInt(1, 3);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(3);
    }
  });

  it('randomFloat returns value in range', () => {
    for (let i = 0; i < 10; i++) {
      const val = helpers.randomFloat(1, 2);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThan(2);
    }
  });

  it('randomElement returns element from array', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(helpers.randomElement(arr));
  });

  it('shuffle returns array of same length', () => {
    const arr = [1, 2, 3, 4];
    const shuffled = helpers.shuffle(arr);
    expect(shuffled).toHaveLength(arr.length);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('formatNumber and formatGold', () => {
    expect(helpers.formatNumber(1000)).toBe('1,000');
    expect(helpers.formatGold(1000)).toContain('1,000');
  });

  it('percentage and formatPercentage', () => {
    expect(helpers.percentage(2, 4)).toBe(50);
    expect(helpers.formatPercentage(12.3456, 2)).toBe('12.35%');
  });

  it('calculateWinRate', () => {
    expect(helpers.calculateWinRate(2, 2)).toBe(50);
    expect(helpers.calculateWinRate(0, 0)).toBe(0);
  });

  it('delay resolves after ms', async () => {
    const start = Date.now();
    await helpers.delay(10);
    expect(Date.now() - start).toBeGreaterThanOrEqual(10);
  });

  it('debounce and throttle do not throw', () => {
    const fn = vi.fn();
    const debounced = helpers.debounce(fn, 5);
    debounced();
    const throttled = helpers.throttle(fn, 5);
    throttled();
  });

  it('deepClone clones object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clone = helpers.deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
  });

  it('isEmpty returns true for empty object', () => {
    expect(helpers.isEmpty({})).toBe(true);
    expect(helpers.isEmpty({ a: 1 })).toBe(false);
  });

  it('capitalize and pluralize', () => {
    expect(helpers.capitalize('foo')).toBe('Foo');
    expect(helpers.pluralize('cat', 2)).toBe('cats');
    expect(helpers.pluralize('cat', 1)).toBe('cat');
  });

  it('formatDuration returns string', () => {
    expect(typeof helpers.formatDuration(1000)).toBe('string');
  });

  it('formatTimestamp returns string', () => {
    expect(typeof helpers.formatTimestamp(Date.now())).toBe('string');
  });

  it('getXPRequired and getLevelFromXP', () => {
    expect(helpers.getXPRequired(2)).toBeGreaterThan(0);
    expect(helpers.getLevelFromXP(0)).toBe(1);
  });

  it('lerp and easeInOutCubic', () => {
    expect(helpers.lerp(0, 10, 0.5)).toBe(5);
    expect(helpers.easeInOutCubic(0)).toBe(0);
    expect(helpers.easeInOutCubic(1)).toBe(1);
  });

  it('distance returns correct value', () => {
    expect(helpers.distance(0, 0, 3, 4)).toBe(5);
  });

  it('rangesOverlap returns correct value', () => {
    expect(helpers.rangesOverlap(1, 5, 4, 8)).toBe(true);
    expect(helpers.rangesOverlap(1, 2, 3, 4)).toBe(false);
  });
});
