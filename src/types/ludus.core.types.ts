/**
 * Ludus Core Types
 * 
 * Main ludus structure and prestige system
 */
    
import { LudusFacility } from './facility.types';
import { CityId } from './location.types';
// Re-export CityId for convenience
export type { CityId };
export interface Ludus {
  id: string;
  name: string;
  location: CityId;
  owner: string; // Player name
  reputation: number; // 0-100
  level: number; // Ludus level (unlocks facilities)
  
  // Finances
  gold: number;
  income: number; // Daily income
  expenses: number; // Daily expenses
  
  // Facilities
  facilities: LudusFacility[];
  
  // Roster
  gladiators: string[]; // Array of gladiator IDs
  maxGladiators: number; // Capacity based on barracks
  
  // Stats
  totalWins: number;
  totalLosses: number;
  tournamentChampionships: number;
  prestigeLevel: PrestigeLevel;
  
  createdAt: number;
  lastUpdated: number;
}

export type PrestigeLevel = 
  | 'unknown' 
  | 'local' 
  | 'regional' 
  | 'national' 
  | 'imperial' 
  | 'legendary';

export interface FinancialReport {
  period: 'daily' | 'weekly' | 'monthly';
  income: {
    tournamentPrizes: number;
    bettingWinnings: number;
    sponsorships: number;
    exhibitionMatches: number;
    total: number;
  };
  expenses: {
    salaries: number;
    maintenance: number;
    food: number;
    equipment: number;
    medical: number;
    training: number;
    taxes: number;
    total: number;
  };
  netProfit: number;
}

export interface LoanOffer {
  id: string;
  amount: number;
  interestRate: number; // Percentage
  duration: number; // Days
  totalRepayment: number;
  dailyPayment: number;
}
