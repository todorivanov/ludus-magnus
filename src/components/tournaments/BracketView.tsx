import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import { startCombat } from '@features/combat/combatSlice';
import { 
  completeMatch, 
  advanceToNextRound,
  completeTournament,
  abandonTournament,
} from '@features/tournaments/tournamentsSlice';
import { 
  updateGladiator, 
  killGladiator,
  addFame as addGladiatorFame,
  recordWin,
  recordLoss,
} from '@features/gladiators/gladiatorsSlice';
import { addGold } from '@features/player/playerSlice';
import { addLudusFame } from '@features/fame/fameSlice';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ProgressBar, useToast } from '@components/ui';
import { TournamentEngine } from '@/game/TournamentEngine';
import { getRoundName, getRewardKey } from '@data/tournaments';
import type { BracketMatch, TournamentParticipant } from '@/types';
import { clsx } from 'clsx';

export const BracketView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { activeTournament } = useAppSelector(state => state.tournaments);
  const { roster } = useAppSelector(state => state.gladiators);
  const gameState = useAppSelector(state => state.game);
  const currentDay = ((gameState?.currentYear ?? 73) - 73) * 12 + (gameState?.currentMonth ?? 1);
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    winner: TournamentParticipant;
    loser: TournamentParticipant;
  } | null>(null);

  // Check if tournament is complete
  useEffect(() => {
    if (activeTournament && activeTournament.status === 'completed') {
      handleTournamentComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTournament?.status]);

  // Check for newly completed matches and apply rewards
  useEffect(() => {
    if (!activeTournament) return;
    
    const currentRoundMatches = activeTournament.bracket.filter(
      m => m.round === activeTournament.currentRound
    );
    
    // Find any completed matches where the winner is a player gladiator and hasn't had rewards applied yet
    currentRoundMatches.forEach(match => {
      if (match.completed && match.winner?.isPlayerGladiator && match.winner.gladiatorId) {
        // Check if we just came back from combat by seeing if the match was recently completed
        // We'll apply rewards once when the match is detected as complete
        const hasRewardsKey = `tournament_${activeTournament.id}_match_${match.id}_rewards`;
        const hasAppliedRewards = sessionStorage.getItem(hasRewardsKey);
        
        if (!hasAppliedRewards) {
          applyStageRewards(match.winner.gladiatorId);
          sessionStorage.setItem(hasRewardsKey, 'true');
        }
      }
    });
  }, [activeTournament?.bracket, activeTournament?.currentRound]);

  // Auto-advance to next round when all matches complete
  useEffect(() => {
    if (!activeTournament) return;
    
    const currentRoundMatches = activeTournament.bracket.filter(
      m => m.round === activeTournament.currentRound
    );
    const allMatchesComplete = currentRoundMatches.every(m => m.completed);
    
    if (allMatchesComplete && activeTournament.status === 'active') {
      // Small delay before advancing
      const timer = setTimeout(() => {
        dispatch(advanceToNextRound());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTournament, dispatch]);

  if (!activeTournament) {
    dispatch(setScreen('arena'));
    return null;
  }

  const currentRoundMatches = activeTournament.bracket.filter(
    m => m.round === activeTournament.currentRound
  );
  const roundName = getRoundName(activeTournament.typeData.size, activeTournament.currentRound);

  const handleMatchClick = (match: BracketMatch) => {
    if (!match.participant1 || !match.participant2) return;
    
    setSelectedMatch(match);
    
    // If it's a player gladiator match, show choice modal
    if (match.needsPlayerAction) {
      setShowChoiceModal(true);
    } else {
      // Auto-simulate AI vs AI matches
      handleSimulateMatch(match);
    }
  };

  const handleFightMatch = () => {
    if (!selectedMatch || !selectedMatch.participant1 || !selectedMatch.participant2) return;
    
    setShowChoiceModal(false);
    
    // Find the player's gladiator in this match
    const playerParticipant = selectedMatch.participant1.isPlayerGladiator 
      ? selectedMatch.participant1 
      : selectedMatch.participant2;
    const opponentParticipant = selectedMatch.participant1.isPlayerGladiator 
      ? selectedMatch.participant2 
      : selectedMatch.participant1;
    
    if (!playerParticipant.gladiatorId) return;
    
    // Get the actual gladiator from roster
    const gladiator = roster.find(g => g.id === playerParticipant.gladiatorId);
    if (!gladiator) return;
    
    // Create opponent data for combat
    const opponent = {
      name: opponentParticipant.name,
      class: opponentParticipant.class,
      level: opponentParticipant.level,
      stats: opponentParticipant.stats,
      hp: opponentParticipant.currentHP,
      stamina: opponentParticipant.currentStamina,
    };
    
    // Start combat using the combat slice
    dispatch(startCombat({
      gladiator: {
        ...gladiator,
        currentHP: playerParticipant.currentHP,
        currentStamina: playerParticipant.currentStamina,
      },
      opponent,
      matchType: 'tournament',
      rules: activeTournament.rules,
      maxRounds: 15,
      tournamentMatchId: selectedMatch.id,
    }));
    
    // Navigate to combat screen
    dispatch(setScreen('combat'));
  };

  const handleSimulateMatch = (match: BracketMatch) => {
    if (!match.participant1 || !match.participant2) return;
    
    setIsSimulating(true);
    setSelectedMatch(match);
    setShowChoiceModal(false);

    // Simulate with slight delay for effect
    setTimeout(() => {
      const result = TournamentEngine.simulateMatch(
        match.participant1!,
        match.participant2!,
        activeTournament.rules,
        15
      );

      setSimulationResult(result);
      setShowResultModal(true);
      setIsSimulating(false);

      // Complete the match
      dispatch(completeMatch({
        matchId: match.id,
        winner: result.winner,
        loser: result.loser,
        combatLog: result.combatLog,
      }));

      // Apply rewards for winner if it's a player gladiator
      if (result.winner.isPlayerGladiator && result.winner.gladiatorId) {
        applyStageRewards(result.winner.gladiatorId);
      }

      // Handle death if loser died
      if (result.loser.died && result.loser.isPlayerGladiator && result.loser.gladiatorId) {
        dispatch(killGladiator({
          id: result.loser.gladiatorId,
          deathDay: currentDay,
          causeOfDeath: 'Tournament combat',
          killedBy: result.winner.name,
        }));
        addToast({
          type: 'error',
          title: `${result.loser.name} has fallen in combat!`,
          icon: '💀',
          duration: 5000,
        });
      }

      // Update gladiator HP/stamina for both if they're player gladiators
      if (result.winner.isPlayerGladiator && result.winner.gladiatorId) {
        dispatch(updateGladiator({
          id: result.winner.gladiatorId,
          updates: {
            currentHP: result.winner.currentHP,
            currentStamina: result.winner.currentStamina,
          },
        }));
        dispatch(recordWin({ id: result.winner.gladiatorId, wasKill: result.loser.died }));
      }

      if (result.loser.isPlayerGladiator && result.loser.gladiatorId && !result.loser.died) {
        dispatch(updateGladiator({
          id: result.loser.gladiatorId,
          updates: {
            currentHP: result.loser.currentHP,
            currentStamina: result.loser.currentStamina,
          },
        }));
        dispatch(recordLoss({ id: result.loser.gladiatorId }));
      }
    }, 1500);
  };

  const handleSimulateAllAIMatches = () => {
    const aiMatches = currentRoundMatches.filter(m => !m.needsPlayerAction && !m.completed);
    aiMatches.forEach(match => {
      handleSimulateMatch(match);
    });
  };

  const applyStageRewards = (gladiatorId: string) => {
    const rewardKey = getRewardKey(
      activeTournament.typeData.size,
      activeTournament.currentRound
    );
    
    if (rewardKey && activeTournament.typeData.stageRewards[rewardKey]) {
      const rewards = activeTournament.typeData.stageRewards[rewardKey];
      
      // Apply gold
      dispatch(addGold({
        amount: rewards.gold,
        description: `Tournament: ${roundName} victory`,
        category: 'tournament',
        day: currentDay,
      }));
      
      // Apply gladiator fame
      dispatch(addGladiatorFame({
        id: gladiatorId,
        amount: rewards.fame,
      }));
      
      // Apply ludus fame (scaled down)
      dispatch(addLudusFame({
        amount: Math.floor(rewards.fame * 0.5),
        source: 'tournament',
        day: currentDay,
      }));

      addToast({
        type: 'gold',
        title: `Earned ${rewards.gold} gold and ${rewards.fame} fame!`,
        icon: '🏆',
        duration: 3000,
      });
    }
  };

  const handleTournamentComplete = () => {
    // Find the winner (participant who won the final match)
    const finalMatch = activeTournament.bracket.find(
      m => m.round === activeTournament.currentRound && m.completed
    );
    
    if (finalMatch && finalMatch.winner) {
      const winner = finalMatch.winner;
      const runnerUp = finalMatch.participant1?.id === winner.id 
        ? finalMatch.participant2 
        : finalMatch.participant1;

      // Apply placement bonuses
      if (winner.isPlayerGladiator && winner.gladiatorId) {
        const winnerBonus = activeTournament.typeData.placementBonuses.winner;
        
        dispatch(addGold({
          amount: winnerBonus.gold,
          description: `Tournament Champion: ${activeTournament.typeData.name}`,
          category: 'tournament',
          day: currentDay,
        }));
        
        dispatch(addGladiatorFame({
          id: winner.gladiatorId,
          amount: winnerBonus.fame,
        }));
        
        dispatch(addLudusFame({
          amount: winnerBonus.ludusFame,
          source: 'tournament_victory',
          day: currentDay,
        }));

        addToast({
          type: 'gold',
          title: `${winner.name} is the Tournament Champion!`,
          icon: '👑',
          duration: 5000,
        });
      }

      if (runnerUp && runnerUp.isPlayerGladiator && runnerUp.gladiatorId) {
        const runnerUpBonus = activeTournament.typeData.placementBonuses.runnerUp;
        
        dispatch(addGold({
          amount: runnerUpBonus.gold,
          description: `Tournament Runner-up: ${activeTournament.typeData.name}`,
          category: 'tournament',
          day: currentDay,
        }));
        
        dispatch(addGladiatorFame({
          id: runnerUp.gladiatorId,
          amount: runnerUpBonus.fame,
        }));
        
        dispatch(addLudusFame({
          amount: runnerUpBonus.ludusFame,
          source: 'tournament',
          day: currentDay,
        }));
      }

      // Calculate player results
      const playerResults = activeTournament.participants
        .filter(p => p.isPlayerGladiator && p.gladiatorId)
        .map(p => ({
          gladiatorId: p.gladiatorId!,
          gladiatorName: p.name,
          roundReached: p.roundEliminated ?? activeTournament.currentRound,
          died: p.died,
          won: p.id === winner.id,
        }));

      // Complete tournament
      dispatch(completeTournament({
        completionDay: currentDay,
        playerResults,
        totalGoldEarned: 0, // TODO: Track this properly
        totalFameEarned: 0, // TODO: Track this properly
      }));

      // Return to arena screen
      setTimeout(() => {
        dispatch(setScreen('arena'));
      }, 3000);
    }
  };

  const handleAbandonTournament = () => {
    if (window.confirm('Are you sure you want to abandon this tournament? Entry fees will not be refunded.')) {
      dispatch(abandonTournament());
      dispatch(setScreen('arena'));
      addToast({
        type: 'error',
        title: 'Tournament abandoned',
        icon: '❌',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
            {activeTournament.typeData.name}
          </h1>
          <p className="text-roman-marble-400">
            {roundName} • {activeTournament.rules === 'death' ? 'Sine Missione' : 'Submission Rules'}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleAbandonTournament}
        >
          Abandon Tournament
        </Button>
      </div>

      {/* Current Round Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{roundName}</span>
            {currentRoundMatches.some(m => !m.needsPlayerAction && !m.completed) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSimulateAllAIMatches}
                disabled={isSimulating}
              >
                Simulate All AI Matches
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {currentRoundMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onMatchClick={() => handleMatchClick(match)}
                isSimulating={isSimulating && selectedMatch?.id === match.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bracket Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <BracketDiagram
            bracket={activeTournament.bracket}
            currentRound={activeTournament.currentRound}
            size={activeTournament.typeData.size}
          />
        </CardContent>
      </Card>

      {/* Choice Modal - Fight or Simulate */}
      {showChoiceModal && selectedMatch && (
        <Modal
          isOpen={showChoiceModal}
          onClose={() => setShowChoiceModal(false)}
          title="Tournament Match"
        >
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-xl font-bold text-roman-gold-400 mb-2">
                Choose Your Approach
              </h3>
              <p className="text-roman-marble-400">
                Will you fight this match yourself or let it be simulated?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-roman-stone-800/50 p-4 rounded">
                <p className="font-semibold text-roman-gold-400 mb-2">
                  {selectedMatch.participant1?.name}
                </p>
                <p className="text-sm text-roman-marble-400">
                  HP: {selectedMatch.participant1?.currentHP}/{selectedMatch.participant1?.maxHP}
                </p>
              </div>
              <div className="bg-roman-stone-800/50 p-4 rounded">
                <p className="font-semibold text-roman-marble-400 mb-2">
                  {selectedMatch.participant2?.name}
                </p>
                <p className="text-sm text-roman-marble-400">
                  HP: {selectedMatch.participant2?.currentHP}/{selectedMatch.participant2?.maxHP}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleFightMatch}
                className="flex-1"
              >
                🎮 Fight
              </Button>
              <Button
                onClick={() => handleSimulateMatch(selectedMatch)}
                variant="ghost"
                className="flex-1"
              >
                ⚡ Simulate
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Result Modal */}
      {showResultModal && simulationResult && (
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Match Result"
        >
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl mb-3">
                {simulationResult.loser.died ? '💀' : '🏆'}
              </div>
              <h3 className="text-2xl font-bold text-roman-gold-400 mb-2">
                {simulationResult.winner.name} Wins!
              </h3>
              {simulationResult.loser.died ? (
                <p className="text-roman-blood-400">
                  {simulationResult.loser.name} has fallen in combat
                </p>
              ) : (
                <p className="text-roman-marble-400">
                  {simulationResult.loser.name} was defeated
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-roman-stone-800/50 p-4 rounded">
                <p className="font-semibold text-roman-gold-400 mb-2">{simulationResult.winner.name}</p>
                <p className="text-sm text-roman-marble-400">
                  HP: {simulationResult.winner.currentHP}/{simulationResult.winner.maxHP}
                </p>
              </div>
              <div className="bg-roman-stone-800/50 p-4 rounded">
                <p className="font-semibold text-roman-marble-400 mb-2">{simulationResult.loser.name}</p>
                <p className="text-sm text-roman-marble-500">
                  HP: {simulationResult.loser.currentHP}/{simulationResult.loser.maxHP}
                </p>
              </div>
            </div>

            <Button onClick={() => setShowResultModal(false)} className="w-full">
              Continue
            </Button>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

// Match Card Component
const MatchCard: React.FC<{
  match: BracketMatch;
  onMatchClick: () => void;
  isSimulating: boolean;
}> = ({ match, onMatchClick, isSimulating }) => {
  if (!match.participant1 || !match.participant2) return null;

  return (
    <div className={clsx(
      'border-2 rounded-lg p-4',
      match.completed ? 'border-roman-stone-700 opacity-75' : 'border-roman-gold-500'
    )}>
      <div className="space-y-3">
        {/* Participant 1 */}
        <ParticipantDisplay
          participant={match.participant1}
          isWinner={match.winner?.id === match.participant1.id}
        />

        <div className="text-center text-roman-marble-500 text-sm font-bold">VS</div>

        {/* Participant 2 */}
        <ParticipantDisplay
          participant={match.participant2}
          isWinner={match.winner?.id === match.participant2.id}
        />

        {/* Action Button */}
        {!match.completed && (
          <Button
            onClick={onMatchClick}
            disabled={isSimulating}
            className="w-full"
            size="sm"
          >
            {isSimulating ? 'Simulating...' : match.needsPlayerAction ? 'Fight / Simulate' : 'Simulate'}
          </Button>
        )}

        {match.completed && match.winner && (
          <div className="text-center text-sm text-roman-gold-400 font-semibold">
            {match.winner.name} advances
          </div>
        )}
      </div>
    </div>
  );
};

// Participant Display Component
const ParticipantDisplay: React.FC<{
  participant: TournamentParticipant;
  isWinner: boolean;
}> = ({ participant, isWinner }) => {
  const hpPercent = (participant.currentHP / participant.maxHP) * 100;

  return (
    <div className={clsx(
      'p-2 rounded',
      participant.isPlayerGladiator ? 'bg-roman-gold-500/10' : 'bg-roman-stone-800/50',
      isWinner && 'ring-2 ring-roman-gold-400'
    )}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <p className={clsx(
            'font-semibold text-sm',
            participant.isPlayerGladiator ? 'text-roman-gold-400' : 'text-roman-marble-300'
          )}>
            {participant.name}
          </p>
          <p className="text-xs text-roman-marble-500">
            Lv{participant.level} {participant.class}
          </p>
        </div>
        {participant.died && <span className="text-lg">💀</span>}
      </div>
      <ProgressBar
        value={participant.currentHP}
        max={participant.maxHP}
        variant={hpPercent > 60 ? 'health' : hpPercent > 30 ? 'stamina' : 'health'}
        showLabel
        size="sm"
      />
    </div>
  );
};

// Bracket Diagram Component
const BracketDiagram: React.FC<{
  bracket: BracketMatch[];
  currentRound: number;
  size: 8 | 16 | 32;
}> = ({ bracket, currentRound, size }) => {
  const rounds = size === 8 ? 3 : size === 16 ? 4 : 5;
  
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 min-w-max p-4">
        {Array.from({ length: rounds }).map((_, roundIndex) => {
          const roundMatches = bracket.filter(m => m.round === roundIndex);
          const roundName = getRoundName(size, roundIndex);
          
          return (
            <div key={roundIndex} className="flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-roman-gold-400 mb-3 text-center">
                {roundName}
              </h4>
              <div className="space-y-4">
                {roundMatches.map(match => (
                  <div
                    key={match.id}
                    className={clsx(
                      'border-2 rounded p-2 min-w-[180px]',
                      match.round === currentRound ? 'border-roman-gold-500' : 'border-roman-stone-700',
                      match.completed && 'opacity-60'
                    )}
                  >
                    {match.participant1 && (
                      <div className={clsx(
                        'text-xs py-1 px-2 rounded mb-1',
                        match.winner?.id === match.participant1.id && 'bg-roman-gold-500/20 font-semibold'
                      )}>
                        {match.participant1.name}
                      </div>
                    )}
                    {match.participant2 && (
                      <div className={clsx(
                        'text-xs py-1 px-2 rounded',
                        match.winner?.id === match.participant2.id && 'bg-roman-gold-500/20 font-semibold'
                      )}>
                        {match.participant2.name}
                      </div>
                    )}
                    {!match.participant1 && !match.participant2 && (
                      <div className="text-xs text-roman-marble-600 py-1 px-2">
                        TBD
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
