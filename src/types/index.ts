// ==========================================
// CORE GAME TYPES
// ==========================================

// Difficulty levels
export type Difficulty = 'easy' | 'normal' | 'hard';

// Game screen states
export type GameScreen = 
  | 'title' 
  | 'newGame' 
  | 'dashboard' 
  | 'ludus' 
  | 'gladiators'
  | 'training' 
  | 'marketplace' 
  | 'arena' 
  | 'combat'
  | 'staff'
  | 'quests'
  | 'settings';

// ==========================================
// GLADIATOR TYPES
// ==========================================

export type GladiatorClass = 
  | 'murmillo' 
  | 'retiarius' 
  | 'thraex' 
  | 'secutor' 
  | 'hoplomachus' 
  | 'dimachaerus' 
  | 'samnite' 
  | 'velitus';

export type GladiatorOrigin = 'pow' | 'criminal' | 'volunteer' | 'elite';

export type InjurySeverity = 'minor' | 'major' | 'permanent';

export interface Injury {
  id: string;
  type: string;
  severity: InjurySeverity;
  statPenalty: Partial<GladiatorStats>;
  recoveryDays: number;
  daysRemaining: number;
}

export interface GladiatorStats {
  strength: number;      // 1-100: Damage, shield effectiveness
  agility: number;       // 1-100: Movement, evasion
  dexterity: number;     // 1-100: Accuracy, crit chance
  endurance: number;     // 1-100: Max stamina, recovery
  constitution: number;  // 1-100: Max HP, injury resistance
}

export interface GladiatorSkill {
  id: string;
  name: string;
  branch: 'offense' | 'defense' | 'utility';
  levelRequired: number;
  unlocked: boolean;
}

export interface Gladiator {
  id: string;
  name: string;
  class: GladiatorClass;
  origin: GladiatorOrigin;
  
  // Base stats
  stats: GladiatorStats;
  
  // Derived/dynamic stats
  morale: number;        // 0.1-1.5 multiplier
  fatigue: number;       // 0-100
  obedience: number;     // 0-100
  
  // Combat stats
  currentHP: number;
  maxHP: number;
  currentStamina: number;
  maxStamina: number;
  
  // Progression
  level: number;         // 1-20
  experience: number;
  skillPoints: number;
  skills: GladiatorSkill[];
  
  // Injuries
  injuries: Injury[];
  
  // Economy
  fame: number;          // 0-1000 individual fame
  purchasePrice: number;
  
  // History
  wins: number;
  losses: number;
  kills: number;
  
  // State
  isTraining: boolean;
  isResting: boolean;
  isInjured: boolean;
  status?: 'idle' | 'training' | 'resting' | 'injured' | 'fighting';
  
  // Training and nutrition
  trainingRegimen?: string | null;
  nutrition?: 'poor' | 'standard' | 'good' | 'excellent';
}

// ==========================================
// BUILDING TYPES
// ==========================================

export type BuildingType = 
  | 'valetudinarium'   // Infirmary
  | 'palus'            // Training post
  | 'balnea'           // Baths
  | 'coalPit'          // Agility training
  | 'sacellum'         // Shrine
  | 'armamentarium'    // Armory
  | 'taberna'          // Food prep
  | 'waterWell'        // Water supply
  | 'walls'            // Security
  | 'grainShelter'     // Grain storage
  | 'wineCellar';      // Wine storage

export interface BuildingBonus {
  stat: string;
  value: number;
  isPercentage: boolean;
}

export interface Building {
  id: string;
  type: BuildingType;
  level: 1 | 2 | 3;
  bonuses: BuildingBonus[];
  isUnderConstruction: boolean;
  constructionDaysRemaining: number;
  isUpgrading: boolean;
  upgradeDaysRemaining: number;
}

// ==========================================
// STAFF TYPES
// ==========================================

export type StaffRole = 
  | 'doctore'    // Chief trainer
  | 'medicus'    // Healer
  | 'faber'      // Blacksmith
  | 'architect'  // Builder
  | 'educator'   // Mental conditioner
  | 'bard'       // Publicist
  | 'spy';       // Operative

export interface StaffSkill {
  id: string;
  name: string;
  unlocked: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  level: number;          // 1-5
  experience: number;
  hireCost: number;       // One-time payment
  dailyWage: number;      // Ongoing salary
  satisfaction: number;   // 0-100
  skills: StaffSkill[];
  daysUnpaid: number;
}

// ==========================================
// COMBAT TYPES
// ==========================================

export type MatchType = 'pitFight' | 'munera' | 'championship';
export type MatchRules = 'submission' | 'death';

export interface CombatAction {
  type: 'attack' | 'defend' | 'special' | 'rest';
  name: string;
  staminaCost: number;
  damage?: number;
  effect?: string;
}

export interface CombatLogEntry {
  turn: number;
  attacker: string;
  action: string;
  damage?: number;
  result: string;
}

export interface CombatMatch {
  id: string;
  type: MatchType;
  rules: MatchRules;
  playerGladiatorId: string;
  opponentGladiatorId: string;
  entryFee: number;
  baseReward: number;
  combatLog: CombatLogEntry[];
  isComplete: boolean;
  winnerId?: string;
  crowdFavor: number;  // -100 to 100
}

// ==========================================
// ECONOMY TYPES
// ==========================================

export interface Resources {
  grain: number;
  water: number;
  wine: number;
  travertine: number;
  glass: number;
  clay: number;
}

export interface MarketPrices {
  grain: number;
  water: number;
  wine: number;
  travertine: number;
  glass: number;
  clay: number;
}

export interface Transaction {
  id: string;
  day: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
}

// ==========================================
// FACTION TYPES
// ==========================================

export type FactionType = 'senate' | 'plebs' | 'legate';

export interface FactionStanding {
  faction: FactionType;
  favor: number;  // -100 to 100
}

// ==========================================
// QUEST TYPES
// ==========================================

export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';

export interface QuestChoice {
  id: string;
  text: string;
  consequences: {
    gold?: number;
    fame?: number;
    factionFavor?: { faction: FactionType; amount: number };
    unlocks?: string[];
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: string[];
  completedObjectives: string[];
  rewards: {
    gold?: number;
    fame?: number;
    unlocks?: string[];
  };
  choices?: QuestChoice[];
  selectedChoice?: string;
  expiresOnDay?: number;
}

// ==========================================
// GAME STATE TYPES
// ==========================================

export interface GameSettings {
  difficulty: Difficulty;
  autosave: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  tutorialCompleted: boolean;
}

export interface GameState {
  currentDay: number;
  currentScreen: GameScreen;
  isPaused: boolean;
  isGameOver: boolean;
  gameOverReason?: string;
  settings: GameSettings;
}

export interface PlayerState {
  name: string;
  ludusName: string;
  gold: number;
  ludusFame: number;  // 0-1000
  resources: Resources;
  transactions: Transaction[];
}
