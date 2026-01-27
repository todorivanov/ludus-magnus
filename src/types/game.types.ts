// Core game types
export interface Fighter {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  
  // Stats
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
  equipped?: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };
  
  // Talents
  talents?: Record<string, number>;
  
  // Grid position (for tactical combat)
  position?: { x: number; y: number } | null;
  
  // Status effects
  statusEffects?: StatusEffect[];
}

export type CharacterClass = 'WARRIOR'
  | 'TANK'
  | 'BALANCED'
  | 'GLASS_CANNON'
  | 'BRUISER'
  | 'MAGE'
  | 'ASSASSIN'
  | 'BERSERKER'
  | 'PALADIN'
  | 'NECROMANCER';

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  stackCount?: number;
  metadata?: Record<string, any>;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: {
    strength?: number;
    defense?: number;
    health?: number;
    critChance?: number;
    critDamage?: number;
  };
  durability: number;
  maxDurability: number;
  classRequirement?: CharacterClass;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  act: number;
  difficulty: number;
  type: 'standard' | 'boss' | 'survival';
  unlocked: boolean;
  rewards: {
    xp: number;
    gold: number;
    items?: string[];
  };
}
