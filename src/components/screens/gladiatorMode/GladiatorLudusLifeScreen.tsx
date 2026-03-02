import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import {
  adjustCompanionRelationship, adjustPlayerMorale, addExperience,
  healPlayer, adjustDominusFavor, recordInteraction,
} from '@features/gladiatorMode/gladiatorModeSlice';
import { Button, Card, CardContent, Modal } from '@components/ui';
import { GladiatorLayout } from '@components/layout/GladiatorLayout';
import { resolveSpar, resolveTalk, resolveChallenge, getCompanionRelationshipTier, getPersonalityLabel } from '@data/gladiatorMode/companions';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { clsx } from 'clsx';

type InteractionType = 'spar' | 'talk' | 'challenge';

export const GladiatorLudusLifeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gm = useAppSelector(state => state.gladiatorMode);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');

  const player = gm.playerGladiator;
  const companions = gm.companions.filter(c => c.isAlive && !c.soldAway && !c.freed);

  if (!player) return null;

  const maxInteractions = 2;
  const interactionsUsed = gm.interactionsThisMonth || 0;

  const handleInteraction = (companionId: string, type: InteractionType) => {
    if (interactionsUsed >= maxInteractions) return;

    const companion = gm.companions.find(c => c.id === companionId);
    if (!companion) return;

    let resultMessage = '';

    if (type === 'spar') {
      const result = resolveSpar(player, companion);
      dispatch(addExperience(result.xpGained));
      dispatch(adjustCompanionRelationship({ id: companionId, amount: result.relationshipChange }));
      if (result.playerInjured) {
        dispatch(healPlayer(-10));
      }
      resultMessage = result.description + ` (+${result.xpGained} XP)`;
    } else if (type === 'talk') {
      const result = resolveTalk(companion);
      dispatch(adjustPlayerMorale(result.moraleChange));
      dispatch(adjustCompanionRelationship({ id: companionId, amount: result.relationshipChange }));
      resultMessage = result.description;
      if (result.rumor) {
        resultMessage += `\n\nRumor: "${result.rumor}"`;
      }
    } else if (type === 'challenge') {
      const result = resolveChallenge(player, companion);
      dispatch(adjustCompanionRelationship({ id: companionId, amount: result.relationshipChange }));
      if (result.dominusFavorChange) {
        dispatch(adjustDominusFavor(result.dominusFavorChange));
      }
      resultMessage = result.description;
    }

    dispatch(recordInteraction());
    setResultText(resultMessage);
    setShowResult(true);
  };

  const selected = companions.find(c => c.id === selectedCompanion);

  return (
    <GladiatorLayout>
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500 mb-1">Life in the Ludus</h1>
          <p className="text-sm text-roman-marble-400">
            Your fellow gladiators. Forge bonds, settle disputes, survive together.
            <span className="ml-2 text-roman-gold-500">
              Interactions remaining: {maxInteractions - interactionsUsed}/{maxInteractions}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Companion List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companions.map((comp) => {
                const relTier = getCompanionRelationshipTier(comp.relationship);
                const classData = GLADIATOR_CLASSES[comp.gladiator.class];
                return (
                  <motion.div
                    key={comp.id}
                    whileHover={{ scale: 1.01 }}
                    className={clsx(
                      'p-4 rounded border-2 cursor-pointer transition-colors',
                      selectedCompanion === comp.id
                        ? 'border-roman-gold-500 bg-roman-marble-800'
                        : 'border-roman-marble-600 bg-roman-marble-800/50 hover:border-roman-marble-500'
                    )}
                    onClick={() => setSelectedCompanion(comp.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{classData?.icon || '⚔️'}</span>
                        <div>
                          <div className="font-roman text-roman-marble-100">{comp.gladiator.name}</div>
                          <div className="text-xs text-roman-marble-500">
                            {classData?.name || comp.gladiator.class} | Lvl {comp.gladiator.level} | {comp.rank}
                          </div>
                        </div>
                      </div>
                      <span className={clsx('text-xs px-2 py-0.5 rounded', relTier.color, 'bg-roman-marble-700')}>
                        {relTier.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-roman-marble-400">
                      <span>Personality: <span className="text-roman-marble-300">{getPersonalityLabel(comp.personality)}</span></span>
                      <span>Rel: <span className={relTier.color}>{comp.relationship}</span></span>
                    </div>

                    {/* Compact stats */}
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="text-roman-marble-500">STR <span className="text-roman-marble-300">{comp.gladiator.stats.strength}</span></span>
                      <span className="text-roman-marble-500">AGI <span className="text-roman-marble-300">{comp.gladiator.stats.agility}</span></span>
                      <span className="text-roman-marble-500">DEX <span className="text-roman-marble-300">{comp.gladiator.stats.dexterity}</span></span>
                      <span className="text-roman-marble-500">W/L <span className="text-green-400">{comp.gladiator.wins}</span>/<span className="text-red-400">{comp.gladiator.losses}</span></span>
                    </div>
                  </motion.div>
                );
              })}
              {companions.length === 0 && (
                <div className="col-span-2 text-center py-8 text-roman-marble-500 italic">
                  You are alone in this ludus. New companions may arrive in time.
                </div>
              )}
            </div>
          </div>

          {/* Interaction Panel */}
          <div>
            {selected ? (
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-roman text-lg text-roman-gold-500 mb-3">{selected.gladiator.name}</h2>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Class</span>
                      <span className="text-roman-marble-200">{GLADIATOR_CLASSES[selected.gladiator.class]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Level</span>
                      <span className="text-roman-marble-200">{selected.gladiator.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Rank</span>
                      <span className="text-roman-marble-200 capitalize">{selected.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Personality</span>
                      <span className="text-roman-marble-200">{getPersonalityLabel(selected.personality)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Relationship</span>
                      <span className={getCompanionRelationshipTier(selected.relationship).color}>
                        {selected.relationship} ({getCompanionRelationshipTier(selected.relationship).label})
                      </span>
                    </div>
                  </div>

                  <div className="divider-roman my-3" />

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={interactionsUsed >= maxInteractions}
                      onClick={() => handleInteraction(selected.id, 'spar')}
                    >
                      Spar (+XP, risk of injury)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      disabled={interactionsUsed >= maxInteractions}
                      onClick={() => handleInteraction(selected.id, 'talk')}
                    >
                      Talk (+Morale, +Relationship)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-orange-400 hover:text-orange-300"
                      disabled={interactionsUsed >= maxInteractions}
                      onClick={() => handleInteraction(selected.id, 'challenge')}
                    >
                      Challenge (Dominance)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-roman-marble-500 italic">
                  Select a companion to interact with.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <Modal isOpen={showResult} onClose={() => setShowResult(false)} title="Result">
          <div className="space-y-4">
            <p className="text-roman-marble-200 whitespace-pre-line">{resultText}</p>
            <div className="text-center">
              <Button variant="gold" onClick={() => setShowResult(false)}>Continue</Button>
            </div>
          </div>
        </Modal>
      )}
    </GladiatorLayout>
  );
};
