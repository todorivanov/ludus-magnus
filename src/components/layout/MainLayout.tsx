import React from 'react';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import type { GameScreen } from '@/types';
import { clsx } from 'clsx';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { currentDay, currentScreen } = useAppSelector(state => state.game);
  const { gold, ludusFame, ludusName } = useAppSelector(state => state.player);

  const navItems: { id: GameScreen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏛️' },
    { id: 'ludus', label: 'Ludus', icon: '🏗️' },
    { id: 'gladiators', label: 'Gladiators', icon: '⚔️' },
    { id: 'training', label: 'Training', icon: '🏋️' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'marketplace', label: 'Market', icon: '🛒' },
    { id: 'arena', label: 'Arena', icon: '🏟️' },
    { id: 'fame', label: 'Fame', icon: '⭐' },
    { id: 'politics', label: 'Politics', icon: '🏛️' },
    { id: 'quests', label: 'Quests', icon: '📜' },
  ];

  const handleNavigate = (screen: GameScreen) => {
    dispatch(setScreen(screen));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-gradient-to-b from-roman-marble-800 to-roman-marble-900 border-b-2 border-roman-gold-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Ludus Name */}
          <div className="flex items-center gap-4">
            <h1 className="font-roman text-2xl text-roman-gold-500 text-shadow-roman">
              {ludusName || 'Ludus Magnus'}
            </h1>
            <div className="text-roman-marble-400 text-sm">
              Day {currentDay}
            </div>
          </div>

          {/* Resources */}
          <div className="flex items-center gap-6">
            {/* Gold */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <span className="font-roman text-roman-gold-400 text-lg">{gold}</span>
            </div>

            {/* Fame */}
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="font-roman text-roman-marble-300 text-lg">{ludusFame}</span>
            </div>

            {/* Settings */}
            <button
              onClick={() => handleNavigate('settings')}
              className="text-roman-marble-400 hover:text-roman-gold-500 transition-colors text-xl"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Side Navigation */}
        <nav className="w-48 bg-roman-marble-900 border-r border-roman-marble-700 py-4">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  className={clsx(
                    'w-full px-4 py-3 flex items-center gap-3 text-left transition-all',
                    'hover:bg-roman-marble-800 hover:border-l-2 hover:border-roman-gold-500',
                    currentScreen === item.id
                      ? 'bg-roman-marble-800 border-l-2 border-roman-gold-500 text-roman-gold-400'
                      : 'text-roman-marble-300 border-l-2 border-transparent'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-roman text-sm uppercase tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
