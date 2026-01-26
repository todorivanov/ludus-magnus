import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatsState } from '@/types/state.types';

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

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (
      state,
      action: PayloadAction<{ stat: keyof StatsState; amount?: number }>
    ) => {
      const { stat, amount = 1 } = action.payload;
      (state[stat]) += amount;
    },
    
    updateStreak: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        // Win
        state.winStreak += 1;
        state.bestStreak = Math.max(state.bestStreak, state.winStreak);
      } else {
        // Loss
        state.winStreak = 0;
      }
    },
    
    resetStats: () => initialState,
  },
});

export const { incrementStat, updateStreak, resetStats } = statsSlice.actions;

export default statsSlice.reducer;
