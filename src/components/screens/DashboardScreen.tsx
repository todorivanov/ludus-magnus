import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { 
  advanceDay, 
  setScreen,
  setDayReport,
  hideDayReport,
  setUnrestLevel,
} from '@features/game/gameSlice';
import { addGold, spendGold, consumeResource } from '@features/player/playerSlice';
import { NUTRITION_OPTIONS, type NutritionQuality } from '@data/training';
import { tickCooldowns as tickQuestCooldowns, incrementObjective } from '@features/quests/questsSlice';
import { tickCooldowns as tickFactionCooldowns } from '@features/factions/factionsSlice';
import { updateSponsorships } from '@features/fame/fameSlice';
import { getQuestById } from '@data/quests';
import { calculateMerchandiseIncome, MERCHANDISE_ITEMS } from '@data/fame';
import { 
  updateConstructionProgress, 
  completeConstruction,
  updateUpgradeProgress,
  completeUpgrade,
  calculateSecurityRating,
} from '@features/ludus/ludusSlice';
import { updateGladiator } from '@features/gladiators/gladiatorsSlice';
import { addExperience as addStaffExperience } from '@features/staff/staffSlice';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar, Modal } from '@components/ui';
import { MainLayout } from '@components/layout';
import { processGladiatorDay, calculateUnrest, rollRandomEvent, type RandomEvent } from '../../game/GameLoop';
import { clsx } from 'clsx';

const TIME_PHASES = ['dawn', 'morning', 'afternoon', 'evening', 'night'] as const;

export const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  const currentDay = gameState?.currentDay || 1;
  const currentPhase = gameState?.currentPhase || 'morning';
  const showDayReport = gameState?.showDayReport || false;
  const lastDayReport = gameState?.lastDayReport || null;
  const unrestLevel = gameState?.unrestLevel || 0;
  const rebellionWarning = gameState?.rebellionWarning || false;
  
  const playerState = useAppSelector(state => state.player);
  const gold = playerState?.gold || 0;
  const resources = playerState?.resources || { grain: 0, water: 0, wine: 0 };
  const ludusName = playerState?.ludusName || 'Ludus';
  const name = playerState?.name || 'Lanista';
  
  const fameState = useAppSelector(state => state.fame);
  const ludusFame = fameState?.ludusFame || 0;
  const ownedMerchandise = fameState?.ownedMerchandise || [];
  const activeSponsorships = fameState?.activeSponsorships || [];
  
  const gladiatorsState = useAppSelector(state => state.gladiators);
  const roster = gladiatorsState?.roster || [];
  
  const ludusState = useAppSelector(state => state.ludus);
  const buildings = ludusState?.buildings || [];
  
  const staffState = useAppSelector(state => state.staff);
  const employees = staffState?.employees || [];
  const totalDailyWages = staffState?.totalDailyWages || 0;
  
  const questsState = useAppSelector(state => state.quests);
  const activeQuests = questsState?.activeQuests || [];

  const [processingDay, setProcessingDay] = useState(false);

  // Calculate daily expenses
  const foodCosts = roster.length * 2;

  // Process end of day
  const handleEndDay = useCallback(() => {
    setProcessingDay(true);
    
    const income: { source: string; amount: number }[] = [];
    const expenses: { source: string; amount: number }[] = [];
    const events: string[] = [];
    const alerts: { severity: 'info' | 'warning' | 'danger'; message: string }[] = [];

    // Process expenses
    if (totalDailyWages > 0) {
      expenses.push({ source: 'Staff Wages', amount: totalDailyWages });
    }
    if (foodCosts > 0) {
      expenses.push({ source: 'Food & Supplies', amount: foodCosts });
    }

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Fame-based income (tier bonus)
    const fameIncome = Math.floor(ludusFame / 100) * 10;
    if (fameIncome > 0) {
      income.push({ source: 'Fame Income', amount: fameIncome });
    }

    // Merchandise income
    const totalGladiatorFame = roster.reduce((sum, g) => sum + (g.fame || 0), 0);
    const merchIncome = ownedMerchandise
      .filter(m => m.isActive)
      .reduce((sum, m) => {
        const item = MERCHANDISE_ITEMS.find(i => i.id === m.itemId);
        return sum + (item ? calculateMerchandiseIncome(item, ludusFame, totalGladiatorFame) : 0);
      }, 0);
    if (merchIncome > 0) {
      income.push({ source: 'Merchandise Sales', amount: merchIncome });
    }

    // Sponsorship income
    const sponsorIncome = activeSponsorships.reduce((sum, s) => sum + s.dailyPayment, 0);
    if (sponsorIncome > 0) {
      income.push({ source: 'Sponsorships', amount: sponsorIncome });
    }

    // Calculate total income
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

    // Calculate net gold change and check if we can afford expenses
    // We need to consider: currentGold + income - expenses >= 0
    const goldAfterIncome = gold + totalIncome;
    const canAffordExpenses = goldAfterIncome >= totalExpenses;

    // Apply gold changes
    if (totalIncome > 0) {
      dispatch(addGold({
        amount: totalIncome,
        description: 'Daily Income',
        category: 'daily',
        day: currentDay,
      }));
    }
    if (totalExpenses > 0 && canAffordExpenses) {
      dispatch(spendGold({
        amount: totalExpenses,
        description: 'Daily Expenses',
        category: 'daily',
        day: currentDay,
      }));
    } else if (!canAffordExpenses) {
      // Still spend what we can (income + current gold)
      const canSpend = Math.min(totalExpenses, goldAfterIncome);
      if (canSpend > 0) {
        dispatch(spendGold({
          amount: canSpend,
          description: 'Daily Expenses (Partial)',
          category: 'daily',
          day: currentDay,
        }));
      }
      alerts.push({
        severity: 'danger',
        message: `Insufficient gold for daily expenses! Short ${totalExpenses - goldAfterIncome}g. Staff morale may suffer.`,
      });
    }

    // Calculate and consume resources for gladiators based on nutrition
    let totalGrainConsumed = 0;
    let totalWaterConsumed = 0;
    let totalWineConsumed = 0;
    
    roster.forEach(gladiator => {
      const nutritionLevel = (gladiator.nutrition || 'standard') as NutritionQuality;
      const nutrition = NUTRITION_OPTIONS[nutritionLevel];
      
      totalGrainConsumed += nutrition.dailyCost.grain;
      totalWaterConsumed += nutrition.dailyCost.water;
      totalWineConsumed += nutrition.dailyCost.wine || 0;
    });
    
    // Check if we have enough resources
    if (resources.grain < totalGrainConsumed) {
      alerts.push({
        severity: 'warning',
        message: `Not enough grain! Need ${totalGrainConsumed}, have ${resources.grain}. Gladiators will suffer.`,
      });
    }
    if (resources.water < totalWaterConsumed) {
      alerts.push({
        severity: 'warning',
        message: `Not enough water! Need ${totalWaterConsumed}, have ${resources.water}. Gladiators will suffer.`,
      });
    }
    
    // Consume resources
    if (totalGrainConsumed > 0) {
      dispatch(consumeResource({ resource: 'grain', amount: totalGrainConsumed }));
      events.push(`Consumed ${totalGrainConsumed} grain`);
    }
    if (totalWaterConsumed > 0) {
      dispatch(consumeResource({ resource: 'water', amount: totalWaterConsumed }));
      events.push(`Consumed ${totalWaterConsumed} water`);
    }
    if (totalWineConsumed > 0) {
      dispatch(consumeResource({ resource: 'wine', amount: totalWineConsumed }));
      events.push(`Consumed ${totalWineConsumed} wine`);
    }

    // Process gladiator recovery
    roster.forEach(gladiator => {
      const { updates, events: gladEvents } = processGladiatorDay(
        gladiator,
        gladiator.isTraining || false,
        gladiator.isResting || false
      );
      
      // Check for any pending level-ups (for existing saves with excess XP)
      let currentXP = updates.experience !== undefined ? updates.experience : gladiator.experience;
      let currentLevel = updates.level !== undefined ? updates.level : gladiator.level;
      let currentSkillPoints = updates.skillPoints !== undefined ? updates.skillPoints : (gladiator.skillPoints || 0);
      let xpToLevel = currentLevel * 100;
      
      while (currentXP >= xpToLevel && currentLevel < 20) {
        currentXP -= xpToLevel;
        currentLevel += 1;
        currentSkillPoints += 5;
        gladEvents.push(`🎉 LEVEL UP! Now level ${currentLevel}! +5 skill points`);
        xpToLevel = currentLevel * 100; // Update for next iteration
      }
      
      // If leveling occurred, update the updates object
      if (currentLevel > gladiator.level) {
        updates.level = currentLevel;
        updates.skillPoints = currentSkillPoints;
        updates.experience = currentXP;
        // Update derived stats on level up
        updates.maxHP = 50 + currentLevel * 10 + Math.round(gladiator.stats.constitution * 2);
        updates.maxStamina = 50 + currentLevel * 5 + Math.round(gladiator.stats.endurance * 1.5);
      }
      
      // Apply the updates to the gladiator
      if (Object.keys(updates).length > 0) {
        dispatch(updateGladiator({ id: gladiator.id, updates }));
      }
      
      if (gladEvents.length > 0) {
        events.push(`${gladiator.name}: ${gladEvents.join(', ')}`);
      }
    });

    // Calculate unrest
    const averageMorale = roster.length > 0 
      ? roster.reduce((sum, g) => sum + (g.morale || 1), 0) / roster.length 
      : 1;
    const hasGuards = employees.some(e => e.role === 'guard');
    const unrest = calculateUnrest(roster, {
      averageMorale,
      daysUnpaidWages: gold < totalExpenses ? 1 : 0,
      recentDeaths: 0,
      hasGuards,
      ludusLevel: buildings.length,
    });
    dispatch(setUnrestLevel(unrest.level));

    if (unrest.riskOfRebellion) {
      alerts.push({
        severity: 'danger',
        message: 'Gladiator unrest is dangerously high! Risk of rebellion!',
      });
    } else if (unrest.level > 50) {
      alerts.push({
        severity: 'warning',
        message: 'Gladiators are becoming restless. Consider improving conditions.',
      });
    }

    // Random event
    const randomEvent: RandomEvent | null = rollRandomEvent(currentDay, ludusFame);
    if (randomEvent) {
      events.push(`Event: ${randomEvent.title}`);
      randomEvent.effects.forEach((effect: RandomEvent['effects'][0]) => {
        if (effect.type === 'gold') {
          if (effect.value > 0) {
            income.push({ source: randomEvent.title, amount: effect.value });
          } else {
            expenses.push({ source: randomEvent.title, amount: -effect.value });
          }
        }
        if (effect.type === 'fame') {
          events.push(`+${effect.value} Fame from ${randomEvent.title}`);
        }
      });
    }

    // Process building construction and upgrades
    buildings.forEach(building => {
      // Handle construction
      if (building.isUnderConstruction && building.constructionDaysRemaining !== undefined) {
        const newDays = building.constructionDaysRemaining - 1;
        if (newDays <= 0) {
          dispatch(completeConstruction(building.id));
          events.push(`Construction complete: ${building.type}`);
          
          // Update quest objectives for building completion
          activeQuests.forEach(activeQuest => {
            const questDef = getQuestById(activeQuest.questId);
            if (!questDef) return;
            
            questDef.objectives.forEach(objective => {
              // Check if this objective is for building this specific type
              if (objective.type === 'build' && objective.target === building.type) {
                dispatch(incrementObjective({
                  questId: activeQuest.questId,
                  objectiveId: objective.id,
                  amount: 1,
                  required: objective.required,
                }));
              }
            });
          });
        } else {
          dispatch(updateConstructionProgress({ id: building.id, daysRemaining: newDays }));
        }
      }
      
      // Handle upgrades
      if (building.isUpgrading && building.upgradeDaysRemaining !== undefined) {
        const newDays = building.upgradeDaysRemaining - 1;
        if (newDays <= 0) {
          dispatch(completeUpgrade(building.id));
          events.push(`Upgrade complete: ${building.type} to level ${building.level + 1}`);
        } else {
          dispatch(updateUpgradeProgress({ id: building.id, daysRemaining: newDays }));
        }
      }
    });

    // Process staff experience gain
    employees.forEach(staff => {
      let xpGain = 5; // Base XP for working a day
      
      // Role-specific XP bonuses based on StaffRole type
      switch (staff.role) {
        case 'doctore':
          // Doctore (trainer) gains extra XP when gladiators train
          const trainingGladiators = roster.filter(g => g.isTraining).length;
          xpGain += trainingGladiators * 3;
          if (trainingGladiators > 0) {
            events.push(`${staff.name} trained ${trainingGladiators} gladiator(s)`);
          }
          break;
        case 'medicus':
          // Medicus (physician) gains XP when healing injured gladiators
          const injuredGladiators = roster.filter(g => g.isInjured || g.currentHP < g.maxHP).length;
          xpGain += injuredGladiators * 3;
          if (injuredGladiators > 0) {
            events.push(`${staff.name} treated ${injuredGladiators} gladiator(s)`);
          }
          break;
        case 'coquus':
          // Coquus (cook) gains XP based on number of gladiators fed
          xpGain += roster.length * 2;
          break;
        case 'guard':
          // Guard gains XP for maintaining security
          xpGain += Math.floor(roster.length / 2) + 2;
          break;
        case 'lanista':
          // Lanista (manager) gains XP based on gold transactions
          xpGain += Math.min(10, Math.floor((totalIncome + totalExpenses) / 50));
          break;
        case 'lorarius':
          // Lorarius (disciplinarian) gains XP for keeping order
          xpGain += Math.floor(roster.length / 2) + 3;
          break;
        case 'faber':
          // Faber (craftsman) gains XP from building maintenance
          const activeBuildings = buildings.filter(b => !b.isUnderConstruction).length;
          xpGain += activeBuildings * 2;
          break;
      }
      
      // Check for level up before applying XP (to detect if level up will happen)
      const currentXP = staff.experience;
      const xpToLevel = staff.level * 50;
      const willLevelUp = (currentXP + xpGain) >= xpToLevel && staff.level < 5;
      
      // Apply XP gain (auto level-up happens in the reducer)
      dispatch(addStaffExperience({ id: staff.id, amount: xpGain }));
      
      if (willLevelUp) {
        events.push(`🎉 ${staff.name} leveled up to Level ${staff.level + 1}!`);
      }
    });

    // Calculate security rating (guards + buildings)
    const guards = employees.filter(e => e.role === 'guard');
    const guardCount = guards.length;
    // Calculate bonus from guard skills (vigilant +5, intimidating +5, elite +10)
    let guardSkillBonus = 0;
    guards.forEach(guard => {
      if (guard.skills.includes('guard_vigilant')) guardSkillBonus += 5;
      if (guard.skills.includes('guard_intimidating')) guardSkillBonus += 5;
      if (guard.skills.includes('guard_elite')) guardSkillBonus += 10;
      // Level bonus: +2 security per guard level
      guardSkillBonus += (guard.level - 1) * 2;
    });
    dispatch(calculateSecurityRating({ guardCount, guardSkillBonus }));

    // Tick cooldowns and update time-based systems
    dispatch(tickQuestCooldowns());
    dispatch(tickFactionCooldowns());
    dispatch(updateSponsorships());

    // Create day report
    dispatch(setDayReport({
      day: currentDay,
      income,
      expenses,
      netGold: totalIncome - totalExpenses,
      events,
      alerts,
    }));

    // Advance day
    dispatch(advanceDay());
    setProcessingDay(false);
  }, [dispatch, currentDay, totalDailyWages, foodCosts, ludusFame, gold, roster, employees, buildings, resources, activeQuests, ownedMerchandise, activeSponsorships]);

  // Get phase icon
  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'dawn': return '🌅';
      case 'morning': return '☀️';
      case 'afternoon': return '🌤️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '☀️';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-start">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
              Welcome, {name}
            </h1>
            <p className="text-roman-marble-400">
              Day {currentDay} at {ludusName}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-2xl">
              <span>{getPhaseIcon(currentPhase)}</span>
              <span className="font-roman text-roman-gold-400 capitalize">{currentPhase}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {TIME_PHASES.map((phase, idx) => (
                <div
                  key={phase}
                  className={clsx(
                    'w-3 h-3 rounded-full',
                    TIME_PHASES.indexOf(currentPhase) >= idx
                      ? 'bg-roman-gold-500'
                      : 'bg-roman-marble-700'
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Rebellion Warning */}
        {rebellionWarning && (
          <motion.div
            variants={itemVariants}
            className="bg-roman-crimson-600/20 border-2 border-roman-crimson-600 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <div className="font-roman text-roman-crimson-400">Rebellion Warning!</div>
                <div className="text-roman-marble-300 text-sm">
                  Your gladiators are extremely restless. Improve conditions immediately or risk a revolt!
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">🪙</div>
              <div className="font-roman text-2xl text-roman-gold-400">{gold}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Gold</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">⚔️</div>
              <div className="font-roman text-2xl text-roman-marble-200">{roster.length}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Gladiators</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">🏗️</div>
              <div className="font-roman text-2xl text-roman-marble-200">{buildings.length}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Buildings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">⭐</div>
              <div className="font-roman text-2xl text-roman-marble-200">{ludusFame}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Fame</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          {/* Ludus Fame Progress */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Ludus Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  value={ludusFame}
                  max={1000}
                  variant="fame"
                  size="lg"
                  showLabel
                  label="Fame"
                />
                <div className="mt-4 text-sm text-roman-marble-400">
                  {ludusFame < 100 && 'Unknown School - Only pit fights available'}
                  {ludusFame >= 100 && ludusFame < 300 && 'Local Recognition - Provincial Munera unlocked'}
                  {ludusFame >= 300 && ludusFame < 500 && 'Regional Fame - Better marketplace access'}
                  {ludusFame >= 500 && ludusFame < 750 && 'Famous School - Elite options available'}
                  {ludusFame >= 750 && "Legendary Ludus - Emperor's Games invitation"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌾</div>
                    <div className="font-bold text-roman-marble-200">{resources.grain}</div>
                    <div className="text-xs text-roman-marble-500">Grain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">💧</div>
                    <div className="font-bold text-roman-marble-200">{resources.water}</div>
                    <div className="text-xs text-roman-marble-500">Water</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🍷</div>
                    <div className="font-bold text-roman-marble-200">{resources.wine}</div>
                    <div className="text-xs text-roman-marble-500">Wine</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-roman-marble-400">Staff Wages</span>
                    <span className="text-roman-crimson-400">-{totalDailyWages}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-roman-marble-400">Food Costs</span>
                    <span className="text-roman-crimson-400">-{roster.length * 2}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-roman-marble-400">Staff Members</span>
                    <span className="text-roman-marble-200">{employees.length}</span>
                  </div>
                  <div className="divider-roman my-2" />
                  <div className="flex justify-between items-center font-roman">
                    <span className="text-roman-gold-400">Est. Daily Cost</span>
                    <span className="text-roman-crimson-400">-{totalDailyWages + roster.length * 2}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => dispatch(setScreen('marketplace'))}
                  >
                    Visit Marketplace
                  </Button>
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => dispatch(setScreen('arena'))}
                  >
                    View Arena Schedule
                  </Button>
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={handleEndDay}
                    disabled={processingDay}
                  >
                    {processingDay ? 'Processing...' : 'End Day →'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Unrest Meter */}
          {roster.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Gladiator Unrest</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressBar
                    value={unrestLevel}
                    max={100}
                    variant={unrestLevel >= 75 ? 'health' : 'default'}
                    size="md"
                  />
                  <div className="flex justify-between mt-2 text-xs text-roman-marble-500">
                    <span>Peaceful</span>
                    <span className={clsx(
                      unrestLevel >= 75 ? 'text-roman-crimson-400' :
                      unrestLevel >= 50 ? 'text-orange-400' :
                      'text-health-high'
                    )}>
                      {unrestLevel}%
                    </span>
                    <span>Rebellion</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Active Notifications */}
        {roster.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card variant="gold">
              <CardContent className="flex items-center gap-4">
                <span className="text-3xl">💡</span>
                <div>
                  <div className="font-roman text-roman-gold-400">Getting Started</div>
                  <div className="text-roman-marble-300">
                    Visit the Marketplace to recruit your first gladiator and begin building your legacy!
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Day Report Modal */}
        <Modal
          isOpen={showDayReport}
          onClose={() => dispatch(hideDayReport())}
          title={`Day ${lastDayReport?.day || currentDay - 1} Summary`}
          size="lg"
        >
          {lastDayReport && (
            <div className="space-y-6">
              {/* Alerts */}
              {lastDayReport.alerts.length > 0 && (
                <div className="space-y-2">
                  {lastDayReport.alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        'p-3 rounded-lg border',
                        alert.severity === 'danger' && 'bg-roman-crimson-600/20 border-roman-crimson-600',
                        alert.severity === 'warning' && 'bg-orange-600/20 border-orange-600',
                        alert.severity === 'info' && 'bg-blue-600/20 border-blue-600'
                      )}
                    >
                      <span className={clsx(
                        alert.severity === 'danger' && 'text-roman-crimson-400',
                        alert.severity === 'warning' && 'text-orange-400',
                        alert.severity === 'info' && 'text-blue-400'
                      )}>
                        {alert.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                {/* Income */}
                <div className="bg-roman-marble-800 p-4 rounded-lg">
                  <h4 className="font-roman text-health-high mb-3">Income</h4>
                  {lastDayReport.income.length === 0 ? (
                    <div className="text-roman-marble-500 text-sm">No income today</div>
                  ) : (
                    <div className="space-y-2">
                      {lastDayReport.income.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-roman-marble-400">{item.source}</span>
                          <span className="text-health-high">+{item.amount}g</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expenses */}
                <div className="bg-roman-marble-800 p-4 rounded-lg">
                  <h4 className="font-roman text-roman-crimson-400 mb-3">Expenses</h4>
                  {lastDayReport.expenses.length === 0 ? (
                    <div className="text-roman-marble-500 text-sm">No expenses today</div>
                  ) : (
                    <div className="space-y-2">
                      {lastDayReport.expenses.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-roman-marble-400">{item.source}</span>
                          <span className="text-roman-crimson-400">-{item.amount}g</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Net Gold */}
              <div className={clsx(
                'p-4 rounded-lg text-center',
                lastDayReport.netGold >= 0 
                  ? 'bg-health-high/20 border border-health-high' 
                  : 'bg-roman-crimson-600/20 border border-roman-crimson-600'
              )}>
                <div className="text-roman-marble-400 text-sm">Net Change</div>
                <div className={clsx(
                  'font-roman text-2xl',
                  lastDayReport.netGold >= 0 ? 'text-health-high' : 'text-roman-crimson-400'
                )}>
                  {lastDayReport.netGold >= 0 ? '+' : ''}{lastDayReport.netGold}g
                </div>
              </div>

              {/* Events */}
              {lastDayReport.events.length > 0 && (
                <div className="bg-roman-marble-800 p-4 rounded-lg">
                  <h4 className="font-roman text-roman-gold-400 mb-3">Events</h4>
                  <div className="space-y-1 text-sm text-roman-marble-300">
                    {lastDayReport.events.map((event, idx) => (
                      <div key={idx}>• {event}</div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="gold"
                className="w-full"
                onClick={() => dispatch(hideDayReport())}
              >
                Continue to Day {currentDay}
              </Button>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};
