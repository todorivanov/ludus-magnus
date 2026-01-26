/**
 * Gladiator Roster Types
 * 
 * Gladiator management and training
 */

export interface GladiatorInRoster {
  id: string;
  name: string;
  class: string;
  level: number;
  health: number;
  maxHealth: number;
  morale: number; // 0-100
  loyalty: number; // 0-100
  fatigue: number; // 0-100 (higher = more tired)
  
  // Contract
  salary: number; // Daily/weekly cost
  contractExpires: number; // Timestamp
  canLeave: boolean; // True if free agent
  
  // Status
  status: GladiatorStatus;
  injuryDaysRemaining?: number;
  trainingProgram?: TrainingProgram;
  
  // Performance
  wins: number;
  losses: number;
  crowdFavorite: boolean;
}

export type GladiatorStatus = 
  | 'ready' 
  | 'training' 
  | 'injured' 
  | 'resting' 
  | 'competing';

export interface TrainingProgram {
  id: string;
  type: TrainingType;
  targetStat: string;
  daysRemaining: number;
  effectiveness: number; // 0-100 (based on facility level)
}

export type TrainingType = 
  | 'strength' 
  | 'endurance' 
  | 'speed' 
  | 'technique' 
  | 'defense' 
  | 'special';

export interface RecruitmentPool {
  available: GladiatorRecruit[];
  refreshDate: number; // Next refresh timestamp
  refreshCost: number; // Cost to force refresh
}

export interface GladiatorRecruit {
  id: string;
  name: string;
  class: string;
  level: number;
  baseStats: {
    strength: number;
    health: number;
    defense: number;
    speed: number;
  };
  price: number;
  contractDuration: number; // Days
  salary: number; // Daily cost
  potential: 'low' | 'medium' | 'high' | 'exceptional';
  background: string;
}
