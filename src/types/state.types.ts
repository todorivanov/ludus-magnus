import { CharacterClass } from './game.types';

// Player state
export interface PlayerState {
  characterCreated: boolean;
  name: string;
  class: CharacterClass | '';
  level: number;
  xp: number;
  gold: number;
  
  // Story progression
  storyPath: StoryPath | null;
  origin: CharacterOrigin | null;
  pathSelected: boolean;
  
  // Timestamps
  createdAt: number | null;
  lastPlayedAt: number | null;
  
  // Talents
  talents: {
    tree1: string[];
    tree2: string[];
    tree3: string[];
  };
  talentPoints: number;
}

export type StoryPath = 'gladiator' | 'lanista' | 'explorer';

export type GladiatorOrigin = 'thracian_veteran' | 'disgraced_noble' | 'barbarian_prisoner';
export type LanistaOrigin = 'the_heir' | 'the_merchant' | 'the_veteran';
export type ExplorerOrigin = 'the_venator' | 'the_merchant_prince' | 'the_wandering_lanista';

export type CharacterOrigin = GladiatorOrigin | LanistaOrigin | ExplorerOrigin;

// Inventory state
export interface InventoryState {
  equipment: string[]; // Array of equipment IDs
}

// Equipped items state
export interface EquippedState {
  weapon: string | null;
  armor: string | null;
  accessory: string | null;
}

// Statistics state
export interface StatsState {
  totalWins: number;
  totalLosses: number;
  totalFightsPlayed: number;
  winStreak: number;
  bestStreak: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  criticalHits: number;
  skillsUsed: number;
  itemsUsed: number;
  itemsSold: number;
  itemsPurchased: number;
  itemsRepaired: number;
  goldFromSales: number;
  legendaryPurchases: number;
}

// Story state
export interface StoryState {
  currentMission: string | null;
  currentMissionState: object | null;
  unlockedRegions: string[];
  unlockedMissions: string[];
  completedMissions: Record<string, { stars: number; completedAt: number }>;
}

// Unlocks state
export interface UnlocksState {
  achievements: string[];
}

// Settings state
export interface SettingsState {
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  soundEnabled: boolean;
  autoBattleEnabled: boolean;
  autoScrollEnabled: boolean;
  performanceMonitorEnabled: boolean;
  darkMode: boolean;
}

// Root state (all slices combined)
export interface RootState {
  player: PlayerState;
  inventory: InventoryState;
  equipped: EquippedState;
  stats: StatsState;
  story: StoryState;
  unlocks: UnlocksState;
  settings: SettingsState;
}
