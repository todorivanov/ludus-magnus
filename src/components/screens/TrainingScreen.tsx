import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { 
  setTrainingRegimen, 
  setNutrition,
  learnSkill,
} from '@features/gladiators/gladiatorsSlice';
import { incrementObjective } from '@features/quests/questsSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar } from '@components/ui';
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
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { getQuestById } from '@data/quests';
import type { Gladiator } from '@/types';
import { clsx } from 'clsx';

type TabType = 'training' | 'nutrition' | 'skills';

export const TrainingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roster } = useAppSelector(state => state.gladiators);
  const { buildings } = useAppSelector(state => state.ludus);
  const { resources } = useAppSelector(state => state.player);
  const questsState = useAppSelector(state => state.quests);
  const activeQuests = questsState?.activeQuests || [];

  const [selectedGladiatorId, setSelectedGladiatorId] = useState<string | null>(
    roster.length > 0 ? roster[0].id : null
  );
  const [activeTab, setActiveTab] = useState<TabType>('training');

  const selectedGladiator = roster.find(g => g.id === selectedGladiatorId);
  const availableTraining = getAvailableTraining(buildings.map(b => ({ type: b.type, level: b.level })));

  // Handle training selection
  const handleSetTraining = (gladiatorId: string, trainingType: TrainingType | null) => {
    dispatch(setTrainingRegimen({ gladiatorId, trainingType }));
    
    // Update quest objectives for training if a training type is selected (not null/stopping)
    if (trainingType) {
      activeQuests.forEach(activeQuest => {
        const questDef = getQuestById(activeQuest.questId);
        if (!questDef) return;
        
        questDef.objectives.forEach(objective => {
          if (objective.type === 'train') {
            // For 'train' objectives, increment by 1 when assigning training
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

  // Handle nutrition selection
  const handleSetNutrition = (gladiatorId: string, nutrition: NutritionQuality) => {
    dispatch(setNutrition({ gladiatorId, nutrition }));
  };

  // Learn a skill
  const handleLearnSkill = (gladiatorId: string, skillId: string) => {
    dispatch(learnSkill({ gladiatorId, skillId }));
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'training', label: 'Training', icon: '⚔️' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍖' },
    { id: 'skills', label: 'Skills', icon: '📚' },
  ];

  if (roster.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardContent className="text-center py-8">
              <div className="text-5xl mb-4">🏋️</div>
              <h2 className="font-roman text-xl text-roman-marble-100 mb-2">
                No Gladiators to Train
              </h2>
              <p className="text-roman-marble-400">
                Visit the marketplace to recruit gladiators for your ludus.
              </p>
            </CardContent>
          </Card>
        </div>
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
            Training Grounds
          </h1>
          <p className="text-roman-marble-400">
            Manage training regimens, nutrition, and skill development
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Gladiator List */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Gladiators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {roster.map(gladiator => (
                  <GladiatorListItem
                    key={gladiator.id}
                    gladiator={gladiator}
                    isSelected={gladiator.id === selectedGladiatorId}
                    onClick={() => setSelectedGladiatorId(gladiator.id)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            {selectedGladiator ? (
              <>
                {/* Gladiator Header */}
                <Card className="mb-4">
                  <CardContent>
                    <GladiatorHeader gladiator={selectedGladiator} />
                  </CardContent>
                </Card>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'px-4 py-2 rounded-t-lg font-roman transition-all',
                        activeTab === tab.id
                          ? 'bg-roman-marble-800 text-roman-gold-400 border-t border-x border-roman-bronze-600'
                          : 'bg-roman-marble-900 text-roman-marble-400 hover:text-roman-marble-200'
                      )}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <Card>
                  <CardContent>
                    {activeTab === 'training' && (
                      <TrainingTab
                        gladiator={selectedGladiator}
                        availableTraining={availableTraining}
                        buildings={buildings}
                        onSetTraining={handleSetTraining}
                      />
                    )}
                    {activeTab === 'nutrition' && (
                      <NutritionTab
                        gladiator={selectedGladiator}
                        resources={resources}
                        onSetNutrition={handleSetNutrition}
                      />
                    )}
                    {activeTab === 'skills' && (
                      <SkillsTab
                        gladiator={selectedGladiator}
                        onLearnSkill={handleLearnSkill}
                      />
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-roman-marble-400">
                    Select a gladiator to manage their training
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

// Gladiator List Item
interface GladiatorListItemProps {
  gladiator: Gladiator;
  isSelected: boolean;
  onClick: () => void;
}

const GladiatorListItem: React.FC<GladiatorListItemProps> = ({
  gladiator,
  isSelected,
  onClick,
}) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-3 rounded-lg cursor-pointer transition-all',
        isSelected
          ? 'bg-roman-gold-500/20 border border-roman-gold-500'
          : 'bg-roman-marble-800 border border-transparent hover:border-roman-marble-600'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{classData?.icon || '⚔️'}</span>
        <div className="flex-1 min-w-0">
          <div className="font-roman text-roman-marble-100 truncate">
            {gladiator.name}
          </div>
          <div className="text-xs text-roman-marble-500">
            Lv.{gladiator.level} {classData?.name}
          </div>
        </div>
        {gladiator.isTraining && (
          <span className="text-xs px-2 py-0.5 bg-roman-bronze-600 rounded">🏋️</span>
        )}
        {gladiator.isInjured && (
          <span className="text-xs px-2 py-0.5 bg-roman-crimson-600 rounded">🩹</span>
        )}
      </div>
    </div>
  );
};

// Gladiator Header
interface GladiatorHeaderProps {
  gladiator: Gladiator;
}

const GladiatorHeader: React.FC<GladiatorHeaderProps> = ({ gladiator }) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];
  const xpForNextLevel = gladiator.level * 100;
  const xpProgress = (gladiator.experience / xpForNextLevel) * 100;
  
  // Convert morale from 0.1-1.5 multiplier to 0-100 display
  const moraleDisplay = Math.round((gladiator.morale - 0.1) / 1.4 * 100);

  return (
    <div className="flex items-start gap-6">
      <div className="text-5xl">{classData?.icon || '⚔️'}</div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="font-roman text-2xl text-roman-marble-100">
            {gladiator.name}
          </h2>
          <span className="px-2 py-1 bg-roman-bronze-600 rounded text-sm">
            Level {gladiator.level}
          </span>
          <span className="text-roman-gold-400">
            ⭐ {gladiator.fame} Fame
          </span>
        </div>
        <div className="text-sm text-roman-marble-400 mb-3">
          {classData?.name} • {gladiator.origin}
        </div>
        
        {/* XP Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-roman-marble-400">Experience</span>
            <span className="text-roman-gold-400">
              {gladiator.experience} / {xpForNextLevel} XP
            </span>
          </div>
          <ProgressBar value={xpProgress} max={100} variant="gold" size="sm" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4 text-center">
          <div className="bg-roman-marble-800 p-2 rounded">
            <div className="text-lg font-roman text-roman-crimson-400">
              {gladiator.stats.strength}
            </div>
            <div className="text-xs text-roman-marble-500">STR</div>
          </div>
          <div className="bg-roman-marble-800 p-2 rounded">
            <div className="text-lg font-roman text-roman-gold-400">
              {gladiator.stats.agility}
            </div>
            <div className="text-xs text-roman-marble-500">AGI</div>
          </div>
          <div className="bg-roman-marble-800 p-2 rounded">
            <div className="text-lg font-roman text-blue-400">
              {gladiator.stats.dexterity}
            </div>
            <div className="text-xs text-roman-marble-500">DEX</div>
          </div>
          <div className="bg-roman-marble-800 p-2 rounded">
            <div className="text-lg font-roman text-green-400">
              {gladiator.stats.endurance}
            </div>
            <div className="text-xs text-roman-marble-500">END</div>
          </div>
          <div className="bg-roman-marble-800 p-2 rounded">
            <div className="text-lg font-roman text-purple-400">
              {gladiator.stats.constitution}
            </div>
            <div className="text-xs text-roman-marble-500">CON</div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-right">
        <div className="mb-2">
          <div className="text-xs text-roman-marble-500 mb-1">Health</div>
          <ProgressBar 
            value={gladiator.currentHP} 
            max={gladiator.maxHP}
            variant="health"
            size="sm"
            showLabel
          />
        </div>
        <div className="mb-2">
          <div className="text-xs text-roman-marble-500 mb-1">Stamina</div>
          <ProgressBar 
            value={gladiator.currentStamina} 
            max={gladiator.maxStamina}
            variant="stamina"
            size="sm"
            showLabel
          />
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-roman-marble-500">Morale: </span>
            <span className={clsx(
              moraleDisplay >= 70 ? 'text-health-high' :
              moraleDisplay >= 40 ? 'text-health-medium' : 'text-health-low'
            )}>
              {moraleDisplay}
            </span>
          </div>
          <div>
            <span className="text-roman-marble-500">Fatigue: </span>
            <span className={clsx(
              gladiator.fatigue <= 30 ? 'text-health-high' :
              gladiator.fatigue <= 60 ? 'text-health-medium' : 'text-health-low'
            )}>
              {gladiator.fatigue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Training Tab
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
  // Get building bonus for training
  const getBuildingBonus = (requiredBuilding?: string) => {
    if (!requiredBuilding) return 0;
    const building = buildings.find(b => b.type === requiredBuilding);
    if (!building) return 0;
    return building.level * 10; // 10/20/30% bonus per level
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
          
          // Convert morale from 0.1-1.5 to 0-100 for calculation
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
                    <span className="font-roman text-roman-marble-100">
                      {regimen.name}
                    </span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-roman-gold-600 text-roman-marble-900 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-roman-marble-400 mt-1">
                    {regimen.description}
                  </p>
                  
                  {!isAvailable && regimen.requiredBuilding && (
                    <p className="text-xs text-roman-crimson-400 mt-2">
                      ⚠️ Requires: {regimen.requiredBuilding}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <span className="text-roman-gold-400">
                      +{estimatedXP} XP/day
                    </span>
                    <span className="text-roman-crimson-400">
                      -{regimen.staminaCost} Stamina
                    </span>
                    <span className="text-roman-marble-500">
                      +{regimen.fatigueGain} Fatigue
                    </span>
                    {regimen.injuryRisk > 0 && (
                      <span className="text-orange-400">
                        {regimen.injuryRisk}% Injury Risk
                      </span>
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

// Nutrition Tab
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

  // Check if player can afford nutrition
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
                    <span className="font-roman text-roman-marble-100">
                      {option.name}
                    </span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-roman-gold-600 text-roman-marble-900 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-roman-marble-400 mt-1">
                    {option.description}
                  </p>

                  {/* Daily Cost */}
                  <div className="flex gap-3 mt-3 text-xs">
                    <span className="text-roman-marble-300">
                      🌾 {option.dailyCost.grain}
                    </span>
                    <span className="text-roman-marble-300">
                      💧 {option.dailyCost.water}
                    </span>
                    {option.dailyCost.wine && (
                      <span className="text-roman-marble-300">
                        🍷 {option.dailyCost.wine}
                      </span>
                    )}
                  </div>

                  {/* Effects */}
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

// Skills Tab
interface SkillsTabProps {
  gladiator: Gladiator;
  onLearnSkill: (gladiatorId: string, skillId: string) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ gladiator, onLearnSkill }) => {
  const [selectedBranch, setSelectedBranch] = useState<'offense' | 'defense' | 'utility'>('offense');
  
  const classTree = CLASS_SKILL_TREES[gladiator.class];
  // Skills can be array of objects or strings depending on implementation
  const learnedSkillIds = Array.isArray(gladiator.skills) 
    ? gladiator.skills.map(s => typeof s === 'string' ? s : s.id)
    : [];
  const availablePoints = gladiator.skillPoints || 0;

  const branches: { id: 'offense' | 'defense' | 'utility'; label: string; icon: string }[] = [
    { id: 'offense', label: 'Offense', icon: '⚔️' },
    { id: 'defense', label: 'Defense', icon: '🛡️' },
    { id: 'utility', label: 'Utility', icon: '⚡' },
  ];

  // Get skills for selected branch (universal + class-specific)
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

      {/* Branch Tabs */}
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

      {/* Skills Grid */}
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
