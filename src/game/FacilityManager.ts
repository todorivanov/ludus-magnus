/**
 * Facility Manager
 * 
 * Manages ludus facilities - building, upgrading, and maintenance
 */

import { LudusFacility, FacilityType } from '@/types/facility.types';

export class FacilityManager {
  /**
   * Get facility build cost
   */
  getBuildCost(type: FacilityType, level: number = 1): number {
    const baseCosts: Record<FacilityType, number> = {
      barracks: 500,
      training_ground: 800,
      medical_wing: 1000,
      armory: 700,
      library: 900,
      arena: 1500,
      market: 600,
      temple: 400,
      treasury: 1200,
      stable: 800,
      forge: 1000,
      tavern: 500,
    };
    
    const base = baseCosts[type];
    if (typeof base !== 'number' || isNaN(base)) {
      throw new Error(`Unknown facility type: ${type}`);
    }
    return Math.floor(base * Math.pow(1.5, level - 1));
  }
  
  /**
   * Get facility maintenance cost
   */
  getMaintenanceCost(type: FacilityType, level: number): number {
    return Math.floor(this.getBuildCost(type, level) * 0.05);
  }
  
  /**
   * Create a new facility
   */
  createFacility(type: FacilityType, level: number = 1): LudusFacility {
    return {
      id: this.generateId(),
      type,
      level,
      upgrading: false,
      maintenanceCost: this.getMaintenanceCost(type, level),
    };
  }
  
  /**
   * Check if facility can be upgraded
   */
  canUpgrade(facility: LudusFacility): boolean {
    return facility.level < 5 && !facility.upgrading;
  }
  
  /**
   * Get upgrade cost for facility
   */
  getUpgradeCost(facility: LudusFacility): number {
    if (!this.canUpgrade(facility)) return 0;
    return this.getBuildCost(facility.type, facility.level + 1);
  }
  
  /**
   * Upgrade facility
   */
  upgradeFacility(facility: LudusFacility): LudusFacility {
    if (!this.canUpgrade(facility)) {
      throw new Error('Cannot upgrade facility');
    }
    
    return {
      ...facility,
      level: facility.level + 1,
      maintenanceCost: this.getMaintenanceCost(facility.type, facility.level + 1),
    };
  }
  
  /**
   * Calculate total maintenance cost for all facilities
   */
  calculateTotalMaintenance(facilities: LudusFacility[]): number {
    return facilities.reduce((total, facility) => total + facility.maintenanceCost, 0);
  }
  
  /**
   * Get facility display name
   */
  getFacilityName(type: FacilityType): string {
    const names: Record<FacilityType, string> = {
      barracks: 'Barracks',
      training_ground: 'Training Ground',
      medical_wing: 'Medical Wing',
      armory: 'Armory',
      library: 'Library',
      arena: 'Practice Arena',
      market: 'Market',
      temple: 'Temple',
      treasury: 'Treasury',
      stable: 'Stable',
      forge: 'Forge',
      tavern: 'Tavern',
    };
    
    return names[type];
  }
  
  /**
   * Get facility description
   */
  getFacilityDescription(type: FacilityType): string {
    const descriptions: Record<FacilityType, string> = {
      barracks: 'Houses your gladiators. Upgrade to increase capacity.',
      training_ground: 'Improves stat gains from training.',
      medical_wing: 'Speeds up healing and reduces death risk.',
      armory: 'Provides equipment bonuses and repair discounts.',
      library: 'Enables advanced skill training.',
      arena: 'Allows practice matches between gladiators.',
      market: 'Improves trade prices for buying and selling.',
      temple: 'Boosts morale and loyalty of gladiators.',
      treasury: 'Increases daily income from tournaments.',
      stable: 'Enables mount training for cavalry tactics.',
      forge: 'Allows crafting and upgrading equipment.',
      tavern: 'Attracts higher quality recruits.',
    };
    
    return descriptions[type];
  }
  
  /**
   * Get facility bonus at level
   * Returns number (percent) for stat bonuses, string for special effects
   */
  getFacilityBonus(type: FacilityType, level: number): number | string {
    switch (type) {
      case 'armory':
        return level * 5; // % equipment stats
      case 'training_ground':
        return level * 10; // % training effectiveness
      case 'market':
        return level * 5; // % better prices
      case 'temple':
        return level * 5; // morale/day
      case 'treasury':
        return level * 10; // % tournament income
      case 'stable':
        return level * 5; // % speed bonus
      case 'tavern':
        return level * 10; // % recruit quality
      case 'medical_wing':
        return `-${level * 20}% healing time`;
      case 'barracks':
        return `+${level * 2} max gladiators`;
      case 'library':
        return `Unlocks ${level} skill tiers`;
      case 'arena':
        return `${level} practice matches per day`;
      case 'forge':
        return `Craft tier ${level} equipment`;
      default:
        return 'No bonus available';
    }
  }
  
  /**
   * Calculate barracks capacity
   */
  calculateBarracksCapacity(barracksLevel: number): number {
    return 5 + barracksLevel * 2;
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `facility_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const facilityManager = new FacilityManager();
