import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { 
  startConstruction, 
  startUpgrade,
  calculateSecurityRating,
  updateBuilding,
} from '@features/ludus/ludusSlice';
import { spendGold, consumeResource } from '@features/player/playerSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ProgressBar } from '@components/ui';
import { BUILDINGS, getBuildingLevelData, getUpgradeCost } from '@data/buildings';
import { 
  getConditionCategory, 
  calculateRepairCost, 
  getTotalMaintenanceCost,
  calculateMaintenanceCost,
} from '@/utils/buildingMaintenance';
import type { Building, BuildingType } from '@/types';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

type CategoryFilter = 'all' | 'training' | 'recovery' | 'storage' | 'security' | 'production';

export const LudusScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { buildings, securityRating, maxBuildings } = useAppSelector(state => state.ludus);
  const { gold, resources } = useAppSelector(state => state.player);
  const gameState = useAppSelector(state => state.game);
  const currentDay = ((gameState?.currentYear ?? 73) - 73) * 12 + (gameState?.currentMonth ?? 1);
  const { employees } = useAppSelector(state => state.staff);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [selectedBuildingType, setSelectedBuildingType] = useState<BuildingType | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [buildingToMaintain, setBuildingToMaintain] = useState<Building | null>(null);

  // Initialize missing maintenance fields for older save files
  useEffect(() => {
    buildings.forEach(building => {
      if (!building.isUnderConstruction && !building.isUpgrading) {
        // Initialize missing fields with defaults
        const needsUpdate = 
          building.condition === undefined || 
          building.maintenanceCost === undefined;
        
        if (needsUpdate) {
          const updates: Partial<Building> = {};
          if (building.condition === undefined) {
            updates.condition = 100;
          }
          if (building.maintenanceCost === undefined) {
            updates.maintenanceCost = calculateMaintenanceCost(building.type, building.level);
          }
          dispatch(updateBuilding({ id: building.id, updates }));
        }
      }
    });
  }, []); // Run once on mount

  // Calculate security rating when component mounts or employees/buildings change
  useEffect(() => {
    const guards = employees.filter(e => e.role === 'guard');
    const guardCount = guards.length;
    let guardSkillBonus = 0;
    guards.forEach(guard => {
      if (guard.skills.includes('guard_vigilant')) guardSkillBonus += 5;
      if (guard.skills.includes('guard_intimidating')) guardSkillBonus += 5;
      if (guard.skills.includes('guard_elite')) guardSkillBonus += 10;
      // Level bonus: +2 security per guard level
      guardSkillBonus += (guard.level - 1) * 2;
    });
    dispatch(calculateSecurityRating({ guardCount, guardSkillBonus }));
  }, [dispatch, employees, buildings]);

  // Get buildings not yet constructed
  const constructedTypes = buildings.map(b => b.type);
  const availableToConstruct = Object.values(BUILDINGS).filter(
    b => !constructedTypes.includes(b.id)
  );

  // Filter available buildings by category
  const filteredAvailable = categoryFilter === 'all' 
    ? availableToConstruct 
    : availableToConstruct.filter(b => b.category === categoryFilter);

  // Check if player can afford a building
  const canAffordBuilding = (buildingType: BuildingType): boolean => {
    const levelData = getBuildingLevelData(buildingType, 1);
    if (gold < levelData.goldCost) return false;
    if (levelData.resourceCost) {
      for (const cost of levelData.resourceCost) {
        if ((resources as any)[cost.resource] < cost.amount) return false;
      }
    }
    return true;
  };

  // Check prerequisites
  const meetsPrerequisites = (buildingType: BuildingType): { met: boolean; reason?: string } => {
    const buildingData = BUILDINGS[buildingType];
    if (!buildingData.prerequisite) return { met: true };

    const prereq = buildingData.prerequisite;
    
    if ('staff' in prereq) {
      const hasStaff = employees.some(e => e.role === prereq.staff);
      if (!hasStaff) {
        return { met: false, reason: `Requires ${prereq.staff} on staff` };
      }
    }

    if ('building' in prereq) {
      const prereqBuilding = buildings.find(
        b => b.type === prereq.building && b.level >= prereq.level
      );
      if (!prereqBuilding) {
        return { 
          met: false, 
          reason: `Requires ${BUILDINGS[prereq.building].name} Level ${prereq.level}` 
        };
      }
    }

    return { met: true };
  };

  // Handle building construction
  const handleBuild = () => {
    if (!selectedBuildingType) return;
    
    const levelData = getBuildingLevelData(selectedBuildingType, 1);
    const buildingData = BUILDINGS[selectedBuildingType];

    // Deduct costs
    dispatch(spendGold({
      amount: levelData.goldCost,
      description: `Construction: ${buildingData.name}`,
      category: 'building',
      day: currentDay,
    }));

    if (levelData.resourceCost) {
      for (const cost of levelData.resourceCost) {
        dispatch(consumeResource({ 
          resource: cost.resource as keyof typeof resources, 
          amount: cost.amount 
        }));
      }
    }

    // Start construction
    const newBuilding: Building = {
      id: uuidv4(),
      type: selectedBuildingType,
      level: 1,
      bonuses: levelData.bonuses,
      isUnderConstruction: true,
      constructionDaysRemaining: levelData.constructionDays,
      isUpgrading: false,
      upgradeDaysRemaining: 0,
      condition: 100, // New buildings start at 100% condition
      maintenanceCost: 0, // Will be set when construction completes
    };

    dispatch(startConstruction({ building: newBuilding }));
    setShowBuildModal(false);
    setSelectedBuildingType(null);
  };

  // Handle building upgrade
  const handleUpgrade = () => {
    if (!selectedBuilding || selectedBuilding.level >= 3) return;

    const upgradeCost = getUpgradeCost(selectedBuilding.type, selectedBuilding.level as 1 | 2);
    const buildingData = BUILDINGS[selectedBuilding.type];

    // Deduct costs
    dispatch(spendGold({
      amount: upgradeCost.gold,
      description: `Upgrade: ${buildingData.name} to Level ${selectedBuilding.level + 1}`,
      category: 'building',
      day: currentDay,
    }));

    if (upgradeCost.resources) {
      for (const cost of upgradeCost.resources) {
        dispatch(consumeResource({ 
          resource: cost.resource as keyof typeof resources, 
          amount: cost.amount 
        }));
      }
    }

    dispatch(startUpgrade({ id: selectedBuilding.id, upgradeDays: upgradeCost.days }));
    setShowUpgradeModal(false);
    setSelectedBuilding(null);
  };

  // Check if can afford upgrade
  const canAffordUpgrade = (building: Building): boolean => {
    if (building.level >= 3) return false;
    const upgradeCost = getUpgradeCost(building.type, building.level as 1 | 2);
    if (gold < upgradeCost.gold) return false;
    if (upgradeCost.resources) {
      for (const cost of upgradeCost.resources) {
        if ((resources as any)[cost.resource] < cost.amount) return false;
      }
    }
    return true;
  };

  const categories: { id: CategoryFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🏛️' },
    { id: 'training', label: 'Training', icon: '⚔️' },
    { id: 'recovery', label: 'Recovery', icon: '💊' },
    { id: 'production', label: 'Production', icon: '⚒️' },
    { id: 'storage', label: 'Storage', icon: '📦' },
    { id: 'security', label: 'Security', icon: '🏰' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
              Ludus Management
            </h1>
            <p className="text-roman-marble-400">
              {buildings.length} / {maxBuildings} buildings constructed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-roman-marble-800 px-4 py-2 rounded-lg border border-roman-marble-600">
              <span className="text-xl">🏰</span>
              <span className="text-roman-marble-200">Security: <span className="text-roman-gold-400">{securityRating}</span></span>
            </div>
            <div className="flex items-center gap-2 bg-roman-marble-800 px-4 py-2 rounded-lg border border-roman-gold-600">
              <span className="text-xl">🪙</span>
              <span className="font-roman text-xl text-roman-gold-400">{gold}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Summary */}
        {buildings.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>🔧 Building Maintenance</CardTitle>
                <div className="text-sm text-roman-marble-400">
                  Total Monthly Cost: <span className="text-roman-gold-400 font-roman">
                    {getTotalMaintenanceCost(buildings)}g
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {buildings.filter(b => !b.isUnderConstruction && !b.isUpgrading).map(building => {
                  const condition = building.condition ?? 100;
                  const conditionInfo = getConditionCategory(condition);
                  const needsAttention = condition < 75;
                  
                  return (
                    <div
                      key={building.id}
                      className={clsx(
                        'bg-roman-marble-800 p-3 rounded-lg border',
                        needsAttention ? 'border-roman-crimson-700' : 'border-roman-marble-700'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{BUILDINGS[building.type].icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-roman-marble-200 truncate">
                            {BUILDINGS[building.type].name}
                          </div>
                          <div className={clsx('text-xs', conditionInfo.color)}>
                            {Math.round(condition)}% • {conditionInfo.label}
                          </div>
                        </div>
                      </div>
                      {needsAttention && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setBuildingToMaintain(building);
                            setShowMaintenanceModal(true);
                          }}
                        >
                          Repair
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-roman-marble-500">
                Buildings degrade by 2% per month without maintenance. Degraded buildings lose effectiveness.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Buildings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Buildings</CardTitle>
              <Button
                variant="gold"
                onClick={() => setShowBuildModal(true)}
                disabled={buildings.length >= maxBuildings}
              >
                + Build New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {buildings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🏗️</div>
                <p className="text-roman-marble-400 mb-4">
                  Your ludus has no buildings yet. Start construction to improve your facilities.
                </p>
                <Button variant="gold" onClick={() => setShowBuildModal(true)}>
                  Build First Structure
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {buildings.map(building => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    onUpgrade={() => {
                      setSelectedBuilding(building);
                      setShowUpgradeModal(true);
                    }}
                    canUpgrade={canAffordUpgrade(building)}
                    onMaintenance={() => {
                      setBuildingToMaintain(building);
                      setShowMaintenanceModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Build New Building Modal */}
        <Modal
          isOpen={showBuildModal}
          onClose={() => {
            setShowBuildModal(false);
            setSelectedBuildingType(null);
          }}
          title="Construct Building"
          size="xl"
        >
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded text-sm transition-all',
                    categoryFilter === cat.id
                      ? 'bg-roman-gold-600 text-roman-marble-900'
                      : 'bg-roman-marble-700 text-roman-marble-300 hover:bg-roman-marble-600'
                  )}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Building List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredAvailable.length === 0 ? (
                <p className="text-roman-marble-400 text-center py-4">
                  No buildings available in this category.
                </p>
              ) : (
                filteredAvailable.map(buildingData => {
                  const levelData = getBuildingLevelData(buildingData.id, 1);
                  const prereq = meetsPrerequisites(buildingData.id);
                  const affordable = canAffordBuilding(buildingData.id);

                  return (
                    <div
                      key={buildingData.id}
                      onClick={() => prereq.met && setSelectedBuildingType(buildingData.id)}
                      className={clsx(
                        'p-4 rounded-lg border transition-all cursor-pointer',
                        selectedBuildingType === buildingData.id
                          ? 'border-roman-gold-500 bg-roman-gold-500/10'
                          : prereq.met
                            ? 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
                            : 'border-roman-marble-700 bg-roman-marble-900 opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{buildingData.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-roman text-lg text-roman-marble-100">
                              {buildingData.name}
                            </span>
                            {!prereq.met && (
                              <span className="text-xs px-2 py-0.5 bg-roman-crimson-600 rounded">
                                Locked
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-roman-marble-400 mb-2">
                            {buildingData.description}
                          </p>
                          {!prereq.met && (
                            <p className="text-xs text-roman-crimson-400 mb-2">
                              ⚠️ {prereq.reason}
                            </p>
                          )}
                          <div className="flex gap-4 text-xs text-roman-marble-500">
                            <span>🪙 {levelData.goldCost}g</span>
                            <span>⏱️ {levelData.constructionDays} days</span>
                            {levelData.resourceCost && levelData.resourceCost.map(rc => (
                              <span key={rc.resource}>
                                {rc.amount} {rc.resource}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-xs">
                            <span className="text-roman-gold-400">Bonuses: </span>
                            {levelData.bonuses.map((bonus, i) => (
                              <span key={bonus.stat} className="text-roman-marble-300">
                                {i > 0 && ', '}
                                {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''} {bonus.stat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={clsx(
                          'font-roman text-lg',
                          affordable && prereq.met ? 'text-roman-gold-400' : 'text-roman-crimson-500'
                        )}>
                          {levelData.goldCost}g
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Build Button */}
            <div className="flex gap-3 pt-4 border-t border-roman-marble-700">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setShowBuildModal(false);
                  setSelectedBuildingType(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                onClick={handleBuild}
                disabled={!selectedBuildingType || !canAffordBuilding(selectedBuildingType) || !meetsPrerequisites(selectedBuildingType).met}
              >
                Start Construction
              </Button>
            </div>
          </div>
        </Modal>

        {/* Upgrade Modal */}
        <Modal
          isOpen={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            setSelectedBuilding(null);
          }}
          title="Upgrade Building"
          size="md"
        >
          {selectedBuilding && selectedBuilding.level < 3 && (
            <UpgradePanel
              building={selectedBuilding}
              gold={gold}
              resources={resources}
              onUpgrade={handleUpgrade}
              onCancel={() => {
                setShowUpgradeModal(false);
                setSelectedBuilding(null);
              }}
            />
          )}
        </Modal>

        {/* Maintenance & Repair Modal */}
        <Modal
          isOpen={showMaintenanceModal}
          onClose={() => {
            setShowMaintenanceModal(false);
            setBuildingToMaintain(null);
          }}
          title="🔧 Building Maintenance"
        >
          {buildingToMaintain && (
            <div className="space-y-4">
              <div className="bg-roman-marble-800 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{BUILDINGS[buildingToMaintain.type].icon}</span>
                  <div>
                    <div className="font-roman text-lg text-roman-marble-100">
                      {BUILDINGS[buildingToMaintain.type].name}
                    </div>
                    <div className="text-sm text-roman-marble-400">
                      Level {buildingToMaintain.level}
                    </div>
                  </div>
                </div>

                {/* Current Condition */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-roman-marble-400">Current Condition</span>
                    <span className={getConditionCategory(buildingToMaintain.condition ?? 100).color}>
                      {getConditionCategory(buildingToMaintain.condition ?? 100).label} ({Math.round(buildingToMaintain.condition ?? 100)}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={buildingToMaintain.condition ?? 100}
                    max={100}
                    variant={(buildingToMaintain.condition ?? 100) >= 75 ? 'health' : 'stamina'}
                    size="lg"
                  />
                  <div className="text-xs text-roman-marble-500 mt-2">
                    {getConditionCategory(buildingToMaintain.condition ?? 100).description}
                  </div>
                </div>

                {/* Monthly Maintenance */}
                <div className="bg-roman-marble-900 p-3 rounded border border-roman-marble-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-roman-marble-300">Monthly Maintenance</div>
                    <div className="text-roman-gold-400 font-roman">
                      {buildingToMaintain.maintenanceCost ?? 0}g/month
                    </div>
                  </div>
                  <div className="text-xs text-roman-marble-500">
                    Prevents degradation (-0.5% vs -2% without maintenance)
                  </div>
                </div>
              </div>

              {/* Repair Options */}
              {(buildingToMaintain.condition ?? 100) < 100 && (
                <div className="space-y-3">
                  <div className="divider-roman" />
                  <div className="text-sm text-roman-marble-300 font-roman mb-2">Repair Options</div>

                  {/* Minor Repair */}
                  {(buildingToMaintain.condition ?? 100) < 75 && (
                    <div className="bg-roman-marble-800 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="text-sm text-roman-marble-200">Minor Repair</div>
                          <div className="text-xs text-roman-marble-500">Restore to 75% condition</div>
                        </div>
                        <div className="text-roman-gold-400 font-roman">
                          {calculateRepairCost(buildingToMaintain, 75, 0)}g
                        </div>
                      </div>
                      <Button
                        variant={gold >= calculateRepairCost(buildingToMaintain, 75, 0) ? 'primary' : 'ghost'}
                        size="sm"
                        className="w-full"
                        disabled={gold < calculateRepairCost(buildingToMaintain, 75, 0)}
                        onClick={() => {
                          const cost = calculateRepairCost(buildingToMaintain, 75, 0);
                          if (gold >= cost) {
                            dispatch(spendGold({
                              amount: cost,
                              description: `Minor Repair: ${buildingToMaintain.type}`,
                              category: 'Maintenance',
                              day: currentDay,
                            }));
                            dispatch(updateBuilding({
                              id: buildingToMaintain.id,
                              updates: { condition: 75 }
                            }));
                            setShowMaintenanceModal(false);
                            setBuildingToMaintain(null);
                          }
                        }}
                      >
                        Perform Minor Repair
                      </Button>
                    </div>
                  )}

                  {/* Major Repair */}
                  <div className="bg-roman-marble-800 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-sm text-roman-marble-200">Major Repair</div>
                        <div className="text-xs text-roman-marble-500">Restore to 100% condition</div>
                      </div>
                      <div className="text-roman-gold-400 font-roman">
                        {calculateRepairCost(buildingToMaintain, 100, 0)}g
                      </div>
                    </div>
                    <Button
                      variant={gold >= calculateRepairCost(buildingToMaintain, 100, 0) ? 'gold' : 'ghost'}
                      size="sm"
                      className="w-full"
                      disabled={gold < calculateRepairCost(buildingToMaintain, 100, 0)}
                      onClick={() => {
                        const cost = calculateRepairCost(buildingToMaintain, 100, 0);
                        if (gold >= cost) {
                          dispatch(spendGold({
                            amount: cost,
                            description: `Major Repair: ${buildingToMaintain.type}`,
                            category: 'Maintenance',
                            day: currentDay,
                          }));
                          dispatch(updateBuilding({
                            id: buildingToMaintain.id,
                            updates: { condition: 100 }
                          }));
                          setShowMaintenanceModal(false);
                          setBuildingToMaintain(null);
                        }
                      }}
                    >
                      Perform Major Repair
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowMaintenanceModal(false);
                  setBuildingToMaintain(null);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

// Building Card Component
interface BuildingCardProps {
  building: Building;
  onUpgrade: () => void;
  canUpgrade: boolean;
  onMaintenance?: () => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building, onUpgrade, canUpgrade, onMaintenance }) => {
  const buildingData = BUILDINGS[building.type];
  const levelData = getBuildingLevelData(building.type, building.level);

  const getLevelStars = () => {
    return '★'.repeat(building.level) + '☆'.repeat(3 - building.level);
  };
  
  const condition = building.condition ?? 100;
  const conditionInfo = getConditionCategory(condition);

  return (
    <Card 
      variant={building.level === 3 ? 'gold' : 'default'}
      className="relative"
    >
      <CardContent>
        {/* Under Construction Overlay */}
        {(building.isUnderConstruction || building.isUpgrading) && (
          <div className="absolute inset-0 bg-roman-marble-900/80 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-3xl mb-2">🏗️</div>
              <div className="text-roman-gold-400 font-roman">
                {building.isUnderConstruction ? 'Building...' : 'Upgrading...'}
              </div>
              <div className="text-roman-marble-400 text-sm">
                {building.isUnderConstruction 
                  ? building.constructionDaysRemaining 
                  : building.upgradeDaysRemaining} days remaining
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{buildingData.icon}</span>
          <div className="flex-1">
            <div className="font-roman text-roman-marble-100">{buildingData.name}</div>
            <div className="text-roman-gold-500 text-sm">{getLevelStars()}</div>
          </div>
        </div>

        {/* Bonuses */}
        <div className="space-y-1 mb-3 text-xs">
          {levelData.bonuses.map(bonus => (
            <div key={bonus.stat} className="flex justify-between text-roman-marble-400">
              <span>{bonus.stat}</span>
              <span className="text-health-high">
                {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''}
              </span>
            </div>
          ))}
          {levelData.special && (
            <div className="text-roman-gold-400 mt-2">
              ✨ {levelData.special}
            </div>
          )}
        </div>

        {/* Building Condition */}
        {!building.isUnderConstruction && condition !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-roman-marble-400">Condition</span>
              <span className={conditionInfo.color}>
                {conditionInfo.label} ({Math.round(condition)}%)
              </span>
            </div>
            <ProgressBar
              value={condition}
              max={100}
              variant={condition >= 75 ? 'health' : condition >= 50 ? 'stamina' : 'stamina'}
              size="sm"
            />
            {condition < 75 && (
              <div className="text-xs text-roman-marble-500 mt-1">
                {conditionInfo.description}
              </div>
            )}
            {onMaintenance && condition < 100 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaintenance();
                }}
              >
                🔧 Maintenance ({building.maintenanceCost ?? 0}g/month)
              </Button>
            )}
          </div>
        )}

        {/* Upgrade Button */}
        {building.level < 3 && !building.isUnderConstruction && !building.isUpgrading && (
          <Button
            variant={canUpgrade ? 'primary' : 'ghost'}
            size="sm"
            className="w-full"
            onClick={onUpgrade}
            disabled={!canUpgrade}
          >
            Upgrade to Level {building.level + 1}
          </Button>
        )}
        {building.level === 3 && (
          <div className="text-center text-roman-gold-400 text-sm font-roman">
            ✨ MAX LEVEL ✨
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Upgrade Panel Component
interface UpgradePanelProps {
  building: Building;
  gold: number;
  resources: any;
  onUpgrade: () => void;
  onCancel: () => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({
  building,
  gold,
  resources,
  onUpgrade,
  onCancel,
}) => {
  const buildingData = BUILDINGS[building.type];
  const currentLevelData = getBuildingLevelData(building.type, building.level);
  const nextLevel = (building.level + 1) as 2 | 3;
  const nextLevelData = getBuildingLevelData(building.type, nextLevel);
  const upgradeCost = getUpgradeCost(building.type, building.level as 1 | 2);

  const canAfford = gold >= upgradeCost.gold && 
    (!upgradeCost.resources || upgradeCost.resources.every(
      rc => resources[rc.resource] >= rc.amount
    ));

  return (
    <div className="space-y-4">
      {/* Building Info */}
      <div className="flex items-center gap-4">
        <span className="text-4xl">{buildingData.icon}</span>
        <div>
          <div className="font-roman text-xl text-roman-marble-100">{buildingData.name}</div>
          <div className="text-roman-marble-400">
            Level {building.level} → Level {nextLevel}
          </div>
        </div>
      </div>

      {/* Current vs New Bonuses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-roman-marble-800 p-3 rounded">
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Current (Lv.{building.level})</div>
          {currentLevelData.bonuses.map(bonus => (
            <div key={bonus.stat} className="text-sm text-roman-marble-300">
              {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''} {bonus.stat}
            </div>
          ))}
        </div>
        <div className="bg-roman-gold-500/10 border border-roman-gold-600 p-3 rounded">
          <div className="text-xs text-roman-gold-500 uppercase mb-2">After Upgrade (Lv.{nextLevel})</div>
          {nextLevelData.bonuses.map(bonus => (
            <div key={bonus.stat} className="text-sm text-roman-gold-400">
              {bonus.value > 0 ? '+' : ''}{bonus.value}{bonus.isPercentage ? '%' : ''} {bonus.stat}
            </div>
          ))}
          {nextLevelData.special && (
            <div className="text-sm text-roman-gold-300 mt-2">
              ✨ {nextLevelData.special}
            </div>
          )}
        </div>
      </div>

      {/* Cost */}
      <div className="bg-roman-marble-800 p-3 rounded">
        <div className="text-xs text-roman-marble-500 uppercase mb-2">Upgrade Cost</div>
        <div className="flex gap-4">
          <div className={clsx(
            'text-lg',
            gold >= upgradeCost.gold ? 'text-roman-gold-400' : 'text-roman-crimson-500'
          )}>
            🪙 {upgradeCost.gold}g
          </div>
          <div className="text-lg text-roman-marble-300">
            ⏱️ {upgradeCost.days} days
          </div>
          {upgradeCost.resources?.map(rc => (
            <div 
              key={rc.resource}
              className={clsx(
                'text-lg',
                resources[rc.resource] >= rc.amount ? 'text-roman-marble-300' : 'text-roman-crimson-500'
              )}
            >
              {rc.amount} {rc.resource}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="gold"
          className="flex-1"
          onClick={onUpgrade}
          disabled={!canAfford}
        >
          {canAfford ? 'Upgrade' : 'Cannot Afford'}
        </Button>
      </div>
    </div>
  );
};
