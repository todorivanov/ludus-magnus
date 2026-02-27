import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import {
  selectGladiator,
  sellGladiator,
  setTraining,
  setResting,
  updateGladiator,
  setTrainingRegimen,
  setNutrition,
  learnSkill,
  type DeadGladiator,
} from '@features/gladiators/gladiatorsSlice';
import { setScreen } from '@features/game/gameSlice';
import { addGold } from '@features/player/playerSlice';
import { incrementObjective } from '@features/quests/questsSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar, Modal, useToast } from '@components/ui';
import { ItemInventoryModal } from '@components/marketplace/ItemInventoryModal';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { ALL_MARKET_ITEMS } from '@data/marketplace';
import {
  TRAINING_REGIMENS,
  NUTRITION_OPTIONS,
  calculateXPGain,
  getAvailableTraining,
  type TrainingType,
  type NutritionQuality,
} from '@data/training';
import {
  CLASS_SKILL_TREES,
  UNIVERSAL_SKILLS,
  canLearnSkill,
} from '@data/skillTrees';
import { getQuestById } from '@data/quests';
import { calculateSellValue } from '@utils/gladiatorGenerator';
import { getAgeCategoryDescription } from '@/utils/ageSystem';
import type { Gladiator } from '@/types';
import { clsx } from 'clsx';

type MainTabType = 'roster' | 'fallen';
type DetailTabType = 'overview' | 'training' | 'nutrition' | 'skills' | 'items';

export const GladiatorsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const gladiatorsState = useAppSelector(state => state.gladiators);
  const roster = gladiatorsState?.roster || [];
  const deadGladiators = gladiatorsState?.deadGladiators || [];
  const selectedGladiatorId = gladiatorsState?.selectedGladiatorId || null;
  const gameState = useAppSelector(state => state.game);
  const currentDay = ((gameState?.currentYear ?? 73) - 73) * 12 + (gameState?.currentMonth ?? 1);
  const { buildings } = useAppSelector(state => state.ludus);
  const { resources } = useAppSelector(state => state.player);
  const questsState = useAppSelector(state => state.quests);
  const activeQuests = questsState?.activeQuests || [];

  const [mainTab, setMainTab] = useState<MainTabType>('roster');
  const [detailTab, setDetailTab] = useState<DetailTabType>('overview');
  const [showSellModal, setShowSellModal] = useState(false);
  const [gladiatorToSell, setGladiatorToSell] = useState<Gladiator | null>(null);
  const [selectedFallen, setSelectedFallen] = useState<DeadGladiator | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const selectedGladiator = roster.find(g => g.id === selectedGladiatorId);
  const availableTraining = getAvailableTraining(buildings.map(b => ({ type: b.type, level: b.level })));

  const handleSelect = (gladiator: Gladiator) => {
    dispatch(selectGladiator(gladiator.id));
    setDetailTab('overview');
  };

  const handleSellClick = (gladiator: Gladiator) => {
    setGladiatorToSell(gladiator);
    setShowSellModal(true);
  };

  const handleConfirmSell = () => {
    if (gladiatorToSell) {
      const sellValue = calculateSellValue(gladiatorToSell);
      dispatch(addGold({
        amount: sellValue,
        description: `Sold gladiator: ${gladiatorToSell.name}`,
        category: 'gladiator',
        day: currentDay,
      }));
      dispatch(sellGladiator(gladiatorToSell.id));
      if (selectedGladiatorId === gladiatorToSell.id) {
        dispatch(selectGladiator(null));
      }
      setShowSellModal(false);
      setGladiatorToSell(null);
    }
  };

  const handleToggleTraining = (gladiator: Gladiator) => {
    dispatch(setTraining({ id: gladiator.id, isTraining: !gladiator.isTraining }));
  };

  const handleToggleResting = (gladiator: Gladiator) => {
    dispatch(setResting({ id: gladiator.id, isResting: !gladiator.isResting }));
  };

  const handleSetTrainingRegimen = (gladiatorId: string, trainingType: TrainingType | null) => {
    dispatch(setTrainingRegimen({ gladiatorId, trainingType }));
    if (trainingType) {
      activeQuests.forEach(activeQuest => {
        const questDef = getQuestById(activeQuest.questId);
        if (!questDef) return;
        questDef.objectives.forEach(objective => {
          if (objective.type === 'train') {
            dispatch(incrementObjective({
              questId: activeQuest.questId,
              objectiveId: objective.id,
              amount: 1,
              required: objective.required,
            }));
          }
        });
      });
    }
  };

  const handleSetNutrition = (gladiatorId: string, nutrition: NutritionQuality) => {
    dispatch(setNutrition({ gladiatorId, nutrition }));
  };

  const handleLearnSkill = (gladiatorId: string, skillId: string) => {
    dispatch(learnSkill({ gladiatorId, skillId }));
  };

  const handleUseItem = () => {
    if (selectedGladiator) {
      setShowItemModal(true);
    }
  };

  const handleApplyItem = (updatedGladiator: Gladiator, message: string) => {
    dispatch(updateGladiator({
      id: updatedGladiator.id,
      updates: updatedGladiator,
    }));
    addToast({
      type: 'success',
      title: 'Item Used',
      message: message,
    });
    setShowItemModal(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const detailTabs: { id: DetailTabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'training', label: 'Training', icon: '⚔️' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍖' },
    { id: 'skills', label: 'Skills', icon: '📚' },
    { id: 'items', label: 'Items', icon: '🎒' },
  ];

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-1">
              Gladiator Roster
            </h1>
            <p className="text-sm text-roman-marble-400">
              {roster.length} fighter{roster.length !== 1 ? 's' : ''} in your ludus
              {deadGladiators.length > 0 && ` • ${deadGladiators.length} fallen`}
            </p>
          </div>
        </motion.div>

        {/* Main Tabs: Roster / Fallen */}
        <motion.div variants={itemVariants} className="flex gap-2">
          <button
            onClick={() => setMainTab('roster')}
            className={clsx(
              'px-4 py-2 rounded-lg font-roman text-sm transition-all',
              mainTab === 'roster'
                ? 'bg-roman-gold-600 text-white shadow-lg'
                : 'bg-roman-marble-800 text-roman-marble-300 hover:bg-roman-marble-700'
            )}
          >
            <span className="mr-1.5">⚔️</span>
            Active Roster <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-xs">{roster.length}</span>
          </button>
          <button
            onClick={() => setMainTab('fallen')}
            className={clsx(
              'px-4 py-2 rounded-lg font-roman text-sm transition-all',
              mainTab === 'fallen'
                ? 'bg-roman-crimson-600 text-white shadow-lg'
                : 'bg-roman-marble-800 text-roman-marble-300 hover:bg-roman-marble-700'
            )}
          >
            <span className="mr-1.5">💀</span>
            Fallen <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-xs">{deadGladiators.length}</span>
          </button>
        </motion.div>

        {/* Active Roster Tab */}
        {mainTab === 'roster' && (
          <>
            {roster.length === 0 ? (
              <motion.div variants={itemVariants}>
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">⚔️</div>
                    <h3 className="font-roman text-xl text-roman-gold-500 mb-2">No Gladiators</h3>
                    <p className="text-roman-marble-400 mb-4">
                      Visit the marketplace to recruit your first fighter
                    </p>
                    <Button
                      variant="gold"
                      onClick={() => dispatch(setScreen('marketplace'))}
                    >
                      Go to Marketplace
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="flex gap-4">
                {/* Left Sidebar: Roster List (1/4) */}
                <motion.div variants={itemVariants} className="w-80 flex-shrink-0 space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
                  {roster.map((gladiator) => (
                    <RosterCard
                      key={gladiator.id}
                      gladiator={gladiator}
                      isSelected={selectedGladiatorId === gladiator.id}
                      onClick={() => handleSelect(gladiator)}
                    />
                  ))}
                </motion.div>

                {/* Right Main Area (3/4) */}
                <motion.div variants={itemVariants} className="flex-1 min-w-0">
                  {selectedGladiator ? (
                    <div className="space-y-3">
                      {/* Gladiator Header Card */}
                      <Card>
                        <CardContent className="py-4">
                          <GladiatorHeader gladiator={selectedGladiator} />
                        </CardContent>
                      </Card>

                      {/* Detail Tabs */}
                      <div className="flex gap-1">
                        {detailTabs.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setDetailTab(tab.id)}
                            className={clsx(
                              'px-3 py-1.5 rounded-t-lg font-roman text-sm transition-all',
                              detailTab === tab.id
                                ? 'bg-roman-marble-800 text-roman-gold-400 border-t-2 border-x border-roman-gold-600'
                                : 'bg-roman-marble-900 text-roman-marble-400 hover:text-roman-marble-200 hover:bg-roman-marble-850'
                            )}
                          >
                            <span className="mr-1">{tab.icon}</span>
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <Card className="max-h-[calc(100vh-380px)] overflow-y-auto">
                        <CardContent className="py-4">
                          {detailTab === 'overview' && (
                            <OverviewTab
                              gladiator={selectedGladiator}
                              onSell={() => handleSellClick(selectedGladiator)}
                              onToggleTraining={() => handleToggleTraining(selectedGladiator)}
                              onToggleResting={() => handleToggleResting(selectedGladiator)}
                              onUseItem={handleUseItem}
                            />
                          )}
                          {detailTab === 'training' && (
                            <TrainingTab
                              gladiator={selectedGladiator}
                              availableTraining={availableTraining}
                              buildings={buildings}
                              onSetTraining={handleSetTrainingRegimen}
                            />
                          )}
                          {detailTab === 'nutrition' && (
                            <NutritionTab
                              gladiator={selectedGladiator}
                              resources={resources}
                              onSetNutrition={handleSetNutrition}
                            />
                          )}
                          {detailTab === 'skills' && (
                            <SkillsTab
                              gladiator={selectedGladiator}
                              onLearnSkill={handleLearnSkill}
                            />
                          )}
                          {detailTab === 'items' && (
                            <ItemsTab
                              gladiator={selectedGladiator}
                              onUseItem={handleUseItem}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <CardContent className="text-center">
                        <p className="text-roman-marble-500">
                          Select a gladiator to view details
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Fallen Gladiators Tab */}
        {mainTab === 'fallen' && (
          <>
            {deadGladiators.length === 0 ? (
              <motion.div variants={itemVariants}>
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🕊️</div>
                    <h3 className="font-roman text-xl text-roman-gold-500 mb-2">No Fallen Warriors</h3>
                    <p className="text-roman-marble-400">
                      May the gods protect your gladiators in battle
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="col-span-2 space-y-3">
                  {deadGladiators.map((gladiator) => (
                    <FallenCard
                      key={gladiator.id}
                      gladiator={gladiator}
                      isSelected={selectedFallen?.id === gladiator.id}
                      onClick={() => setSelectedFallen(gladiator)}
                    />
                  ))}
                </motion.div>

                <motion.div variants={itemVariants}>
                  {selectedFallen ? (
                    <FallenDetailPanel gladiator={selectedFallen} />
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <CardContent className="text-center">
                        <p className="text-roman-marble-500">
                          Select a fallen warrior to honor their memory
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Sell Confirmation Modal */}
        <Modal
          isOpen={showSellModal}
          onClose={() => setShowSellModal(false)}
          title="Sell Gladiator?"
          size="sm"
        >
          {gladiatorToSell && (
            <div className="space-y-4">
              <p className="text-roman-marble-300">
                Are you sure you want to sell <span className="text-roman-gold-400 font-roman">{gladiatorToSell.name}</span>?
              </p>
              <p className="text-roman-marble-400 text-sm">
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-between p-3 bg-roman-marble-800 rounded">
                <span className="text-roman-marble-300">Sale Value:</span>
                <span className="font-roman text-xl text-roman-gold-400">
                  {calculateSellValue(gladiatorToSell)}g
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowSellModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="crimson"
                  className="flex-1"
                  onClick={handleConfirmSell}
                >
                  Sell
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Item Inventory Modal */}
        {selectedGladiator && (
          <ItemInventoryModal
            isOpen={showItemModal}
            onClose={() => setShowItemModal(false)}
            gladiator={selectedGladiator}
            onApplyItem={handleApplyItem}
          />
        )}
      </motion.div>
    </MainLayout>
  );
};

// ============ Roster Card ============
interface RosterCardProps {
  gladiator: Gladiator;
  isSelected: boolean;
  onClick: () => void;
}

const RosterCard: React.FC<RosterCardProps> = ({ gladiator, isSelected, onClick }) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  const getStatusBadge = () => {
    if (gladiator.isInjured) {
      const maxDays = Math.max(...gladiator.injuries.map(i => i.daysRemaining));
      return { text: `Injured (${maxDays}d)`, color: 'bg-roman-crimson-600' };
    }
    if (gladiator.isTraining) return { text: 'Training', color: 'bg-roman-bronze-600' };
    if (gladiator.isResting) return { text: 'Resting', color: 'bg-stamina-high' };
    return { text: 'Ready', color: 'bg-health-high' };
  };

  const status = getStatusBadge();
  
  // Get age info
  const ageInfo = gladiator.age ? getAgeCategoryDescription(gladiator.age) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={clsx(
        'p-3 rounded-lg cursor-pointer transition-all bg-roman-marble-800 border',
        isSelected 
          ? 'border-roman-gold-500 shadow-lg shadow-roman-gold-500/20' 
          : 'border-roman-marble-700 hover:border-roman-marble-600'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl w-12 h-12 flex items-center justify-center bg-roman-marble-700 rounded-lg flex-shrink-0">
          {classData.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-roman text-base text-roman-marble-100 truncate">{gladiator.name}</span>
            <span className="text-xs px-1.5 py-0.5 bg-roman-marble-700 rounded text-roman-marble-300 shrink-0">
              L{gladiator.level}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={clsx('text-xs px-1.5 py-0.5 rounded text-white shrink-0', status.color)}>
              {status.text}
            </span>
            <span className="text-xs text-roman-marble-500">
              {classData.name}
            </span>
            {ageInfo && (
              <span className={clsx('text-xs shrink-0', ageInfo.color)} title={ageInfo.description}>
                {gladiator.age}y
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <ProgressBar
                value={gladiator.currentHP}
                max={gladiator.maxHP}
                variant="health"
                size="sm"
              />
            </div>
            <div className="flex-1">
              <ProgressBar
                value={gladiator.currentStamina}
                max={gladiator.maxStamina}
                variant="stamina"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============ Gladiator Header ============
interface GladiatorHeaderProps {
  gladiator: Gladiator;
}

const GladiatorHeader: React.FC<GladiatorHeaderProps> = ({ gladiator }) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];
  const xpForNextLevel = gladiator.level * 100;
  const xpProgress = (gladiator.experience / xpForNextLevel) * 100;
  const moraleDisplay = Math.round((gladiator.morale - 0.1) / 1.4 * 100);
  const ageInfo = gladiator.age ? getAgeCategoryDescription(gladiator.age) : null;

  return (
    <div className="flex items-start gap-4">
      <div className="text-4xl">{classData?.icon || '⚔️'}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-roman text-xl text-roman-marble-100">
            {gladiator.name}
          </h2>
          <span className="px-2 py-0.5 bg-roman-bronze-600 rounded text-sm">
            Lv.{gladiator.level}
          </span>
          <span className="text-sm text-roman-gold-400">
            ⭐ {gladiator.fame}
          </span>
          {ageInfo && (
            <span className={clsx('text-sm px-2 py-0.5 rounded', ageInfo.color, 'bg-roman-marble-800')} title={ageInfo.description}>
              {gladiator.age} years • {ageInfo.label}
            </span>
          )}
        </div>
        <div className="text-sm text-roman-marble-400 mb-2">
          {classData?.name} • {gladiator.origin}
          {gladiator.titles && gladiator.titles.length > 0 && (
            <span className="text-roman-gold-400"> • {gladiator.titles[gladiator.titles.length - 1]}</span>
          )}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-roman-marble-400">Experience</span>
            <span className="text-roman-gold-400">
              {gladiator.experience} / {xpForNextLevel} XP
            </span>
          </div>
          <ProgressBar value={xpProgress} max={100} variant="gold" size="sm" />
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="bg-roman-marble-800 p-1.5 rounded">
            <div className="text-base font-roman text-roman-crimson-400">{gladiator.stats.strength}</div>
            <div className="text-xs text-roman-marble-500">STR</div>
          </div>
          <div className="bg-roman-marble-800 p-1.5 rounded">
            <div className="text-base font-roman text-roman-gold-400">{gladiator.stats.agility}</div>
            <div className="text-xs text-roman-marble-500">AGI</div>
          </div>
          <div className="bg-roman-marble-800 p-1.5 rounded">
            <div className="text-base font-roman text-blue-400">{gladiator.stats.dexterity}</div>
            <div className="text-xs text-roman-marble-500">DEX</div>
          </div>
          <div className="bg-roman-marble-800 p-1.5 rounded">
            <div className="text-base font-roman text-green-400">{gladiator.stats.endurance}</div>
            <div className="text-xs text-roman-marble-500">END</div>
          </div>
          <div className="bg-roman-marble-800 p-1.5 rounded">
            <div className="text-base font-roman text-purple-400">{gladiator.stats.constitution}</div>
            <div className="text-xs text-roman-marble-500">CON</div>
          </div>
        </div>
      </div>
      <div className="text-right w-48 flex-shrink-0">
        <div className="mb-2">
          <div className="text-xs text-roman-marble-500 mb-0.5">Health</div>
          <ProgressBar
            value={gladiator.currentHP}
            max={gladiator.maxHP}
            variant="health"
            size="sm"
            showLabel
          />
        </div>
        <div className="mb-2">
          <div className="text-xs text-roman-marble-500 mb-0.5">Stamina</div>
          <ProgressBar
            value={gladiator.currentStamina}
            max={gladiator.maxStamina}
            variant="stamina"
            size="sm"
            showLabel
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-roman-marble-800 rounded px-2 py-1">
            <div className="text-roman-marble-500">Morale</div>
            <div className={clsx(
              'font-roman',
              moraleDisplay >= 70 ? 'text-health-high' :
              moraleDisplay >= 40 ? 'text-health-medium' : 'text-health-low'
            )}>
              {moraleDisplay}
            </div>
          </div>
          <div className="bg-roman-marble-800 rounded px-2 py-1">
            <div className="text-roman-marble-500">Fatigue</div>
            <div className={clsx(
              'font-roman',
              gladiator.fatigue <= 30 ? 'text-health-high' :
              gladiator.fatigue <= 60 ? 'text-health-medium' : 'text-health-low'
            )}>
              {gladiator.fatigue}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Overview Tab ============
interface OverviewTabProps {
  gladiator: Gladiator;
  onSell: () => void;
  onToggleTraining: () => void;
  onToggleResting: () => void;
  onUseItem: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  gladiator,
  onSell,
  onToggleTraining,
  onToggleResting,
  onUseItem,
}) => {
  return (
    <div className="space-y-4">
      {/* Combat Stats */}
      <div>
        <div className="text-xs text-roman-marble-500 uppercase mb-2">Combat Stats</div>
        <div className="space-y-1.5">
          <StatBar label="Strength" value={gladiator.stats.strength} />
          <StatBar label="Agility" value={gladiator.stats.agility} />
          <StatBar label="Dexterity" value={gladiator.stats.dexterity} />
          <StatBar label="Endurance" value={gladiator.stats.endurance} />
          <StatBar label="Constitution" value={gladiator.stats.constitution} />
        </div>
      </div>

      {/* Injuries */}
      {gladiator.injuries && gladiator.injuries.length > 0 && (
        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Injuries</div>
          <div className="space-y-2">
            {gladiator.injuries.map((injury) => (
              <div
                key={injury.id}
                className="bg-roman-crimson-900/30 border border-roman-crimson-600/50 rounded p-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-roman-marble-200">{injury.type}</span>
                  <span className={clsx(
                    'text-xs px-2 py-0.5 rounded font-roman',
                    injury.severity === 'permanent' ? 'bg-roman-crimson-800 text-roman-crimson-200' :
                    injury.severity === 'major' ? 'bg-roman-crimson-700 text-roman-crimson-100' :
                    'bg-roman-crimson-600 text-white'
                  )}>
                    {injury.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-roman-marble-400">
                    Recovery: {injury.daysRemaining} day{injury.daysRemaining !== 1 ? 's' : ''} remaining
                  </span>
                  {Object.keys(injury.statPenalty).length > 0 && (
                    <span className="text-health-low">
                      {Object.entries(injury.statPenalty).map(([stat, value]) =>
                        `${stat.slice(0, 3).toUpperCase()}: ${value > 0 ? '+' : ''}${value}`
                      ).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      {gladiator.equippedItems && gladiator.equippedItems.length > 0 && (
        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Equipment</div>
          <div className="space-y-2">
            {gladiator.equippedItems.map((itemId) => {
              const item = ALL_MARKET_ITEMS[itemId];
              if (!item) return null;
              return (
                <div
                  key={itemId}
                  className="bg-roman-gold-900/20 border border-roman-gold-600/50 rounded p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-roman-marble-200">{item.name}</div>
                      <div className="text-xs text-roman-marble-400">{item.description}</div>
                    </div>
                    {item.effect.quality && (
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded font-roman uppercase',
                        item.effect.quality === 'legendary' ? 'bg-roman-gold-600 text-white' :
                        item.effect.quality === 'rare' ? 'bg-health-high text-white' :
                        'bg-roman-marble-700 text-roman-marble-200'
                      )}>
                        {item.effect.quality}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Combat Record */}
      <div>
        <div className="text-xs text-roman-marble-500 uppercase mb-2">Combat Record</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-roman-marble-800 rounded p-2">
            <div className="text-lg font-roman text-health-high">{gladiator.wins}</div>
            <div className="text-xs text-roman-marble-500">Wins</div>
          </div>
          <div className="bg-roman-marble-800 rounded p-2">
            <div className="text-lg font-roman text-health-low">{gladiator.losses}</div>
            <div className="text-xs text-roman-marble-500">Losses</div>
          </div>
          <div className="bg-roman-marble-800 rounded p-2">
            <div className="text-lg font-roman text-roman-crimson-400">{gladiator.kills}</div>
            <div className="text-xs text-roman-marble-500">Kills</div>
          </div>
        </div>
      </div>

      {/* Derived Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-roman-marble-500">Morale</span>
          <span className={clsx(
            gladiator.morale >= 1.0 ? 'text-health-high' :
            gladiator.morale >= 0.7 ? 'text-health-medium' :
            'text-health-low'
          )}>{Math.round(gladiator.morale * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-roman-marble-500">Fatigue</span>
          <span className={clsx(
            gladiator.fatigue <= 30 ? 'text-health-high' :
            gladiator.fatigue <= 60 ? 'text-health-medium' :
            'text-health-low'
          )}>{gladiator.fatigue}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-roman-marble-500">Obedience</span>
          <span className="text-roman-marble-200">{gladiator.obedience}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-roman-marble-500">Fame</span>
          <span className="text-roman-gold-400">{gladiator.fame}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="divider-roman" />
      <div className="space-y-2">
        <Button
          variant={gladiator.isTraining ? 'gold' : 'primary'}
          className="w-full"
          onClick={onToggleTraining}
          disabled={gladiator.isInjured}
        >
          {gladiator.isTraining ? '⏹ Stop Training' : '🏋️ Start Training'}
        </Button>
        <Button
          variant={gladiator.isResting ? 'gold' : 'primary'}
          className="w-full"
          onClick={onToggleResting}
        >
          {gladiator.isResting ? '⏹ Stop Resting' : '😴 Rest & Recover'}
        </Button>
        <Button
          variant="primary"
          className="w-full"
          onClick={onUseItem}
        >
          🎒 Use Item
        </Button>
        <Button
          variant="crimson"
          className="w-full"
          onClick={onSell}
        >
          💰 Sell ({calculateSellValue(gladiator)}g)
        </Button>
      </div>
    </div>
  );
};

// ============ Items Tab ============
interface ItemsTabProps {
  gladiator: Gladiator;
  onUseItem: () => void;
}

const ItemsTab: React.FC<ItemsTabProps> = ({ gladiator, onUseItem }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-roman text-lg text-roman-marble-100">
          Equipment & Items
        </h3>
        <Button variant="gold" onClick={onUseItem}>
          🎒 Use Item
        </Button>
      </div>
      <p className="text-sm text-roman-marble-400">
        Use items from your inventory to equip or consume them on this gladiator.
      </p>
      {gladiator.equippedItems && gladiator.equippedItems.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Equipped Items</div>
          {gladiator.equippedItems.map((itemId) => {
            const item = ALL_MARKET_ITEMS[itemId];
            if (!item) return null;
            return (
              <div
                key={itemId}
                className="bg-roman-gold-900/20 border border-roman-gold-600/50 rounded p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-roman text-roman-marble-200">{item.name}</div>
                    <div className="text-sm text-roman-marble-400">{item.description}</div>
                  </div>
                  {item.effect.quality && (
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded font-roman uppercase',
                      item.effect.quality === 'legendary' ? 'bg-roman-gold-600 text-white' :
                      item.effect.quality === 'rare' ? 'bg-health-high text-white' :
                      'bg-roman-marble-700 text-roman-marble-200'
                    )}>
                      {item.effect.quality}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-roman-marble-800/50 rounded-lg">
          <p className="text-roman-marble-500">No items equipped</p>
          <p className="text-sm text-roman-marble-600 mt-1">Use the button above to equip items from your inventory</p>
        </div>
      )}
    </div>
  );
};

// ============ Stat Bar ============
const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <div className="w-20 text-xs text-roman-marble-400">{label}</div>
    <div className="flex-1 h-2 bg-roman-marble-700 rounded-full overflow-hidden">
      <div
        className={clsx(
          'h-full rounded-full',
          value >= 70 ? 'bg-health-high' :
          value >= 50 ? 'bg-health-medium' :
          'bg-health-low'
        )}
        style={{ width: `${value}%` }}
      />
    </div>
    <div className="w-8 text-xs text-roman-marble-300 text-right">{value}</div>
  </div>
);

// ============ Training Tab ============
interface TrainingTabProps {
  gladiator: Gladiator;
  availableTraining: TrainingType[];
  buildings: any[];
  onSetTraining: (gladiatorId: string, trainingType: TrainingType | null) => void;
}

const TrainingTab: React.FC<TrainingTabProps> = ({
  gladiator,
  availableTraining,
  buildings,
  onSetTraining,
}) => {
  const getBuildingBonus = (requiredBuilding?: string) => {
    if (!requiredBuilding) return 0;
    const building = buildings.find(b => b.type === requiredBuilding);
    if (!building) return 0;
    return building.level * 10;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-roman text-lg text-roman-marble-100">
          Select Training Regimen
        </h3>
        {gladiator.trainingRegimen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetTraining(gladiator.id, null)}
          >
            Stop Training
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.values(TRAINING_REGIMENS).map(regimen => {
          const isAvailable = availableTraining.includes(regimen.id);
          const isSelected = gladiator.trainingRegimen === regimen.id;
          const buildingBonus = getBuildingBonus(regimen.requiredBuilding);
          const moraleForCalc = Math.round((gladiator.morale - 0.1) / 1.4 * 100);
          const estimatedXP = calculateXPGain(
            regimen.id,
            gladiator.level,
            (gladiator.nutrition || 'standard') as NutritionQuality,
            moraleForCalc,
            gladiator.fatigue,
            buildingBonus
          );

          return (
            <div
              key={regimen.id}
              onClick={() => isAvailable && onSetTraining(gladiator.id, regimen.id)}
              className={clsx(
                'p-4 rounded-lg border transition-all',
                !isAvailable && 'opacity-50 cursor-not-allowed',
                isSelected
                  ? 'border-roman-gold-500 bg-roman-gold-500/10'
                  : isAvailable
                    ? 'border-roman-marble-600 bg-roman-marble-800 cursor-pointer hover:border-roman-marble-500'
                    : 'border-roman-marble-700 bg-roman-marble-900'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{regimen.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-roman text-roman-marble-100">{regimen.name}</span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-roman-gold-600 text-roman-marble-900 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-roman-marble-400 mt-1">{regimen.description}</p>
                  {!isAvailable && regimen.requiredBuilding && (
                    <p className="text-xs text-roman-crimson-400 mt-2">
                      ⚠️ Requires: {regimen.requiredBuilding}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <span className="text-roman-gold-400">+{estimatedXP} XP/day</span>
                    <span className="text-roman-crimson-400">-{regimen.staminaCost} Stamina</span>
                    <span className="text-roman-marble-500">+{regimen.fatigueGain} Fatigue</span>
                    {regimen.injuryRisk > 0 && (
                      <span className="text-orange-400">{regimen.injuryRisk}% Injury Risk</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-roman-marble-500">
                    Trains: {regimen.statGains.map(g => g.stat).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ Nutrition Tab ============
interface NutritionTabProps {
  gladiator: Gladiator;
  resources: any;
  onSetNutrition: (gladiatorId: string, nutrition: NutritionQuality) => void;
}

const NutritionTab: React.FC<NutritionTabProps> = ({
  gladiator,
  resources,
  onSetNutrition,
}) => {
  const currentNutrition = gladiator.nutrition || 'standard';

  const canAfford = (nutrition: NutritionQuality) => {
    const option = NUTRITION_OPTIONS[nutrition];
    if (resources.grain < option.dailyCost.grain) return false;
    if (resources.water < option.dailyCost.water) return false;
    if (option.dailyCost.wine && resources.wine < option.dailyCost.wine) return false;
    return true;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-roman text-lg text-roman-marble-100">
        Nutrition Plan
      </h3>
      <p className="text-sm text-roman-marble-400">
        Better nutrition improves training effectiveness, healing, and morale.
        Costs are per day per gladiator.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {Object.values(NUTRITION_OPTIONS).map(option => {
          const isSelected = currentNutrition === option.id;
          const affordable = canAfford(option.id);

          return (
            <div
              key={option.id}
              onClick={() => affordable && onSetNutrition(gladiator.id, option.id)}
              className={clsx(
                'p-4 rounded-lg border transition-all',
                !affordable && 'opacity-50 cursor-not-allowed',
                isSelected
                  ? 'border-roman-gold-500 bg-roman-gold-500/10'
                  : affordable
                    ? 'border-roman-marble-600 bg-roman-marble-800 cursor-pointer hover:border-roman-marble-500'
                    : 'border-roman-marble-700 bg-roman-marble-900'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-roman text-roman-marble-100">{option.name}</span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-roman-gold-600 text-roman-marble-900 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-roman-marble-400 mt-1">{option.description}</p>
                  <div className="flex gap-3 mt-3 text-xs">
                    <span className="text-roman-marble-300">🌾 {option.dailyCost.grain}</span>
                    <span className="text-roman-marble-300">💧 {option.dailyCost.water}</span>
                    {option.dailyCost.wine && (
                      <span className="text-roman-marble-300">🍷 {option.dailyCost.wine}</span>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className={clsx(
                      option.effects.trainingModifier >= 0 ? 'text-health-high' : 'text-health-low'
                    )}>
                      Training: {option.effects.trainingModifier >= 0 ? '+' : ''}{option.effects.trainingModifier}%
                    </div>
                    <div className={clsx(
                      option.effects.healingModifier >= 0 ? 'text-health-high' : 'text-health-low'
                    )}>
                      Healing: {option.effects.healingModifier >= 0 ? '+' : ''}{option.effects.healingModifier}%
                    </div>
                    <div className={clsx(
                      option.effects.moraleModifier >= 0 ? 'text-health-high' : 'text-health-low'
                    )}>
                      Morale: {option.effects.moraleModifier >= 0 ? '+' : ''}{option.effects.moraleModifier}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ Skills Tab ============
interface SkillsTabProps {
  gladiator: Gladiator;
  onLearnSkill: (gladiatorId: string, skillId: string) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ gladiator, onLearnSkill }) => {
  const [selectedBranch, setSelectedBranch] = useState<'offense' | 'defense' | 'utility'>('offense');

  const classTree = CLASS_SKILL_TREES[gladiator.class];
  const learnedSkillIds = Array.isArray(gladiator.skills)
    ? gladiator.skills.map(s => typeof s === 'string' ? s : s.id)
    : [];
  const availablePoints = gladiator.skillPoints || 0;

  const branches: { id: 'offense' | 'defense' | 'utility'; label: string; icon: string }[] = [
    { id: 'offense', label: 'Offense', icon: '⚔️' },
    { id: 'defense', label: 'Defense', icon: '🛡️' },
    { id: 'utility', label: 'Utility', icon: '⚡' },
  ];

  const branchSkills = [
    ...UNIVERSAL_SKILLS.filter(s => s.branch === selectedBranch),
    ...classTree.branches[selectedBranch],
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-roman text-lg text-roman-marble-100">
          Skill Trees
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-roman-marble-400">Available Points:</span>
          <span className="text-xl font-roman text-roman-gold-400">
            {availablePoints}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {branches.map(branch => (
          <button
            key={branch.id}
            onClick={() => setSelectedBranch(branch.id)}
            className={clsx(
              'px-4 py-2 rounded-lg transition-all',
              selectedBranch === branch.id
                ? 'bg-roman-gold-600 text-roman-marble-900'
                : 'bg-roman-marble-700 text-roman-marble-300 hover:bg-roman-marble-600'
            )}
          >
            {branch.icon} {branch.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(tier => {
          const tierSkills = branchSkills.filter(s => s.tier === tier);
          if (tierSkills.length === 0) return null;

          return (
            <div key={tier} className="flex gap-3">
              <div className="w-16 text-roman-marble-500 text-sm pt-3">
                Tier {tier}
              </div>
              <div className="flex-1 flex gap-3">
                {tierSkills.map(skill => {
                  const isLearned = learnedSkillIds.includes(skill.id);
                  const canLearn = canLearnSkill(skill.id, learnedSkillIds, availablePoints);

                  return (
                    <div
                      key={skill.id}
                      onClick={() => canLearn.canLearn && onLearnSkill(gladiator.id, skill.id)}
                      className={clsx(
                        'flex-1 p-3 rounded-lg border transition-all',
                        isLearned
                          ? 'border-roman-gold-500 bg-roman-gold-500/20'
                          : canLearn.canLearn
                            ? 'border-roman-marble-600 bg-roman-marble-800 cursor-pointer hover:border-roman-gold-600'
                            : 'border-roman-marble-700 bg-roman-marble-900 opacity-50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{skill.icon}</span>
                        <span className={clsx(
                          'font-roman text-sm',
                          isLearned ? 'text-roman-gold-400' : 'text-roman-marble-200'
                        )}>
                          {skill.name}
                        </span>
                        {isLearned && (
                          <span className="text-xs text-roman-gold-500">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-roman-marble-400 mb-2">
                        {skill.description}
                      </p>
                      <div className="text-xs space-y-1">
                        {skill.effects.map((effect, i) => (
                          <div key={i} className="text-health-high">
                            {effect.value > 0 ? '+' : ''}{effect.value}{effect.isPercentage ? '%' : ''} {effect.stat}
                            {effect.condition && (
                              <span className="text-roman-marble-500"> ({effect.condition})</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {!isLearned && !canLearn.canLearn && canLearn.reason && (
                        <div className="text-xs text-roman-crimson-400 mt-2">
                          {canLearn.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ Fallen Card ============
interface FallenCardProps {
  gladiator: DeadGladiator;
  isSelected: boolean;
  onClick: () => void;
}

const FallenCard: React.FC<FallenCardProps> = ({ gladiator, isSelected, onClick }) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={clsx(
        'card-roman cursor-pointer transition-all opacity-80',
        isSelected && 'ring-2 ring-roman-crimson-500'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative text-4xl w-16 h-16 flex items-center justify-center bg-roman-marble-800 rounded-lg">
          {classData.icon}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <span className="text-2xl">💀</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-roman text-lg text-roman-marble-300 line-through">{gladiator.name}</span>
            <span className="text-xs px-2 py-0.5 bg-roman-crimson-900 rounded text-roman-crimson-300">
              Fallen
            </span>
          </div>
          <div className="text-sm text-roman-marble-500 mb-1">
            {classData.name} • Level {gladiator.level}
          </div>
          <div className="text-xs text-roman-marble-600">
            Died on Day {gladiator.deathDay} • {gladiator.causeOfDeath}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-roman-marble-400">
            {gladiator.wins}W / {gladiator.losses}L
          </div>
          <div className="text-xs text-roman-crimson-400">
            {gladiator.kills} kills
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============ Fallen Detail Panel ============
interface FallenDetailPanelProps {
  gladiator: DeadGladiator;
}

const FallenDetailPanel: React.FC<FallenDetailPanelProps> = ({ gladiator }) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  return (
    <Card variant="default" className="sticky top-4 border-roman-crimson-800">
      <CardHeader className="bg-roman-crimson-900/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-4xl">{classData.icon}</span>
            <span className="absolute -bottom-1 -right-1 text-xl">💀</span>
          </div>
          <div>
            <CardTitle className="text-roman-marble-300">{gladiator.name}</CardTitle>
            <div className="text-sm text-roman-marble-500">
              Level {gladiator.level} {classData.name}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-roman-crimson-900/20 border border-roman-crimson-800 rounded-lg p-3">
          <div className="text-roman-crimson-400 text-sm font-roman mb-2">⚰️ Memorial</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-roman-marble-500">Died</span>
              <span className="text-roman-marble-300">Day {gladiator.deathDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-roman-marble-500">Cause</span>
              <span className="text-roman-marble-300">{gladiator.causeOfDeath}</span>
            </div>
            {gladiator.killedBy && (
              <div className="flex justify-between">
                <span className="text-roman-marble-500">Killed by</span>
                <span className="text-roman-crimson-400">{gladiator.killedBy}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Combat Record</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-roman-marble-800 rounded p-2">
              <div className="text-lg font-roman text-health-high">{gladiator.wins}</div>
              <div className="text-xs text-roman-marble-500">Wins</div>
            </div>
            <div className="bg-roman-marble-800 rounded p-2">
              <div className="text-lg font-roman text-health-low">{gladiator.losses}</div>
              <div className="text-xs text-roman-marble-500">Losses</div>
            </div>
            <div className="bg-roman-marble-800 rounded p-2">
              <div className="text-lg font-roman text-roman-crimson-400">{gladiator.kills}</div>
              <div className="text-xs text-roman-marble-500">Kills</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Final Stats</div>
          <div className="space-y-1.5">
            <StatBar label="Strength" value={gladiator.stats.strength} />
            <StatBar label="Agility" value={gladiator.stats.agility} />
            <StatBar label="Dexterity" value={gladiator.stats.dexterity} />
            <StatBar label="Endurance" value={gladiator.stats.endurance} />
            <StatBar label="Constitution" value={gladiator.stats.constitution} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-roman-marble-500">Peak Fame</span>
            <span className="text-roman-gold-400">{gladiator.fame}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-roman-marble-500">Origin</span>
            <span className="text-roman-marble-300 capitalize">{gladiator.origin}</span>
          </div>
        </div>

        <div className="divider-roman" />
        <div className="text-center italic text-roman-marble-500 text-sm">
          "May the gods grant you peace in the afterlife, brave warrior."
        </div>
      </CardContent>
    </Card>
  );
};
