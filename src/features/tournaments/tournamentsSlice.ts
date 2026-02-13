import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tournament, TournamentParticipant, BracketMatch, CompletedTournament, TournamentTypeData, CombatLogEntry } from '@/types';

interface TournamentsState {
  activeTournament: Tournament | null;
  tournamentHistory: CompletedTournament[];
  selectedGladiatorIds: string[];
}

const initialState: TournamentsState = {
  activeTournament: null,
  tournamentHistory: [],
  selectedGladiatorIds: [],
};

const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    // Tournament creation
    createTournament: (state, action: PayloadAction<{
      id: string;
      type: string;
      typeData: TournamentTypeData;
      startDay: number;
      bracket: BracketMatch[];
      participants: TournamentParticipant[];
      playerGladiatorIds: string[];
    }>) => {
      state.activeTournament = {
        ...action.payload,
        currentRound: 0,
        rules: action.payload.typeData.rules,
        status: 'active',
      };
    },
    
    // Tournament progression
    completeMatch: (state, action: PayloadAction<{
      matchId: string;
      winner: TournamentParticipant;
      loser: TournamentParticipant;
      combatLog?: CombatLogEntry[];
    }>) => {
      if (!state.activeTournament) return;
      
      const match = state.activeTournament.bracket.find(m => m.id === action.payload.matchId);
      if (!match) return;
      
      match.completed = true;
      match.winner = action.payload.winner;
      match.needsPlayerAction = false;
      if (action.payload.combatLog) {
        match.combatLog = action.payload.combatLog;
      }
      
      // Update participant status
      const loserInTournament = state.activeTournament.participants.find(
        p => p.id === action.payload.loser.id
      );
      if (loserInTournament) {
        loserInTournament.eliminated = true;
        loserInTournament.roundEliminated = state.activeTournament.currentRound;
        loserInTournament.currentHP = action.payload.loser.currentHP;
        loserInTournament.currentStamina = action.payload.loser.currentStamina;
        loserInTournament.died = action.payload.loser.died;
      }
      
      // Update winner HP/stamina
      const winnerInTournament = state.activeTournament.participants.find(
        p => p.id === action.payload.winner.id
      );
      if (winnerInTournament) {
        winnerInTournament.currentHP = action.payload.winner.currentHP;
        winnerInTournament.currentStamina = action.payload.winner.currentStamina;
      }
    },
    
    advanceToNextRound: (state) => {
      if (!state.activeTournament) return;
      
      const currentRound = state.activeTournament.currentRound;
      const currentMatches = state.activeTournament.bracket.filter(m => m.round === currentRound);
      
      // Check if all matches are completed
      const allCompleted = currentMatches.every(m => m.completed);
      if (!allCompleted) return;
      
      // Get winners from current round
      const winners = currentMatches.map(m => m.winner).filter(w => w !== null) as TournamentParticipant[];
      
      // If only one winner, tournament is complete
      if (winners.length === 1) {
        state.activeTournament.status = 'completed';
        return;
      }
      
      // Create matches for next round
      const nextRound = currentRound + 1;
      const matchesInNextRound = Math.floor(winners.length / 2);
      
      for (let i = 0; i < matchesInNextRound; i++) {
        const match: BracketMatch = {
          id: `${state.activeTournament.id}-r${nextRound}-m${i}`,
          round: nextRound,
          position: i,
          participant1: winners[i * 2],
          participant2: winners[i * 2 + 1],
          winner: null,
          completed: false,
          needsPlayerAction: 
            winners[i * 2].isPlayerGladiator || 
            winners[i * 2 + 1].isPlayerGladiator,
        };
        state.activeTournament.bracket.push(match);
      }
      
      state.activeTournament.currentRound = nextRound;
    },
    
    // Update participant HP/Stamina
    updateParticipant: (state, action: PayloadAction<{
      participantId: string;
      updates: Partial<TournamentParticipant>;
    }>) => {
      if (!state.activeTournament) return;
      
      const participant = state.activeTournament.participants.find(
        p => p.id === action.payload.participantId
      );
      if (participant) {
        Object.assign(participant, action.payload.updates);
      }
    },
    
    // Complete tournament
    completeTournament: (state, action: PayloadAction<{
      completionDay: number;
      playerResults: CompletedTournament['playerResults'];
      totalGoldEarned: number;
      totalFameEarned: number;
    }>) => {
      if (!state.activeTournament) return;
      
      const completedTournament: CompletedTournament = {
        id: state.activeTournament.id,
        type: state.activeTournament.type,
        startDay: state.activeTournament.startDay,
        completionDay: action.payload.completionDay,
        playerResults: action.payload.playerResults,
        totalGoldEarned: action.payload.totalGoldEarned,
        totalFameEarned: action.payload.totalFameEarned,
      };
      
      state.tournamentHistory.push(completedTournament);
      state.activeTournament = null;
      state.selectedGladiatorIds = [];
    },
    
    // Exit/abandon tournament
    abandonTournament: (state) => {
      state.activeTournament = null;
      state.selectedGladiatorIds = [];
    },
    
    // Gladiator selection for entry
    setSelectedGladiators: (state, action: PayloadAction<string[]>) => {
      state.selectedGladiatorIds = action.payload;
    },
    
    clearSelectedGladiators: (state) => {
      state.selectedGladiatorIds = [];
    },
  },
});

export const {
  createTournament,
  completeMatch,
  advanceToNextRound,
  updateParticipant,
  completeTournament,
  abandonTournament,
  setSelectedGladiators,
  clearSelectedGladiators,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
