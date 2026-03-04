import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { advanceMonth, setScreen } from '@features/game/gameSlice';
import {
  setCurrentOrder, setMonthPhase, advanceGladiatorMonth,
  adjustDominusFavor, addLibertas, addPeculium, adjustPlayerMorale,
  healPlayer, setPlayerFatigue, addExperience, updatePlayerGladiator,
  adjustPlayerFame, setCompanions, setPendingEvent, resolveEvent,
  recalculateManumissionPrice, completeStoryChapter, updateFreedom,
  soldToNewLudus, addCompanion, removeCompanion, adjustCompanionRelationship,
} from '@features/gladiatorMode/gladiatorModeSlice';
import { Button, Card, CardContent, Modal } from '@components/ui';
import { GladiatorLayout } from '@components/layout/GladiatorLayout';
import { generateMonthlyOrder, getDominusFoodQuality } from '@data/gladiatorMode/dominusAI';
import { generateInitialCompanions, generateCompanion } from '@data/gladiatorMode/companions';
import { getLibertasTier } from '@data/gladiatorMode/freedomSystem';
import { STORY_CHAPTERS, getCurrentChapter } from '@data/gladiatorMode/gladiatorEvents';
import { processGladiatorMonth } from '@/game/GladiatorModeLoop';
import { clsx } from 'clsx';

export const GladiatorDashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const game = useAppSelector(state => state.game);
  const gm = useAppSelector(state => state.gladiatorMode);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showFreedomModal, setShowFreedomModal] = useState(false);
  const [chapterComplete, setChapterComplete] = useState<typeof STORY_CHAPTERS[0] | null>(null);
  const [monthSummary, setMonthSummary] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const player = gm.playerGladiator;
  const dominus = gm.dominus;
  const companions = gm.companions;
  const freedom = gm.freedom;
  const currentOrder = gm.currentOrder;

  // Initialize companions on first game load
  useEffect(() => {
    if (player && companions.length === 0 && gm.totalMonthsServed === 0) {
      const initial = generateInitialCompanions(game.currentYear, game.currentMonth, 5);
      dispatch(setCompanions(initial));
    }
  }, [player, companions.length, gm.totalMonthsServed]);

  // Generate first order if none exists (game start or after load)
  useEffect(() => {
    if (!player || currentOrder) return;
    const aliveCompanions = companions.filter(c => c.isAlive && !c.soldAway && !c.freed);
    const order = generateMonthlyOrder(dominus, player, aliveCompanions, gm.monthsInCurrentLudus, gm.totalMonthsServed);
    dispatch(setCurrentOrder(order));
    setShowOrderModal(true);
  }, [player, !currentOrder]);

  if (!player) return <div className="text-center p-8 text-roman-marble-400">No gladiator data found.</div>;

  const foodQuality = getDominusFoodQuality(dominus, dominus.favor);
  const libertasTier = getLibertasTier(freedom.totalLibertas);
  const hpPercent = (player.currentHP / player.maxHP) * 100;
  const staminaPercent = (player.currentStamina / player.maxStamina) * 100;
  const favorPercent = dominus.favor;

  const handleAdvanceMonth = () => {
    const result = processGladiatorMonth(gm, { currentYear: game.currentYear, currentMonth: game.currentMonth });

    if (currentOrder) {
      dispatch(setMonthPhase('aftermath'));
    }

    // Apply order effects
    if (result.healAmount !== 0) dispatch(healPlayer(result.healAmount));
    if (result.staminaRestore > 0) dispatch(updatePlayerGladiator({ currentStamina: result.staminaRestore }));
    if (result.fatigueChange !== 0) dispatch(setPlayerFatigue(Math.max(0, player.fatigue + result.fatigueChange)));
    if (result.moraleChange !== 0) dispatch(adjustPlayerMorale(result.moraleChange));
    if (result.favorChange !== 0) dispatch(adjustDominusFavor(result.favorChange));
    if (result.xpGained > 0) dispatch(addExperience(result.xpGained));

    // Passive libertas
    if (result.libertasGained > 0) {
      dispatch(addLibertas({ amount: result.libertasGained, source: 'glory' }));
    }

    // Passive fame
    if (result.fameGain > 0) {
      dispatch(adjustPlayerFame(result.fameGain));
    }

    dispatch(recalculateManumissionPrice());

    // Selling
    if (result.wasSold && result.newDominus) {
      dispatch(soldToNewLudus({ newDominus: result.newDominus }));
      dispatch(setCompanions(result.newCompanions));
    } else if (result.newArrival) {
      dispatch(addCompanion(result.newArrival));
    }

    // Random event
    if (result.event) {
      dispatch(setPendingEvent(result.event));
    }

    // Story chapter
    if (result.completedChapter && result.chapterRewards) {
      dispatch(completeStoryChapter(result.completedChapter.id));
      dispatch(addLibertas({ amount: result.chapterRewards.libertas, source: 'glory' }));
      dispatch(adjustPlayerFame(result.chapterRewards.fame));
      if (result.chapterRewards.peculium > 0) {
        dispatch(addPeculium({
          amount: result.chapterRewards.peculium,
          source: `Chapter ${result.completedChapter.id}: ${result.completedChapter.title}`,
          year: game.currentYear,
          month: game.currentMonth,
        }));
      }
      if (result.chapterRewards.morale > 0) {
        dispatch(adjustPlayerMorale(result.chapterRewards.morale));
      }
      setChapterComplete(result.completedChapter);
    }

    // Freedom path fulfilled
    if (result.freedomFulfilled) {
      dispatch(addLibertas({ amount: result.freedomLibertas, source: freedom.chosenPath || 'glory' }));
      setShowFreedomModal(true);
    }

    // Advance the month
    dispatch(advanceGladiatorMonth());
    dispatch(advanceMonth());

    // Set next month's order
    dispatch(setCurrentOrder(result.nextOrder));

    setMonthSummary(result.summary);
    setShowSummary(true);
  };

  const handleOrderAcknowledged = () => {
    setShowOrderModal(false);
  };

  const handleEventChoice = (choiceId: string) => {
    const event = gm.pendingEvent;
    if (!event || !event.choices) return;
    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) return;

    const effects = choice.effects;
    if (effects.morale) dispatch(adjustPlayerMorale(effects.morale));
    if (effects.health) dispatch(healPlayer(effects.health));
    if (effects.peculium) {
      dispatch(addPeculium({
        amount: effects.peculium,
        source: event.title,
        year: game.currentYear,
        month: game.currentMonth,
      }));
    }
    if (effects.dominusFavor) dispatch(adjustDominusFavor(effects.dominusFavor));
    if (effects.libertas) dispatch(addLibertas({ amount: effects.libertas, source: 'glory' }));
    if (effects.patronageFavor) {
      dispatch(updateFreedom({ patronageFavor: Math.min(100, (gm.freedom.patronageFavor || 0) + effects.patronageFavor) }));
    }
    if (effects.companionRelationship) {
      dispatch(adjustCompanionRelationship({ id: effects.companionRelationship.companionId, amount: effects.companionRelationship.amount }));
    }

    // Handle event-type-specific side effects
    if (event.type === 'companion_sold' && event.targetCompanionId) {
      dispatch(removeCompanion(event.targetCompanionId));
    }
    if (event.type === 'new_arrival' && choiceId === 'welcome') {
      const newComp = generateCompanion(game.currentYear, game.currentMonth, [1, 3]);
      newComp.relationship = 10;
      dispatch(addCompanion(newComp));
    } else if (event.type === 'new_arrival' && choiceId === 'ignore') {
      const newComp = generateCompanion(game.currentYear, game.currentMonth, [1, 3]);
      dispatch(addCompanion(newComp));
    }

    dispatch(resolveEvent(choiceId));
    setShowEventModal(false);
  };

  // Show pending event
  useEffect(() => {
    if (gm.pendingEvent) {
      setShowEventModal(true);
    }
  }, [gm.pendingEvent]);

  useEffect(() => {
    if (chapterComplete) {
      setShowChapterModal(true);
    }
  }, [chapterComplete]);

  const currentChapter = getCurrentChapter(gm.storyChapter);

  return (
    <GladiatorLayout>
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500 mb-1">
            Your Cell — {dominus.ludusName}
          </h1>
          <p className="text-sm text-roman-marble-400">
            Owned by <span className="text-roman-marble-200">{dominus.name}</span>
            <span className="mx-2">|</span>
            <span className="capitalize">{dominus.personality}</span> dominus
          </p>
        </div>

        {/* Status Alerts */}
        {(() => {
          const alerts: { icon: string; text: string; color: string }[] = [];
          if (player.currentHP < player.maxHP * 0.4)
            alerts.push({ icon: '🩸', text: `Injured — HP at ${Math.round(hpPercent)}%. Rest is needed.`, color: 'border-red-600 bg-red-900/30 text-red-300' });
          if (player.fatigue >= 70)
            alerts.push({ icon: '😮‍💨', text: `Exhausted — Fatigue at ${player.fatigue}%. Performance will suffer.`, color: 'border-orange-600 bg-orange-900/30 text-orange-300' });
          if (player.morale < 0.5)
            alerts.push({ icon: '😞', text: 'Low morale. Despair weighs heavily.', color: 'border-purple-600 bg-purple-900/30 text-purple-300' });
          if (player.currentStamina < player.maxStamina * 0.3)
            alerts.push({ icon: '🫁', text: `Low stamina — only ${player.currentStamina}/${player.maxStamina}. You will tire quickly in combat.`, color: 'border-blue-600 bg-blue-900/30 text-blue-300' });
          if (player.currentHP >= player.maxHP * 0.9 && player.fatigue < 20 && player.morale >= 1.0)
            alerts.push({ icon: '💪', text: 'Peak condition. You are ready for anything.', color: 'border-green-600 bg-green-900/30 text-green-300' });
          return alerts.length > 0 ? (
            <div className="mb-4 space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className={clsx('flex items-center gap-3 px-4 py-2.5 rounded border', alert.color)}>
                  <span className="text-xl">{alert.icon}</span>
                  <span className="text-sm">{alert.text}</span>
                </div>
              ))}
            </div>
          ) : null;
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Player status */}
          <div className="lg:col-span-2 space-y-4">
            {/* Vitals */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-roman text-lg text-roman-gold-500">
                    {player.name} — {player.class.charAt(0).toUpperCase() + player.class.slice(1)}
                  </h2>
                  <div className="text-sm text-roman-marble-400">
                    Level {player.level} | Age {player.age}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div>
                    <div className="text-xs text-roman-marble-500 mb-1">Health</div>
                    <div className="h-4 bg-roman-marble-800 rounded overflow-hidden">
                      <div
                        className={clsx('h-full rounded transition-all', hpPercent > 50 ? 'bg-green-600' : hpPercent > 25 ? 'bg-yellow-600' : 'bg-red-600')}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                    <div className="text-xs text-roman-marble-400 mt-0.5">{player.currentHP}/{player.maxHP}</div>
                  </div>
                  <div>
                    <div className="text-xs text-roman-marble-500 mb-1">Stamina</div>
                    <div className="h-4 bg-roman-marble-800 rounded overflow-hidden">
                      <div className="h-full bg-blue-600 rounded transition-all" style={{ width: `${staminaPercent}%` }} />
                    </div>
                    <div className="text-xs text-roman-marble-400 mt-0.5">{player.currentStamina}/{player.maxStamina}</div>
                  </div>
                  <div>
                    <div className="text-xs text-roman-marble-500 mb-1">Morale</div>
                    <div className="h-4 bg-roman-marble-800 rounded overflow-hidden">
                      <div className="h-full bg-purple-600 rounded transition-all" style={{ width: `${Math.min(100, player.morale * 66.7)}%` }} />
                    </div>
                    <div className="text-xs text-roman-marble-400 mt-0.5">{(player.morale * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-roman-marble-500 mb-1">Fatigue</div>
                    <div className="h-4 bg-roman-marble-800 rounded overflow-hidden">
                      <div className="h-full bg-orange-600 rounded transition-all" style={{ width: `${player.fatigue}%` }} />
                    </div>
                    <div className="text-xs text-roman-marble-400 mt-0.5">{player.fatigue}/100</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-2 text-center">
                  {Object.entries(player.stats).map(([key, val]) => (
                    <div key={key} className="p-2 bg-roman-marble-800 rounded">
                      <div className="text-lg font-bold text-roman-gold-500">{val}</div>
                      <div className="text-xs text-roman-marble-400 capitalize">{key.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>

                {/* Record */}
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="text-roman-marble-500">Record:</span>
                  <span className="text-green-400">{player.wins}W</span>
                  <span className="text-red-400">{player.losses}L</span>
                  <span className="text-roman-marble-400">{player.kills}K</span>
                  <span className="mx-2 text-roman-marble-700">|</span>
                  <span className="text-roman-marble-500">Fame:</span>
                  <span className="text-roman-gold-400">{player.fame}</span>
                  <span className="mx-2 text-roman-marble-700">|</span>
                  <span className="text-roman-marble-500">XP:</span>
                  <span className="text-roman-marble-300">{player.experience}/{player.level * 100}</span>
                </div>
              </CardContent>
            </Card>

            {/* Current Order */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-roman text-lg text-roman-gold-500 mb-2">Current Orders</h2>
                {currentOrder ? (
                  <div className="p-3 bg-roman-marble-800 rounded border border-roman-marble-600">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {currentOrder.type === 'fight' ? '🏟️' : currentOrder.type === 'train' ? '⚔️' : currentOrder.type === 'rest' ? '🛏️' : currentOrder.type === 'punishment' ? '⛓️' : '🤝'}
                      </span>
                      <span className="font-roman text-roman-marble-100 capitalize">{currentOrder.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-roman-marble-300">{currentOrder.description}</p>
                    {currentOrder.type === 'fight' && !(gm.foughtThisMonth ?? false) && (
                      <Button
                        variant="gold"
                        size="sm"
                        className="mt-2"
                        onClick={() => dispatch(setScreen('gladiatorArena'))}
                      >
                        Go to Arena
                      </Button>
                    )}
                    {currentOrder.type === 'fight' && (gm.foughtThisMonth ?? false) && (
                      <p className="text-sm text-green-400 mt-2">Fight completed this month.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-roman-marble-400 italic">No orders yet. Advance the month to receive orders.</p>
                )}
              </CardContent>
            </Card>

            {/* Story Progress */}
            {currentChapter && (
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-roman text-lg text-roman-gold-500 mb-2">
                    Chapter {currentChapter.id}: {currentChapter.title}
                  </h2>
                  <p className="text-sm text-roman-marble-400 italic mb-3">{currentChapter.latin}</p>
                  <p className="text-sm text-roman-marble-300 mb-3">{currentChapter.description}</p>
                  <div className="space-y-1">
                    {currentChapter.objectives.map((obj) => {
                      const rootState = { gladiatorMode: gm, game };
                      const complete = obj.check(rootState);
                      return (
                        <div key={obj.id} className="flex items-center gap-2 text-sm">
                          <span className={complete ? 'text-green-400' : 'text-roman-marble-500'}>
                            {complete ? '✓' : '○'}
                          </span>
                          <span className={complete ? 'text-roman-marble-200 line-through' : 'text-roman-marble-300'}>
                            {obj.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column: dominus, freedom, quick stats */}
          <div className="space-y-4">
            {/* Dominus Favor */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-roman text-lg text-roman-gold-500 mb-2">Dominus Favor</h2>
                <div className="h-4 bg-roman-marble-800 rounded overflow-hidden mb-2">
                  <div
                    className={clsx('h-full rounded transition-all',
                      favorPercent > 60 ? 'bg-roman-gold-500' : favorPercent > 30 ? 'bg-yellow-600' : 'bg-red-600'
                    )}
                    style={{ width: `${favorPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className={clsx(
                    favorPercent <= 15 ? 'text-red-400' : favorPercent <= 35 ? 'text-roman-marble-400' : favorPercent <= 55 ? 'text-yellow-400' : favorPercent <= 75 ? 'text-roman-gold-500' : 'text-roman-gold-400'
                  )}>
                    {favorPercent <= 15 ? 'Despised' : favorPercent <= 35 ? 'Tolerated' : favorPercent <= 55 ? 'Valued' : favorPercent <= 75 ? 'Prized' : 'Champion'}
                  </span>
                  <span className="text-roman-marble-400">{favorPercent}/100</span>
                </div>
                <div className="mt-2 text-xs text-roman-marble-500">
                  Food quality: <span className="text-roman-marble-300 capitalize">{foodQuality}</span>
                </div>
              </CardContent>
            </Card>

            {/* Freedom Progress */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-roman text-lg text-roman-gold-500 mb-2">Path to Freedom</h2>
                <div className="h-4 bg-roman-marble-800 rounded overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-roman-gold-600 to-roman-gold-400 rounded transition-all"
                    style={{ width: `${(freedom.totalLibertas / 1000) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-roman-gold-400">{libertasTier.name}</span>
                  <span className="text-roman-marble-400">{freedom.totalLibertas}/1000 Libertas</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => dispatch(setScreen('gladiatorFreedom'))}
                >
                  View Freedom Paths
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-roman text-lg text-roman-gold-500 mb-2">Status</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Months served</span>
                    <span className="text-roman-marble-200">{gm.totalMonthsServed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Times sold</span>
                    <span className="text-roman-marble-200">{gm.timesSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Peculium</span>
                    <span className="text-roman-gold-400">{gm.peculium}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Companions</span>
                    <span className="text-roman-marble-200">
                      {companions.filter(c => c.isAlive && !c.soldAway && !c.freed).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Manumission price</span>
                    <span className="text-roman-marble-200">{freedom.manumissionPrice}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advance Month */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleAdvanceMonth}
              >
                End Month
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && currentOrder && (
        <Modal isOpen={showOrderModal} onClose={handleOrderAcknowledged} title="The Dominus Speaks">
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">
                {currentOrder.type === 'fight' ? '🏟️' : currentOrder.type === 'train' ? '⚔️' : currentOrder.type === 'rest' ? '🛏️' : '⛓️'}
              </span>
            </div>
            <p className="text-roman-marble-200 text-center">{currentOrder.description}</p>
            <div className="text-center">
              <Button variant="gold" onClick={handleOrderAcknowledged}>
                Understood
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Event Modal */}
      {showEventModal && gm.pendingEvent && (
        <Modal isOpen={showEventModal} onClose={() => {}} title={gm.pendingEvent.title}>
          <div className="space-y-4">
            <p className="text-roman-marble-200">{gm.pendingEvent.description}</p>
            {gm.pendingEvent.choices && (
              <div className="space-y-2">
                {gm.pendingEvent.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    variant="ghost"
                    className="w-full text-left justify-start"
                    onClick={() => handleEventChoice(choice.id)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Chapter Complete Modal */}
      {showChapterModal && chapterComplete && (
        <Modal
          isOpen={showChapterModal}
          onClose={() => { setShowChapterModal(false); setChapterComplete(null); }}
          title={`Chapter ${chapterComplete.id} Complete!`}
        >
          <div className="space-y-4 text-center">
            <h3 className="font-roman text-xl text-roman-gold-500">{chapterComplete.title}</h3>
            <p className="text-roman-marble-300 italic">{chapterComplete.completionText}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {chapterComplete.rewards.libertas > 0 && (
                <div className="p-2 bg-roman-marble-800 rounded">
                  <span className="text-roman-gold-400">+{chapterComplete.rewards.libertas}</span>
                  <span className="text-roman-marble-500 ml-1">Libertas</span>
                </div>
              )}
              {chapterComplete.rewards.fame > 0 && (
                <div className="p-2 bg-roman-marble-800 rounded">
                  <span className="text-roman-gold-400">+{chapterComplete.rewards.fame}</span>
                  <span className="text-roman-marble-500 ml-1">Fame</span>
                </div>
              )}
              {chapterComplete.rewards.peculium > 0 && (
                <div className="p-2 bg-roman-marble-800 rounded">
                  <span className="text-roman-gold-400">+{chapterComplete.rewards.peculium}</span>
                  <span className="text-roman-marble-500 ml-1">Gold</span>
                </div>
              )}
            </div>
            <Button variant="gold" onClick={() => { setShowChapterModal(false); setChapterComplete(null); }}>
              Continue
            </Button>
          </div>
        </Modal>
      )}

      {/* Month Summary Modal */}
      {showSummary && monthSummary.length > 0 && (
        <Modal isOpen={showSummary} onClose={() => setShowSummary(false)} title="Month Summary">
          <div className="space-y-2">
            {monthSummary.map((msg, i) => (
              <div key={i} className="text-sm text-roman-marble-300 flex items-start gap-2">
                <span className="text-roman-gold-500 mt-0.5">-</span>
                <span>{msg}</span>
              </div>
            ))}
            <div className="text-center mt-4">
              <Button variant="gold" onClick={() => setShowSummary(false)}>
                Continue
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Freedom Achieved Modal */}
      {showFreedomModal && (
        <Modal isOpen={showFreedomModal} onClose={() => {}} title="">
          <div className="text-center space-y-6 py-4">
            <div className="text-6xl">🕊️</div>
            <h2 className="font-roman text-3xl text-roman-gold-500">The Rudis</h2>
            <p className="text-roman-marble-300 leading-relaxed">
              The editor stands before you in the arena. The crowd is silent — an impossible thing. 
              In his hand, a simple wooden sword. The <span className="text-roman-gold-400 italic">rudis</span>.
            </p>
            <p className="text-roman-marble-300 leading-relaxed">
              He places it in your hand. Light as air. Heavy as the world. 
              The crowd erupts. Your name shakes the very stones of the arena.
            </p>
            <p className="text-roman-gold-500 font-roman text-xl italic">
              You are free.
            </p>
            <p className="text-roman-marble-400 text-sm leading-relaxed">
              {freedom.chosenPath === 'mercy' && 'Your dominus, moved by your years of loyal service and the glory you brought his ludus, has granted your freedom. He clasps your arm — not as master to slave, but as one man to another.'}
              {freedom.chosenPath === 'glory' && 'Fifty victories. The crowd demanded it. The editor had no choice. Your name will echo through the ages.'}
              {freedom.chosenPath === 'coin' && 'Coin by coin, fight by fight, you scraped together the price of your own flesh. Your dominus counts the gold and signs the papers. A fair trade, he says.'}
              {freedom.chosenPath === 'patronage' && 'Your patron rises in the stands and declares your freedom before the crowd. Political theater, perhaps, but the rudis in your hand is real.'}
            </p>
            <div className="bg-roman-marble-800 rounded p-4 text-sm">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-roman-marble-500">Months Served</div>
                  <div className="text-roman-gold-400 text-lg font-bold">{gm.totalMonthsServed}</div>
                </div>
                <div>
                  <div className="text-roman-marble-500">Arena Victories</div>
                  <div className="text-roman-gold-400 text-lg font-bold">{player.wins}</div>
                </div>
                <div>
                  <div className="text-roman-marble-500">Final Fame</div>
                  <div className="text-roman-gold-400 text-lg font-bold">{player.fame}</div>
                </div>
              </div>
            </div>
            <p className="text-roman-marble-500 text-sm italic">
              The gate of the ludus opens — not to the arena, but to the road beyond. 
              For the first time, you walk through it as a free man.
            </p>
            <Button variant="gold" size="lg" className="px-12" onClick={() => {
              setShowFreedomModal(false);
              dispatch(setScreen('title'));
            }}>
              Walk Into the Light
            </Button>
          </div>
        </Modal>
      )}
    </GladiatorLayout>
  );
};
