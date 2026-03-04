/**
 * Game-wide constants extracted from magic numbers throughout the codebase.
 * Centralizes tunable values for balance and maintenance.
 */

// ==========================================
// ECONOMY
// ==========================================

export const MONTHLY_FOOD_COST_PER_GLADIATOR = 60;

export const STARTING_GOLD: Record<string, number> = {
  easy: 750,
  normal: 500,
  hard: 300,
};

export const SEASONAL_FOOD_MODIFIERS: Record<string, number> = {
  Winter: 1.25,
  Autumn: 0.85,
  Spring: 1.0,
  Summer: 1.0,
};

export const SEASONAL_MORALE_BONUS: Record<string, number> = {
  Spring: 0.03,
  Summer: 0,
  Autumn: 0,
  Winter: 0,
};

export const EARLY_PAYOFF_DISCOUNT = 0.1;

// ==========================================
// COMBAT
// ==========================================

export const BASE_COMBAT_XP = 50;
export const KILL_BONUS_XP = 25;
export const COMBAT_MORALE_WIN = 0.1;
export const COMBAT_MORALE_LOSS = -0.1;

export const EXHAUSTED_DAMAGE_MODIFIER = 0.8;
export const EXHAUSTED_ACCURACY_PENALTY = 15;
export const EXHAUSTED_DURATION = 3;
export const ENRAGED_DAMAGE_MODIFIER = 1.25;
export const ENRAGED_ACCURACY_PENALTY = 20;

export const DEFEND_DAMAGE_REDUCTION = 0.5;
export const CRITICAL_DAMAGE_MULTIPLIER = 1.5;

export const SUBMISSION_SURRENDER_HP_THRESHOLD = 0.15;
export const SUBMISSION_SURRENDER_MORALE_THRESHOLD = 30;

// ==========================================
// GLADIATOR
// ==========================================

export const MAX_STAT_VALUE = 100;
export const MIN_STAT_VALUE = 1;
export const SKILL_POINTS_PER_LEVEL = 5;

export const AGE_CATEGORIES = {
  youth: { min: 15, max: 19, xpMod: 1.25 },
  prime: { min: 20, max: 29, xpMod: 1.0 },
  veteran: { min: 30, max: 35, xpMod: 0.9 },
  aging: { min: 36, max: 40, xpMod: 0.75 },
  old: { min: 41, max: 999, xpMod: 0.6 },
} as const;

// ==========================================
// GLADIATOR MODE
// ==========================================

export const DOMINUS_SELL_FAVOR_THRESHOLD = 15;
export const DOMINUS_SELL_MIN_MONTHS = 3;
export const SNEAK_TRAINING_CATCH_CHANCE = 0.3;
export const SNEAK_TRAINING_FAVOR_PENALTY = -5;
export const MAX_INTERACTIONS_PER_MONTH = 2;
export const COMPANION_SPAR_INJURY_RISK = 0.08;

export const FREEDOM_LIBERTAS_TARGET = 1000;
export const PATRONAGE_FAVOR_THRESHOLD = 80;

export const NATURAL_HP_RECOVERY_RATE = 0.1;
export const NATURAL_STAMINA_RECOVERY_RATE = 0.3;
export const NATURAL_FATIGUE_RECOVERY = 10;

// ==========================================
// BUILDING MAINTENANCE
// ==========================================

export const BUILDING_DEGRADATION_RATE = 2;
export const BUILDING_MAINTAINED_DEGRADATION_RATE = 0.5;
export const BUILDING_NEGLECTED_DEGRADATION_RATE = 5;
export const BUILDING_NEGLECT_THRESHOLD = 50;

export const BUILDING_CONDITION_THRESHOLDS = {
  excellent: 75,
  fair: 50,
  poor: 25,
} as const;

// ==========================================
// MARKET
// ==========================================

export const MARKET_REFRESH_INTERVAL_MONTHS = 10;
export const MANUAL_MARKET_REFRESH_COST = 100;

// ==========================================
// STAFF
// ==========================================

export const STAFF_XP_PER_LEVEL_MULTIPLIER = 50;
export const MAX_STAFF_LEVEL = 5;
export const STAFF_BASE_DAILY_XP = 5;
