import unlocksReducer, { unlockAchievement } from '@/store/slices/unlocksSlice';
import { UnlocksState } from '@/types/state.types';
import { describe, it, expect } from 'vitest';

describe('unlocksSlice', () => {
  const initialState: UnlocksState = { achievements: [] };

  it('should handle unlockAchievement', () => {
    let state = unlocksReducer(initialState, unlockAchievement('achv_1'));
    expect(state.achievements).toContain('achv_1');
    // Should not add duplicate
    state = unlocksReducer(state, unlockAchievement('achv_1'));
    expect(state.achievements).toEqual(['achv_1']);
  });
});
