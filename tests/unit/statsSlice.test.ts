import statsReducer, { incrementStat, updateStreak, resetStats } from '@/store/slices/statsSlice';
import { StatsState } from '@/types/state.types';
import { describe, it, expect } from 'vitest';

describe('statsSlice', () => {
  const initialState: StatsState = {
    totalWins: 0,
    totalLosses: 0,
    totalFightsPlayed: 0,
    winStreak: 0,
    bestStreak: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    criticalHits: 0,
    skillsUsed: 0,
    itemsUsed: 0,
    itemsSold: 0,
    itemsPurchased: 0,
    itemsRepaired: 0,
    goldFromSales: 0,
    legendaryPurchases: 0,
  };

  it('should handle incrementStat', () => {
    let state = statsReducer(initialState, incrementStat({ stat: 'totalWins' }));
    expect(state.totalWins).toBe(1);
    state = statsReducer(state, incrementStat({ stat: 'totalWins', amount: 2 }));
    expect(state.totalWins).toBe(3);
  });

  it('should handle updateStreak for win', () => {
    let state = { ...initialState, winStreak: 2, bestStreak: 2 };
    state = statsReducer(state, updateStreak(true));
    expect(state.winStreak).toBe(3);
    expect(state.bestStreak).toBe(3);
  });

  it('should handle updateStreak for loss', () => {
    let state = { ...initialState, winStreak: 2, bestStreak: 5 };
    state = statsReducer(state, updateStreak(false));
    expect(state.winStreak).toBe(0);
    expect(state.bestStreak).toBe(5);
  });

  it('should handle resetStats', () => {
    let state = { ...initialState, totalWins: 10 };
    state = statsReducer(state, resetStats());
    expect(state).toEqual(initialState);
  });
});
