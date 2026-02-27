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
import loansReducer from '@features/loans/loansSlice';

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
  loans: loansReducer,
});

// Persist configuration
const persistConfig = {
  key: 'ludus-magnus-reborn',
  version: 1,
  storage,
  whitelist: ['game', 'player', 'gladiators', 'ludus', 'staff', 'economy', 'fame', 'factions', 'quests', 'tournaments', 'marketplace', 'loans'],
  blacklist: ['combat'], // Don't persist combat state
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
