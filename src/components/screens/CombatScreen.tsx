import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import { 
  endCombat,
} from '@features/combat/combatSlice';
import { 
  updateHP, 
  updateStamina, 
  addFame, 
  recordWin, 
  recordLoss,
  addInjury,
} from '@features/gladiators/gladiatorsSlice';
import { addGold } from '@features/player/playerSlice';
import { addLudusFame } from '@features/fame/fameSlice';
import { incrementObjective, updateObjective } from '@features/quests/questsSlice';
import { getQuestById } from '@data/quests';
import { Card, CardContent, Button, ProgressBar } from '@components/ui';
import { 
  COMBAT_ACTIONS, 
  STATUS_EFFECTS, 
  MATCH_TYPES,
  CLASS_SPECIALS,
  type ActionType,
} from '@data/combat';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { CombatEngine, type CombatState, type CombatLogEntry } from '../../game/CombatEngine';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

export const CombatScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const combatState = useAppSelector(state => state.combat);
  const gameStateRedux = useAppSelector(state => state.game);
  const currentDay = gameStateRedux?.currentDay || 1;
  const questsState = useAppSelector(state => state.quests);
  const activeQuests = questsState?.activeQuests || [];
  const currentLudusFame = useAppSelector(state => state.fame?.ludusFame || 0);
  
  const [engine, setEngine] = useState<CombatEngine | null>(null);
  const [gameState, setGameState] = useState<CombatState | null>(null);
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const logRef = useRef<HTMLDivElement>(null);

  // Initialize combat engine
  useEffect(() => {
    if (combatState?.gladiator && combatState?.opponent && !engine) {
      const newEngine = new CombatEngine(
        {
          id: combatState.gladiator.id,
          name: combatState.gladiator.name,
          class: combatState.gladiator.class,
          level: combatState.gladiator.level,
          stats: combatState.gladiator.stats,
          currentHP: combatState.gladiator.currentHP,
          maxHP: combatState.gladiator.maxHP,
          currentStamina: combatState.gladiator.currentStamina,
          maxStamina: combatState.gladiator.maxStamina,
          morale: combatState.gladiator.morale * 100, // Convert from 0.1-1.5 to percentage
        },
        combatState.opponent,
        combatState.matchType,
        combatState.rules,
        combatState.maxRounds
      );
      
      setEngine(newEngine);
      setGameState(newEngine.getState());
    }
  }, [combatState, engine]);

  // Auto-scroll combat log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  // Handle action selection
  const handleAction = async (action: ActionType) => {
    if (!engine || !gameState || isAnimating || gameState.phase === 'ended') return;

    setIsAnimating(true);

    // Execute the action
    const entries = engine.executePlayerAction(action);
    
    // Animate log entries
    for (const entry of entries) {
      setCombatLog(prev => [...prev, entry]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Update state
    const newState = engine.getState();
    setGameState(newState);

    // Check for combat end
    if (newState.phase === 'ended') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowResults(true);
    }

    setIsAnimating(false);
  };

  // Handle combat end
  const handleEndCombat = () => {
    if (!gameState || !combatState?.gladiator) return;

    const isVictory = gameState.winner === gameState.player.name;
    const matchData = MATCH_TYPES[combatState.matchType];

    // Update gladiator HP/Stamina
    dispatch(updateHP({ 
      id: combatState.gladiator.id, 
      hp: gameState.player.currentHP 
    }));
    dispatch(updateStamina({ 
      id: combatState.gladiator.id, 
      stamina: gameState.player.currentStamina 
    }));

    if (isVictory) {
      // Victory rewards
      const goldReward = Math.round(50 * matchData.rewardMultiplier);
      const fameReward = Math.round(20 * matchData.fameMultiplier);

      dispatch(addGold({
        amount: goldReward,
        description: `Victory: ${matchData.name}`,
        category: 'arena',
        day: currentDay,
      }));
      dispatch(addFame({ id: combatState.gladiator.id, amount: fameReward }));
      dispatch(recordWin({ id: combatState.gladiator.id, wasKill: gameState.opponent.currentHP <= 0 }));
      
      // Also add ludus fame for victories
      dispatch(addLudusFame({
        amount: fameReward,
        source: `Arena Victory: ${matchData.name}`,
        day: currentDay,
      }));
      
      // Calculate new ludus fame for objective updates
      const newLudusFame = currentLudusFame + fameReward;

      // Update quest objectives for wins and fame
      activeQuests.forEach(activeQuest => {
        const questData = getQuestById(activeQuest.questId);
        if (questData) {
          questData.objectives.forEach(objective => {
            if (objective.type === 'win_matches') {
              dispatch(incrementObjective({
                questId: activeQuest.questId,
                objectiveId: objective.id,
                amount: 1,
                required: objective.required,
              }));
            }
            // Update fame objectives with current total fame
            if (objective.type === 'gain_fame') {
              dispatch(updateObjective({
                questId: activeQuest.questId,
                objectiveId: objective.id,
                progress: newLudusFame,
                required: objective.required,
              }));
            }
          });
        }
      });
    } else {
      // Defeat
      dispatch(recordLoss({ id: combatState.gladiator.id }));

      // Check for death in death match
      if (matchData.rules === 'death' && gameState.player.currentHP <= 0) {
        // Gladiator dies - would need to remove them
        // For now, just add a severe injury
        dispatch(addInjury({
          id: combatState.gladiator.id,
          injury: {
            id: uuidv4(),
            type: 'Near-fatal wound',
            severity: 'major',
            statPenalty: { strength: -10, agility: -10 },
            recoveryDays: 30,
            daysRemaining: 30,
          },
        }));
      }
    }

    dispatch(endCombat());
    dispatch(setScreen('arena'));
  };

  // If no combat state, show error
  if (!combatState?.gladiator || !gameState) {
    return (
      <div className="min-h-screen bg-roman-marble-900 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-roman-marble-400">No active combat</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => dispatch(setScreen('arena'))}
            >
              Return to Arena
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const player = gameState.player;
  const opponent = gameState.opponent;

  return (
    <div className="min-h-screen bg-gradient-to-b from-roman-marble-900 via-roman-marble-800 to-roman-marble-900 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Match Info Header */}
        <div className="text-center">
          <div className="font-roman text-xl text-roman-gold-500">
            {MATCH_TYPES[combatState.matchType]?.name || 'Combat'}
          </div>
          <div className="text-roman-marble-400 text-sm">
            Turn {gameState.turn} / {gameState.maxRounds} • {combatState.rules} rules
          </div>
        </div>

        {/* Combatants Display */}
        <div className="grid grid-cols-3 gap-8">
          {/* Player */}
          <CombatantDisplay
            combatant={player}
            isPlayer={true}
            classData={GLADIATOR_CLASSES[player.class]}
          />

          {/* VS / Turn Indicator */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-5xl font-roman text-roman-crimson-500"
            >
              VS
            </motion.div>
            {gameState.phase !== 'ended' && (
              <div className="mt-4 text-roman-marble-400 text-sm">
                {isAnimating ? 'Resolving...' : 'Your turn'}
              </div>
            )}
          </div>

          {/* Opponent */}
          <CombatantDisplay
            combatant={opponent}
            isPlayer={false}
            classData={GLADIATOR_CLASSES[opponent.class]}
          />
        </div>

        {/* Action Buttons */}
        {gameState.phase !== 'ended' && (
          <Card>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {Object.values(COMBAT_ACTIONS).map(action => {
                  const canPerform = engine?.canPerformAction(player, action.id);
                  const isSpecial = action.id === 'special';
                  const specialData = isSpecial ? CLASS_SPECIALS[player.class] : null;

                  return (
                    <ActionButton
                      key={action.id}
                      action={action}
                      specialData={specialData}
                      canPerform={canPerform?.canPerform ?? false}
                      reason={canPerform?.reason}
                      currentStamina={player.currentStamina}
                      isAnimating={isAnimating}
                      onClick={() => handleAction(action.id)}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Combat Log */}
        <Card>
          <CardContent>
            <div className="text-sm text-roman-marble-500 mb-2">Combat Log</div>
            <div 
              ref={logRef}
              className="h-40 overflow-y-auto space-y-1 bg-roman-marble-900 p-3 rounded"
            >
              {combatLog.length === 0 ? (
                <div className="text-roman-marble-600 text-center py-4">
                  Combat begins! Select an action.
                </div>
              ) : (
                combatLog.map((entry, index) => (
                  <LogEntry key={index} entry={entry} playerName={player.name} />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-roman-marble-800 border-2 border-roman-gold-600 rounded-lg p-8 max-w-md w-full mx-4"
              >
                <ResultsDisplay
                  gameState={gameState}
                  matchType={combatState.matchType}
                  onClose={handleEndCombat}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Combatant Display Component
interface CombatantDisplayProps {
  combatant: CombatState['player'];
  isPlayer: boolean;
  classData: typeof GLADIATOR_CLASSES[keyof typeof GLADIATOR_CLASSES];
}

const CombatantDisplay: React.FC<CombatantDisplayProps> = ({
  combatant,
  isPlayer,
  classData,
}) => {
  const hpPercent = (combatant.currentHP / combatant.maxHP) * 100;

  return (
    <Card variant={isPlayer ? 'default' : 'default'}>
      <CardContent>
        <div className={clsx('text-center', !isPlayer && 'text-roman-crimson-400')}>
          <motion.div 
            className="text-5xl mb-2"
            animate={combatant.currentHP < combatant.maxHP * 0.3 ? { x: [-2, 2, -2] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {classData?.icon}
          </motion.div>
          <div className={clsx(
            'font-roman text-lg',
            isPlayer ? 'text-roman-gold-400' : 'text-roman-crimson-400'
          )}>
            {combatant.name}
          </div>
          <div className="text-sm text-roman-marble-400">
            Level {combatant.level} {classData?.name}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* HP Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-roman-marble-400">HP</span>
              <span className={clsx(
                hpPercent > 50 ? 'text-health-high' :
                hpPercent > 25 ? 'text-health-medium' : 'text-health-low'
              )}>
                {combatant.currentHP} / {combatant.maxHP}
              </span>
            </div>
            <ProgressBar value={combatant.currentHP} max={combatant.maxHP} variant="health" />
          </div>

          {/* Stamina Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-roman-marble-400">Stamina</span>
              <span className="text-stamina-full">
                {Math.round(combatant.currentStamina)} / {combatant.maxStamina}
              </span>
            </div>
            <ProgressBar value={combatant.currentStamina} max={combatant.maxStamina} variant="stamina" />
          </div>

          {/* Status Effects */}
          {combatant.statusEffects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {combatant.statusEffects.map((status: { effect: keyof typeof STATUS_EFFECTS; duration: number }, idx: number) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 bg-roman-marble-700 rounded"
                  title={STATUS_EFFECTS[status.effect].description}
                >
                  {STATUS_EFFECTS[status.effect].icon} {status.duration}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Action Button Component
interface ActionButtonProps {
  action: typeof COMBAT_ACTIONS[keyof typeof COMBAT_ACTIONS];
  specialData: typeof CLASS_SPECIALS[keyof typeof CLASS_SPECIALS] | null;
  canPerform: boolean;
  reason?: string;
  currentStamina: number;
  isAnimating: boolean;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  specialData,
  canPerform,
  reason,
  currentStamina,
  isAnimating,
  onClick,
}) => {
  const displayName = specialData?.name || action.name;
  const displayDesc = specialData?.description || action.description;
  const hasEnoughStamina = action.staminaCost <= 0 || currentStamina >= action.staminaCost;

  return (
    <button
      onClick={onClick}
      disabled={!canPerform || isAnimating || !hasEnoughStamina}
      className={clsx(
        'p-3 rounded-lg border transition-all text-left',
        canPerform && hasEnoughStamina && !isAnimating
          ? 'border-roman-bronze-600 bg-roman-marble-800 hover:border-roman-gold-500 hover:bg-roman-marble-700 cursor-pointer'
          : 'border-roman-marble-700 bg-roman-marble-900 opacity-50 cursor-not-allowed'
      )}
      title={reason || displayDesc}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{action.icon}</span>
        <span className="font-roman text-sm text-roman-marble-100">{displayName}</span>
      </div>
      <div className="text-xs text-roman-marble-500 mb-1 line-clamp-1">
        {displayDesc}
      </div>
      <div className="text-xs">
        {action.staminaCost > 0 ? (
          <span className={hasEnoughStamina ? 'text-stamina-full' : 'text-roman-crimson-400'}>
            -{action.staminaCost} Stamina
          </span>
        ) : action.staminaCost < 0 ? (
          <span className="text-health-high">+{-action.staminaCost} Stamina</span>
        ) : (
          <span className="text-roman-marble-600">No cost</span>
        )}
      </div>
    </button>
  );
};

// Log Entry Component
interface LogEntryProps {
  entry: CombatLogEntry;
  playerName: string;
}

const LogEntry: React.FC<LogEntryProps> = ({ entry, playerName }) => {
  const isPlayerAction = entry.actor === playerName;

  return (
    <motion.div
      initial={{ opacity: 0, x: isPlayerAction ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={clsx(
        'text-xs p-2 rounded',
        isPlayerAction ? 'bg-roman-gold-500/10 text-roman-gold-400' : 'bg-roman-crimson-500/10 text-roman-crimson-400'
      )}
    >
      <span className="text-roman-marble-500">[Turn {entry.turn}]</span>{' '}
      {entry.message}
      {entry.isCrit && <span className="text-roman-gold-500"> (CRITICAL!)</span>}
    </motion.div>
  );
};

// Results Display Component
interface ResultsDisplayProps {
  gameState: CombatState;
  matchType: string;
  onClose: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  gameState,
  matchType,
  onClose,
}) => {
  const isVictory = gameState.winner === gameState.player.name;
  const matchData = MATCH_TYPES[matchType];

  const goldReward = isVictory ? Math.round(50 * matchData.rewardMultiplier) : 0;
  const fameReward = isVictory ? Math.round(20 * matchData.fameMultiplier) : -5;

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={clsx(
          'text-6xl mb-4',
          isVictory ? 'text-roman-gold-500' : 'text-roman-crimson-500'
        )}
      >
        {isVictory ? '🏆' : '💀'}
      </motion.div>

      <h2 className={clsx(
        'font-roman text-3xl mb-2',
        isVictory ? 'text-roman-gold-500' : 'text-roman-crimson-500'
      )}>
        {isVictory ? 'VICTORY!' : 'DEFEAT'}
      </h2>

      <p className="text-roman-marble-400 mb-6">
        {isVictory
          ? `${gameState.player.name} has triumphed in the arena!`
          : `${gameState.player.name} has fallen to ${gameState.opponent.name}.`
        }
      </p>

      <div className="bg-roman-marble-900 p-4 rounded-lg mb-6">
        <div className="text-sm text-roman-marble-500 mb-3">Results</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-roman-marble-400 text-sm">Gold</div>
            <div className={clsx(
              'font-roman text-xl',
              goldReward > 0 ? 'text-roman-gold-400' : 'text-roman-marble-600'
            )}>
              {goldReward > 0 ? `+${goldReward}` : '0'}g
            </div>
          </div>
          <div>
            <div className="text-roman-marble-400 text-sm">Fame</div>
            <div className={clsx(
              'font-roman text-xl',
              fameReward > 0 ? 'text-roman-gold-400' : 'text-roman-crimson-400'
            )}>
              {fameReward > 0 ? `+${fameReward}` : fameReward}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-roman-marble-700">
          <div className="flex justify-between text-sm">
            <span className="text-roman-marble-400">Final HP:</span>
            <span className={gameState.player.currentHP > 0 ? 'text-health-high' : 'text-health-low'}>
              {gameState.player.currentHP} / {gameState.player.maxHP}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-roman-marble-400">Turns:</span>
            <span className="text-roman-marble-200">{gameState.turn}</span>
          </div>
        </div>
      </div>

      <Button variant="gold" className="w-full" onClick={onClose}>
        Return to Arena
      </Button>
    </div>
  );
};
