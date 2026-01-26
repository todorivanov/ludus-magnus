import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import './styles/index.css';

// Load saved game state on startup (will be implemented in store)
// const saveData = SaveManagerV2.load();
// if (saveData) {
//   store.dispatch(loadGameState(saveData));
// }

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
