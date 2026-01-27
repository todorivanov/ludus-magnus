import React from 'react';
import { render, screen } from '@testing-library/react';
import { TournamentBracket } from '@/components/tournament/TournamentBracket';
import { describe, it, expect, vi } from 'vitest';

describe('TournamentBracket', () => {
  const bracket = {
    rounds: [
      {
        roundNumber: 1,
        matches: [
          { id: 'm1', fighter1Id: 'f1', fighter2Id: 'f2', winnerId: null },
          { id: 'm2', fighter1Id: 'f3', fighter2Id: null, winnerId: null },
        ],
      },
      {
        roundNumber: 2,
        matches: [
          { id: 'm3', fighter1Id: null, fighter2Id: null, winnerId: null },
        ],
      },
    ],
  } as any;
  const onSelectMatch = vi.fn();

  it('renders bracket header and round count', () => {
    render(
      <TournamentBracket
        bracket={bracket}
        onSelectMatch={onSelectMatch}
      />
    );
    expect(screen.getByText('🏆 Tournament Bracket')).toBeInTheDocument();
    expect(screen.getByText('2 rounds • 4 fighters')).toBeInTheDocument();
  });
});
