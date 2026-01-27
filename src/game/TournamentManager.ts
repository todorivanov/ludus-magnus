/**
 * Tournament Manager
 * 
 * Manages tournament creation, registration, brackets, and rewards
 */

import {
  Tournament,
  TournamentType,
  TournamentTier,
  TournamentBracket,
  TournamentRound,
  TournamentMatch,
} from '@/types/tournament.types';
import { CityId } from '@/types/location.types';

export class TournamentManager {
  private tournaments: Map<string, Tournament> = new Map();
  private activeTournaments: Tournament[] = [];
  
  /**
   * Create a new tournament
   */
  createTournament(config: {
    name: string;
    type: TournamentType;
    location: CityId;
    tier: TournamentTier;
    entryFee: number;
    minLevel: number;
    maxParticipants: number;
    goldPrize: number;
    reputationReward: number;
    equipment?: string[];
    startDate: number;
    durationDays: number;
  }): Tournament {
    const tournament: Tournament = {
      id: this.generateId(),
      name: config.name,
      type: config.type,
      location: config.location,
      tier: config.tier,
      
      entryFee: config.entryFee,
      minLevel: config.minLevel,
      maxParticipants: config.maxParticipants,
      
      goldPrize: config.goldPrize,
      reputationReward: config.reputationReward,
      equipment: config.equipment,
      
      startDate: config.startDate,
      endDate: config.startDate + config.durationDays * 24 * 60 * 60 * 1000,
      registrationDeadline: config.startDate - 24 * 60 * 60 * 1000, // 1 day before
      
      registeredGladiators: [],
      bracket: undefined,
      
      status: 'upcoming',
    };
    
    this.tournaments.set(tournament.id, tournament);
    this.activeTournaments.push(tournament);
    
    return tournament;
  }
  
  /**
   * Get tournament by ID
   */
  getTournament(tournamentId: string): Tournament | undefined {
    return this.tournaments.get(tournamentId);
  }
  
  /**
   * Get all active tournaments
   */
  getActiveTournaments(): Tournament[] {
    return this.activeTournaments;
  }
  
  /**
   * Get tournaments by tier
   */
  getTournamentsByTier(tier: TournamentTier): Tournament[] {
    return this.activeTournaments.filter((t) => t.tier === tier);
  }
  
  /**
   * Get tournaments by location
   */
  getTournamentsByLocation(location: CityId): Tournament[] {
    return this.activeTournaments.filter((t) => t.location === location);
  }
  
  // ===== REGISTRATION =====
  
  /**
   * Register gladiator for tournament
   */
  registerGladiator(
    tournamentId: string,
    gladiatorId: string,
    gladiatorLevel: number,
    currentGold?: number
  ): { success: boolean; message: string } {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament) {
      return { success: false, message: 'Tournament not found' };
    }
    
    // Check registration period
    const now = Date.now();
    if (now > tournament.registrationDeadline) {
      return { success: false, message: 'Registration deadline passed' };
    }
    
    // Check level requirement
    if (gladiatorLevel < tournament.minLevel) {
      return { success: false, message: `Minimum level ${tournament.minLevel} required` };
    }
    
    // Check if already registered
    if (tournament.registeredGladiators.includes(gladiatorId)) {
      return { success: false, message: 'Already registered' };
    }
    // Check gold requirement
    if (typeof currentGold === 'number' && currentGold < tournament.entryFee) {
      return { success: false, message: 'Not enough gold to register' };
    }
    // Check capacity
    if (tournament.registeredGladiators.length >= tournament.maxParticipants) {
      return { success: false, message: 'Tournament full' };
    }
    // Register
    tournament.registeredGladiators.push(gladiatorId);
    tournament.status = 'registration_open';
    return { success: true, message: 'Registered successfully' };
  }
  
  /**
   * Unregister gladiator from tournament
   */
  unregisterGladiator(tournamentId: string, gladiatorId: string): { success: boolean; message: string } {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament) {
      return { success: false, message: 'Tournament not found' };
    }
    
    // Check if tournament started
    if (tournament.status === 'in_progress' || tournament.status === 'completed') {
      return { success: false, message: 'Cannot unregister from active tournament' };
    }
    
    const index = tournament.registeredGladiators.indexOf(gladiatorId);
    if (index === -1) {
      return { success: false, message: 'Not registered' };
    }
    
    tournament.registeredGladiators.splice(index, 1);
    
    return { success: true, message: 'Unregistered successfully' };
  }
  
  // ===== BRACKET GENERATION =====
  
  /**
   * Generate tournament bracket
   */
  generateBracket(tournamentId: string): { success: boolean; message: string } {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament) {
      return { success: false, message: 'Tournament not found' };
    }
    
    if (tournament.registeredGladiators.length < 2) {
      return { success: false, message: 'Not enough participants' };
    }
    
    // Different bracket generation based on type
    switch (tournament.type) {
      case 'single_elimination':
        tournament.bracket = this.generateSingleEliminationBracket(tournament.registeredGladiators);
        break;
      case 'double_elimination':
        tournament.bracket = this.generateDoubleEliminationBracket(tournament.registeredGladiators);
        break;
      case 'round_robin':
        tournament.bracket = this.generateRoundRobinBracket(tournament.registeredGladiators);
        break;
      case 'gauntlet':
        tournament.bracket = this.generateGauntletBracket(tournament.registeredGladiators);
        break;
      default:
        return { success: false, message: 'Unsupported tournament type' };
    }
    
    tournament.status = 'in_progress';
    
    return { success: true, message: 'Bracket generated' };
  }
  
  /**
   * Generate single elimination bracket
   */
  private generateSingleEliminationBracket(gladiators: string[]): TournamentBracket {
    const shuffled = [...gladiators].sort(() => Math.random() - 0.5);
    
    // Pad to power of 2
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(shuffled.length)));
    const paddedGladiators = [...shuffled];
    while (paddedGladiators.length < nextPowerOf2) {
      paddedGladiators.push('BYE');
    }
    
    const rounds: TournamentRound[] = [];
    const totalRounds = Math.log2(paddedGladiators.length);
    
    // First round
    const firstRoundMatches: TournamentMatch[] = [];
    for (let i = 0; i < paddedGladiators.length; i += 2) {
      const fighter1 = paddedGladiators[i] as string;
      const fighter2 = paddedGladiators[i + 1] as string;
      firstRoundMatches.push({
        id: this.generateId(),
        fighter1Id: fighter1,
        fighter2Id: fighter2,
        completed: fighter2 === 'BYE', // Auto-complete BYE matches
        winnerId: fighter2 === 'BYE' ? fighter1 : undefined,
      });
    }
    
    rounds.push({
      roundNumber: 1,
      matches: firstRoundMatches,
    });
    
    // Create empty subsequent rounds
    for (let r = 2; r <= totalRounds; r++) {
      const matchCount = Math.pow(2, totalRounds - r);
      const matches: TournamentMatch[] = [];
      
      for (let m = 0; m < matchCount; m++) {
        matches.push({
          id: this.generateId(),
          fighter1Id: 'TBD',
          fighter2Id: 'TBD',
          completed: false,
        });
      }
      
      rounds.push({
        roundNumber: r,
        matches,
      });
    }
    
    return {
      rounds,
      currentRound: 1,
    };
  }
  
  /**
   * Generate double elimination bracket (simplified)
   */
  private generateDoubleEliminationBracket(gladiators: string[]): TournamentBracket {
    // For now, use single elimination with second chance
    return this.generateSingleEliminationBracket(gladiators);
  }
  
  /**
   * Generate round robin bracket
   */
  private generateRoundRobinBracket(gladiators: string[]): TournamentBracket {
    const rounds: TournamentRound[] = [];
    const n = gladiators.length;
    
    // Each fighter faces every other fighter once
    let matchId = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const roundIndex = Math.floor(matchId / Math.ceil(n / 2));
        
        if (!rounds[roundIndex]) {
          rounds.push({
            roundNumber: roundIndex + 1,
            matches: [],
          });
        }
        
        const currentRound = rounds[roundIndex];
        if (currentRound) {
          currentRound.matches.push({
            id: this.generateId(),
            fighter1Id: gladiators[i] as string,
            fighter2Id: gladiators[j] as string,
            completed: false,
          });
        }
        
        matchId++;
      }
    }
    
    return {
      rounds,
      currentRound: 1,
    };
  }
  
  /**
   * Generate gauntlet bracket
   */
  private generateGauntletBracket(gladiators: string[]): TournamentBracket {
    const rounds: TournamentRound[] = [];
    
    // Player fights all others sequentially
    const player = gladiators[0] as string;
    const opponents = gladiators.slice(1);
    
    opponents.forEach((opponent, index) => {
      rounds.push({
        roundNumber: index + 1,
        matches: [
          {
            id: this.generateId(),
            fighter1Id: player,
            fighter2Id: opponent,
            completed: false,
          },
        ],
      });
    });
    
    return {
      rounds,
      currentRound: 1,
    };
  }
  
  // ===== MATCH RESULTS =====
  
  /**
   * Record match result
   */
  recordMatchResult(
    tournamentId: string,
    matchId: string,
    winnerId: string
  ): { success: boolean; message: string } {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament || !tournament.bracket) {
      return { success: false, message: 'Tournament or bracket not found' };
    }
    
    // Find match
    let match: TournamentMatch | undefined;
    let roundIndex = -1;
    
    for (let i = 0; i < tournament.bracket.rounds.length; i++) {
      const round = tournament.bracket.rounds[i];
      if (round) {
        const found = round.matches.find((m) => m.id === matchId);
        if (found) {
          match = found;
          roundIndex = i;
          break;
        }
      }
    }
    
    if (!match) {
      return { success: false, message: 'Match not found' };
    }
    
    if (match.completed) {
      return { success: false, message: 'Match already completed' };
    }
    
    // Record result
    match.winnerId = winnerId;
    match.completed = true;
    
    // Check if round is complete
    const round = tournament.bracket.rounds[roundIndex];
    const roundComplete = round ? round.matches.every((m) => m.completed) : false;
    
    if (roundComplete) {
      // Advance to next round
      if (roundIndex + 1 < tournament.bracket.rounds.length) {
        tournament.bracket.currentRound++;
        this.advanceWinners(tournament, roundIndex);
      } else {
        // Tournament complete
        tournament.status = 'completed';
        tournament.bracket.winner = winnerId;
      }
    }
    
    return { success: true, message: 'Match result recorded' };
  }
  
  /**
   * Advance winners to next round
   */
  private advanceWinners(tournament: Tournament, completedRoundIndex: number): void {
    if (!tournament.bracket) return;
    
    const completedRound = tournament.bracket.rounds[completedRoundIndex];
    const nextRound = tournament.bracket.rounds[completedRoundIndex + 1];
    
    if (!nextRound) return;
    
    // Pair winners into next round matches
    const winners = completedRound
      ? completedRound.matches
          .filter((m) => m.winnerId)
          .map((m) => m.winnerId as string)
      : [];
    
    for (let i = 0; i < winners.length; i += 2) {
      const nextMatch = nextRound.matches[Math.floor(i / 2)];
      if (nextMatch) {
        nextMatch.fighter1Id = winners[i] as string;
        nextMatch.fighter2Id = winners[i + 1] || 'BYE';
        
        // Auto-complete if BYE
        if (nextMatch.fighter2Id === 'BYE') {
          nextMatch.completed = true;
          nextMatch.winnerId = nextMatch.fighter1Id;
        }
      }
    }
  }
  
  /**
   * Get current match for gladiator
   */
  getCurrentMatch(tournamentId: string, gladiatorId: string): TournamentMatch | null {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament || !tournament.bracket) return null;
    
    const currentRound = tournament.bracket.rounds[tournament.bracket.currentRound - 1];
    if (!currentRound) return null;
    
    return (
      currentRound.matches.find(
        (m) =>
          !m.completed && (m.fighter1Id === gladiatorId || m.fighter2Id === gladiatorId)
      ) || null
    );
  }
  
  // ===== UTILITY =====
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Update tournament statuses based on time
   */
  updateTournamentStatuses(): void {
    const now = Date.now();
    
    for (const tournament of this.activeTournaments) {
      if (tournament.status === 'upcoming' && now >= tournament.registrationDeadline) {
        tournament.status = 'registration_open';
      }
      
      if (tournament.status === 'registration_open' && now >= tournament.startDate) {
        // Auto-generate bracket if not done
        if (!tournament.bracket && tournament.registeredGladiators.length >= 2) {
          this.generateBracket(tournament.id);
        }
      }
      
      if (tournament.status === 'in_progress' && now >= tournament.endDate) {
        tournament.status = 'completed';
      }
    }
    
    // Remove completed tournaments from active list
    this.activeTournaments = this.activeTournaments.filter((t) => t.status !== 'completed');
  }
}

// Export singleton instance
export const tournamentManager = new TournamentManager();
