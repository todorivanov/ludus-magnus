/**
 * Building Maintenance System
 * Handles building degradation, maintenance costs, and repair calculations
 */

import type { Building, BuildingType } from '@/types';

/**
 * Calculate monthly degradation rate
 * Returns the percentage points lost per month
 */
export function calculateDegradation(
  building: Building,
  maintenancePaid: boolean
): number {
  // Base degradation rates
  const BASE_DEGRADATION = -2; // -2% per month without maintenance
  const MAINTAINED_DEGRADATION = -0.5; // -0.5% with maintenance
  const NEGLECTED_DEGRADATION = -5; // -5% if severely neglected
  
  // If under construction or upgrading, no degradation
  if (building.isUnderConstruction || building.isUpgrading) {
    return 0;
  }
  
  // Check if building is already in poor condition (neglect penalty)
  if (building.condition < 50 && !maintenancePaid) {
    return NEGLECTED_DEGRADATION;
  }
  
  return maintenancePaid ? MAINTAINED_DEGRADATION : BASE_DEGRADATION;
}

/**
 * Get effectiveness modifier based on building condition
 * Returns multiplier (0-1) for building bonuses
 */
export function getEffectivenessModifier(condition: number): number {
  if (condition >= 75) return 1.0; // Excellent/Good: Full effectiveness
  if (condition >= 50) return 0.75; // Fair: 75% effectiveness
  if (condition >= 25) return 0.5; // Poor: 50% effectiveness
  return 0; // Dilapidated: Non-functional
}

/**
 * Get condition level category
 */
export function getConditionCategory(condition: number): {
  label: string;
  color: string;
  description: string;
} {
  if (condition >= 100) {
    return {
      label: 'Excellent',
      color: 'text-green-400',
      description: 'Building is in pristine condition'
    };
  } else if (condition >= 75) {
    return {
      label: 'Good',
      color: 'text-blue-400',
      description: 'Building is well-maintained'
    };
  } else if (condition >= 50) {
    return {
      label: 'Fair',
      color: 'text-yellow-400',
      description: 'Building showing signs of wear (-25% effectiveness)'
    };
  } else if (condition >= 25) {
    return {
      label: 'Poor',
      color: 'text-orange-400',
      description: 'Building needs urgent attention (-50% effectiveness)'
    };
  } else {
    return {
      label: 'Dilapidated',
      color: 'text-red-400',
      description: 'Building is non-functional and requires reconstruction'
    };
  }
}

/**
 * Calculate repair cost to restore building to target condition
 */
export function calculateRepairCost(
  building: Building,
  targetCondition: number,
  originalConstructionCost: number
): number {
  const currentCondition = building.condition;
  const conditionGap = targetCondition - currentCondition;
  
  if (conditionGap <= 0) return 0;
  
  // Minor repair (restore to 75%)
  if (targetCondition === 75) {
    return Math.round(50 + (building.level * 25));
  }
  
  // Major repair (restore to 100%)
  if (targetCondition === 100) {
    const baseRepairCost = 100 + (building.level * 50);
    // Scale by how damaged it is
    const damageMultiplier = (100 - currentCondition) / 100;
    return Math.round(baseRepairCost * damageMultiplier);
  }
  
  // Full reconstruction (for dilapidated buildings)
  if (currentCondition < 25 && targetCondition === 100) {
    return Math.round(originalConstructionCost * 0.5);
  }
  
  // General repair formula
  return Math.round(conditionGap * 2 * building.level);
}

/**
 * Calculate monthly maintenance cost based on building type and level
 */
export function calculateMaintenanceCost(
  buildingType: BuildingType,
  level: 1 | 2 | 3
): number {
  // Basic buildings: 5-10 gold/month
  const basicBuildings: BuildingType[] = [
    'palus',
    'waterWell',
    'grainShelter',
    'coalPit',
  ];
  
  // Advanced buildings: 15-25 gold/month
  const advancedBuildings: BuildingType[] = [
    'valetudinarium',
    'balnea',
    'armamentarium',
    'taberna',
    'walls',
    'gymnasium',
    'arenaReplica',
    'library',
    'forge',
    'guardTower',
    'barracks',
  ];
  
  // Luxury buildings: 30-50 gold/month
  const luxuryBuildings: BuildingType[] = [
    'sacellum',
    'wineCellar',
    'marketplace',
    'spectatorSeats',
    'beastPens',
    'oilPress',
    'triclinium',
    'hypocaust',
    'ludusOffice',
  ];
  
  let baseCost = 15; // Default
  
  if (basicBuildings.includes(buildingType)) {
    baseCost = 7;
  } else if (advancedBuildings.includes(buildingType)) {
    baseCost = 20;
  } else if (luxuryBuildings.includes(buildingType)) {
    baseCost = 40;
  }
  
  // Scale by level
  return baseCost * level;
}

/**
 * Apply monthly degradation to a building
 */
export function applyMonthlyDegradation(
  building: Building,
  maintenancePaid: boolean
): Partial<Building> {
  const degradation = calculateDegradation(building, maintenancePaid);
  const newCondition = Math.max(0, Math.min(100, building.condition + degradation));
  
  return {
    condition: newCondition,
  };
}

/**
 * Get total monthly maintenance cost for all buildings
 */
export function getTotalMaintenanceCost(buildings: Building[]): number {
  return buildings.reduce((total, building) => {
    // Don't charge for buildings under construction or upgrading
    if (building.isUnderConstruction || building.isUpgrading) {
      return total;
    }
    return total + building.maintenanceCost;
  }, 0);
}
