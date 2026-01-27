import equippedReducer, { equipItem, unequipItem, clearEquipped } from '@/store/slices/equippedSlice';
import { EquippedState } from '@/types/state.types';
import { describe, it, expect } from 'vitest';

describe('equippedSlice', () => {
  const initialState: EquippedState = { weapon: null, armor: null, accessory: null };

  it('should handle equipItem', () => {
    let state = equippedReducer(initialState, equipItem({ slot: 'weapon', itemId: 'sword_1' }));
    expect(state.weapon).toBe('sword_1');
    state = equippedReducer(state, equipItem({ slot: 'armor', itemId: 'armor_1' }));
    expect(state.armor).toBe('armor_1');
  });

  it('should handle unequipItem', () => {
    const state = { weapon: 'sword_1', armor: 'armor_1', accessory: 'ring_1' };
    const nextState = equippedReducer(state, unequipItem('armor'));
    expect(nextState.armor).toBeNull();
    expect(nextState.weapon).toBe('sword_1');
    expect(nextState.accessory).toBe('ring_1');
  });

  it('should handle clearEquipped', () => {
    const state = { weapon: 'sword_1', armor: 'armor_1', accessory: 'ring_1' };
    const nextState = equippedReducer(state, clearEquipped());
    expect(nextState.weapon).toBeNull();
    expect(nextState.armor).toBeNull();
    expect(nextState.accessory).toBeNull();
  });
});
