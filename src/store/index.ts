import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import inventoryReducer from './slices/inventorySlice';
import equippedReducer from './slices/equippedSlice';
import statsReducer from './slices/statsSlice';
import storyReducer from './slices/storySlice';
import unlocksReducer from './slices/unlocksSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    inventory: inventoryReducer,
    equipped: equippedReducer,
    stats: statsReducer,
    story: storyReducer,
    unlocks: unlocksReducer,
    settings: settingsReducer,
  },
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
