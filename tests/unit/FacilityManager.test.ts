import { FacilityManager } from '@/game/FacilityManager';
import { LudusFacility, FacilityType } from '@/types/facility.types';
import { describe, it, expect } from 'vitest';

describe('FacilityManager', () => {
  const manager = new FacilityManager();
  const type: FacilityType = 'barracks';

  it('getBuildCost returns correct value', () => {
    expect(manager.getBuildCost('barracks', 1)).toBe(500);
    expect(manager.getBuildCost('barracks', 2)).toBeGreaterThan(500);
  });

  it('getMaintenanceCost returns 5% of build cost', () => {
    const build = manager.getBuildCost('barracks', 2);
    expect(manager.getMaintenanceCost('barracks', 2)).toBe(Math.floor(build * 0.05));
  });

  it('createFacility returns valid facility', () => {
    const facility = manager.createFacility('barracks', 1);
    expect(facility.type).toBe('barracks');
    expect(facility.level).toBe(1);
    expect(facility.maintenanceCost).toBe(manager.getMaintenanceCost('barracks', 1));
    expect(facility.id).toMatch(/^facility_/);
  });

  it('canUpgrade returns true if level < 5 and not upgrading', () => {
    const facility: LudusFacility = { id: '1', type: 'barracks', level: 2, upgrading: false, maintenanceCost: 100 };
    expect(manager.canUpgrade(facility)).toBe(true);
    expect(manager.canUpgrade({ ...facility, level: 5 })).toBe(false);
    expect(manager.canUpgrade({ ...facility, upgrading: true })).toBe(false);
  });

  it('getUpgradeCost returns correct value', () => {
    const facility: LudusFacility = { id: '1', type: 'barracks', level: 2, upgrading: false, maintenanceCost: 100 };
    expect(manager.getUpgradeCost(facility)).toBe(manager.getBuildCost('barracks', 3));
    expect(manager.getUpgradeCost({ ...facility, level: 5 })).toBe(0);
  });

  it('upgradeFacility increases level and maintenance', () => {
    const facility: LudusFacility = { id: '1', type: 'barracks', level: 2, upgrading: false, maintenanceCost: 100 };
    const upgraded = manager.upgradeFacility(facility);
    expect(upgraded.level).toBe(3);
    expect(upgraded.maintenanceCost).toBe(manager.getMaintenanceCost('barracks', 3));
  });

  it('calculateTotalMaintenance sums all maintenance', () => {
    const facilities: LudusFacility[] = [
      { id: '1', type: 'barracks', level: 1, upgrading: false, maintenanceCost: 10 },
      { id: '2', type: 'armory', level: 1, upgrading: false, maintenanceCost: 20 },
    ];
    expect(manager.calculateTotalMaintenance(facilities)).toBe(30);
  });

  it('getFacilityName and getFacilityDescription return strings', () => {
    expect(typeof manager.getFacilityName('barracks')).toBe('string');
    expect(typeof manager.getFacilityDescription('barracks')).toBe('string');
  });

  it('getFacilityBonus returns correct bonus type', () => {
    expect(manager.getFacilityBonus('armory', 2)).toBe(10);
    expect(manager.getFacilityBonus('barracks', 2)).toMatch(/max gladiators/);
  });

  it('calculateBarracksCapacity returns correct value', () => {
    expect(manager.calculateBarracksCapacity(1)).toBe(7);
    expect(manager.calculateBarracksCapacity(3)).toBe(11);
  });
});
