/**
 * Location and World Types
 * 
 * Cities, locations, and world exploration
 */

export type CityId = 
  | 'rome'
  | 'capua'
  | 'pompeii'
  | 'alexandria'
  | 'carthage'
  | 'britannia'
  | 'gaul'
  | 'greece'
  | 'egypt'
  | 'spain';

export interface WorldLocation {
  id: string;
  name: string;
  type: LocationType;
  cityId?: CityId;
  description: string;
  
  // Requirements
  unlocked: boolean;
  requiredLevel?: number;
  requiredReputation?: number;
  
  // Features
  hasTournaments: boolean;
  hasMarket: boolean;
  hasRecruitment: boolean;
  hasQuests: boolean;
  
  // Travel
  travelCost: number;
  travelTime: number; // Milliseconds
}

export type LocationType = 
  | 'city' 
  | 'arena' 
  | 'market' 
  | 'training_camp' 
  | 'dungeon' 
  | 'wilderness';
