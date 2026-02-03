import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OwnedMerchandise {
  id: string;
  itemId: string;
  purchaseDay: number;
  isActive: boolean;
}

interface ActiveSponsorship {
  id: string;
  dealId: string;
  startDay: number;
  daysRemaining: number;
  dailyPayment: number;
}

interface FameState {
  // Ludus fame (aggregate)
  ludusFame: number;
  
  // Merchandise system
  ownedMerchandise: OwnedMerchandise[];
  totalMerchandiseRevenue: number;
  
  // Sponsorships
  activeSponsorships: ActiveSponsorship[];
  totalSponsorshipRevenue: number;
  
  // Fame modifiers
  fameMultiplier: number;
  
  // History
  fameHistory: { day: number; fame: number; source: string }[];
}

const initialState: FameState = {
  ludusFame: 0,
  ownedMerchandise: [],
  totalMerchandiseRevenue: 0,
  activeSponsorships: [],
  totalSponsorshipRevenue: 0,
  fameMultiplier: 1.0,
  fameHistory: [],
};

const fameSlice = createSlice({
  name: 'fame',
  initialState,
  reducers: {
    // Ludus Fame
    addLudusFame: (state, action: PayloadAction<{ amount: number; source: string; day: number }>) => {
      const adjustedAmount = Math.round(action.payload.amount * state.fameMultiplier);
      state.ludusFame = Math.max(0, state.ludusFame + adjustedAmount);
      state.fameHistory.push({
        day: action.payload.day,
        fame: adjustedAmount,
        source: action.payload.source,
      });
      // Keep only last 100 entries
      if (state.fameHistory.length > 100) {
        state.fameHistory = state.fameHistory.slice(-100);
      }
    },
    setLudusFame: (state, action: PayloadAction<number>) => {
      state.ludusFame = Math.max(0, action.payload);
    },
    
    // Merchandise
    purchaseMerchandise: (state, action: PayloadAction<{ id: string; itemId: string; day: number }>) => {
      state.ownedMerchandise.push({
        id: action.payload.id,
        itemId: action.payload.itemId,
        purchaseDay: action.payload.day,
        isActive: true,
      });
    },
    removeMerchandise: (state, action: PayloadAction<string>) => {
      state.ownedMerchandise = state.ownedMerchandise.filter(m => m.id !== action.payload);
    },
    toggleMerchandise: (state, action: PayloadAction<string>) => {
      const item = state.ownedMerchandise.find(m => m.id === action.payload);
      if (item) {
        item.isActive = !item.isActive;
      }
    },
    setMerchandiseRevenue: (state, action: PayloadAction<number>) => {
      state.totalMerchandiseRevenue = action.payload;
    },
    
    // Sponsorships
    acceptSponsorship: (state, action: PayloadAction<ActiveSponsorship>) => {
      state.activeSponsorships.push(action.payload);
      state.totalSponsorshipRevenue = state.activeSponsorships.reduce(
        (sum, s) => sum + s.dailyPayment, 0
      );
    },
    cancelSponsorship: (state, action: PayloadAction<string>) => {
      state.activeSponsorships = state.activeSponsorships.filter(s => s.id !== action.payload);
      state.totalSponsorshipRevenue = state.activeSponsorships.reduce(
        (sum, s) => sum + s.dailyPayment, 0
      );
    },
    updateSponsorships: (state) => {
      // Called daily to reduce remaining days
      state.activeSponsorships = state.activeSponsorships
        .map(s => ({ ...s, daysRemaining: s.daysRemaining - 1 }))
        .filter(s => s.daysRemaining > 0);
      state.totalSponsorshipRevenue = state.activeSponsorships.reduce(
        (sum, s) => sum + s.dailyPayment, 0
      );
    },
    
    // Fame multiplier
    setFameMultiplier: (state, action: PayloadAction<number>) => {
      state.fameMultiplier = Math.max(0.1, action.payload);
    },
    adjustFameMultiplier: (state, action: PayloadAction<number>) => {
      state.fameMultiplier = Math.max(0.1, state.fameMultiplier + action.payload);
    },
    
    // Reset
    resetFame: () => initialState,
  },
});

export const {
  addLudusFame,
  setLudusFame,
  purchaseMerchandise,
  removeMerchandise,
  toggleMerchandise,
  setMerchandiseRevenue,
  acceptSponsorship,
  cancelSponsorship,
  updateSponsorships,
  setFameMultiplier,
  adjustFameMultiplier,
  resetFame,
} = fameSlice.actions;

// Selectors
export const selectLudusFame = (state: { fame: FameState }) => state.fame.ludusFame;
export const selectOwnedMerchandise = (state: { fame: FameState }) => state.fame.ownedMerchandise;
export const selectActiveMerchandise = (state: { fame: FameState }) => 
  state.fame.ownedMerchandise.filter(m => m.isActive);
export const selectTotalMerchandiseRevenue = (state: { fame: FameState }) => 
  state.fame.totalMerchandiseRevenue;
export const selectActiveSponsorships = (state: { fame: FameState }) => state.fame.activeSponsorships;
export const selectTotalSponsorshipRevenue = (state: { fame: FameState }) => 
  state.fame.totalSponsorshipRevenue;
export const selectFameMultiplier = (state: { fame: FameState }) => state.fame.fameMultiplier;
export const selectFameHistory = (state: { fame: FameState }) => state.fame.fameHistory;

export default fameSlice.reducer;
