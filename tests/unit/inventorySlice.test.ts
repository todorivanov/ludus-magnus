import inventoryReducer, { addItem, removeItem, clearInventory } from '@/store/slices/inventorySlice';
import { InventoryState } from '@/types/state.types';
import { describe, it, expect } from 'vitest';

describe('inventorySlice', () => {
  const initialState: InventoryState = { equipment: [] };

  it('should handle addItem', () => {
    const nextState = inventoryReducer(initialState, addItem('sword_1'));
    expect(nextState.equipment).toContain('sword_1');
  });

  it('should handle removeItem', () => {
    const state = { equipment: ['sword_1', 'shield_1'] };
    const nextState = inventoryReducer(state, removeItem('sword_1'));
    expect(nextState.equipment).not.toContain('sword_1');
    expect(nextState.equipment).toContain('shield_1');
  });

  it('should do nothing if removeItem not found', () => {
    const state = { equipment: ['sword_1'] };
    const nextState = inventoryReducer(state, removeItem('axe_1'));
    expect(nextState.equipment).toEqual(['sword_1']);
  });

  it('should handle clearInventory', () => {
    const state = { equipment: ['sword_1', 'shield_1'] };
    const nextState = inventoryReducer(state, clearInventory());
    expect(nextState.equipment).toHaveLength(0);
  });
});
