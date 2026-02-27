import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import gameReducer from '@features/game/gameSlice';
import playerReducer from '@features/player/playerSlice';
import gladiatorsReducer from '@features/gladiators/gladiatorsSlice';
import ludusReducer from '@features/ludus/ludusSlice';
import staffReducer from '@features/staff/staffSlice';
import economyReducer from '@features/economy/economySlice';
import combatReducer from '@features/combat/combatSlice';
import fameReducer from '@features/fame/fameSlice';
import factionsReducer from '@features/factions/factionsSlice';
import questsReducer from '@features/quests/questsSlice';
import tournamentsReducer from '@features/tournaments/tournamentsSlice';
import marketplaceReducer from '@features/marketplace/marketplaceSlice';

// Combine all reducers
const rootReducer = combineReducers({
  game: gameReducer,
  player: playerReducer,
  gladiators: gladiatorsReducer,
  ludus: ludusReducer,
  staff: staffReducer,
  economy: economyReducer,
  combat: combatReducer,
  fame: fameReducer,
  factions: factionsReducer,
  quests: questsReducer,
  tournaments: tournamentsReducer,
  marketplace: marketplaceReducer,
});

// Migration function for converting old day-based saves to month-based
const migrations = {
  // Migration from version 1 (day-based) to version 2 (month-based)
  2: (state: any) => {
    if (state.game && state.game.currentDay !== undefined && !state.game.currentYear) {
      // Convert currentDay to year/month
      const currentDay = state.game.currentDay || 1;
      const totalMonths = currentDay; // Each "day" in the new system is actually a month
      const currentYear = 73 + Math.floor((totalMonths - 1) / 12);
      const currentMonth = ((totalMonths - 1) % 12) + 1;
      
      return {
        ...state,
        game: {
          ...state.game,
          currentYear,
          currentMonth,
          totalMonthsPlayed: state.game.totalDaysPlayed || 0,
          lastMonthReport: null,
          showMonthReport: false,
          monthProcessing: false,
        },
      };
    }
    return state;
  },
};

// Persist configuration
const persistConfig = {
  key: 'ludus-magnus-reborn',
  version: 2, // Incremented version for migration
  storage,
  whitelist: ['game', 'player', 'gladiators', 'ludus', 'staff', 'economy', 'fame', 'factions', 'quests', 'tournaments', 'marketplace'],
  blacklist: ['combat'], // Don't persist combat state
  migrate: (state: any, version: number) => {
    // Run migrations sequentially
    let migratedState = state;
    for (let v = version + 1; v <= 2; v++) {
      if (migrations[v as keyof typeof migrations]) {
        migratedState = migrations[v as keyof typeof migrations](migratedState);
      }
    }
    return Promise.resolve(migratedState);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
