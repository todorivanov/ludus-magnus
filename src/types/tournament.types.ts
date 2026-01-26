/**
 * Tournament Types
 * 
 * Tournament system, brackets, and matches
 */

import { CityId } from './location.types';

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  location: CityId;
  tier: TournamentTier;
  
  // Entry
  entryFee: number;
  minLevel: number;
  maxParticipants: number;
  
  // Rewards
  goldPrize: number;
  reputationReward: number;
  equipment?: string[]; // Item IDs
  
  // Schedule
  startDate: number; // Timestamp
  endDate: number;
  registrationDeadline: number;
  
  // Participants
  registeredGladiators: string[]; // Gladiator IDs
  bracket?: TournamentBracket;
  
  status: TournamentStatus;
}

export type TournamentType = 
  | 'single_elimination' 
  | 'double_elimination' 
  | 'round_robin' 
  | 'gauntlet' 
  | 'team_battle';

export type TournamentTier = 
  | 'local' 
  | 'regional' 
  | 'national' 
  | 'imperial' 
  | 'special';

export type TournamentStatus = 
  | 'upcoming' 
  | 'registration_open' 
  | 'in_progress' 
  | 'completed';

export interface TournamentBracket {
  rounds: TournamentRound[];
  currentRound: number;
  winner?: string; // Gladiator ID
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  fighter1Id: string;
  fighter2Id: string;
  winnerId?: string;
  completed: boolean;
  scheduledTime?: number;
}
