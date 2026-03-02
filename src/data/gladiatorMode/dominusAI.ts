import type { 
  Dominus, DominusPersonality, DominusOrder, 
  Gladiator, Companion,
} from '@/types';

const DOMINUS_NAMES = [
  'Quintus Lentulus Batiatus', 'Gaius Petronius Arbiter', 'Marcus Crassus Frugi',
  'Lucius Tullius Decula', 'Publius Varinius Glaber', 'Titus Calavius Sabinus',
  'Gnaeus Cornelius Scipio', 'Sextus Pompeius Strabo', 'Aulus Gabinius Capito',
  'Decimus Junius Brutus', 'Servius Sulpicius Galba', 'Appius Claudius Pulcher',
  'Manius Aemilius Lepidus', 'Spurius Postumius Albinus', 'Numerius Fabius Pictor',
];

const LUDUS_NAMES = [
  'Ludus Magnus', 'Ludus Gallicus', 'Ludus Dacicus', 'Ludus Matutinus',
  'Ludus Maximus', 'Ludus Bestiarius', 'Ludus Julianus', 'Ludus Neronis',
  'Ludus Capuanus', 'Ludus Pompeiianus', 'Ludus Flavianus', 'Ludus Traianus',
  'Ludus Augustanus', 'Ludus Imperialis', 'Ludus Venatorius',
];

export function generateDominus(excludeNames: string[] = []): Dominus {
  const personalities: DominusPersonality[] = ['fair', 'harsh', 'cruel', 'indulgent', 'ambitious'];
  const availableNames = DOMINUS_NAMES.filter(n => !excludeNames.includes(n));
  const name = availableNames[Math.floor(Math.random() * availableNames.length)] || DOMINUS_NAMES[0];
  
  return {
    name,
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    ludusName: LUDUS_NAMES[Math.floor(Math.random() * LUDUS_NAMES.length)],
    wealth: 500 + Math.floor(Math.random() * 1500),
    favor: 35 + Math.floor(Math.random() * 15),
    politicalConnections: 20 + Math.floor(Math.random() * 40),
  };
}

export function generateMonthlyOrder(
  dominus: Dominus,
  player: Gladiator,
  companions: Companion[],
  monthsInLudus: number,
  totalMonths: number
): DominusOrder {
  const isInjured = player.isInjured || player.currentHP < player.maxHP * 0.4;
  const isTired = player.fatigue > 70;
  const isNewbie = monthsInLudus < 3;

  if (isInjured) {
    return {
      type: 'rest',
      description: 'You are injured. Rest and recover your strength. The arena will wait.',
    };
  }

  if (isTired && dominus.personality !== 'cruel') {
    return {
      type: 'rest',
      description: 'You have been pushed hard. Take this month to recover.',
    };
  }

  const fightChance = calculateFightChance(dominus, player, monthsInLudus, totalMonths);
  const roll = Math.random();

  if (roll < fightChance && !isNewbie) {
    const matchTypes = ['pitFight', 'munera'];
    if (player.fame >= 100) matchTypes.push('championship');
    const matchType = matchTypes[Math.floor(Math.random() * matchTypes.length)];
    const matchLabels: Record<string, string> = {
      pitFight: 'a pit fight',
      munera: 'the local munera',
      championship: 'the championship',
    };

    return {
      type: 'fight',
      description: `You will fight in ${matchLabels[matchType] || 'the arena'} this month. Prepare yourself.`,
      matchType,
    };
  }

  // Spar partner for another gladiator
  const aliveCompanions = companions.filter(c => c.isAlive && !c.soldAway && !c.freed);
  if (aliveCompanions.length > 0 && Math.random() < 0.15) {
    const target = aliveCompanions[Math.floor(Math.random() * aliveCompanions.length)];
    return {
      type: 'spar_partner',
      description: `You will spar with ${target.gladiator.name} to help prepare ${target.rank === 'champion' ? 'the champion' : 'a fellow gladiator'} for an upcoming fight.`,
      targetCompanionId: target.id,
    };
  }

  // Punishment (cruel dominus, or low obedience)
  if (dominus.personality === 'cruel' && Math.random() < 0.1) {
    return {
      type: 'punishment',
      description: 'Your dominus has ordered you to the punishment post. It seems his mood is foul today.',
    };
  }

  // Default: training
  const regimens = ['palus_drill', 'sparring', 'endurance', 'agility', 'strength', 'tactics', 'weapon_mastery', 'showmanship'];
  const regimen = regimens[Math.floor(Math.random() * regimens.length)];
  const regimenLabels: Record<string, string> = {
    palus_drill: 'the palus', sparring: 'sparring', endurance: 'endurance drills',
    agility: 'agility training', strength: 'strength exercises', tactics: 'tactical studies',
    weapon_mastery: 'weapon mastery', showmanship: 'showmanship practice',
  };

  return {
    type: 'train',
    description: `The doctore has assigned you to ${regimenLabels[regimen] || 'training'} this month.`,
    trainingRegimen: regimen,
  };
}

function calculateFightChance(dominus: Dominus, player: Gladiator, _monthsInLudus: number, totalMonths: number): number {
  let base = 0.3;

  // Personality modifiers
  if (dominus.personality === 'ambitious') base += 0.15;
  if (dominus.personality === 'harsh') base += 0.1;
  if (dominus.personality === 'cruel') base += 0.1;
  if (dominus.personality === 'indulgent') base -= 0.1;

  // Higher level gladiators fight more
  base += player.level * 0.02;

  // More experienced gladiators get more fights
  if (totalMonths > 12) base += 0.1;
  if (totalMonths > 24) base += 0.05;

  // Fame increases fight frequency
  base += player.fame * 0.0002;

  return Math.max(0.15, Math.min(0.6, base));
}

export function evaluateMonthPerformance(
  dominus: Dominus,
  order: DominusOrder,
  obeyed: boolean,
  wonFight: boolean | null,
  crowdFavor: number
): { favorChange: number; message: string } {
  let favorChange = 0;
  let message = '';

  if (!obeyed) {
    favorChange -= 15;
    if (dominus.personality === 'harsh' || dominus.personality === 'cruel') {
      favorChange -= 10;
    }
    message = 'Your disobedience has angered your dominus.';
    return { favorChange, message };
  }

  // Obeyed orders
  favorChange += 2;

  if (order.type === 'fight') {
    if (wonFight) {
      favorChange += 10;
      if (crowdFavor > 50) favorChange += 5;
      if (crowdFavor > 80) favorChange += 5;
      message = 'Your victory pleases your dominus greatly.';
      if (dominus.personality === 'ambitious') {
        favorChange += 3;
        message = 'Your victory brings glory to the ludus. Your dominus is very pleased.';
      }
    } else if (wonFight === false) {
      favorChange -= 5;
      if (dominus.personality === 'harsh') favorChange -= 5;
      if (dominus.personality === 'cruel') favorChange -= 8;
      message = 'Your defeat disappoints your dominus.';
    }
  } else if (order.type === 'train') {
    favorChange += 1;
    message = 'You have trained as ordered. Your dominus is satisfied.';
  } else if (order.type === 'spar_partner') {
    favorChange += 3;
    message = 'You served well as a sparring partner.';
  } else if (order.type === 'rest') {
    favorChange += 1;
    message = 'You rested as ordered.';
  }

  return { favorChange, message };
}

export function shouldSellGladiator(dominus: Dominus, favor: number, months: number): boolean {
  if (favor <= 15 && months >= 3) return true;
  if (dominus.personality === 'cruel' && favor < 25 && Math.random() < 0.15) return true;
  if (favor < 10) return true;
  return false;
}

export function getDominusPersonalityDescription(personality: DominusPersonality): string {
  const descriptions: Record<DominusPersonality, string> = {
    fair: 'A balanced man who rewards loyalty and punishes proportionally. Fair but firm.',
    harsh: 'Demands excellence. Punishment is severe, but he respects strength above all.',
    cruel: 'Arbitrary and vicious. His moods dictate your fate. Survival is its own reward.',
    indulgent: 'Generous with comforts and slow to anger, but may not push you to your potential.',
    ambitious: 'Sees you as an investment. He will push you hard and spend gold on your training.',
  };
  return descriptions[personality];
}

export function getDominusFoodQuality(dominus: Dominus, favor: number): 'poor' | 'standard' | 'good' | 'excellent' {
  if (dominus.personality === 'cruel' && favor < 30) return 'poor';
  if (dominus.personality === 'indulgent') return favor > 50 ? 'excellent' : 'good';
  if (favor <= 15) return 'poor';
  if (favor <= 35) return 'standard';
  if (favor <= 60) return 'good';
  return 'excellent';
}
