import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileScreen from '@/components/screens/ProfileScreen';

import { describe, expect, it, vi } from 'vitest';
vi.mock('react-router-dom', async () => ({
  ...((await import('react-router-dom'))),
  useNavigate: () => vi.fn(),
}));
vi.mock('@hooks/useAppSelector', () => {
  const player = {
    name: 'Maximus',
    class: 'Warrior',
    level: 5,
    xp: 100,
    gold: 500,
    storyPath: 'gladiator',
    origin: 'thracian_veteran',
    pathSelected: true,
    characterCreated: true,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    talents: { tree1: [], tree2: [], tree3: [] },
    talentPoints: 0,
  };
  const stats = {
    totalWins: 10,
    totalLosses: 5,
    totalFightsPlayed: 15,
    winStreak: 2,
    bestStreak: 3,
    totalDamageDealt: 1000,
    totalDamageTaken: 800,
    criticalHits: 7,
    skillsUsed: 0,
    itemsUsed: 0,
    itemsSold: 0,
    itemsPurchased: 0,
    itemsRepaired: 0,
    goldFromSales: 0,
    legendaryPurchases: 0,
  };
  return {
    useAppSelector: (selector: any) => {
      // Simulate selector(state) for state.player or state.stats
      if (typeof selector === 'function') {
        const fakeState = { player, stats };
        return selector(fakeState);
      }
      return undefined;
    },
  };
});
vi.mock('@utils/SaveManager', () => ({
  saveManager: {
    getSaveInfo: () => ({ version: '1.0.0', timestamp: Date.now() }),
    hasSave: () => true,
    deleteSave: () => true,
    exportSave: () => true,
    importSave: () => true,
  },
}));
vi.mock('@/store', () => ({ saveGame: () => true }));

describe('ProfileScreen', () => {
  it('renders player info and stats', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Maximus')).toBeInTheDocument();
    expect(screen.getByText('Warrior')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('XP')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    // There are multiple '10' and '5' elements (e.g., in stats and save info), so use getAllByText
    const wins = screen.getAllByText('10');
    expect(wins.length).toBeGreaterThanOrEqual(1);
    const losses = screen.getAllByText('5');
    expect(losses.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('15')).toBeInTheDocument(); // totalFightsPlayed
  });

  it('renders path and origin names', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('⚔️ The Gladiator - Chain Breaker')).toBeInTheDocument();
    expect(screen.getByText('The Thracian Veteran (Soldier)')).toBeInTheDocument();
  });

  it('calls saveGame on save button click', () => {
    render(<ProfileScreen />);
    fireEvent.click(screen.getByText('💾 Save Game'));
    expect(screen.getByText('✅ Game saved!')).toBeInTheDocument();
  });
});
