import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MerchandiseItem {
  id: string;
  type: 'glassCups' | 'figurines' | 'athleteOil' | 'betting';
  gladiatorId: string;
  dailyRevenue: number;
  isActive: boolean;
}

interface FameState {
  // Individual gladiator fame is stored in gladiatorsSlice
  // This slice handles fame-related systems
  merchandise: MerchandiseItem[];
  totalMerchandiseRevenue: number;
  fameMultiplier: number;  // From Bard and other bonuses
}

const initialState: FameState = {
  merchandise: [],
  totalMerchandiseRevenue: 0,
  fameMultiplier: 1.0,
};

const fameSlice = createSlice({
  name: 'fame',
  initialState,
  reducers: {
    // Merchandise
    addMerchandise: (state, action: PayloadAction<MerchandiseItem>) => {
      state.merchandise.push(action.payload);
      state.totalMerchandiseRevenue = state.merchandise
        .filter(m => m.isActive)
        .reduce((sum, m) => sum + m.dailyRevenue, 0);
    },
    removeMerchandise: (state, action: PayloadAction<string>) => {
      state.merchandise = state.merchandise.filter(m => m.id !== action.payload);
      state.totalMerchandiseRevenue = state.merchandise
        .filter(m => m.isActive)
        .reduce((sum, m) => sum + m.dailyRevenue, 0);
    },
    toggleMerchandise: (state, action: PayloadAction<string>) => {
      const item = state.merchandise.find(m => m.id === action.payload);
      if (item) {
        item.isActive = !item.isActive;
        state.totalMerchandiseRevenue = state.merchandise
          .filter(m => m.isActive)
          .reduce((sum, m) => sum + m.dailyRevenue, 0);
      }
    },
    updateMerchandiseRevenue: (state, action: PayloadAction<{ id: string; revenue: number }>) => {
      const item = state.merchandise.find(m => m.id === action.payload.id);
      if (item) {
        item.dailyRevenue = action.payload.revenue;
        state.totalMerchandiseRevenue = state.merchandise
          .filter(m => m.isActive)
          .reduce((sum, m) => sum + m.dailyRevenue, 0);
      }
    },
    
    // Fame multiplier
    setFameMultiplier: (state, action: PayloadAction<number>) => {
      state.fameMultiplier = Math.max(0.1, action.payload);
    },
    adjustFameMultiplier: (state, action: PayloadAction<number>) => {
      state.fameMultiplier = Math.max(0.1, state.fameMultiplier + action.payload);
    },
    
    // Recalculate total revenue
    recalculateRevenue: (state) => {
      state.totalMerchandiseRevenue = state.merchandise
        .filter(m => m.isActive)
        .reduce((sum, m) => sum + m.dailyRevenue, 0);
    },
    
    // Reset
    resetFame: () => initialState,
  },
});

export const {
  addMerchandise,
  removeMerchandise,
  toggleMerchandise,
  updateMerchandiseRevenue,
  setFameMultiplier,
  adjustFameMultiplier,
  recalculateRevenue,
  resetFame,
} = fameSlice.actions;

// Selectors
export const selectMerchandise = (state: { fame: FameState }) => state.fame.merchandise;
export const selectActiveMerchandise = (state: { fame: FameState }) => 
  state.fame.merchandise.filter(m => m.isActive);
export const selectTotalMerchandiseRevenue = (state: { fame: FameState }) => 
  state.fame.totalMerchandiseRevenue;
export const selectFameMultiplier = (state: { fame: FameState }) => state.fame.fameMultiplier;

export default fameSlice.reducer;
