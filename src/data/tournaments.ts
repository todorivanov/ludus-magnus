import type { TournamentTypeData } from '@/types';

// Tournament type definitions
export const TOURNAMENT_TYPES: Record<string, TournamentTypeData> = {
  localTournament: {
    id: 'localTournament',
    name: 'Local Tournament',
    description: 'A modest tournament for aspiring gladiators. Fought to submission.',
    size: 8,
    rules: 'submission',
    entryFeePerGladiator: 50,
    minFame: 0,
    stageRewards: {
      quarterfinals: { gold: 75, fame: 5 },
      semifinals: { gold: 150, fame: 10 },
      finals: { gold: 300, fame: 20 },
    },
    placementBonuses: {
      winner: { gold: 500, fame: 50, ludusFame: 25 },
      runnerUp: { gold: 150, fame: 15, ludusFame: 10 },
    },
  },
  
  regionalChampionship: {
    id: 'regionalChampionship',
    name: 'Regional Championship',
    description: 'A prestigious regional tournament. The rules allow combat to the death, but submission is also accepted.',
    size: 16,
    rules: 'submission',
    entryFeePerGladiator: 150,
    minFame: 100,
    stageRewards: {
      roundOf16: { gold: 100, fame: 10 },
      quarterfinals: { gold: 250, fame: 25 },
      semifinals: { gold: 500, fame: 50 },
      finals: { gold: 1000, fame: 100 },
    },
    placementBonuses: {
      winner: { gold: 2000, fame: 200, ludusFame: 100 },
      runnerUp: { gold: 600, fame: 60, ludusFame: 30 },
    },
  },
  
  grandArena: {
    id: 'grandArena',
    name: 'Grand Arena Tournament',
    description: 'A brutal tournament fought sine missione - to the death. Only the strongest survive.',
    size: 16,
    rules: 'death',
    entryFeePerGladiator: 300,
    minFame: 300,
    stageRewards: {
      roundOf16: { gold: 200, fame: 20 },
      quarterfinals: { gold: 500, fame: 50 },
      semifinals: { gold: 1000, fame: 100 },
      finals: { gold: 2000, fame: 200 },
    },
    placementBonuses: {
      winner: { gold: 5000, fame: 500, ludusFame: 250 },
      runnerUp: { gold: 1500, fame: 150, ludusFame: 75 },
    },
  },
  
  imperialGames: {
    id: 'imperialGames',
    name: 'Imperial Games',
    description: 'The ultimate test of skill and survival. Fought before the Emperor himself, sine missione. Glory eternal awaits the victor.',
    size: 32,
    rules: 'death',
    entryFeePerGladiator: 1000,
    minFame: 600,
    stageRewards: {
      roundOf32: { gold: 300, fame: 30 },
      roundOf16: { gold: 600, fame: 60 },
      quarterfinals: { gold: 1200, fame: 120 },
      semifinals: { gold: 2400, fame: 240 },
      finals: { gold: 4800, fame: 480 },
    },
    placementBonuses: {
      winner: { gold: 15000, fame: 1000, ludusFame: 500 },
      runnerUp: { gold: 5000, fame: 300, ludusFame: 150 },
    },
  },
};

// Helper to get available tournaments based on player's ludus fame
export const getAvailableTournaments = (ludusFame: number): TournamentTypeData[] => {
  return Object.values(TOURNAMENT_TYPES).filter(
    tournament => ludusFame >= tournament.minFame
  );
};

// Helper to check if a gladiator can enter a tournament
export const canGladiatorEnterTournament = (
  gladiatorFame: number,
  gladiatorHP: number,
  gladiatorMaxHP: number,
  gladiatorStamina: number,
  gladiatorMaxStamina: number,
  isInjured: boolean,
  isTraining: boolean,
  isResting: boolean,
  tournamentMinFame: number
): { canEnter: boolean; reason?: string } => {
  if (gladiatorFame < tournamentMinFame) {
    return { canEnter: false, reason: 'Insufficient fame' };
  }
  
  if (isInjured) {
    return { canEnter: false, reason: 'Gladiator is injured' };
  }
  
  if (isTraining) {
    return { canEnter: false, reason: 'Gladiator is training' };
  }
  
  if (isResting) {
    return { canEnter: false, reason: 'Gladiator is resting' };
  }
  
  if (gladiatorHP < gladiatorMaxHP * 0.5) {
    return { canEnter: false, reason: 'HP too low (minimum 50%)' };
  }
  
  if (gladiatorStamina < gladiatorMaxStamina * 0.5) {
    return { canEnter: false, reason: 'Stamina too low (minimum 50%)' };
  }
  
  return { canEnter: true };
};

// Get round name based on bracket size and round number
export const getRoundName = (size: 8 | 16 | 32, round: number): string => {
  if (size === 8) {
    // Round 0 = Quarterfinals, 1 = Semifinals, 2 = Finals
    const names = ['Quarterfinals', 'Semifinals', 'Finals'];
    return names[round] || 'Finals';
  } else if (size === 16) {
    // Round 0 = Round of 16, 1 = Quarterfinals, 2 = Semifinals, 3 = Finals
    const names = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Finals'];
    return names[round] || 'Finals';
  } else {
    // size === 32
    // Round 0 = Round of 32, 1 = Round of 16, 2 = Quarterfinals, 3 = Semifinals, 4 = Finals
    const names = ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Finals'];
    return names[round] || 'Finals';
  }
};

// Get reward key for a round
export const getRewardKey = (size: 8 | 16 | 32, round: number): keyof TournamentTypeData['stageRewards'] | null => {
  if (size === 8) {
    const keys: (keyof TournamentTypeData['stageRewards'])[] = ['quarterfinals', 'semifinals', 'finals'];
    return keys[round] || null;
  } else if (size === 16) {
    const keys: (keyof TournamentTypeData['stageRewards'])[] = ['roundOf16', 'quarterfinals', 'semifinals', 'finals'];
    return keys[round] || null;
  } else {
    const keys: (keyof TournamentTypeData['stageRewards'])[] = ['roundOf32', 'roundOf16', 'quarterfinals', 'semifinals', 'finals'];
    return keys[round] || null;
  }
};
