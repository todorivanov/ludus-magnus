/**
 * Fighter Entity Class
 * 
 * Core entity representing a gladiator/fighter with stats, skills, and combat mechanics
 */

import { Fighter as FighterType, CharacterClass, StatusEffect } from '@/types/game.types';
import { CHARACTER_BASE_STATS } from '@data/characterStats';

export class Fighter implements FighterType {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  
  // Core Stats
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  strength: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
  
  // Equipment
  equipped: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };
  
  // Progression
  talents: Record<string, number>;
  
  // Combat State
  position: { x: number; y: number } | null;
  statusEffects: StatusEffect[];
  
  constructor(config: {
    id?: string;
    name: string;
    class: CharacterClass;
    level?: number;
    xp?: number;
    equipped?: { weapon: string | null; armor: string | null; accessory: string | null };
    talents?: Record<string, number>;
  }) {
    this.id = config.id || this.generateId();
    this.name = config.name;
    this.class = config.class;
    this.level = config.level || 1;
    this.xp = config.xp || 0;
    
    // Initialize base stats based on class using imported data
    const baseStats = CHARACTER_BASE_STATS[config.class];
    this.maxHp = baseStats.hp + (this.level - 1) * baseStats.hpPerLevel;
    this.hp = this.maxHp;
    this.maxMana = baseStats.mana + (this.level - 1) * baseStats.manaPerLevel;
    this.mana = this.maxMana;
    this.strength = baseStats.strength + (this.level - 1) * baseStats.strengthPerLevel;
    this.defense = baseStats.defense + (this.level - 1) * baseStats.defensePerLevel;
    this.speed = baseStats.speed + (this.level - 1) * baseStats.speedPerLevel;
    this.critChance = baseStats.critChance;
    this.critDamage = baseStats.critDamage;
    
    // Equipment
    this.equipped = config.equipped || {
      weapon: null,
      armor: null,
      accessory: null,
    };
    
    // Talents
    this.talents = config.talents || {};
    
    // Combat state
    this.position = null;
    this.statusEffects = [];
  }
  
  /**
   * Generate unique ID for fighter
   */
  private generateId(): string {
    return `fighter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Calculate total attack damage
   */
  calculateDamage(): number {
    // Base damage from strength
    let damage = this.strength;
    
    // Critical hit
    if (Math.random() < this.critChance) {
      damage *= this.critDamage;
    }
    
    // Add randomness (±10%)
    const variance = 0.9 + Math.random() * 0.2;
    damage *= variance;
    
    return Math.round(damage);
  }
  
  /**
   * Take damage with defense calculation
   */
  takeDamage(amount: number): number {
    // Defense reduces damage (diminishing returns)
    const damageReduction = this.defense / (this.defense + 100);
    const actualDamage = Math.round(amount * (1 - damageReduction));
    
    this.hp = Math.max(0, this.hp - actualDamage);
    
    return actualDamage;
  }
  
  /**
   * Heal HP
   */
  heal(amount: number): number {
    const oldHp = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp - oldHp;
  }
  
  /**
   * Check if fighter is alive
   */
  isAlive(): boolean {
    return this.hp > 0;
  }
  
  /**
   * Check if fighter is defeated
   */
  isDefeated(): boolean {
    return this.hp <= 0;
  }
  
  /**
   * Restore to full health and mana
   */
  restore(): void {
    this.hp = this.maxHp;
    this.mana = this.maxMana;
    this.statusEffects = [];
  }
  
  /**
   * Add status effect
   */
  addStatusEffect(effect: StatusEffect): void {
    // Check if effect already exists
    const existingIndex = this.statusEffects.findIndex((e) => e.id === effect.id);
    
    if (existingIndex !== -1) {
      // Replace existing effect
      this.statusEffects[existingIndex] = effect;
    } else {
      // Add new effect
      this.statusEffects.push(effect);
    }
  }
  
  /**
   * Remove status effect
   */
  removeStatusEffect(effectId: string): void {
    this.statusEffects = this.statusEffects.filter((e) => e.id !== effectId);
  }
  
  /**
   * Get current stats including equipment bonuses
   */
  getCurrentStats(): {
    hp: number;
    maxHp: number;
    mana: number;
    maxMana: number;
    strength: number;
    defense: number;
    speed: number;
    critChance: number;
    critDamage: number;
  } {
    // TODO: Add equipment bonus calculations
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      mana: this.mana,
      maxMana: this.maxMana,
      strength: this.strength,
      defense: this.defense,
      speed: this.speed,
      critChance: this.critChance,
      critDamage: this.critDamage,
    };
  }
  
  /**
   * Level up the fighter
   */
  levelUp(): void {
    this.level++;
    
    const baseStats = CHARACTER_BASE_STATS[this.class];
    
    // Increase stats
    this.maxHp += baseStats.hpPerLevel;
    this.hp = this.maxHp;
    this.maxMana += baseStats.manaPerLevel;
    this.mana = this.maxMana;
    this.strength += baseStats.strengthPerLevel;
    this.defense += baseStats.defensePerLevel;
    this.speed += baseStats.speedPerLevel;
  }
  
  /**
   * Gain XP and check for level up
   */
  gainXP(amount: number): boolean {
    this.xp += amount;
    
    const xpRequired = this.getXPRequired();
    
    if (this.xp >= xpRequired) {
      this.xp -= xpRequired;
      this.levelUp();
      return true; // Leveled up
    }
    
    return false;
  }
  
  /**
   * Get XP required for next level
   */
  getXPRequired(): number {
    // XP curve: 100 * level^1.5
    return Math.floor(100 * Math.pow(this.level, 1.5));
  }
  
  /**
   * Serialize fighter to plain object
   */
  toJSON(): FighterType {
    return {
      id: this.id,
      name: this.name,
      class: this.class,
      level: this.level,
      xp: this.xp,
      hp: this.hp,
      maxHp: this.maxHp,
      mana: this.mana,
      maxMana: this.maxMana,
      strength: this.strength,
      defense: this.defense,
      speed: this.speed,
      critChance: this.critChance,
      critDamage: this.critDamage,
      equipped: this.equipped,
      talents: this.talents,
      position: this.position,
      statusEffects: this.statusEffects,
    };
  }
  
  /**
   * Create Fighter from plain object
   */
  static fromJSON(data: FighterType): Fighter {
    const fighter = new Fighter({
      id: data.id,
      name: data.name,
      class: data.class,
      level: data.level,
      xp: data.xp,
      equipped: data.equipped,
      talents: data.talents,
    });
    
    // Restore runtime state
    fighter.hp = data.hp;
    fighter.mana = data.mana;
    fighter.position = data.position!;
    fighter.statusEffects = data.statusEffects!;
    
    return fighter;
  }
}
