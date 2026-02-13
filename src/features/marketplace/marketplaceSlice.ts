import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PurchasedItem, ActiveEffect } from '@/types';

interface MarketplaceState {
  purchasedItems: PurchasedItem[];
  activeEffects: ActiveEffect[];
  lastMarketRefreshDay: number;
  itemStock: Record<string, number>; // Track limited stock items
}

const initialState: MarketplaceState = {
  purchasedItems: [],
  activeEffects: [],
  lastMarketRefreshDay: 0,
  itemStock: {},
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    // Purchase an item
    purchaseItem: (state, action: PayloadAction<{
      itemId: string;
      purchaseDay: number;
      quantity?: number;
    }>) => {
      const { itemId, purchaseDay, quantity = 1 } = action.payload;
      
      // Find existing purchase record
      const existing = state.purchasedItems.find(p => p.itemId === itemId);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.purchasedItems.push({
          itemId,
          purchaseDay,
          quantity,
        });
      }
      
      // Update stock if item has limited stock
      if (state.itemStock[itemId] !== undefined) {
        state.itemStock[itemId] = Math.max(0, state.itemStock[itemId] - quantity);
      }
    },
    
    // Initialize item stock
    initializeStock: (state, action: PayloadAction<Record<string, number>>) => {
      state.itemStock = action.payload;
    },
    
    // Refresh market stock
    refreshMarketStock: (state, action: PayloadAction<{ day: number; stock: Record<string, number> }>) => {
      state.lastMarketRefreshDay = action.payload.day;
      state.itemStock = action.payload.stock;
    },
    
    // Apply item effect to a gladiator
    applyItemEffect: (state, action: PayloadAction<{
      id: string;
      itemId: string;
      gladiatorId?: string;
      type: string;
      value: number;
      expiresOnDay?: number;
    }>) => {
      state.activeEffects.push(action.payload);
      
      // Remove one from purchased items
      const purchased = state.purchasedItems.find(p => p.itemId === action.payload.itemId);
      if (purchased) {
        purchased.quantity = Math.max(0, purchased.quantity - 1);
        if (purchased.quantity === 0) {
          state.purchasedItems = state.purchasedItems.filter(p => p.itemId !== action.payload.itemId);
        }
      }
    },
    
    // Apply item to specific gladiator (tracking)
    markItemApplied: (state, action: PayloadAction<{
      itemId: string;
      gladiatorId: string;
    }>) => {
      const purchased = state.purchasedItems.find(p => p.itemId === action.payload.itemId);
      if (purchased) {
        if (!purchased.appliedTo) {
          purchased.appliedTo = [];
        }
        if (!purchased.appliedTo.includes(action.payload.gladiatorId)) {
          purchased.appliedTo.push(action.payload.gladiatorId);
        }
      }
    },
    
    // Remove expired effects
    removeExpiredEffects: (state, action: PayloadAction<number>) => {
      const currentDay = action.payload;
      state.activeEffects = state.activeEffects.filter(
        effect => !effect.expiresOnDay || effect.expiresOnDay > currentDay
      );
    },
    
    // Remove specific effect
    removeEffect: (state, action: PayloadAction<string>) => {
      state.activeEffects = state.activeEffects.filter(
        effect => effect.id !== action.payload
      );
    },
    
    // Clear all expired effects and purchased items with 0 quantity
    cleanupMarketplace: (state) => {
      state.purchasedItems = state.purchasedItems.filter(p => p.quantity > 0);
    },
    
    // Reset marketplace
    resetMarketplace: () => initialState,
  },
});

export const {
  purchaseItem,
  initializeStock,
  refreshMarketStock,
  applyItemEffect,
  markItemApplied,
  removeExpiredEffects,
  removeEffect,
  cleanupMarketplace,
  resetMarketplace,
} = marketplaceSlice.actions;

// Selectors
export const selectPurchasedItems = (state: { marketplace: MarketplaceState }) => 
  state.marketplace.purchasedItems;

export const selectActiveEffects = (state: { marketplace: MarketplaceState }) => 
  state.marketplace.activeEffects;

export const selectItemStock = (state: { marketplace: MarketplaceState }) => 
  state.marketplace.itemStock;

export const selectGladiatorEffects = (state: { marketplace: MarketplaceState }, gladiatorId: string) => 
  state.marketplace.activeEffects.filter(effect => effect.gladiatorId === gladiatorId);

export const selectItemQuantity = (state: { marketplace: MarketplaceState }, itemId: string) => {
  const purchased = state.marketplace.purchasedItems.find(p => p.itemId === itemId);
  return purchased?.quantity || 0;
};

export default marketplaceSlice.reducer;
