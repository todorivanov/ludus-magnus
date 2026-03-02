import React from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import { formatGameDate } from '@features/game/gameSlice';
import type { GameScreen } from '@/types';
import { clsx } from 'clsx';

const NAV_ITEMS: { screen: GameScreen; label: string; icon: string }[] = [
  { screen: 'gladiatorDashboard', label: 'Cell', icon: '🏠' },
  { screen: 'gladiatorTraining', label: 'Training', icon: '⚔️' },
  { screen: 'gladiatorLudusLife', label: 'Ludus', icon: '👥' },
  { screen: 'gladiatorArena', label: 'Arena', icon: '🏟️' },
  { screen: 'gladiatorFreedom', label: 'Freedom', icon: '🕊️' },
  { screen: 'gladiatorPeculium', label: 'Peculium', icon: '💰' },
  { screen: 'codex', label: 'Codex', icon: '📖' },
  { screen: 'settings', label: 'Settings', icon: '⚙️' },
];

export const GladiatorNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector(state => state.game.currentScreen);
  const year = useAppSelector(state => state.game.currentYear);
  const month = useAppSelector(state => state.game.currentMonth);
  const playerName = useAppSelector(state => state.gladiatorMode?.playerGladiator?.name || 'Gladiator');
  const peculium = useAppSelector(state => state.gladiatorMode?.peculium || 0);
  const libertas = useAppSelector(state => state.gladiatorMode?.freedom?.totalLibertas || 0);

  return (
    <nav className="bg-roman-marble-800 border-b border-roman-marble-600 px-4 py-2">
      <div className="mx-auto flex items-center justify-between">
        {/* Left: player info */}
        <div className="flex items-center gap-4">
          <div className="font-roman text-roman-gold-500 text-sm">
            {playerName}
          </div>
          <div className="text-xs text-roman-marble-400">
            {formatGameDate(year, month)}
          </div>
        </div>

        {/* Center: navigation */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.screen}
              onClick={() => dispatch(setScreen(item.screen))}
              className={clsx(
                'px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1',
                currentScreen === item.screen
                  ? 'bg-roman-gold-500/20 text-roman-gold-400'
                  : 'text-roman-marble-400 hover:text-roman-marble-200 hover:bg-roman-marble-700'
              )}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: key stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-roman-gold-400">
            <span className="text-roman-marble-500">Peculium:</span> {peculium}g
          </div>
          <div className="text-roman-gold-400">
            <span className="text-roman-marble-500">Libertas:</span> {libertas}/1000
          </div>
        </div>
      </div>
    </nav>
  );
};
