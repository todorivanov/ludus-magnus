import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryState } from '@/types/state.types';

const initialState: InventoryState = {
  equipment: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.equipment.push(action.payload);
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      const index = state.equipment.indexOf(action.payload);
      if (index !== -1) {
        state.equipment.splice(index, 1);
      }
    },
    
    clearInventory: (state) => {
      state.equipment = [];
    },
  },
});

export const { addItem, removeItem, clearInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
