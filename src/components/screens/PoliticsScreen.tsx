import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { spendGold } from '@features/player/playerSlice';
import { 
  adjustFavor, 
  setCooldown, 
  formAlliance,
  breakAlliance,
  recordSabotage,
} from '@features/factions/factionsSlice';
import { addLudusFame } from '@features/fame/fameSlice';
import { updateObjective } from '@features/quests/questsSlice';
import { getQuestById } from '@data/quests';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ProgressBar } from '@components/ui';
import { 
  FACTIONS, 
  POLITICAL_ACTIONS,
  SABOTAGE_EVENTS,
  getFavorLevel,
  calculateFactionModifiers,
  type PoliticalAction,
} from '@data/factions';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

type FactionId = 'optimates' | 'populares' | 'military' | 'merchants';

export const PoliticsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const factionsState = useAppSelector(state => state.factions);
  const factionFavors = factionsState?.factionFavors || {
    optimates: 0,
    populares: 0,
    military: 0,
    merchants: 0,
  };
  const actionCooldowns = factionsState?.actionCooldowns || {};
  const alliedWith = factionsState?.alliedWith || null;
  const pendingSabotage = factionsState?.pendingSabotage || null;
  const protectionLevel = factionsState?.protectionLevel || 0;
  
  const { gold } = useAppSelector(state => state.player);
  const gameState = useAppSelector(state => state.game);
  const currentDay = ((gameState?.currentYear ?? 73) - 73) * 12 + (gameState?.currentMonth ?? 1);
  const questsState = useAppSelector(state => state.quests);
  const activeQuests = questsState?.activeQuests || [];
  const currentLudusFame = useAppSelector(state => state.fame?.ludusFame || 0);

  const [selectedFaction, setSelectedFaction] = useState<FactionId | null>(null);
  const [selectedAction, setSelectedAction] = useState<PoliticalAction | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'factions' | 'actions' | 'history'>('factions');

  // Calculate modifiers from faction standings
  const modifiers = calculateFactionModifiers(factionFavors);

  // Helper to update fame objectives in all active quests
  const updateFameObjectives = (newFameTotal: number) => {
    activeQuests.forEach(activeQuest => {
      const questData = getQuestById(activeQuest.questId);
      if (questData) {
        questData.objectives.forEach(objective => {
          if (objective.type === 'gain_fame') {
            dispatch(updateObjective({
              questId: activeQuest.questId,
              objectiveId: objective.id,
              progress: newFameTotal,
              required: objective.required,
            }));
          }
        });
      }
    });
  };

  // Helper to update faction favor objectives in all active quests
  const updateFavorObjectives = (updatedFavors: typeof factionFavors) => {
    activeQuests.forEach(activeQuest => {
      const questData = getQuestById(activeQuest.questId);
      if (questData) {
        questData.objectives.forEach(objective => {
          if (objective.type === 'reach_favor') {
            // If specific faction targeted, use that faction's favor
            // Otherwise use the highest favor among all factions
            const progress = objective.target 
              ? (updatedFavors[objective.target as keyof typeof updatedFavors] || 0)
              : Math.max(...Object.values(updatedFavors));
            
            dispatch(updateObjective({
              questId: activeQuest.questId,
              objectiveId: objective.id,
              progress,
              required: objective.required,
            }));
          }
        });
      }
    });
  };

  // Handle political action
  const handleExecuteAction = () => {
    if (!selectedAction || !selectedFaction) return;
    if (gold < selectedAction.cost) return;

    // Deduct cost
    if (selectedAction.cost > 0) {
      dispatch(spendGold({
        amount: selectedAction.cost,
        description: `Political: ${selectedAction.name}`,
        category: 'political',
        day: currentDay,
      }));
    }

    // Roll for success
    const roll = Math.random() * 100;
    const success = roll < selectedAction.successChance;

    if (success) {
      // Apply favor change
      dispatch(adjustFavor({ 
        faction: selectedFaction, 
        amount: selectedAction.favorChange 
      }));

      // Calculate updated favor values for quest tracking
      const updatedFavors = { ...factionFavors };
      updatedFavors[selectedFaction] = Math.max(0, Math.min(100, 
        (updatedFavors[selectedFaction] || 0) + selectedAction.favorChange
      ));

      // Apply rival favor change if applicable
      if (selectedAction.rivalFavorChange) {
        const rivalFaction = FACTIONS[selectedFaction]?.rivalFaction as FactionId;
        if (rivalFaction) {
          dispatch(adjustFavor({ 
            faction: rivalFaction, 
            amount: selectedAction.rivalFavorChange 
          }));
          updatedFavors[rivalFaction] = Math.max(0, Math.min(100, 
            (updatedFavors[rivalFaction] || 0) + selectedAction.rivalFavorChange
          ));
        }
      }

      // Update favor objectives in quests
      updateFavorObjectives(updatedFavors);

      // Handle alliance
      if (selectedAction.type === 'alliance') {
        dispatch(formAlliance({ faction: selectedFaction, day: currentDay }));
      }

      setActionResult({
        success: true,
        message: selectedAction.consequences?.onSuccess || 'Your action was successful!',
      });
    } else {
      // Failed action consequences
      if (selectedAction.type === 'sabotage' || selectedAction.type === 'bribe') {
        // Lose favor with both factions on failed sabotage/bribe
        dispatch(adjustFavor({ faction: selectedFaction, amount: -15 }));
        dispatch(addLudusFame({ amount: -10, source: 'Political failure', day: currentDay }));
        // Update fame objectives
        updateFameObjectives(Math.max(0, currentLudusFame - 10));
        
        // Update favor objectives for failed action
        const updatedFavors = { ...factionFavors };
        updatedFavors[selectedFaction] = Math.max(0, (updatedFavors[selectedFaction] || 0) - 15);
        updateFavorObjectives(updatedFavors);
      }

      setActionResult({
        success: false,
        message: selectedAction.consequences?.onFailure || 'Your action failed!',
      });
    }

    // Set cooldown
    dispatch(setCooldown({ 
      actionId: selectedAction.id, 
      days: selectedAction.cooldownDays 
    }));

    setShowActionModal(false);
  };

  // Handle sabotage prevention
  const handlePreventSabotage = () => {
    if (!pendingSabotage) return;

    dispatch(spendGold({
      amount: pendingSabotage.preventionCost,
      description: 'Sabotage prevention',
      category: 'security',
      day: currentDay,
    }));

    dispatch(recordSabotage({
      id: uuidv4(),
      eventId: pendingSabotage.eventId,
      day: currentDay,
      prevented: true,
      effects: [],
    }));
  };

  const handleIgnoreSabotage = () => {
    if (!pendingSabotage) return;

    const event = SABOTAGE_EVENTS.find(e => e.id === pendingSabotage.eventId);
    const effects = event?.effects.map(e => `${e.type}: ${e.value}`) || [];

    dispatch(recordSabotage({
      id: uuidv4(),
      eventId: pendingSabotage.eventId,
      day: currentDay,
      prevented: false,
      effects,
    }));
  };

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
            Politics of Rome
          </h1>
          <p className="text-roman-marble-400">
            Navigate the treacherous waters of Roman politics. Allies bring rewards, enemies bring ruin.
          </p>
        </div>

        {/* Pending Sabotage Alert */}
        {pendingSabotage && (
          <SabotageAlert
            sabotage={pendingSabotage}
            gold={gold}
            onPrevent={handlePreventSabotage}
            onIgnore={handleIgnoreSabotage}
          />
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-roman-marble-700 pb-2">
          {(['factions', 'actions', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-2 rounded-t font-roman capitalize transition-colors',
                activeTab === tab
                  ? 'bg-roman-gold-600 text-roman-marble-100'
                  : 'text-roman-marble-400 hover:text-roman-marble-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'factions' && (
          <FactionsTab
            factionFavors={factionFavors}
            alliedWith={alliedWith}
            modifiers={modifiers}
            protectionLevel={protectionLevel}
            onSelectFaction={setSelectedFaction}
            selectedFaction={selectedFaction}
            onBreakAlliance={() => dispatch(breakAlliance())}
          />
        )}

        {activeTab === 'actions' && (
          <ActionsTab
            factionFavors={factionFavors}
            actionCooldowns={actionCooldowns}
            gold={gold}
            selectedFaction={selectedFaction}
            onSelectFaction={setSelectedFaction}
            onSelectAction={(action) => {
              setSelectedAction(action);
              setShowActionModal(true);
            }}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab sabotageHistory={factionsState?.sabotageHistory || []} />
        )}

        {/* Action Result Toast */}
        <AnimatePresence>
          {actionResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={clsx(
                'fixed bottom-4 right-4 p-4 rounded-lg border max-w-md',
                actionResult.success
                  ? 'bg-health-high/20 border-health-high'
                  : 'bg-roman-crimson-600/20 border-roman-crimson-600'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{actionResult.success ? '✓' : '✗'}</span>
                <div>
                  <div className={clsx(
                    'font-roman',
                    actionResult.success ? 'text-health-high' : 'text-roman-crimson-400'
                  )}>
                    {actionResult.success ? 'Success!' : 'Failed!'}
                  </div>
                  <div className="text-sm text-roman-marble-300">{actionResult.message}</div>
                </div>
                <button 
                  onClick={() => setActionResult(null)}
                  className="ml-auto text-roman-marble-500 hover:text-roman-marble-300"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Modal */}
        <Modal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          title="Execute Political Action"
        >
          {selectedAction && selectedFaction && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedAction.icon}</div>
                <div className="font-roman text-xl text-roman-gold-400">
                  {selectedAction.name}
                </div>
                <div className="text-sm text-roman-marble-400 mt-1">
                  Target: {FACTIONS[selectedFaction]?.name}
                </div>
              </div>

              <p className="text-roman-marble-300 text-sm">{selectedAction.description}</p>

              <div className="bg-roman-marble-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Cost:</span>
                  <span className={gold >= selectedAction.cost ? 'text-roman-gold-400' : 'text-roman-crimson-400'}>
                    {selectedAction.cost}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Favor Change:</span>
                  <span className="text-health-high">+{selectedAction.favorChange}</span>
                </div>
                {selectedAction.rivalFavorChange && (
                  <div className="flex justify-between">
                    <span className="text-roman-marble-400">Rival Impact:</span>
                    <span className="text-roman-crimson-400">{selectedAction.rivalFavorChange}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Success Rate:</span>
                  <span className={clsx(
                    selectedAction.successChance >= 80 ? 'text-health-high' :
                    selectedAction.successChance >= 60 ? 'text-roman-gold-400' : 'text-roman-crimson-400'
                  )}>
                    {selectedAction.successChance}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Cooldown:</span>
                  <span className="text-roman-marble-300">{selectedAction.cooldownDays} days</span>
                </div>
              </div>

              {selectedAction.riskLevel === 'high' && (
                <div className="bg-roman-crimson-600/20 border border-roman-crimson-600 p-3 rounded-lg">
                  <div className="text-roman-crimson-400 text-sm">
                    ⚠️ High Risk Action - Failure may have severe consequences!
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowActionModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="gold" 
                  className="flex-1" 
                  onClick={handleExecuteAction}
                  disabled={gold < selectedAction.cost}
                >
                  Execute
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

// Sabotage Alert Component
interface SabotageAlertProps {
  sabotage: { eventId: string; perpetrator: string; preventionCost: number };
  gold: number;
  onPrevent: () => void;
  onIgnore: () => void;
}

const SabotageAlert: React.FC<SabotageAlertProps> = ({
  sabotage,
  gold,
  onPrevent,
  onIgnore,
}) => {
  const event = SABOTAGE_EVENTS.find(e => e.id === sabotage.eventId);
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-roman-crimson-600/20 border-2 border-roman-crimson-600 rounded-lg p-4"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-roman text-xl text-roman-crimson-400">{event.name}</h3>
          <p className="text-roman-marble-300 text-sm mt-1">{event.description}</p>
          <div className="mt-3 flex gap-3">
            <Button
              variant="gold"
              size="sm"
              onClick={onPrevent}
              disabled={gold < sabotage.preventionCost}
            >
              Prevent ({sabotage.preventionCost}g)
            </Button>
            <Button variant="ghost" size="sm" onClick={onIgnore}>
              Ignore
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Factions Tab
interface FactionsTabProps {
  factionFavors: Record<FactionId, number>;
  alliedWith: FactionId | null;
  modifiers: ReturnType<typeof calculateFactionModifiers>;
  protectionLevel: number;
  selectedFaction: FactionId | null;
  onSelectFaction: (faction: FactionId) => void;
  onBreakAlliance: () => void;
}

const FactionsTab: React.FC<FactionsTabProps> = ({
  factionFavors,
  alliedWith,
  modifiers,
  protectionLevel,
  selectedFaction,
  onSelectFaction,
  onBreakAlliance,
}) => {
  return (
    <div className="space-y-6">
      {/* Faction Cards */}
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(FACTIONS) as FactionId[]).map(factionId => {
          const faction = FACTIONS[factionId];
          const favor = factionFavors[factionId] || 0;
          const favorLevel = getFavorLevel(favor);
          const isAllied = alliedWith === factionId;
          const isSelected = selectedFaction === factionId;

          return (
            <div
              key={factionId}
              onClick={() => onSelectFaction(factionId)}
              className={clsx(
                'p-4 rounded-lg border cursor-pointer transition-all',
                isSelected
                  ? 'border-roman-gold-500 bg-roman-gold-500/10'
                  : isAllied
                    ? 'border-health-high bg-health-high/10'
                    : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{faction.icon}</span>
                  <div>
                    <div className="font-roman text-lg text-roman-marble-100">
                      {faction.name}
                    </div>
                    <div className="text-xs text-roman-marble-500">
                      Leader: {faction.leader}
                    </div>
                  </div>
                </div>
                {isAllied && (
                  <span className="px-2 py-1 bg-health-high text-xs rounded">Allied</span>
                )}
              </div>

              <p className="text-xs text-roman-marble-400 mb-3 line-clamp-2">
                {faction.ideology}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={favorLevel.color}>{favorLevel.level}</span>
                  <span className="text-roman-marble-400">{favor}/100</span>
                </div>
                <ProgressBar
                  value={favor + 100}
                  max={200}
                  variant="default"
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Faction Details */}
      {selectedFaction && (
        <Card>
          <CardHeader>
            <CardTitle>{FACTIONS[selectedFaction].name} Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Benefits */}
              <div>
                <h4 className="font-roman text-roman-gold-400 mb-3">Benefits</h4>
                <div className="space-y-2">
                  {FACTIONS[selectedFaction].benefits.map((benefit, idx) => {
                    const isUnlocked = factionFavors[selectedFaction] >= benefit.favorThreshold;
                    return (
                      <div 
                        key={idx}
                        className={clsx(
                          'text-sm p-2 rounded',
                          isUnlocked ? 'bg-health-high/20' : 'bg-roman-marble-800 opacity-60'
                        )}
                      >
                        <div className="flex justify-between">
                          <span className={isUnlocked ? 'text-health-high' : 'text-roman-marble-500'}>
                            {benefit.description}
                          </span>
                          <span className="text-xs text-roman-marble-500">
                            {benefit.favorThreshold}+
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Penalties */}
              <div>
                <h4 className="font-roman text-roman-crimson-400 mb-3">Penalties</h4>
                <div className="space-y-2">
                  {FACTIONS[selectedFaction].penalties.map((penalty, idx) => {
                    const isActive = factionFavors[selectedFaction] <= penalty.favorThreshold;
                    return (
                      <div 
                        key={idx}
                        className={clsx(
                          'text-sm p-2 rounded',
                          isActive ? 'bg-roman-crimson-600/20' : 'bg-roman-marble-800 opacity-60'
                        )}
                      >
                        <div className="flex justify-between">
                          <span className={isActive ? 'text-roman-crimson-400' : 'text-roman-marble-500'}>
                            {penalty.description}
                          </span>
                          <span className="text-xs text-roman-marble-500">
                            {penalty.favorThreshold} or less
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {alliedWith === selectedFaction && (
              <div className="mt-4 pt-4 border-t border-roman-marble-700">
                <Button variant="crimson" onClick={onBreakAlliance}>
                  Break Alliance (−30 Favor)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Modifiers Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Active Modifiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm text-roman-marble-500 mb-2">Discounts</h4>
              {modifiers.discounts.length > 0 ? (
                modifiers.discounts.map((d, i) => (
                  <div key={i} className="text-sm text-health-high">
                    {d.source}: -{d.value}%
                  </div>
                ))
              ) : (
                <div className="text-sm text-roman-marble-600">None</div>
              )}
            </div>
            <div>
              <h4 className="text-sm text-roman-marble-500 mb-2">Income</h4>
              {modifiers.income.length > 0 ? (
                modifiers.income.map((d, i) => (
                  <div key={i} className="text-sm text-roman-gold-400">
                    {d.source}: +{d.value}g
                  </div>
                ))
              ) : (
                <div className="text-sm text-roman-marble-600">None</div>
              )}
            </div>
            <div>
              <h4 className="text-sm text-roman-marble-500 mb-2">Bonuses</h4>
              {modifiers.bonuses.length > 0 ? (
                modifiers.bonuses.map((d, i) => (
                  <div key={i} className="text-sm text-blue-400">
                    {d.source}: +{d.value}% {d.type}
                  </div>
                ))
              ) : (
                <div className="text-sm text-roman-marble-600">None</div>
              )}
            </div>
            <div>
              <h4 className="text-sm text-roman-marble-500 mb-2">Penalties</h4>
              {modifiers.penalties.length > 0 ? (
                modifiers.penalties.map((d, i) => (
                  <div key={i} className="text-sm text-roman-crimson-400">
                    {d.source}: {d.type}
                  </div>
                ))
              ) : (
                <div className="text-sm text-roman-marble-600">None</div>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-roman-marble-700">
            <div className="flex items-center justify-between">
              <span className="text-roman-marble-400">Protection Level:</span>
              <span className="text-roman-marble-200">{protectionLevel}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Actions Tab
interface ActionsTabProps {
  factionFavors: Record<FactionId, number>;
  actionCooldowns: Record<string, number>;
  gold: number;
  selectedFaction: FactionId | null;
  onSelectFaction: (faction: FactionId) => void;
  onSelectAction: (action: PoliticalAction) => void;
}

const ActionsTab: React.FC<ActionsTabProps> = ({
  factionFavors,
  actionCooldowns,
  gold,
  selectedFaction,
  onSelectFaction,
  onSelectAction,
}) => {
  const [actionFilter, setActionFilter] = useState<'all' | 'gift' | 'bribe' | 'service' | 'sabotage' | 'alliance'>('all');

  const filteredActions = POLITICAL_ACTIONS.filter(action => {
    if (actionFilter !== 'all' && action.type !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Faction Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Target Faction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(Object.keys(FACTIONS) as FactionId[]).map(factionId => (
              <button
                key={factionId}
                onClick={() => onSelectFaction(factionId)}
                className={clsx(
                  'flex-1 p-3 rounded-lg border transition-all',
                  selectedFaction === factionId
                    ? 'border-roman-gold-500 bg-roman-gold-500/10'
                    : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
                )}
              >
                <div className="text-2xl mb-1">{FACTIONS[factionId].icon}</div>
                <div className="text-sm text-roman-marble-200">{FACTIONS[factionId].name}</div>
                <div className="text-xs text-roman-marble-500">
                  Favor: {factionFavors[factionId] || 0}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Filters */}
      <div className="flex gap-2">
        {(['all', 'gift', 'bribe', 'service', 'sabotage', 'alliance'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActionFilter(filter)}
            className={clsx(
              'px-3 py-1 rounded text-sm capitalize',
              actionFilter === filter
                ? 'bg-roman-gold-600 text-roman-marble-100'
                : 'bg-roman-marble-800 text-roman-marble-400 hover:text-roman-marble-200'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Available Actions */}
      {selectedFaction ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredActions.map(action => {
            const onCooldown = (actionCooldowns[action.id] || 0) > 0;
            const canAfford = gold >= action.cost;
            const meetsRequirements = action.requiredFavor === undefined || 
              (action.requiredFavor < 0 
                ? factionFavors[selectedFaction] <= action.requiredFavor
                : factionFavors[selectedFaction] >= action.requiredFavor);

            return (
              <div
                key={action.id}
                className={clsx(
                  'p-4 rounded-lg border',
                  onCooldown || !canAfford || !meetsRequirements
                    ? 'border-roman-marble-700 bg-roman-marble-900 opacity-60'
                    : 'border-roman-marble-600 bg-roman-marble-800'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <div className="font-roman text-sm text-roman-marble-100">{action.name}</div>
                    <div className={clsx(
                      'text-xs px-1.5 py-0.5 rounded inline-block',
                      action.riskLevel === 'low' && 'bg-health-high',
                      action.riskLevel === 'medium' && 'bg-roman-gold-600',
                      action.riskLevel === 'high' && 'bg-roman-crimson-600'
                    )}>
                      {action.riskLevel} risk
                    </div>
                  </div>
                </div>

                <p className="text-xs text-roman-marble-400 mb-3 line-clamp-2">
                  {action.description}
                </p>

                <div className="space-y-1 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Cost:</span>
                    <span className={canAfford ? 'text-roman-gold-400' : 'text-roman-crimson-400'}>
                      {action.cost}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Favor:</span>
                    <span className="text-health-high">+{action.favorChange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-roman-marble-500">Success:</span>
                    <span className="text-roman-marble-300">{action.successChance}%</span>
                  </div>
                </div>

                {onCooldown ? (
                  <div className="text-xs text-roman-crimson-400">
                    Cooldown: {actionCooldowns[action.id]} days
                  </div>
                ) : !meetsRequirements ? (
                  <div className="text-xs text-roman-crimson-400">
                    Requires {action.requiredFavor} favor
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    disabled={!canAfford}
                    onClick={() => onSelectAction(action)}
                  >
                    Execute
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-roman-marble-500">
          Select a faction to view available actions
        </div>
      )}
    </div>
  );
};

// History Tab
interface HistoryTabProps {
  sabotageHistory: { id: string; eventId: string; day: number; prevented: boolean; effects: string[] }[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ sabotageHistory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sabotage History</CardTitle>
      </CardHeader>
      <CardContent>
        {sabotageHistory.length === 0 ? (
          <div className="text-center py-8 text-roman-marble-500">
            No sabotage events recorded
          </div>
        ) : (
          <div className="space-y-3">
            {[...sabotageHistory].reverse().map(entry => {
              const event = SABOTAGE_EVENTS.find(e => e.id === entry.eventId);
              return (
                <div 
                  key={entry.id}
                  className={clsx(
                    'p-3 rounded-lg',
                    entry.prevented 
                      ? 'bg-health-high/10 border border-health-high'
                      : 'bg-roman-crimson-600/10 border border-roman-crimson-600'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={clsx(
                        'font-roman',
                        entry.prevented ? 'text-health-high' : 'text-roman-crimson-400'
                      )}>
                        {event?.name || 'Unknown Event'}
                      </div>
                      <div className="text-xs text-roman-marble-500">Day {entry.day}</div>
                    </div>
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-xs',
                      entry.prevented ? 'bg-health-high' : 'bg-roman-crimson-600'
                    )}>
                      {entry.prevented ? 'Prevented' : 'Occurred'}
                    </span>
                  </div>
                  {!entry.prevented && entry.effects.length > 0 && (
                    <div className="mt-2 text-xs text-roman-marble-400">
                      Effects: {entry.effects.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
