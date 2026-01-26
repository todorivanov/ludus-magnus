import { configureStore, combineReducers } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import inventoryReducer from './slices/inventorySlice';
import equippedReducer from './slices/equippedSlice';
import statsReducer from './slices/statsSlice';
import storyReducer from './slices/storySlice';
import unlocksReducer from './slices/unlocksSlice';
import settingsReducer from './slices/settingsSlice';
import { saveManager } from '@utils/SaveManager';

// Define the root reducer
const rootReducer = combineReducers({
  player: playerReducer,
  inventory: inventoryReducer,
  equipped: equippedReducer,
  stats: statsReducer,
  story: storyReducer,
  unlocks: unlocksReducer,
  settings: settingsReducer,
});

// Infer the `RootState` type from the root reducer BEFORE creating the store
export type RootState = ReturnType<typeof rootReducer>;

// Load saved state if available
const loadSavedState = (): RootState | undefined => {
  const saveData = saveManager.load();
  if (!saveData) return undefined;
  return saveData.state;
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadSavedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['player/createCharacter'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Auto-save every 30 seconds
let autoSaveInterval: number | null = null;

export const startAutoSave = () => {
  if (autoSaveInterval) return; // Already started

  autoSaveInterval = window.setInterval(() => {
    const state = store.getState();
    
    // Only auto-save if character is created
    if (state.player.characterCreated) {
      saveManager.save(state);
    }
  }, 30000); // 30 seconds

  console.log('🔄 Auto-save started (every 30 seconds)');
};

export const stopAutoSave = () => {
  if (autoSaveInterval) {
    window.clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log('⏸️ Auto-save stopped');
  }
};

// Manual save function
export const saveGame = () => {
  const state = store.getState();
  return saveManager.save(state);
};

// Export types
export type AppDispatch = typeof store.dispatch;
