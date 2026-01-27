import React from 'react';
import { render, screen } from '@testing-library/react';
import { LudusDashboard } from '@/components/ludus/LudusDashboard';
import { describe, it, expect, vi } from 'vitest';

describe('LudusDashboard', () => {
  it('renders ludus name and prestige', () => {
    render(
      <LudusDashboard
        ludusName="Test Ludus"
        prestige={100}
        reputation={50}
        currentGold={1000}
        dailyRevenue={200}
        dailyExpenses={150}
        totalIncome={5000}
        totalSpent={3000}
        gladiators={[]}
        maxRosterCapacity={10}
        facilities={[]}
        onBuildFacility={vi.fn()}
        onUpgradeFacility={vi.fn()}
        onRecruitGladiator={vi.fn()}
        onTrainGladiator={vi.fn()}
        onReleaseGladiator={vi.fn()}
        onSelectGladiator={vi.fn()}
      />
    );
    expect(screen.getAllByText('Test Ludus').length).toBeGreaterThan(0);
    expect(screen.getByText('Prestige')).toBeInTheDocument();
    expect(screen.getByText('Reputation')).toBeInTheDocument();
  });
});
