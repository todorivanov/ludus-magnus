import type {
  Companion, Dominus, DominusOrder,
  GladiatorModeState,
} from '@/types';
import { generateMonthlyOrder, evaluateMonthPerformance, shouldSellGladiator, getDominusFoodQuality, generateDominus } from '@data/gladiatorMode/dominusAI';
import { generateInitialCompanions, generateCompanion } from '@data/gladiatorMode/companions';
import { generateRandomEvent } from '@data/gladiatorMode/gladiatorEvents';
import { calculateLibertasFromMonth, checkPathFulfilled } from '@data/gladiatorMode/freedomSystem';
import { getCurrentChapter, checkChapterCompletion, type StoryChapter } from '@data/gladiatorMode/gladiatorEvents';

export interface MonthProcessingResult {
  summary: string[];

  // Obedience
  obeyed: boolean;

  // Order effects
  healAmount: number;
  staminaRestore: number;
  fatigueChange: number;
  moraleChange: number;
  favorChange: number;
  xpGained: number;

  // Passive gains
  libertasGained: number;
  fameGain: number;

  // Selling
  wasSold: boolean;
  newDominus: Dominus | null;
  newCompanions: Companion[];

  // New companion arrival (when not sold)
  newArrival: Companion | null;

  // Random event
  event: ReturnType<typeof generateRandomEvent>;

  // Story
  completedChapter: StoryChapter | null;
  chapterRewards: { libertas: number; fame: number; peculium: number; morale: number } | null;

  // Freedom
  freedomFulfilled: boolean;
  freedomLibertas: number;

  // Next month
  nextOrder: DominusOrder;
}

export function processGladiatorMonth(
  gmState: GladiatorModeState,
  gameState: { currentYear: number; currentMonth: number },
): MonthProcessingResult {
  const player = gmState.playerGladiator;
  const dominus = gmState.dominus;
  const companions = gmState.companions;
  const freedom = gmState.freedom;
  const currentOrder = gmState.currentOrder;
  const aliveCompanions = companions.filter(c => c.isAlive && !c.soldAway && !c.freed);

  const result: MonthProcessingResult = {
    summary: [],
    obeyed: true,
    healAmount: 0,
    staminaRestore: 0,
    fatigueChange: 0,
    moraleChange: 0,
    favorChange: 0,
    xpGained: 0,
    libertasGained: 0,
    fameGain: 0,
    wasSold: false,
    newDominus: null,
    newCompanions: [],
    newArrival: null,
    event: null,
    completedChapter: null,
    chapterRewards: null,
    freedomFulfilled: false,
    freedomLibertas: 0,
    nextOrder: { type: 'train', description: 'Train at the palus.', trainingRegimen: 'palus_drill' },
  };

  if (!player) return result;

  // 1. Check obedience
  const trained = gmState.trainedThisMonth ?? false;
  const fought = gmState.foughtThisMonth ?? false;
  if (currentOrder) {
    if (currentOrder.type === 'train' && !trained) result.obeyed = false;
    if (currentOrder.type === 'fight' && !fought) result.obeyed = false;
  }

  // 2. Process order effects
  if (currentOrder) {
    if (currentOrder.type === 'train' && trained) {
      result.summary.push('You trained as ordered.');
    } else if (currentOrder.type === 'train' && !trained) {
      result.summary.push('You disobeyed orders and did not train. Your dominus is displeased.');
    }

    if (currentOrder.type === 'fight' && fought) {
      result.summary.push('You fought in the arena as ordered.');
    } else if (currentOrder.type === 'fight' && !fought) {
      result.summary.push('You were ordered to fight but did not enter the arena. Your dominus is furious.');
    }

    if (currentOrder.type === 'rest') {
      result.healAmount += Math.floor(player.maxHP * 0.3);
      result.fatigueChange -= 30;
      result.summary.push(`Rested and recovered HP.`);
    }

    if (currentOrder.type === 'spar_partner') {
      result.xpGained += 10 + Math.floor(Math.random() * 10);
      result.summary.push(`Gained ${result.xpGained} XP as a sparring partner.`);
    }

    if (currentOrder.type === 'punishment') {
      result.healAmount -= 15;
      result.moraleChange -= 0.1;
      result.summary.push('Endured punishment. Lost HP and morale.');
    }

    const evaluation = evaluateMonthPerformance(dominus, currentOrder, result.obeyed, null, 0);
    result.favorChange = evaluation.favorChange;
    result.summary.push(evaluation.message);
  }

  // 3. Passive libertas
  const passiveLibertas = calculateLibertasFromMonth(player, dominus, gmState.totalMonthsServed);
  result.libertasGained = passiveLibertas;
  if (passiveLibertas > 0) {
    result.summary.push(`Earned ${passiveLibertas} Libertas from your reputation.`);
  }

  // 4. Natural recovery
  result.healAmount += Math.floor(player.maxHP * 0.1);
  result.staminaRestore = Math.min(player.maxStamina, player.currentStamina + Math.floor(player.maxStamina * 0.3));
  result.fatigueChange -= 10;

  // 5. Food quality morale
  const foodQuality = getDominusFoodQuality(dominus, dominus.favor + result.favorChange);
  const foodMoraleMap: Record<string, number> = { poor: -0.03, standard: 0, good: 0.02, excellent: 0.05 };
  result.moraleChange += foodMoraleMap[foodQuality] || 0;

  // 5.5 Companion relationship consequences
  const brothers = aliveCompanions.filter(c => c.relationship >= 60);
  const enemies = aliveCompanions.filter(c => c.relationship <= -60);

  if (brothers.length > 0) {
    const moraleBoost = brothers.length * 0.02;
    result.moraleChange += moraleBoost;
    result.summary.push(`Your ${brothers.length} brother${brothers.length > 1 ? 's' : ''} in the ludus lift your spirits (+morale).`);
  }

  if (enemies.length > 0 && Math.random() < 0.25) {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const sabotageRoll = Math.random();
    if (sabotageRoll < 0.4) {
      result.fatigueChange += 15;
      result.summary.push(`${enemy.gladiator.name} sabotaged your rest — you start the month more fatigued.`);
    } else if (sabotageRoll < 0.7) {
      result.moraleChange -= 0.05;
      result.summary.push(`${enemy.gladiator.name} spread rumors about you. Morale suffers.`);
    } else {
      result.healAmount -= 10;
      result.summary.push(`${enemy.gladiator.name} tripped you during exercise. You took minor damage.`);
    }
  }

  // 6. Check if being sold
  const newFavor = Math.max(0, Math.min(100, dominus.favor + result.favorChange));
  if (shouldSellGladiator(dominus, newFavor, gmState.monthsInCurrentLudus + 1)) {
    result.wasSold = true;
    result.newDominus = generateDominus([dominus.name, ...gmState.previousDomini]);
    result.newCompanions = generateInitialCompanions(gameState.currentYear, gameState.currentMonth, 4 + Math.floor(Math.random() * 3));
    result.summary.push(`You have been sold to ${result.newDominus.name} of ${result.newDominus.ludusName}!`);
  } else if (aliveCompanions.length < 4 && Math.random() < 0.2) {
    result.newArrival = generateCompanion(gameState.currentYear, gameState.currentMonth);
    result.summary.push(`A new gladiator, ${result.newArrival.gladiator.name}, has arrived at the ludus.`);
  }

  // 7. Random event
  result.event = generateRandomEvent(player, aliveCompanions, dominus, gmState.totalMonthsServed, freedom);

  // 8. Check story chapter completion
  const chapter = getCurrentChapter(gmState.storyChapter);
  if (chapter) {
    const rootState = { gladiatorMode: gmState, game: gameState };
    if (checkChapterCompletion(chapter, rootState)) {
      result.completedChapter = chapter;
      result.chapterRewards = chapter.rewards;
      result.summary.push(`Completed Chapter ${chapter.id}: ${chapter.title}!`);
    }
  }

  // 9. Check freedom path
  if (freedom.chosenPath) {
    const pathFulfilled = checkPathFulfilled(
      freedom.chosenPath, player, freedom, dominus,
      gmState.totalMonthsServed, gmState.peculium
    );
    if (pathFulfilled) {
      result.freedomFulfilled = true;
      result.freedomLibertas = 1000 - freedom.totalLibertas;
      result.summary.push('Your path to freedom is complete! The rudis awaits!');
    }
  }

  // 10. Passive fame
  if (player.wins > 0) {
    result.fameGain = 1 + Math.floor(player.wins * 0.1);
  }

  // 11. Generate next month's order
  const nextAlive = result.wasSold
    ? result.newCompanions.filter(c => c.isAlive && !c.soldAway && !c.freed)
    : aliveCompanions;
  const effectiveDominus = result.wasSold && result.newDominus ? result.newDominus : dominus;
  result.nextOrder = generateMonthlyOrder(
    effectiveDominus, player, nextAlive,
    result.wasSold ? 0 : gmState.monthsInCurrentLudus + 1,
    gmState.totalMonthsServed + 1
  );

  return result;
}

export function generateNewLudusCompanions(
  currentYear: number,
  currentMonth: number,
): Companion[] {
  return generateInitialCompanions(currentYear, currentMonth, 4 + Math.floor(Math.random() * 3));
}
