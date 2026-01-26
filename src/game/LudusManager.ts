/**
 * Ludus Manager
 * 
 * Manages gladiator school operations, facilities, roster, and finances
 */

import { 
  Ludus, 
  PrestigeLevel,
  CityId
} from '@/types/ludus.core.types';
import { FacilityType, LudusFacility } from '@/types/facility.types';
import { facilityManager } from './FacilityManager';

export class LudusManager {
  private ludus: Ludus | null = null;
  
  /**
   * Create a new ludus
   */
  createLudus(config: {
    name: string;
    location: CityId;
    owner: string;
    startingGold: number;
  }): Ludus {
    this.ludus = {
      id: this.generateId(),
      name: config.name,
      location: config.location,
      owner: config.owner,
      reputation: 0,
      level: 1,
      
      gold: config.startingGold,
      income: 0,
      expenses: 0,
      
      facilities: [
        facilityManager.createFacility('barracks', 1),
        facilityManager.createFacility('training_ground', 1),
      ],
      
      gladiators: [],
      maxGladiators: 5, // Base capacity
      
      totalWins: 0,
      totalLosses: 0,
      tournamentChampionships: 0,
      prestigeLevel: 'unknown',
      
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    
    return this.ludus;
  }
  
  /**
   * Get current ludus
   */
  getLudus(): Ludus | null {
    return this.ludus;
  }
  
  /**
   * Load ludus from saved data
   */
  loadLudus(data: Ludus): void {
    this.ludus = data;
  }
  
  /**
   * Check if player has a ludus
   */
  hasLudus(): boolean {
    return this.ludus !== null;
  }
  
  // ===== FACILITY MANAGEMENT =====
  
  /**
   * Build a new facility
   */
  buildFacility(type: FacilityType): { success: boolean; message: string } {
    if (!this.ludus) {
      return { success: false, message: 'No ludus found' };
    }
    
    // Check if facility already exists
    const existing = this.ludus.facilities.find((f) => f.type === type);
    if (existing) {
      return { success: false, message: 'Facility already exists' };
    }
    
    // Get facility cost using FacilityManager
    const cost = facilityManager.getBuildCost(type, 1);
    
    // Check gold
    if (this.ludus.gold < cost) {
      return { success: false, message: 'Not enough gold' };
    }
    
    // Build facility using FacilityManager
    this.ludus.gold -= cost;
    this.ludus.facilities.push(facilityManager.createFacility(type, 1));
    this.ludus.lastUpdated = Date.now();
    
    return { success: true, message: `${facilityManager.getFacilityName(type)} built successfully` };
  }
  
  /**
   * Upgrade facility
   */
  upgradeFacility(type: FacilityType): { success: boolean; message: string } {
    if (!this.ludus) {
      return { success: false, message: 'No ludus found' };
    }
    
    const facility = this.ludus.facilities.find((f) => f.type === type);
    if (!facility) {
      return { success: false, message: 'Facility not found' };
    }
    
    if (!facilityManager.canUpgrade(facility)) {
      return { success: false, message: 'Facility cannot be upgraded' };
    }
    
    const cost = facilityManager.getUpgradeCost(facility);
    
    if (this.ludus.gold < cost) {
      return { success: false, message: 'Not enough gold' };
    }
    
    // Upgrade using FacilityManager
    this.ludus.gold -= cost;
    const upgraded = facilityManager.upgradeFacility(facility);
    Object.assign(facility, upgraded);
    this.ludus.lastUpdated = Date.now();
    
    // Update max gladiators if barracks
    if (type === 'barracks') {
      this.ludus.maxGladiators = facilityManager.calculateBarracksCapacity(facility.level);
    }
    
    return { success: true, message: `${facilityManager.getFacilityName(type)} upgraded to level ${facility.level}` };
  }
  
  /**
   * Get all facilities
   */
  getFacilities(): LudusFacility[] {
    return this.ludus?.facilities || [];
  }
  
  /**
   * Get specific facility
   */
  getFacility(type: FacilityType): LudusFacility | undefined {
    return this.ludus?.facilities.find((f) => f.type === type);
  }
  
  // ===== ROSTER MANAGEMENT =====
  
  /**
   * Add gladiator to roster
   */
  addGladiator(gladiatorId: string): { success: boolean; message: string } {
    if (!this.ludus) {
      return { success: false, message: 'No ludus found' };
    }
    
    if (this.ludus.gladiators.length >= this.ludus.maxGladiators) {
      return { success: false, message: 'Roster full. Upgrade barracks to house more gladiators.' };
    }
    
    this.ludus.gladiators.push(gladiatorId);
    this.ludus.lastUpdated = Date.now();
    
    return { success: true, message: 'Gladiator added to roster' };
  }
  
  /**
   * Remove gladiator from roster
   */
  removeGladiator(gladiatorId: string): { success: boolean; message: string } {
    if (!this.ludus) {
      return { success: false, message: 'No ludus found' };
    }
    
    const index = this.ludus.gladiators.indexOf(gladiatorId);
    if (index === -1) {
      return { success: false, message: 'Gladiator not in roster' };
    }
    
    this.ludus.gladiators.splice(index, 1);
    this.ludus.lastUpdated = Date.now();
    
    return { success: true, message: 'Gladiator removed from roster' };
  }
  
  /**
   * Get roster capacity
   */
  getRosterCapacity(): { current: number; max: number } {
    if (!this.ludus) {
      return { current: 0, max: 0 };
    }
    
    return {
      current: this.ludus.gladiators.length,
      max: this.ludus.maxGladiators,
    };
  }
  
  // ===== FINANCIAL MANAGEMENT =====
  
  /**
   * Add gold
   */
  addGold(amount: number): void {
    if (!this.ludus) return;
    this.ludus.gold += amount;
    this.ludus.lastUpdated = Date.now();
  }
  
  /**
   * Spend gold
   */
  spendGold(amount: number): boolean {
    if (!this.ludus || this.ludus.gold < amount) {
      return false;
    }
    
    this.ludus.gold -= amount;
    this.ludus.lastUpdated = Date.now();
    return true;
  }
  
  /**
   * Calculate daily expenses
   */
  calculateDailyExpenses(): number {
    if (!this.ludus) return 0;
    
    // Use FacilityManager to calculate total maintenance
    const facilityMaintenance = facilityManager.calculateTotalMaintenance(this.ludus.facilities);
    
    // TODO: Add gladiator salaries, food costs, etc.
    
    return facilityMaintenance;
  }
  
  /**
   * Process daily finances (income/expenses)
   */
  processDailyFinances(): { income: number; expenses: number; net: number } {
    if (!this.ludus) {
      return { income: 0, expenses: 0, net: 0 };
    }
    
    const expenses = this.calculateDailyExpenses();
    const income = this.ludus.income;
    const net = income - expenses;
    
    this.ludus.gold += net;
    this.ludus.lastUpdated = Date.now();
    
    return { income, expenses, net };
  }
  
  // ===== REPUTATION & PRESTIGE =====
  
  /**
   * Add reputation
   */
  addReputation(amount: number): void {
    if (!this.ludus) return;
    
    this.ludus.reputation = Math.min(100, this.ludus.reputation + amount);
    this.ludus.prestigeLevel = this.calculatePrestigeLevel(this.ludus.reputation);
    this.ludus.lastUpdated = Date.now();
  }
  
  /**
   * Calculate prestige level from reputation
   */
  private calculatePrestigeLevel(reputation: number): PrestigeLevel {
    if (reputation >= 90) return 'legendary';
    if (reputation >= 70) return 'imperial';
    if (reputation >= 50) return 'national';
    if (reputation >= 30) return 'regional';
    if (reputation >= 10) return 'local';
    return 'unknown';
  }
  
  /**
   * Record tournament victory
   */
  recordTournamentWin(): void {
    if (!this.ludus) return;
    
    this.ludus.totalWins++;
    this.ludus.tournamentChampionships++;
    this.addReputation(5);
    this.ludus.lastUpdated = Date.now();
  }
  
  /**
   * Record tournament loss
   */
  recordTournamentLoss(): void {
    if (!this.ludus) return;
    
    this.ludus.totalLosses++;
    this.ludus.lastUpdated = Date.now();
  }
  
  // ===== LEVEL & PROGRESSION =====
  
  /**
   * Check if ludus can level up
   */
  canLevelUp(): boolean {
    if (!this.ludus) return false;
    
    const requiredWins = this.ludus.level * 10;
    return this.ludus.totalWins >= requiredWins;
  }
  
  /**
   * Level up ludus
   */
  levelUp(): { success: boolean; newLevel: number } {
    if (!this.ludus || !this.canLevelUp()) {
      return { success: false, newLevel: this.ludus?.level || 0 };
    }
    
    this.ludus.level++;
    this.ludus.lastUpdated = Date.now();
    
    return { success: true, newLevel: this.ludus.level };
  }
  
  // ===== UTILITY =====
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get ludus stats summary
   */
  getStatsSummary(): {
    level: number;
    reputation: number;
    prestige: PrestigeLevel;
    gold: number;
    gladiatorCount: number;
    maxGladiators: number;
    winRate: number;
    facilities: number;
  } | null {
    if (!this.ludus) return null;
    
    const totalGames = this.ludus.totalWins + this.ludus.totalLosses;
    const winRate = totalGames > 0 ? (this.ludus.totalWins / totalGames) * 100 : 0;
    
    return {
      level: this.ludus.level,
      reputation: this.ludus.reputation,
      prestige: this.ludus.prestigeLevel,
      gold: this.ludus.gold,
      gladiatorCount: this.ludus.gladiators.length,
      maxGladiators: this.ludus.maxGladiators,
      winRate: Math.round(winRate),
      facilities: this.ludus.facilities.length,
    };
  }
}

// Export singleton instance
export const ludusManager = new LudusManager();
