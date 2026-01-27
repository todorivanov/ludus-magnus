import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TournamentBrowser } from '@/components/tournament/TournamentBrowser';

describe('TournamentBrowser', () => {
  const tournaments = [
    { id: 't1', name: 'Rookie Cup', status: 'registration_open', maxParticipants: 8, registeredGladiators: [], minLevel: 1, entryFee: 100 },
    { id: 't2', name: 'Champion Gauntlet', status: 'completed', maxParticipants: 8, registeredGladiators: [], minLevel: 5, entryFee: 500 },
  ];
  const onSelectTournament = vi.fn();
  const onRegister = vi.fn();

  it('renders tournament names and filters', () => {
    render(
      <TournamentBrowser
        tournaments={tournaments as any}
        onSelectTournament={onSelectTournament}
        onRegister={onRegister}
        playerLevel={5}
        currentGold={1000}
      />
    );
    expect(screen.getByText('Rookie Cup')).toBeInTheDocument();
    // Show all tournaments by clicking the 'All' status filter button
    fireEvent.click(screen.getAllByText('All')[1]!); // Second 'All' is status filter
    expect(screen.getByText('Champion Gauntlet')).toBeInTheDocument();
    expect(screen.getByText('\u2b50 Easy')).toBeInTheDocument();
  });
});
