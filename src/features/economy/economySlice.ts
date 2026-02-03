import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MarketPrices } from '@/types';

interface EconomyState {
  marketPrices: MarketPrices;
  priceHistory: { day: number; prices: MarketPrices }[];
  dailyIncome: number;
  dailyExpenses: number;
  bankruptcyWarning: boolean;
  criticalWarning: boolean;
}

const initialPrices: MarketPrices = {
  grain: 2,
  water: 1,
  wine: 5,
  travertine: 15,
  glass: 8,
  clay: 3,
};

const initialState: EconomyState = {
  marketPrices: initialPrices,
  priceHistory: [],
  dailyIncome: 0,
  dailyExpenses: 0,
  bankruptcyWarning: false,
  criticalWarning: false,
};

const economySlice = createSlice({
  name: 'economy',
  initialState,
  reducers: {
    // Market prices
    setMarketPrices: (state, action: PayloadAction<MarketPrices>) => {
      state.marketPrices = action.payload;
    },
    updatePrice: (state, action: PayloadAction<{ resource: keyof MarketPrices; price: number }>) => {
      state.marketPrices[action.payload.resource] = Math.max(0.5, action.payload.price);
    },
    fluctuatePrices: (state, action: PayloadAction<number>) => {
      // Fluctuate prices by +/- percentage
      const fluctuation = action.payload / 100;
      (Object.keys(state.marketPrices) as (keyof MarketPrices)[]).forEach(resource => {
        const change = (Math.random() * 2 - 1) * fluctuation;
        const basePrice = initialPrices[resource];
        const newPrice = state.marketPrices[resource] * (1 + change);
        // Keep prices within 50% - 200% of base price
        state.marketPrices[resource] = Math.max(
          basePrice * 0.5,
          Math.min(basePrice * 2, newPrice)
        );
      });
    },
    recordPriceHistory: (state, action: PayloadAction<number>) => {
      state.priceHistory.push({
        day: action.payload,
        prices: { ...state.marketPrices },
      });
      // Keep only last 30 days of history
      if (state.priceHistory.length > 30) {
        state.priceHistory.shift();
      }
    },
    
    // Daily tracking
    setDailyIncome: (state, action: PayloadAction<number>) => {
      state.dailyIncome = action.payload;
    },
    setDailyExpenses: (state, action: PayloadAction<number>) => {
      state.dailyExpenses = action.payload;
    },
    addDailyIncome: (state, action: PayloadAction<number>) => {
      state.dailyIncome += action.payload;
    },
    addDailyExpenses: (state, action: PayloadAction<number>) => {
      state.dailyExpenses += action.payload;
    },
    resetDailyTracking: (state) => {
      state.dailyIncome = 0;
      state.dailyExpenses = 0;
    },
    
    // Warnings
    setBankruptcyWarning: (state, action: PayloadAction<boolean>) => {
      state.bankruptcyWarning = action.payload;
    },
    setCriticalWarning: (state, action: PayloadAction<boolean>) => {
      state.criticalWarning = action.payload;
    },
    checkWarnings: (state, action: PayloadAction<number>) => {
      const gold = action.payload;
      state.bankruptcyWarning = gold < 50;
      state.criticalWarning = gold < 20;
    },
    
    // Reset
    resetEconomy: () => initialState,
  },
});

export const {
  setMarketPrices,
  updatePrice,
  fluctuatePrices,
  recordPriceHistory,
  setDailyIncome,
  setDailyExpenses,
  addDailyIncome,
  addDailyExpenses,
  resetDailyTracking,
  setBankruptcyWarning,
  setCriticalWarning,
  checkWarnings,
  resetEconomy,
} = economySlice.actions;

// Selectors
export const selectMarketPrices = (state: { economy: EconomyState }) => state.economy.marketPrices;
export const selectResourcePrice = (state: { economy: EconomyState }, resource: keyof MarketPrices) => 
  state.economy.marketPrices[resource];
export const selectDailyBalance = (state: { economy: EconomyState }) => 
  state.economy.dailyIncome - state.economy.dailyExpenses;
export const selectHasBankruptcyWarning = (state: { economy: EconomyState }) => 
  state.economy.bankruptcyWarning;

export default economySlice.reducer;
