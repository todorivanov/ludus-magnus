import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RosterManagement } from '@/components/ludus/RosterManagement';

describe('RosterManagement', () => {
  const gladiators = [
    { id: '1', name: 'Spartacus', class: 'WARRIOR', level: 5 },
    { id: '2', name: 'Crixus', class: 'BERSERKER', level: 4 },
  ];
  const onRecruitGladiator = vi.fn();
  const onTrainGladiator = vi.fn();
  const onReleaseGladiator = vi.fn();
  const onSelectGladiator = vi.fn();

  it('renders gladiator names and stats', () => {
    render(
      <RosterManagement
        gladiators={gladiators as any}
        maxCapacity={5}
        onRecruitGladiator={onRecruitGladiator}
        onTrainGladiator={onTrainGladiator}
        onReleaseGladiator={onReleaseGladiator}
        onSelectGladiator={onSelectGladiator}
        currentGold={1000}
      />
    );
    expect(screen.getByText('Spartacus')).toBeInTheDocument();
    expect(screen.getByText('Crixus')).toBeInTheDocument();
  });

  it('does not render recruit button if at max capacity', () => {
    render(
      <RosterManagement
        gladiators={gladiators as any}
        maxCapacity={2}
        onRecruitGladiator={onRecruitGladiator}
        onTrainGladiator={onTrainGladiator}
        onReleaseGladiator={onReleaseGladiator}
        onSelectGladiator={onSelectGladiator}
        currentGold={1000}
      />
    );
    expect(screen.queryByText('Add New Gladiator')).toBeNull();
  });
});
