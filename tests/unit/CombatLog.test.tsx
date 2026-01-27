
// Mock scrollIntoView for jsdom
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CombatLog, CombatLogEntry } from '@/components/combat/CombatLog';
import { describe, it, expect, beforeAll } from 'vitest';

describe('CombatLog', () => {
  const baseEntries: CombatLogEntry[] = [
    {
      id: '1',
      message: 'Maximus attacks Brutus for 20 damage.',
      type: 'attack',
      timestamp: 123456,
    },
    {
      id: '2',
      message: 'Brutus takes 20 damage.',
      type: 'damage',
      timestamp: 123457,
    },
    {
      id: '3',
      message: 'Maximus uses Healing Potion.',
      type: 'heal',
      timestamp: 123458,
    },
    {
      id: '4',
      message: 'Maximus wins the battle!',
      type: 'victory',
      timestamp: 123459,
    },
  ];

  it('renders the combat log header', () => {
    render(<CombatLog entries={[]} />);
    expect(screen.getByText('📜 Combat Log')).toBeInTheDocument();
  });

  it('shows empty state when no entries', () => {
    render(<CombatLog entries={[]} />);
    expect(screen.getByText('⚔️ Battle will begin soon...')).toBeInTheDocument();
    expect(screen.getByText('Combat events will appear here')).toBeInTheDocument();
  });

  it('renders all log entries with correct icons', () => {
    render(<CombatLog entries={baseEntries} />);
    expect(screen.getByText('⚔️')).toBeInTheDocument(); // attack
    expect(screen.getByText('💥')).toBeInTheDocument(); // damage
    expect(screen.getByText('💚')).toBeInTheDocument(); // heal
    expect(screen.getByText('🏆')).toBeInTheDocument(); // victory
    expect(screen.getByText('Maximus attacks Brutus for 20 damage.')).toBeInTheDocument();
    expect(screen.getByText('Brutus takes 20 damage.')).toBeInTheDocument();
    expect(screen.getByText('Maximus uses Healing Potion.')).toBeInTheDocument();
    expect(screen.getByText('Maximus wins the battle!')).toBeInTheDocument();
  });

  it('shows event count in footer', () => {
    render(<CombatLog entries={baseEntries} />);
    expect(screen.getByText('4 events')).toBeInTheDocument();
  });

  it('shows singular event label for one entry', () => {
    render(<CombatLog entries={[baseEntries[0]!]} />);
    expect(screen.getByText('1 event')).toBeInTheDocument();
  });

  it('applies custom maxHeight', () => {
    render(<CombatLog entries={baseEntries} maxHeight="200px" />);
    const logDiv = screen.getByText('Maximus attacks Brutus for 20 damage.').closest('div');
    expect(logDiv?.parentElement?.style.maxHeight).toBe('200px');
  });
});
