/**
 * Facility Types
 * 
 * Ludus facilities and upgrades
 */

export interface LudusFacility {
  id: string;
  type: FacilityType;
  level: number; // 1-5
  upgrading: boolean;
  upgradeTimeRemaining?: number; // Milliseconds
  maintenanceCost: number; // Daily cost
}

export type FacilityType =
  | 'barracks' // House more gladiators
  | 'training_ground' // Improve stat gains
  | 'medical_wing' // Faster healing, lower death risk
  | 'armory' // Equipment bonuses, repair discounts
  | 'library' // Skill training
  | 'arena' // Practice matches
  | 'market' // Better trade prices
  | 'temple' // Morale boost
  | 'treasury' // Income bonus
  | 'stable' // Mount training
  | 'forge' // Craft equipment
  | 'tavern'; // Recruit better gladiators

export interface FacilityDefinition {
  type: FacilityType;
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  maintenanceCostPerLevel: number;
  maxLevel: number;
  requiredLudusLevel: number;
  buildTime: number; // Milliseconds
  benefits: FacilityBenefit[];
}

export interface FacilityBenefit {
  level: number;
  description: string;
  stat?: string;
  value?: number;
  type: 'stat_bonus' | 'capacity' | 'cost_reduction' | 'speed_bonus' | 'income';
}
