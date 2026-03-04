import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import {
  recordWin, recordLoss, recordKill, addExperience,
  adjustPlayerFame, adjustDominusFavor, addLibertas, addPeculium,
  adjustPlayerMorale, updatePlayerGladiator, markFoughtThisMonth, updateFreedom,
} from '@features/gladiatorMode/gladiatorModeSlice';
import { Card, CardContent, Button, ProgressBar } from '@components/ui';
import { GladiatorLayout } from '@components/layout/GladiatorLayout';
import { generateGladiator } from '@utils/gladiatorGenerator';
import { CombatEngine, type CombatState, type CombatLogEntry } from '../../../game/CombatEngine';
import {
  COMBAT_ACTIONS,
  STATUS_EFFECTS,
  CLASS_SPECIALS,
  type ActionType,
} from '@data/combat';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { calculateLibertasFromFight, getPeculiumTipFromFight } from '@data/gladiatorMode/freedomSystem';
import type { Gladiator } from '@/types';
import { clsx } from 'clsx';
import { useAudio } from '@/audio/useAudio';
import type { SoundEffect } from '@/audio/sounds';

type ArenaPhase = 'preview' | 'fighting' | 'missio' | 'result';

export const GladiatorArenaScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gm = useAppSelector(state => state.gladiatorMode);
  const game = useAppSelector(state => state.game);
  const [phase, setPhase] = useState<ArenaPhase>('preview');
  const [opponent, setOpponent] = useState<Gladiator | null>(null);
  const [combatEngine, setCombatEngine] = useState<CombatEngine | null>(null);
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerWon, setPlayerWon] = useState<boolean | null>(null);
  const [crowdFavor, setCrowdFavor] = useState(50);
  const [missioResult, setMissioResult] = useState<'spared' | 'killed' | null>(null);
  const [playerDied, setPlayerDied] = useState(false);
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const [killed, setKilled] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const player = gm.playerGladiator;
  const currentOrder = gm.currentOrder;

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  if (!player) return null;

  const hasFightOrder = currentOrder?.type === 'fight' && !(gm.foughtThisMonth ?? false);
  const matchType = currentOrder?.matchType || 'pitFight';
  const matchLabels: Record<string, string> = {
    pitFight: 'Pit Fight', localMunera: 'Local Munera', championship: 'Championship',
  };
  const rules = matchType === 'championship' ? 'death' as const : 'submission' as const;

  const handleStartFight = () => {
    const oppLevel = Math.max(1, player.level + Math.floor(Math.random() * 3) - 1);
    const opp = generateGladiator({
      level: oppLevel,
      currentYear: game.currentYear,
      currentMonth: game.currentMonth,
    });
    setOpponent(opp);

    try {
      const maxRounds = matchType === 'championship' ? 15 : 10;
      const engine = new CombatEngine(
        {
          id: player.id,
          name: player.name,
          class: player.class,
          level: player.level,
          stats: { ...player.stats },
          currentHP: player.currentHP,
          maxHP: player.maxHP,
          currentStamina: player.currentStamina,
          maxStamina: player.maxStamina,
          morale: player.morale * 100,
        },
        {
          name: opp.name,
          class: opp.class,
          level: opp.level,
          stats: { ...opp.stats },
          hp: opp.currentHP,
          stamina: opp.currentStamina,
        },
        matchType,
        rules,
        maxRounds,
      );
      setCombatEngine(engine);
      setCombatState(engine.getState());
      setCombatLog([]);
      setCrowdFavor(50);
      setPhase('fighting');
    } catch {
      setPhase('preview');
    }
  };

  const { playSFX } = useAudio();

  const getSoundForLogEntry = (entry: CombatLogEntry): SoundEffect | null => {
    if (entry.dodged) return 'dodge';
    if (entry.blocked) return 'block';
    if (entry.missed) return 'miss';
    if (entry.isCrit) return 'critical';
    if (entry.action === 'heavy_attack' && entry.damage) return 'heavyAttack';
    if (entry.action === 'special' && entry.damage) return 'special';
    if (entry.action === 'taunt') return 'taunt';
    if (entry.action === 'defend') return 'block';
    if (entry.action === 'rest') return null;
    if (entry.damage && entry.damage > 0) return 'attack';
    return null;
  };

  const handlePlayerAction = async (action: ActionType) => {
    if (!combatEngine || !combatState || isAnimating || combatState.phase === 'ended') return;

    setIsAnimating(true);
    playSFX('click');

    const entries = combatEngine.executePlayerAction(action);

    for (const entry of entries) {
      const sfx = getSoundForLogEntry(entry);
      if (sfx) playSFX(sfx);
      setCombatLog(prev => [...prev, entry]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const newState = combatEngine.getState();
    setCombatState(newState);

    // Crowd favor based on action
    let favorDelta = 0;
    if (action === 'heavy_attack' || action === 'special') favorDelta += 3;
    if (action === 'taunt') favorDelta += 5;
    if (action === 'attack') favorDelta += 1;
    if (action === 'defend' || action === 'rest') favorDelta -= 1;
    if (action === 'dodge') favorDelta += 1;
    setCrowdFavor(prev => Math.max(0, Math.min(100, prev + favorDelta)));

    if (newState.phase === 'ended') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const won = newState.winner === player.name;
      playSFX(won ? 'victory' : 'defeat');
      handleCombatEnd(newState);
    }

    setIsAnimating(false);
  };

  const handleCombatEnd = (state: CombatState) => {
    const won = state.winner === player.name;
    setPlayerWon(won);

    if (won) {
      if (matchType !== 'championship') {
        setPhase('missio');
      } else {
        resolveVictory(true);
      }
    } else {
      const missioChance = calculateMissioChance(crowdFavor, player.fame, gm.dominus.politicalConnections, matchType);
      const spared = Math.random() < missioChance;
      if (spared) {
        resolveLoss(false);
      } else {
        setPlayerDied(true);
        resolveLoss(true);
      }
    }
  };

  const handleMissioChoice = (spare: boolean) => {
    setMissioResult(spare ? 'spared' : 'killed');
    resolveVictory(!spare);
  };

  const resolveVictory = (killedOpponent: boolean) => {
    dispatch(markFoughtThisMonth());
    dispatch(recordWin());
    if (killedOpponent) {
      dispatch(recordKill());
      setKilled(true);
    }
    const xp = 50 + (killedOpponent ? 25 : 0) + Math.floor(Math.random() * 20);
    dispatch(addExperience(xp));
    const fameGain = matchType === 'championship' ? 25 : matchType === 'localMunera' ? 15 : 8;
    dispatch(adjustPlayerFame(fameGain + (crowdFavor > 70 ? 5 : 0)));
    dispatch(adjustDominusFavor(10 + (crowdFavor > 50 ? 5 : 0)));
    const libertas = calculateLibertasFromFight(true, matchType, crowdFavor, killedOpponent);
    dispatch(addLibertas({ amount: libertas, source: 'glory' }));
    // Patronage favor grows passively from impressive victories
    if (player.fame >= 100 && crowdFavor > 60 && (gm.freedom.patronageFavor || 0) > 0) {
      const patronBonus = crowdFavor > 80 ? 3 : 1;
      dispatch(updateFreedom({ patronageFavor: Math.min(100, (gm.freedom.patronageFavor || 0) + patronBonus) }));
    }
    const tips = getPeculiumTipFromFight(true, crowdFavor, player.fame);
    if (tips > 0) {
      dispatch(addPeculium({ amount: tips, source: 'Arena victory tips', year: game.currentYear, month: game.currentMonth }));
    }
    dispatch(adjustPlayerMorale(0.1));
    if (combatState) {
      dispatch(updatePlayerGladiator({ currentHP: Math.max(1, combatState.player.currentHP), currentStamina: combatState.player.currentStamina }));
    }
    setShowResults(true);
    setPhase('result');
  };

  const resolveLoss = (died: boolean) => {
    dispatch(markFoughtThisMonth());
    dispatch(recordLoss());
    dispatch(adjustDominusFavor(-5));
    dispatch(adjustPlayerMorale(-0.1));
    if (!died) {
      dispatch(updatePlayerGladiator({ currentHP: Math.max(1, Math.floor(player.maxHP * 0.1)), currentStamina: Math.floor(player.maxStamina * 0.2) }));
    }
    dispatch(adjustPlayerFame(2));
    setShowResults(true);
    setPhase('result');
  };

  const handleReturnToDashboard = () => {
    if (playerDied) {
      dispatch(updatePlayerGladiator({ currentHP: 0 }));
    }
    dispatch(setScreen('gladiatorDashboard'));
  };

  // ============ PREVIEW PHASE ============
  const renderPreview = () => (
    <div className="max-w-2xl mx-auto">
      <Card variant="gold">
        <CardContent className="p-8 text-center">
          {hasFightOrder ? (
            <>
              <div className="text-5xl mb-4">🏟️</div>
              <h2 className="font-roman text-3xl text-roman-gold-500 mb-2">The Arena Awaits</h2>
              <p className="text-roman-marble-300 mb-1">
                You have been ordered to fight in <span className="text-roman-gold-400">{matchLabels[matchType] || 'the arena'}</span>.
              </p>
              <p className="text-sm text-roman-marble-500 mb-6">
                {rules === 'death'
                  ? 'Death match rules. There will be no mercy.'
                  : 'Submission rules. The crowd and editor will judge the loser\'s fate.'}
              </p>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-3 bg-roman-marble-800 rounded">
                  <div className="text-xs text-roman-marble-500">HP</div>
                  <div className={clsx('text-lg font-bold', player.currentHP < player.maxHP * 0.5 ? 'text-red-400' : 'text-green-400')}>
                    {player.currentHP}/{player.maxHP}
                  </div>
                </div>
                <div className="p-3 bg-roman-marble-800 rounded">
                  <div className="text-xs text-roman-marble-500">Stamina</div>
                  <div className="text-lg font-bold text-blue-400">{player.currentStamina}/{player.maxStamina}</div>
                </div>
                <div className="p-3 bg-roman-marble-800 rounded">
                  <div className="text-xs text-roman-marble-500">Level</div>
                  <div className="text-lg font-bold text-roman-marble-200">{player.level}</div>
                </div>
                <div className="p-3 bg-roman-marble-800 rounded">
                  <div className="text-xs text-roman-marble-500">Class</div>
                  <div className="text-lg font-bold text-roman-marble-200">{GLADIATOR_CLASSES[player.class]?.icon}</div>
                </div>
              </div>

              <Button variant="gold" size="lg" onClick={handleStartFight} className="px-12">
                Enter the Arena
              </Button>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 opacity-40">🏟️</div>
              <h2 className="font-roman text-2xl text-roman-marble-400 mb-2">No Fight Scheduled</h2>
              <p className="text-roman-marble-500 mb-6">
                Your dominus has not ordered you to fight this month.
              </p>
              <Button variant="ghost" onClick={() => dispatch(setScreen('gladiatorDashboard'))}>
                Return to Cell
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ============ COMBAT PHASE ============
  const renderCombat = () => {
    if (!combatState || !opponent) return null;
    const p = combatState.player;
    const o = combatState.opponent;
    const playerClass = GLADIATOR_CLASSES[p.class];
    const opponentClass = GLADIATOR_CLASSES[o.class];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {/* Match header */}
        <div className="text-center">
          <div className="font-roman text-xl text-roman-gold-500">
            {matchLabels[matchType] || 'Combat'}
          </div>
          <div className="text-roman-marble-400 text-sm">
            Turn {combatState.turn} / {combatState.maxRounds} &bull; {rules} rules
          </div>
        </div>

        {/* Combatants */}
        <div className="grid grid-cols-3 gap-4 lg:gap-8">
          <CombatantCard combatant={p} isPlayer={true} classData={playerClass} />

          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl lg:text-5xl font-roman text-roman-crimson-500"
            >
              VS
            </motion.div>
            {combatState.phase !== 'ended' && (
              <div className="mt-3 text-roman-marble-400 text-sm">
                {isAnimating ? 'Resolving...' : 'Choose your action'}
              </div>
            )}
          </div>

          <CombatantCard combatant={o} isPlayer={false} classData={opponentClass} />
        </div>

        {/* Crowd Favor Bar */}
        <Card>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-roman-marble-400">Crowd Favor</span>
              <span className={clsx(
                'font-bold',
                crowdFavor > 60 ? 'text-roman-gold-400' : crowdFavor > 30 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {crowdFavor}/100
                {crowdFavor > 70 && ' — They love you!'}
                {crowdFavor <= 30 && ' — Crowd is restless...'}
              </span>
            </div>
            <div className="h-3 bg-roman-marble-800 rounded-full overflow-hidden">
              <motion.div
                className={clsx('h-full rounded-full', crowdFavor > 60 ? 'bg-roman-gold-500' : crowdFavor > 30 ? 'bg-yellow-600' : 'bg-red-600')}
                animate={{ width: `${crowdFavor}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {combatState.phase !== 'ended' && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.values(COMBAT_ACTIONS).map(action => {
                  const canPerform = combatEngine?.canPerformAction(p, action.id);
                  const isSpecial = action.id === 'special';
                  const specialData = isSpecial ? CLASS_SPECIALS[p.class] : null;
                  const displayName = specialData?.name || action.name;
                  const displayDesc = specialData?.description || action.description;
                  const hasEnoughStamina = action.staminaCost <= 0 || p.currentStamina >= action.staminaCost;

                  return (
                    <button
                      key={action.id}
                      onClick={() => handlePlayerAction(action.id)}
                      disabled={!(canPerform?.canPerform) || isAnimating || !hasEnoughStamina}
                      title={canPerform?.reason || displayDesc}
                      className={clsx(
                        'p-3 rounded-lg border transition-all text-left',
                        (canPerform?.canPerform) && hasEnoughStamina && !isAnimating
                          ? 'border-roman-bronze-600 bg-roman-marble-800 hover:border-roman-gold-500 hover:bg-roman-marble-700 cursor-pointer'
                          : 'border-roman-marble-700 bg-roman-marble-900 opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{action.icon}</span>
                        <span className="font-roman text-sm text-roman-marble-100">{displayName}</span>
                      </div>
                      <div className="text-xs text-roman-marble-500 mb-1 line-clamp-1">{displayDesc}</div>
                      <div className="text-xs">
                        {action.staminaCost > 0 ? (
                          <span className={hasEnoughStamina ? 'text-blue-400' : 'text-roman-crimson-400'}>
                            -{action.staminaCost} Stamina
                          </span>
                        ) : action.staminaCost < 0 ? (
                          <span className="text-green-400">+{-action.staminaCost} Stamina</span>
                        ) : (
                          <span className="text-roman-marble-600">No cost</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Combat Log */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-roman-marble-500 mb-2">Combat Log</div>
            <div
              ref={logRef}
              className="h-44 overflow-y-auto space-y-1 bg-roman-marble-900 p-3 rounded"
            >
              {combatLog.length === 0 ? (
                <div className="text-roman-marble-600 text-center py-4">
                  The crowd roars! Select your first action.
                </div>
              ) : (
                combatLog.map((entry, index) => {
                  const isPlayerEntry = entry.actor === p.name;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isPlayerEntry ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={clsx(
                        'text-xs p-2 rounded',
                        isPlayerEntry
                          ? 'bg-roman-gold-500/10 text-roman-gold-400'
                          : 'bg-roman-crimson-500/10 text-roman-crimson-400'
                      )}
                    >
                      <span className="text-roman-marble-500">[Turn {entry.turn}]</span>{' '}
                      {entry.message}
                      {entry.isCrit && <span className="text-roman-gold-500 font-bold"> CRITICAL!</span>}
                    </motion.div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ============ MISSIO PHASE ============
  const renderMissio = () => (
    <div className="max-w-2xl mx-auto">
      <Card variant="gold">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            👊
          </motion.div>
          <h2 className="font-roman text-3xl text-roman-gold-500 mb-3">Missio!</h2>
          <p className="text-roman-marble-300 mb-2">
            Your opponent lies defeated at your feet. The crowd roars. The editor turns to the mob.
          </p>
          <p className="text-sm text-roman-marble-400 mb-6">
            Crowd favor: <span className={clsx('font-bold', crowdFavor > 50 ? 'text-roman-gold-400' : 'text-red-400')}>{crowdFavor}/100</span>
            {crowdFavor > 60 && ' — The crowd calls for mercy!'}
            {crowdFavor <= 40 && ' — The crowd thirsts for blood!'}
          </p>
          <div className="flex gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="gold" size="lg" onClick={() => handleMissioChoice(true)} className="px-8">
                🕊️ Spare (Mercy)
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="lg" className="text-red-400 hover:text-red-300 px-8" onClick={() => handleMissioChoice(false)}>
                🗡️ Kill (Iugula)
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============ RESULTS ============
  const renderResultOverlay = () => {
    if (!showResults) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-roman-marble-800 border-2 border-roman-gold-600 rounded-lg p-8 max-w-lg w-full mx-4"
          >
            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={clsx('text-6xl mb-4', playerDied ? 'text-roman-crimson-500' : playerWon ? 'text-roman-gold-500' : 'text-yellow-500')}
              >
                {playerDied ? '💀' : playerWon ? '🏆' : '🛡️'}
              </motion.div>

              {/* Title */}
              <h2 className={clsx(
                'font-roman text-3xl mb-3',
                playerDied ? 'text-roman-crimson-500' : playerWon ? 'text-roman-gold-500' : 'text-yellow-500'
              )}>
                {playerDied ? 'DEATH' : playerWon ? 'VICTORY!' : 'DEFEAT'}
              </h2>

              {/* Flavor text */}
              <p className="text-roman-marble-300 mb-6">
                {playerDied
                  ? 'The crowd turns their thumbs down. The blade falls. Your journey ends here in the sand.'
                  : playerWon
                    ? (killed
                        ? 'You stand over the body of your opponent. The crowd roars its approval.'
                        : 'Your opponent yields. The crowd cheers for the victor.')
                    : 'You fall to the sand. The editor grants you missio — you will fight again.'
                }
              </p>

              {missioResult && (
                <p className="text-sm text-roman-marble-400 mb-4 italic">
                  {missioResult === 'spared' ? 'You showed mercy. The crowd respects this.' : 'You showed no mercy. The mob is satisfied.'}
                </p>
              )}

              {/* Results grid */}
              {combatState && (
                <div className="bg-roman-marble-900 p-4 rounded-lg mb-6">
                  <div className="text-sm text-roman-marble-500 mb-3">Results</div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-roman-marble-400 text-xs">Crowd Favor</div>
                      <div className={clsx('font-roman text-xl', crowdFavor > 50 ? 'text-roman-gold-400' : 'text-roman-marble-400')}>
                        {crowdFavor}
                      </div>
                    </div>
                    <div>
                      <div className="text-roman-marble-400 text-xs">Turns</div>
                      <div className="font-roman text-xl text-roman-marble-200">{combatState.turn}</div>
                    </div>
                    <div>
                      <div className="text-roman-marble-400 text-xs">Final HP</div>
                      <div className={clsx('font-roman text-xl', combatState.player.currentHP > 0 ? 'text-green-400' : 'text-red-400')}>
                        {combatState.player.currentHP}/{combatState.player.maxHP}
                      </div>
                    </div>
                  </div>
                  {playerWon && (
                    <div className="border-t border-roman-marble-700 pt-3 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-roman-marble-400 text-xs">Fame Earned</div>
                        <div className="font-roman text-lg text-roman-gold-400">
                          +{matchType === 'championship' ? 25 : matchType === 'localMunera' ? 15 : 8}
                        </div>
                      </div>
                      <div>
                        <div className="text-roman-marble-400 text-xs">Libertas</div>
                        <div className="font-roman text-lg text-roman-gold-400">
                          +{calculateLibertasFromFight(true, matchType, crowdFavor, killed)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {playerDied && (
                <p className="text-sm text-roman-marble-500 italic mb-4">"Morituri te salutant."</p>
              )}

              <Button variant="gold" className="w-full" onClick={handleReturnToDashboard}>
                {playerDied ? 'Accept Your Fate' : 'Return to Cell'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <GladiatorLayout>
      <div className="max-w-5xl mx-auto">
        {phase !== 'fighting' && (
          <div className="mb-6">
            <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500 mb-1">
              {phase === 'missio' ? 'The Crowd Decides' : 'The Arena'}
            </h1>
          </div>
        )}

        {phase === 'preview' && renderPreview()}
        {phase === 'fighting' && renderCombat()}
        {phase === 'missio' && renderMissio()}
        {phase === 'result' && !showResults && renderPreview()}
      </div>

      {renderResultOverlay()}
    </GladiatorLayout>
  );
};

// ============ COMBATANT CARD COMPONENT ============
const CombatantCard: React.FC<{
  combatant: CombatState['player'];
  isPlayer: boolean;
  classData: typeof GLADIATOR_CLASSES[keyof typeof GLADIATOR_CLASSES];
}> = ({ combatant, isPlayer, classData }) => {
  const hpPercent = (combatant.currentHP / combatant.maxHP) * 100;

  return (
    <Card>
      <CardContent className="p-4">
        <div className={clsx('text-center', !isPlayer && 'text-roman-crimson-400')}>
          <motion.div
            className="text-4xl lg:text-5xl mb-2"
            animate={combatant.currentHP < combatant.maxHP * 0.3 ? { x: [-2, 2, -2] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {classData?.icon}
          </motion.div>
          <div className={clsx('font-roman text-lg', isPlayer ? 'text-roman-gold-400' : 'text-roman-crimson-400')}>
            {combatant.name}
            {isPlayer && <span className="text-roman-marble-500 text-sm ml-1">(You)</span>}
          </div>
          <div className="text-sm text-roman-marble-400">
            Level {combatant.level} {classData?.name}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* HP */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-roman-marble-400">HP</span>
              <span className={clsx(
                hpPercent > 50 ? 'text-green-400' : hpPercent > 25 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {combatant.currentHP} / {combatant.maxHP}
              </span>
            </div>
            <ProgressBar value={combatant.currentHP} max={combatant.maxHP} variant="health" />
          </div>

          {/* Stamina */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-roman-marble-400">Stamina</span>
              <span className="text-blue-400">
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
                  title={STATUS_EFFECTS[status.effect]?.description}
                >
                  {STATUS_EFFECTS[status.effect]?.icon} {status.duration}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function calculateMissioChance(crowdFavor: number, fame: number, politicalConnections: number, matchType: string): number {
  if (matchType === 'championship') return 0;
  let chance = 0.5;
  if (crowdFavor > 50) chance += 0.2;
  if (crowdFavor > 80) chance += 0.2;
  if (crowdFavor < 30) chance -= 0.2;
  if (fame > 200) chance += 0.1;
  if (politicalConnections > 50) chance += 0.1;
  return Math.max(0.1, Math.min(0.95, chance));
}
