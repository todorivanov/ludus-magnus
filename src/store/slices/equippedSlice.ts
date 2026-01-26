import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquippedState } from '@/types/state.types';

const initialState: EquippedState = {
  weapon: null,
  armor: null,
  accessory: null,
};

const equippedSlice = createSlice({
  name: 'equipped',
  initialState,
  reducers: {
    equipItem: (
      state,
      action: PayloadAction<{ slot: keyof EquippedState; itemId: string }>
    ) => {
      state[action.payload.slot] = action.payload.itemId;
    },
    
    unequipItem: (state, action: PayloadAction<keyof EquippedState>) => {
      state[action.payload] = null;
    },
    
    clearEquipped: (state) => {
      state.weapon = null;
      state.armor = null;
      state.accessory = null;
    },
  },
});

export const { equipItem, unequipItem, clearEquipped } = equippedSlice.actions;

export default equippedSlice.reducer;
