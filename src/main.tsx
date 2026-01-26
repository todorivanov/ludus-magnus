import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store, startAutoSave } from './store';
import './styles/index.css';

// Start auto-save after store is loaded
// Only starts if character is created
const state = store.getState();
if (state.player.characterCreated) {
  startAutoSave();
  console.log('✅ Game loaded from save');
}

// Save on page unload
window.addEventListener('beforeunload', () => {
  const currentState = store.getState();
  if (currentState.player.characterCreated) {
    // Import at runtime to avoid circular dependency
    import('./utils/SaveManager').then(({ saveManager }) => {
      saveManager.save(currentState);
      console.log('💾 Game saved on exit');
    });
  }
});

// Expose store for debugging in development
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (window as any).__GAME_STORE__ = store;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (window as any).__GAME_STATE__ = () => store.getState();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>

);
