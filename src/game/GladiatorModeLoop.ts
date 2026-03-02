import type { 
  Companion, Dominus, DominusOrder, 
  GladiatorModeState,
} from '@/types';
import { generateMonthlyOrder, evaluateMonthPerformance, shouldSellGladiator, getDominusFoodQuality, generateDominus } from '@data/gladiatorMode/dominusAI';
import { generateInitialCompanions } from '@data/gladiatorMode/companions';
import { generateRandomEvent } from '@data/gladiatorMode/gladiatorEvents';
import { calculateLibertasFromMonth } from '@data/gladiatorMode/freedomSystem';

export interface MonthProcessingResult {
  summary: string[];
  wasSold: boolean;
  newDominus?: Dominus;
  event: ReturnType<typeof generateRandomEvent>;
  chapterCompleted: number | null;
  isFree: boolean;
  isDead: boolean;
  order: DominusOrder;
  libertasGained: number;
  trainingXP: number;
  statGains: Record<string, number>;
  healAmount: number;
  fatigueChange: number;
  moraleChange: number;
  favorChange: number;
  fameGain: number;
}

export function processGladiatorMonth(
  state: GladiatorModeState,
  _gameState: { currentYear: number; currentMonth: number; settings: { difficulty: string } },
): MonthProcessingResult {
  const result: MonthProcessingResult = {
    summary: [],
    wasSold: false,
    event: null,
    chapterCompleted: null,
    isFree: false,
    isDead: false,
    order: state.currentOrder || { type: 'train', description: 'Train at the palus.', trainingRegimen: 'palus_drill' },
    libertasGained: 0,
    trainingXP: 0,
    statGains: {},
    healAmount: 0,
    fatigueChange: 0,
    moraleChange: 0,
    favorChange: 0,
    fameGain: 0,
  };

  const player = state.playerGladiator;
  if (!player) return result;

  const dominus = state.dominus;
  const order = state.currentOrder || result.order;
  const aliveCompanions = state.companions.filter(c => c.isAlive && !c.soldAway && !c.freed);

  // Generate order if not set
  if (!state.currentOrder) {
    result.order = generateMonthlyOrder(dominus, player, aliveCompanions, state.monthsInCurrentLudus, state.totalMonthsServed);
  }

  // Process order effects
  if (order.type === 'train') {
    result.trainingXP = 15 + Math.floor(Math.random() * 15);
    if (Math.random() < 0.3) {
      const stats = ['strength', 'agility', 'dexterity', 'endurance', 'constitution'];
      const stat = stats[Math.floor(Math.random() * stats.length)];
      result.statGains[stat] = 1;
      result.summary.push(`Training improved your ${stat}.`);
    }
    result.summary.push(`Gained ${result.trainingXP} XP from training.`);
  } else if (order.type === 'rest') {
    result.healAmount = Math.floor(player.maxHP * 0.3);
    result.fatigueChange = -30;
    result.summary.push(`Rested and recovered ${result.healAmount} HP.`);
  } else if (order.type === 'spar_partner') {
    result.trainingXP = 10 + Math.floor(Math.random() * 10);
    result.summary.push(`Gained ${result.trainingXP} XP as sparring partner.`);
  } else if (order.type === 'punishment') {
    result.healAmount = -15;
    result.moraleChange = -0.1;
    result.summary.push('Endured punishment.');
  }

  // Evaluate obedience (default: obeyed)
  const evaluation = evaluateMonthPerformance(dominus, order, true, null, 0);
  result.favorChange = evaluation.favorChange;
  result.summary.push(evaluation.message);

  // Passive libertas
  const passiveLibertas = calculateLibertasFromMonth(player, dominus, state.totalMonthsServed);
  result.libertasGained = passiveLibertas;
  if (passiveLibertas > 0) {
    result.summary.push(`Earned ${passiveLibertas} Libertas from your reputation.`);
  }

  // Natural recovery
  result.healAmount += Math.floor(player.maxHP * 0.1);
  result.fatigueChange -= 10;

  // Food quality morale
  const foodQuality = getDominusFoodQuality(dominus, dominus.favor + result.favorChange);
  const foodMoraleMap: Record<string, number> = { poor: -0.03, standard: 0, good: 0.02, excellent: 0.05 };
  result.moraleChange += foodMoraleMap[foodQuality] || 0;

  // Check if sold
  const newFavor = Math.max(0, Math.min(100, dominus.favor + result.favorChange));
  if (shouldSellGladiator(dominus, newFavor, state.monthsInCurrentLudus + 1)) {
    result.wasSold = true;
    result.newDominus = generateDominus([dominus.name, ...state.previousDomini]);
    result.summary.push(`You have been sold to ${result.newDominus.name} of ${result.newDominus.ludusName}!`);
  }

  // Random event
  result.event = generateRandomEvent(player, aliveCompanions, dominus, state.totalMonthsServed + 1);

  // Companion changes: random arrival or departure
  if (aliveCompanions.length < 4 && Math.random() < 0.2) {
    result.summary.push('A new gladiator has arrived at the ludus.');
  }

  // Fame passive gain
  if (player.wins > 0) {
    result.fameGain = 1 + Math.floor(player.wins * 0.1);
  }

  // Check freedom
  const totalLibertas = state.freedom.totalLibertas + result.libertasGained;
  if (totalLibertas >= 1000) {
    result.isFree = true;
    result.summary.push('You have earned enough Libertas! The rudis awaits!');
  }

  // Check death (HP too low from punishment/events)
  if (player.currentHP + result.healAmount <= 0) {
    result.isDead = true;
    result.summary.push('Your injuries have proven fatal.');
  }

  return result;
}

export function generateNewLudusCompanions(
  currentYear: number,
  currentMonth: number,
): Companion[] {
  return generateInitialCompanions(currentYear, currentMonth, 4 + Math.floor(Math.random() * 3));
}
