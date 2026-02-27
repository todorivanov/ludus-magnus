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
  | 'tournaments'
  | 'staff'
  | 'fame'
  | 'politics'
  | 'quests'
  | 'settings'
  | 'codex';

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
  
  // Age & Career
  age: number;           // Years old
  birthYear: number;     // Year born
  birthMonth: number;    // Month born (1-12)
  careerStartYear: number;
  careerStartMonth: number;
  monthsOfService: number;
  milestones: Array<{ id: string; achievedYear: number; achievedMonth: number }>;
  titles: string[];
  
  // Injuries
  injuries: Injury[];
  
  // Equipment
  equippedItems?: string[]; // Array of equipped item IDs
  
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
  | 'wineCellar'       // Wine storage
  // New buildings
  | 'gymnasium'        // Advanced training
  | 'arenaReplica'     // Practice arena
  | 'library'          // Tactical knowledge
  | 'forge'            // Weapon crafting
  | 'guardTower'       // Enhanced security
  | 'barracks'         // Staff housing
  | 'marketplace'      // Income generation
  | 'spectatorSeats'   // Fame generation
  | 'beastPens'        // Beast training
  | 'oilPress'         // Oil production
  | 'triclinium'       // Dining hall
  | 'hypocaust'        // Heating system
  | 'ludusOffice';     // Administration

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
  
  // Maintenance & Degradation
  condition: number; // 0-100, percentage of building health
  lastMaintenanceMonth?: number; // Track when maintenance was last paid
  maintenanceCost: number; // Monthly maintenance cost in gold
}

// ==========================================
// STAFF TYPES
// ==========================================

export type StaffRole = 
  | 'doctore'    // Chief trainer
  | 'medicus'    // Healer/Physician
  | 'lanista'    // Manager/Negotiator
  | 'faber'      // Blacksmith/Craftsman
  | 'coquus'     // Cook
  | 'guard'      // Security
  | 'lorarius';  // Disciplinarian

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
  dailyWage: number;      // Ongoing salary
  satisfaction: number;   // 0-100
  skills: string[];       // Array of learned skill IDs
  daysUnpaid: number;
  daysEmployed: number;
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
// MARKETPLACE ITEM TYPES
// ==========================================

export type MarketItemCategory = 
  | 'equipment'      // Weapons, armor
  | 'consumables'    // Potions, tonics
  | 'training'       // Training manuals, skill scrolls
  | 'luxury'         // Morale boosters
  | 'beasts'         // Animals for training/entertainment
  | 'services';      // Special services

export type EquipmentSlot = 
  | 'weapon'      // Swords, tridents, etc.
  | 'shield'      // Shields
  | 'armor'       // Body armor, helmets
  | 'accessory';  // Sandals, weights, misc

export interface MarketItemEffect {
  type: 
    | 'stat_boost'           // Permanent stat increase
    | 'heal'                 // HP/Stamina recovery
    | 'morale_boost'         // Morale increase
    | 'injury_heal'          // Reduce injury recovery time
    | 'xp_boost'             // Grant XP
    | 'skill_point'          // Grant skill points
    | 'training_boost'       // Temporary training efficiency
    | 'combat_buff'          // Temporary combat bonus
    | 'fame_boost'           // Instant fame
    | 'equipment';           // Equippable gear

  value?: number;
  stat?: keyof GladiatorStats;
  duration?: number; // For temporary effects (in days)
  quality?: 'common' | 'rare' | 'legendary';
  slot?: EquipmentSlot; // Equipment slot type
}

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: MarketItemCategory;
  price: number;
  stock?: number; // Limited quantity, undefined = unlimited
  minFame?: number; // Ludus fame requirement to unlock
  effect: MarketItemEffect;
}

export interface PurchasedItem {
  itemId: string;
  purchaseDay: number;
  quantity: number;
  appliedTo?: string[]; // Gladiator IDs for items applied to specific gladiators
}

export interface ActiveEffect {
  id: string;
  itemId: string;
  gladiatorId?: string; // If effect applies to specific gladiator
  type: string;
  value: number;
  expiresOnDay?: number;
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

// ==========================================
// TOURNAMENT TYPES
// ==========================================

export type TournamentSize = 8 | 16 | 32;
export type TournamentRules = 'submission' | 'death';

export interface TournamentTypeData {
  id: string;
  name: string;
  description: string;
  size: TournamentSize;
  rules: TournamentRules;
  entryFeePerGladiator: number;
  minFame: number;
  stageRewards: {
    roundOf32?: { gold: number; fame: number };
    roundOf16?: { gold: number; fame: number };
    quarterfinals: { gold: number; fame: number };
    semifinals: { gold: number; fame: number };
    finals: { gold: number; fame: number };
  };
  placementBonuses: {
    winner: { gold: number; fame: number; ludusFame: number };
    runnerUp: { gold: number; fame: number; ludusFame: number };
  };
}

export interface TournamentParticipant {
  id: string;
  name: string;
  isPlayerGladiator: boolean;
  gladiatorId?: string;
  class: GladiatorClass;
  level: number;
  stats: GladiatorStats;
  currentHP: number;
  maxHP: number;
  currentStamina: number;
  maxStamina: number;
  eliminated: boolean;
  died: boolean;
  roundEliminated?: number;
}

export interface BracketMatch {
  id: string;
  round: number;
  position: number;
  participant1: TournamentParticipant | null;
  participant2: TournamentParticipant | null;
  winner: TournamentParticipant | null;
  completed: boolean;
  needsPlayerAction: boolean;
  combatLog?: CombatLogEntry[];
}

export interface Tournament {
  id: string;
  type: string;
  typeData: TournamentTypeData;
  startDay: number;
  currentRound: number;
  bracket: BracketMatch[];
  participants: TournamentParticipant[];
  playerGladiatorIds: string[];
  rules: TournamentRules;
  status: 'active' | 'completed';
}

export interface CompletedTournament {
  id: string;
  type: string;
  startDay: number;
  completionDay: number;
  playerResults: {
    gladiatorId: string;
    gladiatorName: string;
    roundReached: number;
    died: boolean;
    won: boolean;
  }[];
  totalGoldEarned: number;
  totalFameEarned: number;
}
