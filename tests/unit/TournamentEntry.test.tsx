import { describe, it, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TournamentEntry } from '@/components/tournament/TournamentEntry';

describe('TournamentEntry', () => {
  const tournament = {
    id: 't1',
    name: 'Test Tournament',
    minLevel: 1,
    entryFee: 100,
    registeredGladiators: [],
    maxParticipants: 8,
  } as any;
  const availableGladiators = [
    { id: 'g1', name: 'Spartacus', level: 5, hp: 100, class: 'WARRIOR' },
    { id: 'g2', name: 'Crixus', level: 2, hp: 0, class: 'BERSERKER' }, // not eligible (hp 0)
  ];
  const onConfirmEntry = vi.fn();
  const onCancel = vi.fn();

  it('renders tournament name and available gladiators', () => {
    render(
      <TournamentEntry
        tournament={tournament}
        availableGladiators={availableGladiators as any}
        currentGold={200}
        onConfirmEntry={onConfirmEntry}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
    expect(screen.getByText('Spartacus')).toBeInTheDocument();
    expect(screen.queryByText('Crixus')).toBeNull();
  });
});
