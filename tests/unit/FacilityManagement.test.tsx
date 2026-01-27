import React from 'react';
import { render, screen } from '@testing-library/react';
import { FacilityManagement } from '@/components/ludus/FacilityManagement';
import { describe, it, expect, vi } from 'vitest';

describe('FacilityManagement', () => {
  const facilities = [
    { id: '1', type: 'barracks', level: 2, upgrading: false, maintenanceCost: 0 },
    { id: '2', type: 'training_ground', level: 1, upgrading: false, maintenanceCost: 0 },
  ];
  const onBuildFacility = vi.fn();
  const onUpgradeFacility = vi.fn();

  it('renders facility management header and facility count', () => {
    render(
      <FacilityManagement
        facilities={facilities as any}
        currentGold={1000}
        onBuildFacility={onBuildFacility}
        onUpgradeFacility={onUpgradeFacility}
      />
    );
    expect(screen.getByText('🏗️ Facility Management')).toBeInTheDocument();
    expect(
      screen.getByText(/2\s*facilities\s*\|/i)
    ).toBeInTheDocument();
  });
});
