import { v4 as uuidv4 } from 'uuid';
import type { Companion, CompanionPersonality, Gladiator } from '@/types';
import { generateGladiator } from '@utils/gladiatorGenerator';

const PERSONALITIES: CompanionPersonality[] = ['aggressive', 'cunning', 'loyal', 'bitter', 'jovial'];

export function generateCompanion(
  currentYear: number,
  currentMonth: number,
  levelRange: [number, number] = [1, 5]
): Companion {
  const level = levelRange[0] + Math.floor(Math.random() * (levelRange[1] - levelRange[0] + 1));
  const gladiator = generateGladiator({ level, currentYear, currentMonth });

  const monthsActive = level * 4 + Math.floor(Math.random() * 12);
  let rank: 'tiro' | 'veteran' | 'champion' = 'tiro';
  if (monthsActive >= 24 || level >= 8) rank = 'champion';
  else if (monthsActive >= 6 || level >= 3) rank = 'veteran';

  return {
    id: uuidv4(),
    gladiator,
    relationship: -10 + Math.floor(Math.random() * 20),
    personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
    rank,
    isAlive: true,
    soldAway: false,
    freed: false,
  };
}

export function generateInitialCompanions(
  currentYear: number,
  currentMonth: number,
  count: number = 5
): Companion[] {
  const companions: Companion[] = [];
  
  // One champion
  const champion = generateCompanion(currentYear, currentMonth, [5, 8]);
  champion.rank = 'champion';
  champion.relationship = -5;
  companions.push(champion);

  // Some veterans
  for (let i = 0; i < Math.min(2, count - 1); i++) {
    const vet = generateCompanion(currentYear, currentMonth, [3, 5]);
    vet.rank = 'veteran';
    companions.push(vet);
  }

  // Rest are tiros
  for (let i = companions.length; i < count; i++) {
    const tiro = generateCompanion(currentYear, currentMonth, [1, 2]);
    tiro.rank = 'tiro';
    companions.push(tiro);
  }

  return companions;
}

export interface SparResult {
  xpGained: number;
  companionXpGained: number;
  playerInjured: boolean;
  companionInjured: boolean;
  relationshipChange: number;
  description: string;
}

export function resolveSpar(
  player: Gladiator,
  companion: Companion
): SparResult {
  const playerPower = player.stats.strength + player.stats.dexterity + player.level * 5;
  const compPower = companion.gladiator.stats.strength + companion.gladiator.stats.dexterity + companion.gladiator.level * 5;
  
  const playerWins = (playerPower + Math.random() * 30) > (compPower + Math.random() * 30);
  const baseXP = 15 + Math.floor(Math.random() * 10);
  const xpGained = playerWins ? baseXP + 5 : baseXP;
  const companionXpGained = playerWins ? baseXP : baseXP + 5;
  
  const injuryChance = 0.08;
  const playerInjured = Math.random() < injuryChance;
  const companionInjured = Math.random() < injuryChance;
  
  let relationshipChange = 0;
  if (companion.personality === 'loyal' || companion.personality === 'jovial') {
    relationshipChange = 3 + Math.floor(Math.random() * 5);
  } else if (companion.personality === 'aggressive') {
    relationshipChange = playerWins ? -2 : 2;
  } else if (companion.personality === 'bitter') {
    relationshipChange = playerWins ? -3 : 1;
  } else {
    relationshipChange = 1 + Math.floor(Math.random() * 3);
  }
  
  let description = '';
  if (playerWins && !playerInjured && !companionInjured) {
    description = `You bested ${companion.gladiator.name} in sparring. A good session.`;
  } else if (!playerWins && !playerInjured && !companionInjured) {
    description = `${companion.gladiator.name} got the better of you today. You learned from it.`;
  } else if (playerInjured) {
    description = `A hard blow from ${companion.gladiator.name} left you nursing a bruise. Training always carries risks.`;
  } else if (companionInjured) {
    description = `You hit ${companion.gladiator.name} harder than intended. The medicus will see to it.`;
  } else {
    description = `An intense sparring session with ${companion.gladiator.name}.`;
  }

  return { xpGained, companionXpGained, playerInjured, companionInjured, relationshipChange, description };
}

export interface TalkResult {
  moraleChange: number;
  relationshipChange: number;
  rumor: string | null;
  description: string;
}

export function resolveTalk(companion: Companion): TalkResult {
  const moraleChange = 0.02 + Math.random() * 0.05;
  let relationshipChange = 3 + Math.floor(Math.random() * 5);
  let rumor: string | null = null;
  let description = '';

  if (companion.personality === 'bitter') {
    relationshipChange = Math.max(1, relationshipChange - 2);
    description = `${companion.gladiator.name} is not much for conversation, but you sense a grudging respect.`;
  } else if (companion.personality === 'jovial') {
    relationshipChange += 2;
    description = `${companion.gladiator.name} shares stories and laughs. The ludus feels a little less like a prison tonight.`;
  } else if (companion.personality === 'cunning') {
    if (Math.random() < 0.4) {
      const rumors = [
        'The dominus is planning to sell one of us soon.',
        'A wealthy patron has been asking about the ludus fighters.',
        'There is talk of a grand tournament in the coming months.',
        'The doctore says the dominus lost heavily at dice last night.',
        'A new shipment of prisoners from the frontier is expected.',
        'One of the guards has been bribed. Someone is planning something.',
        'The editor of the next games favors flashy fighters.',
      ];
      rumor = rumors[Math.floor(Math.random() * rumors.length)];
      description = `${companion.gladiator.name} leans close and whispers a rumor.`;
    } else {
      description = `${companion.gladiator.name} watches you carefully as you speak. Hard to tell what he is thinking.`;
    }
  } else if (companion.personality === 'loyal') {
    relationshipChange += 3;
    description = `${companion.gladiator.name} speaks of loyalty and shared fate. A bond forms between you.`;
  } else {
    description = `You share a quiet moment with ${companion.gladiator.name}. Words are few but meaningful.`;
  }

  return { moraleChange, relationshipChange, rumor, description };
}

export interface ChallengeResult {
  playerWon: boolean;
  relationshipChange: number;
  dominusFavorChange: number;
  description: string;
}

export function resolveChallenge(player: Gladiator, companion: Companion): ChallengeResult {
  const playerPower = player.stats.strength + player.stats.agility + player.level * 8 + Math.random() * 20;
  const compPower = companion.gladiator.stats.strength + companion.gladiator.stats.agility + companion.gladiator.level * 8 + Math.random() * 20;

  const playerWon = playerPower > compPower;
  let relationshipChange = playerWon ? -8 : 3;
  let dominusFavorChange = 0;

  if (companion.personality === 'aggressive') {
    relationshipChange = playerWon ? -12 : -5;
  }

  if (playerWon && companion.rank === 'champion') {
    dominusFavorChange = 3;
  }

  const description = playerWon
    ? `You challenged ${companion.gladiator.name} and won. Your standing in the ludus rises.`
    : `You challenged ${companion.gladiator.name} but were bested. The others take note.`;

  return { playerWon, relationshipChange, dominusFavorChange, description };
}

export function getCompanionRelationshipTier(relationship: number) {
  if (relationship <= -60) return { tier: 'enemy' as const, label: 'Enemy', color: 'text-red-500' };
  if (relationship <= -20) return { tier: 'rival' as const, label: 'Rival', color: 'text-orange-400' };
  if (relationship <= 20) return { tier: 'neutral' as const, label: 'Neutral', color: 'text-roman-marble-400' };
  if (relationship <= 60) return { tier: 'friend' as const, label: 'Friend', color: 'text-green-400' };
  return { tier: 'brother' as const, label: 'Brother', color: 'text-roman-gold-400' };
}

export function getPersonalityLabel(personality: CompanionPersonality): string {
  const labels: Record<CompanionPersonality, string> = {
    aggressive: 'Aggressive',
    cunning: 'Cunning',
    loyal: 'Loyal',
    bitter: 'Bitter',
    jovial: 'Jovial',
  };
  return labels[personality];
}
