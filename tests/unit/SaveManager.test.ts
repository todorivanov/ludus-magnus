import { SaveManager } from '@/utils/SaveManager';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SaveManager', () => {
  let saveManager: SaveManager;
  const mockState = { foo: 'bar' };
  beforeEach(() => {
    saveManager = SaveManager.getInstance();
    localStorage.clear();
  });

  it('should save and load state', () => {
    expect(saveManager.save(mockState)).toBe(true);
    const loaded = saveManager.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.state).toEqual(mockState);
  });

  it('should return null if no save exists', () => {
    expect(saveManager.load()).toBeNull();
  });

  it('should delete save', () => {
    saveManager.save(mockState);
    expect(saveManager.deleteSave()).toBe(true);
    expect(saveManager.load()).toBeNull();
  });

  it('should check if save exists', () => {
    expect(saveManager.hasSave()).toBe(false);
    saveManager.save(mockState);
    expect(saveManager.hasSave()).toBe(true);
  });

  it('should get save info', () => {
    saveManager.save(mockState);
    const info = saveManager.getSaveInfo();
    expect(info).not.toBeNull();
    expect(typeof info?.version).toBe('string');
    expect(typeof info?.timestamp).toBe('number');
  });
});
