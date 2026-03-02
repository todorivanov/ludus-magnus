import type { Gladiator, FreedomProgress, FreedomPath, Dominus } from '@/types';

export interface FreedomPathInfo {
  id: FreedomPath;
  name: string;
  latin: string;
  description: string;
  icon: string;
  requirements: string[];
  progress: number; // 0-100
  available: boolean;
}

export function calculateFreedomPaths(
  gladiator: Gladiator,
  freedom: FreedomProgress,
  dominus: Dominus,
  totalMonths: number,
  peculium: number,
): FreedomPathInfo[] {
  return [
    {
      id: 'glory',
      name: 'Path of Glory',
      latin: 'Via Gloriae',
      description: 'Earn freedom through arena dominance. Win fights, win tournaments, earn the crowd\'s adoration.',
      icon: '🏆',
      requirements: [
        `Win 50 fights (${gladiator.wins}/50)`,
        `Reach fame 500 (${gladiator.fame}/500)`,
        `Win a championship`,
      ],
      progress: Math.min(100, (gladiator.wins / 50) * 40 + (gladiator.fame / 500) * 40 + (freedom.gloryPoints > 200 ? 20 : 0)),
      available: true,
    },
    {
      id: 'coin',
      name: 'Path of Coin',
      latin: 'Via Pecuniae',
      description: 'Save enough from your peculium to buy your own freedom. The better you are, the more expensive freedom becomes.',
      icon: '💰',
      requirements: [
        `Save ${freedom.manumissionPrice} gold (${peculium}/${freedom.manumissionPrice})`,
        `Dominus must be willing to sell (favor > 30)`,
      ],
      progress: Math.min(100, (peculium / Math.max(1, freedom.manumissionPrice)) * 80 + (dominus.favor > 30 ? 20 : 0)),
      available: peculium >= freedom.manumissionPrice * 0.1,
    },
    {
      id: 'patronage',
      name: 'Path of Patronage',
      latin: 'Via Patroni',
      description: 'A powerful Roman takes notice and sponsors your freedom. Build faction favor and attract a patron.',
      icon: '🏛️',
      requirements: [
        `Reach fame 300 (${gladiator.fame}/300)`,
        `Attract a patron (fame + crowd favor)`,
        `Complete patron quest chain`,
      ],
      progress: Math.min(100, (freedom.patronageFavor / 100) * 60 + (gladiator.fame / 300) * 40),
      available: gladiator.fame >= 100,
    },
    {
      id: 'mercy',
      name: 'Path of Mercy',
      latin: 'Via Misericordiae',
      description: 'Serve your dominus with such loyalty and distinction that he grants your freedom willingly.',
      icon: '🕊️',
      requirements: [
        `Dominus favor 90+ (${dominus.favor}/90)`,
        `Serve 36+ months (${totalMonths}/36)`,
        `Fame 200+ (${gladiator.fame}/200)`,
      ],
      progress: Math.min(100,
        (Math.min(dominus.favor, 90) / 90) * 40 +
        (Math.min(totalMonths, 36) / 36) * 30 +
        (Math.min(gladiator.fame, 200) / 200) * 30
      ),
      available: dominus.favor >= 50 && totalMonths >= 12,
    },
  ];
}

export function calculateLibertasFromFight(
  won: boolean,
  matchType: string,
  crowdFavor: number,
  killed: boolean,
): number {
  if (!won) return 0;

  let base = 0;
  switch (matchType) {
    case 'pitFight': base = 15; break;
    case 'munera': base = 20; break;
    case 'championship': base = 30; break;
    default: base = 15;
  }

  // Crowd favor bonus
  if (crowdFavor > 50) base += 5;
  if (crowdFavor > 80) base += 10;

  // Kill bonus (crowds love it, even if it's grim)
  if (killed) base += 5;

  return base;
}

export function calculateLibertasFromMonth(
  gladiator: Gladiator,
  dominus: Dominus,
  totalMonths: number,
): number {
  let points = 0;

  // Passive fame-based libertas
  if (gladiator.fame >= 100) points += 2;
  if (gladiator.fame >= 300) points += 3;
  if (gladiator.fame >= 500) points += 5;

  // Dominus favor contribution
  if (dominus.favor >= 60) points += 1;
  if (dominus.favor >= 80) points += 2;

  // Long service
  if (totalMonths >= 24) points += 1;
  if (totalMonths >= 36) points += 2;

  return points;
}

export function isFreed(freedom: FreedomProgress): boolean {
  return freedom.totalLibertas >= 1000;
}

export function checkPathFulfilled(
  path: FreedomPath,
  gladiator: Gladiator,
  freedom: FreedomProgress,
  dominus: Dominus,
  totalMonths: number,
  peculium: number,
): boolean {
  switch (path) {
    case 'glory':
      return gladiator.wins >= 50 && gladiator.fame >= 500;
    case 'coin':
      return peculium >= freedom.manumissionPrice && dominus.favor > 30;
    case 'patronage':
      return gladiator.fame >= 300 && freedom.patronageFavor >= 80;
    case 'mercy':
      return dominus.favor >= 90 && totalMonths >= 36 && gladiator.fame >= 200;
    default:
      return false;
  }
}

export function getLibertasTier(libertas: number): { name: string; latin: string; threshold: number } {
  if (libertas >= 900) return { name: 'On the Threshold', latin: 'Ad Limen', threshold: 900 };
  if (libertas >= 700) return { name: 'Renowned', latin: 'Celebris', threshold: 700 };
  if (libertas >= 500) return { name: 'The Crowd\'s Favorite', latin: 'Dilectus Populi', threshold: 500 };
  if (libertas >= 300) return { name: 'Known Name', latin: 'Nomen Notum', threshold: 300 };
  if (libertas >= 100) return { name: 'Survivor', latin: 'Superstes', threshold: 100 };
  return { name: 'Unknown', latin: 'Ignotus', threshold: 0 };
}

export function getPeculiumTipFromFight(won: boolean, crowdFavor: number, fame: number): number {
  if (!won) return Math.floor(Math.random() * 3);
  
  let base = 5 + Math.floor(Math.random() * 10);
  if (crowdFavor > 50) base += 5;
  if (crowdFavor > 80) base += 10;
  if (fame > 200) base += 5;
  
  return base;
}
