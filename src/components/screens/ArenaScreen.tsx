import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import { startCombat } from '@features/combat/combatSlice';
import { spendGold } from '@features/player/playerSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ProgressBar } from '@components/ui';
import { MATCH_TYPES, generateOpponent } from '@data/combat';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { TournamentsScreen } from './TournamentsScreen';
import { BracketView } from '@components/tournaments/BracketView';
import type { Gladiator } from '@/types';
import { clsx } from 'clsx';

export const ArenaScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roster } = useAppSelector(state => state.gladiators);
  const { gold } = useAppSelector(state => state.player);
  const { currentDay } = useAppSelector(state => state.game);
  const { activeTournament } = useAppSelector(state => state.tournaments);

  const [activeTab, setActiveTab] = useState<'fights' | 'tournaments'>('fights');
  const [selectedGladiator, setSelectedGladiator] = useState<Gladiator | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewOpponent, setPreviewOpponent] = useState<ReturnType<typeof generateOpponent> | null>(null);

  // Filter available gladiators (not injured, not exhausted)
  const availableGladiators = roster.filter(g => 
    !g.isInjured && 
    g.currentHP >= g.maxHP * 0.5 &&
    g.currentStamina >= g.maxStamina * 0.5
  );

  // Check if gladiator meets fame requirement
  const meetsFameRequirement = (gladiator: Gladiator, matchType: string) => {
    const match = MATCH_TYPES[matchType];
    return gladiator.fame >= match.minFame;
  };

  // Handle match selection and preview
  const handleSelectMatch = (matchType: string) => {
    if (!selectedGladiator) return;
    if (!meetsFameRequirement(selectedGladiator, matchType)) return;
    if (gold < MATCH_TYPES[matchType].entryFee) return;

    setSelectedMatch(matchType);
    const opponent = generateOpponent(selectedGladiator.fame, matchType, 'normal');
    setPreviewOpponent(opponent);
    setShowConfirmModal(true);
  };

  // Start the fight
  const handleStartFight = () => {
    if (!selectedGladiator || !selectedMatch || !previewOpponent) return;

    const match = MATCH_TYPES[selectedMatch];
    
    // Deduct entry fee
    dispatch(spendGold({
      amount: match.entryFee,
      description: `Entry fee: ${match.name}`,
      category: 'arena',
      day: currentDay,
    }));

    // Start combat
    dispatch(startCombat({
      gladiator: selectedGladiator,
      opponent: previewOpponent,
      matchType: selectedMatch,
      rules: match.rules,
      maxRounds: match.rounds,
    }));

    // Navigate to combat screen
    dispatch(setScreen('combat'));
    setShowConfirmModal(false);
  };

  // If there's an active tournament, show the bracket view instead
  if (activeTournament) {
    return (
      <MainLayout>
        <BracketView />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
            The Arena
          </h1>
          <p className="text-roman-marble-400">
            Fight for glory, gold, and eternal fame in the arena!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-roman-stone-700">
          <button
            onClick={() => setActiveTab('fights')}
            className={clsx(
              'px-6 py-3 font-semibold transition-colors relative',
              activeTab === 'fights'
                ? 'text-roman-gold-400'
                : 'text-roman-marble-500 hover:text-roman-marble-300'
            )}
          >
            Regular Fights
            {activeTab === 'fights' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-roman-gold-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={clsx(
              'px-6 py-3 font-semibold transition-colors relative',
              activeTab === 'tournaments'
                ? 'text-roman-gold-400'
                : 'text-roman-marble-500 hover:text-roman-marble-300'
            )}
          >
            🏆 Tournaments
            {activeTab === 'tournaments' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-roman-gold-400"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'fights' ? (
          <div className="grid grid-cols-3 gap-6">
          {/* Gladiator Selection */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Fighter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {availableGladiators.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚔️</div>
                    <p className="text-roman-marble-400 text-sm">
                      No gladiators ready for combat. Ensure they are healthy and rested.
                    </p>
                  </div>
                ) : (
                  availableGladiators.map(gladiator => (
                    <GladiatorSelectCard
                      key={gladiator.id}
                      gladiator={gladiator}
                      isSelected={selectedGladiator?.id === gladiator.id}
                      onClick={() => setSelectedGladiator(gladiator)}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Match Types */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Matches</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedGladiator ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🏟️</div>
                    <p className="text-roman-marble-400">
                      Select a gladiator to view available matches
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(MATCH_TYPES).map(match => {
                      const canEnter = meetsFameRequirement(selectedGladiator, match.id);
                      const canAfford = gold >= match.entryFee;

                      return (
                        <MatchCard
                          key={match.id}
                          match={match}
                          gladiatorFame={selectedGladiator.fame}
                          canEnter={canEnter}
                          canAfford={canAfford}
                          onSelect={() => handleSelectMatch(match.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        ) : (
          <TournamentsScreen />
        )}

        {/* Confirm Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Entry"
          size="lg"
        >
          {selectedGladiator && selectedMatch && previewOpponent && (
            <div className="space-y-6">
              {/* VS Display */}
              <div className="flex items-center justify-between">
                {/* Player Gladiator */}
                <div className="text-center flex-1">
                  <div className="text-4xl mb-2">
                    {GLADIATOR_CLASSES[selectedGladiator.class]?.icon}
                  </div>
                  <div className="font-roman text-lg text-roman-gold-400">
                    {selectedGladiator.name}
                  </div>
                  <div className="text-sm text-roman-marble-400">
                    Level {selectedGladiator.level} {GLADIATOR_CLASSES[selectedGladiator.class]?.name}
                  </div>
                  <div className="text-xs text-roman-marble-500 mt-2">
                    ⭐ {selectedGladiator.fame} Fame
                  </div>
                </div>

                <div className="text-4xl font-roman text-roman-crimson-500 px-8">
                  VS
                </div>

                {/* Opponent */}
                <div className="text-center flex-1">
                  <div className="text-4xl mb-2">
                    {GLADIATOR_CLASSES[previewOpponent.class]?.icon}
                  </div>
                  <div className="font-roman text-lg text-roman-crimson-400">
                    {previewOpponent.name}
                  </div>
                  <div className="text-sm text-roman-marble-400">
                    Level {previewOpponent.level} {GLADIATOR_CLASSES[previewOpponent.class]?.name}
                  </div>
                  <div className="text-xs text-roman-marble-500 mt-2">
                    ??? Fame
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="bg-roman-marble-800 p-4 rounded-lg">
                <div className="text-center mb-3">
                  <span className="font-roman text-xl text-roman-gold-400">
                    {MATCH_TYPES[selectedMatch].name}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-roman-marble-500">Rules</div>
                    <div className="text-roman-marble-200 capitalize">
                      {MATCH_TYPES[selectedMatch].rules.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-roman-marble-500">Max Rounds</div>
                    <div className="text-roman-marble-200">
                      {MATCH_TYPES[selectedMatch].rounds}
                    </div>
                  </div>
                  <div>
                    <div className="text-roman-marble-500">Entry Fee</div>
                    <div className="text-roman-gold-400">
                      {MATCH_TYPES[selectedMatch].entryFee}g
                    </div>
                  </div>
                </div>
              </div>

              {/* Rewards Preview */}
              <div className="bg-roman-gold-500/10 border border-roman-gold-600 p-4 rounded-lg">
                <div className="text-center text-sm text-roman-gold-400 mb-2">
                  Potential Rewards (Victory)
                </div>
                <div className="flex justify-center gap-8 text-sm">
                  <div>
                    <span className="text-roman-marble-400">Gold: </span>
                    <span className="text-roman-gold-400">
                      ~{Math.round(50 * MATCH_TYPES[selectedMatch].rewardMultiplier)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-roman-marble-400">Fame: </span>
                    <span className="text-roman-gold-400">
                      ~{Math.round(20 * MATCH_TYPES[selectedMatch].fameMultiplier)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning for death matches */}
              {MATCH_TYPES[selectedMatch].rules === 'death' && (
                <div className="bg-roman-crimson-600/20 border border-roman-crimson-600 p-3 rounded-lg">
                  <div className="text-roman-crimson-400 text-sm text-center">
                    ⚠️ Death Match: Your gladiator may die if defeated!
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={handleStartFight}
                >
                  Enter Arena
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

// Gladiator Selection Card
interface GladiatorSelectCardProps {
  gladiator: Gladiator;
  isSelected: boolean;
  onClick: () => void;
}

const GladiatorSelectCard: React.FC<GladiatorSelectCardProps> = ({
  gladiator,
  isSelected,
  onClick,
}) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-3 rounded-lg border cursor-pointer transition-all',
        isSelected
          ? 'border-roman-gold-500 bg-roman-gold-500/10'
          : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{classData?.icon}</span>
        <div className="flex-1">
          <div className="font-roman text-roman-marble-100">{gladiator.name}</div>
          <div className="text-xs text-roman-marble-500">
            Lv.{gladiator.level} • ⭐ {gladiator.fame}
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <ProgressBar 
          value={gladiator.currentHP} 
          max={gladiator.maxHP} 
          variant="health" 
          size="sm" 
        />
        <ProgressBar 
          value={gladiator.currentStamina} 
          max={gladiator.maxStamina} 
          variant="stamina" 
          size="sm" 
        />
      </div>
    </div>
  );
};

// Match Card
interface MatchCardProps {
  match: typeof MATCH_TYPES[string];
  gladiatorFame: number;
  canEnter: boolean;
  canAfford: boolean;
  onSelect: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  gladiatorFame,
  canEnter,
  canAfford,
  onSelect,
}) => {
  const isLocked = !canEnter || !canAfford;

  return (
    <div
      onClick={() => !isLocked && onSelect()}
      className={clsx(
        'p-4 rounded-lg border transition-all',
        isLocked
          ? 'border-roman-marble-700 bg-roman-marble-900 opacity-60 cursor-not-allowed'
          : 'border-roman-marble-600 bg-roman-marble-800 cursor-pointer hover:border-roman-gold-600'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-roman text-lg text-roman-marble-100">{match.name}</div>
          <div className={clsx(
            'text-xs px-2 py-0.5 rounded inline-block mt-1',
            match.rules === 'death' && 'bg-roman-crimson-600',
            match.rules === 'submission' && 'bg-roman-bronze-600',
            match.rules === 'first_blood' && 'bg-blue-600'
          )}>
            {match.rules.replace('_', ' ')}
          </div>
        </div>
        <div className="text-right">
          <div className="text-roman-gold-400 font-roman">{match.entryFee}g</div>
          <div className="text-xs text-roman-marble-500">entry</div>
        </div>
      </div>

      <p className="text-xs text-roman-marble-400 mb-3">{match.description}</p>

      <div className="flex justify-between text-xs">
        <div>
          <span className="text-roman-marble-500">Min Fame: </span>
          <span className={gladiatorFame >= match.minFame ? 'text-health-high' : 'text-roman-crimson-400'}>
            {match.minFame}
          </span>
        </div>
        <div>
          <span className="text-roman-marble-500">Rounds: </span>
          <span className="text-roman-marble-300">{match.rounds}</span>
        </div>
      </div>

      <div className="flex justify-between text-xs mt-1">
        <div>
          <span className="text-roman-marble-500">Reward: </span>
          <span className="text-roman-gold-400">{match.rewardMultiplier}x</span>
        </div>
        <div>
          <span className="text-roman-marble-500">Fame: </span>
          <span className="text-roman-gold-400">{match.fameMultiplier}x</span>
        </div>
      </div>

      {!canEnter && (
        <div className="text-xs text-roman-crimson-400 mt-2">
          ⚠️ Need {match.minFame} fame to enter
        </div>
      )}
      {canEnter && !canAfford && (
        <div className="text-xs text-roman-crimson-400 mt-2">
          ⚠️ Cannot afford entry fee
        </div>
      )}
    </div>
  );
};
