import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setMarketPool, purchaseGladiator } from '@features/gladiators/gladiatorsSlice';
import { spendGold, addResource, consumeResource } from '@features/player/playerSlice';
import { incrementObjective } from '@features/quests/questsSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@components/ui';
import { generateMarketPool } from '@utils/gladiatorGenerator';
import { GLADIATOR_CLASSES, GLADIATOR_ORIGINS } from '@data/gladiatorClasses';
import { getQuestById } from '@data/quests';
import type { Gladiator, Resources } from '@/types';
import { clsx } from 'clsx';

type MarketTab = 'gladiators' | 'resources';

export const MarketplaceScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gold, resources } = useAppSelector(state => state.player);
  const { marketPool } = useAppSelector(state => state.gladiators);
  const { marketPrices } = useAppSelector(state => state.economy);
  const { currentDay } = useAppSelector(state => state.game);
  const { activeQuests } = useAppSelector(state => state.quests);
  
  const [activeTab, setActiveTab] = useState<MarketTab>('gladiators');
  const [selectedGladiator, setSelectedGladiator] = useState<Gladiator | null>(null);
  const [resourceAmounts, setResourceAmounts] = useState<Record<keyof Resources, number>>({
    grain: 10,
    water: 10,
    wine: 5,
    travertine: 1,
    glass: 1,
    clay: 5,
  });

  // Generate market pool on first load
  useEffect(() => {
    if (marketPool.length === 0) {
      dispatch(setMarketPool(generateMarketPool(6)));
    }
  }, [dispatch, marketPool.length]);

  const handleBuyGladiator = (gladiator: Gladiator) => {
    if (gold >= gladiator.purchasePrice) {
      dispatch(spendGold({
        amount: gladiator.purchasePrice,
        description: `Purchased gladiator: ${gladiator.name}`,
        category: 'gladiator',
        day: currentDay,
      }));
      dispatch(purchaseGladiator(gladiator.id));
      setSelectedGladiator(null);
      
      // Update quest objectives for recruiting gladiators
      activeQuests.forEach(activeQuest => {
        const questData = getQuestById(activeQuest.questId);
        if (questData) {
          questData.objectives.forEach(objective => {
            if (objective.type === 'recruit_gladiator') {
              dispatch(incrementObjective({
                questId: activeQuest.questId,
                objectiveId: objective.id,
                amount: 1,
                required: objective.required,
              }));
            }
          });
        }
      });
    }
  };

  const handleBuyResource = (resource: keyof Resources) => {
    const amount = resourceAmounts[resource];
    const totalCost = Math.round(marketPrices[resource] * amount);
    
    if (gold >= totalCost) {
      dispatch(spendGold({
        amount: totalCost,
        description: `Purchased ${amount} ${resource}`,
        category: 'resource',
        day: currentDay,
      }));
      dispatch(addResource({ resource, amount }));
    }
  };

  const handleSellResource = (resource: keyof Resources) => {
    const amount = resourceAmounts[resource];
    if (resources[resource] >= amount) {
      const totalValue = Math.round(marketPrices[resource] * amount * 0.7); // Sell at 70%
      dispatch(consumeResource({ resource, amount }));
      dispatch(spendGold({
        amount: -totalValue, // Negative spend = income
        description: `Sold ${amount} ${resource}`,
        category: 'resource',
        day: currentDay,
      }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const resourceInfo: { key: keyof Resources; name: string; icon: string; unit: string }[] = [
    { key: 'grain', name: 'Grain', icon: '🌾', unit: 'bushels' },
    { key: 'water', name: 'Water', icon: '💧', unit: 'barrels' },
    { key: 'wine', name: 'Wine', icon: '🍷', unit: 'amphorae' },
    { key: 'travertine', name: 'Travertine', icon: '🪨', unit: 'blocks' },
    { key: 'glass', name: 'Glass', icon: '🔮', unit: 'sheets' },
    { key: 'clay', name: 'Clay', icon: '🏺', unit: 'units' },
  ];

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
              Marketplace
            </h1>
            <p className="text-roman-marble-400">
              Purchase gladiators and supplies for your ludus
            </p>
          </div>
          <div className="flex items-center gap-2 bg-roman-marble-800 px-4 py-2 rounded-lg border border-roman-gold-600">
            <span className="text-2xl">🪙</span>
            <span className="font-roman text-2xl text-roman-gold-400">{gold}</span>
            <span className="text-roman-marble-400 text-sm">gold</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-2">
          <button
            onClick={() => setActiveTab('gladiators')}
            className={clsx(
              'px-6 py-3 font-roman uppercase tracking-wide rounded-t-lg transition-all',
              activeTab === 'gladiators'
                ? 'bg-roman-marble-800 text-roman-gold-400 border-t-2 border-x-2 border-roman-gold-600'
                : 'bg-roman-marble-900 text-roman-marble-400 hover:text-roman-marble-200'
            )}
          >
            ⚔️ Gladiators
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={clsx(
              'px-6 py-3 font-roman uppercase tracking-wide rounded-t-lg transition-all',
              activeTab === 'resources'
                ? 'bg-roman-marble-800 text-roman-gold-400 border-t-2 border-x-2 border-roman-gold-600'
                : 'bg-roman-marble-900 text-roman-marble-400 hover:text-roman-marble-200'
            )}
          >
            📦 Resources
          </button>
        </motion.div>

        {/* Content */}
        {activeTab === 'gladiators' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Gladiator List */}
            <div className="col-span-2 space-y-3">
              {marketPool.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-roman-marble-400">No gladiators available. Check back tomorrow.</p>
                  </CardContent>
                </Card>
              ) : (
                marketPool.map((gladiator) => (
                  <GladiatorCard
                    key={gladiator.id}
                    gladiator={gladiator}
                    isSelected={selectedGladiator?.id === gladiator.id}
                    canAfford={gold >= gladiator.purchasePrice}
                    onClick={() => setSelectedGladiator(gladiator)}
                    onBuy={() => handleBuyGladiator(gladiator)}
                  />
                ))
              )}
            </div>

            {/* Selected Gladiator Details */}
            <div>
              {selectedGladiator ? (
                <GladiatorDetails
                  gladiator={selectedGladiator}
                  canAfford={gold >= selectedGladiator.purchasePrice}
                  onBuy={() => handleBuyGladiator(selectedGladiator)}
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <p className="text-roman-marble-500">
                      Select a gladiator to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-2 gap-4">
            {resourceInfo.map((resource) => (
              <Card key={resource.key}>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{resource.icon}</span>
                      <div>
                        <div className="font-roman text-lg text-roman-marble-100">{resource.name}</div>
                        <div className="text-sm text-roman-marble-400">
                          Current stock: <span className="text-roman-gold-400">{resources[resource.key]}</span> {resource.unit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-roman-gold-400 font-roman text-lg">
                        {marketPrices[resource.key].toFixed(1)}g
                      </div>
                      <div className="text-xs text-roman-marble-500">per unit</div>
                    </div>
                  </div>

                  {/* Amount selector */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setResourceAmounts(prev => ({
                        ...prev,
                        [resource.key]: Math.max(1, prev[resource.key] - 5)
                      }))}
                      className="w-8 h-8 bg-roman-marble-700 rounded hover:bg-roman-marble-600 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={resourceAmounts[resource.key]}
                      onChange={(e) => setResourceAmounts(prev => ({
                        ...prev,
                        [resource.key]: Math.max(1, parseInt(e.target.value) || 1)
                      }))}
                      className="w-20 text-center bg-roman-marble-800 border border-roman-marble-600 rounded py-1"
                    />
                    <button
                      onClick={() => setResourceAmounts(prev => ({
                        ...prev,
                        [resource.key]: prev[resource.key] + 5
                      }))}
                      className="w-8 h-8 bg-roman-marble-700 rounded hover:bg-roman-marble-600 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Buy/Sell buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="gold"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleBuyResource(resource.key)}
                      disabled={gold < Math.round(marketPrices[resource.key] * resourceAmounts[resource.key])}
                    >
                      Buy ({Math.round(marketPrices[resource.key] * resourceAmounts[resource.key])}g)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSellResource(resource.key)}
                      disabled={resources[resource.key] < resourceAmounts[resource.key]}
                    >
                      Sell ({Math.round(marketPrices[resource.key] * resourceAmounts[resource.key] * 0.7)}g)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

// Gladiator Card Component
interface GladiatorCardProps {
  gladiator: Gladiator;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
  onBuy: () => void;
}

const GladiatorCard: React.FC<GladiatorCardProps> = ({
  gladiator,
  isSelected,
  canAfford,
  onClick,
  onBuy,
}) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];
  const originData = GLADIATOR_ORIGINS[gladiator.origin];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={clsx(
        'card-roman cursor-pointer transition-all',
        isSelected && 'ring-2 ring-roman-gold-500'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Class Icon */}
        <div className="text-4xl w-16 h-16 flex items-center justify-center bg-roman-marble-700 rounded-lg">
          {classData.icon}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-roman text-lg text-roman-marble-100">{gladiator.name}</span>
            <span className="text-xs px-2 py-0.5 bg-roman-marble-700 rounded text-roman-marble-300">
              Lv.{gladiator.level}
            </span>
          </div>
          <div className="text-sm text-roman-marble-400">
            {classData.name} • {originData.name}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-roman-marble-500">
            <span>STR: {gladiator.stats.strength}</span>
            <span>AGI: {gladiator.stats.agility}</span>
            <span>DEX: {gladiator.stats.dexterity}</span>
          </div>
        </div>

        {/* Price & Buy */}
        <div className="text-right">
          <div className={clsx(
            'font-roman text-xl',
            canAfford ? 'text-roman-gold-400' : 'text-roman-crimson-500'
          )}>
            {gladiator.purchasePrice}g
          </div>
          <Button
            variant={canAfford ? 'gold' : 'ghost'}
            size="sm"
            onClick={(e) => { e.stopPropagation(); onBuy(); }}
            disabled={!canAfford}
            className="mt-2"
          >
            {canAfford ? 'Buy' : 'Cannot Afford'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Gladiator Details Panel
interface GladiatorDetailsProps {
  gladiator: Gladiator;
  canAfford: boolean;
  onBuy: () => void;
}

const GladiatorDetails: React.FC<GladiatorDetailsProps> = ({
  gladiator,
  canAfford,
  onBuy,
}) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];
  const originData = GLADIATOR_ORIGINS[gladiator.origin];

  return (
    <Card variant="gold">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{classData.icon}</span>
          <div>
            <CardTitle>{gladiator.name}</CardTitle>
            <div className="text-sm text-roman-marble-400">
              Level {gladiator.level} {classData.name}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Origin */}
        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-1">Origin</div>
          <div className="text-roman-marble-200">{originData.name}</div>
          <div className="text-xs text-roman-marble-400">{originData.description}</div>
        </div>

        {/* Stats */}
        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-2">Stats</div>
          <div className="space-y-2">
            <StatBar label="Strength" value={gladiator.stats.strength} />
            <StatBar label="Agility" value={gladiator.stats.agility} />
            <StatBar label="Dexterity" value={gladiator.stats.dexterity} />
            <StatBar label="Endurance" value={gladiator.stats.endurance} />
            <StatBar label="Constitution" value={gladiator.stats.constitution} />
          </div>
        </div>

        {/* Combat Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-roman-marble-500">HP</div>
            <div className="text-roman-marble-200">{gladiator.maxHP}</div>
          </div>
          <div>
            <div className="text-roman-marble-500">Stamina</div>
            <div className="text-roman-marble-200">{gladiator.maxStamina}</div>
          </div>
          <div>
            <div className="text-roman-marble-500">Morale</div>
            <div className="text-roman-marble-200">{(gladiator.morale * 100).toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-roman-marble-500">Obedience</div>
            <div className="text-roman-marble-200">{gladiator.obedience}</div>
          </div>
        </div>

        {/* Class Info */}
        <div>
          <div className="text-xs text-roman-marble-500 uppercase mb-1">Equipment</div>
          <div className="text-sm text-roman-marble-300">
            {classData.primaryWeapon}
            {classData.secondaryWeapon && ` + ${classData.secondaryWeapon}`}
          </div>
          <div className="text-xs text-roman-marble-400 mt-1">
            {classData.armor}
          </div>
        </div>

        {/* Strengths/Weaknesses */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-health-high">+ {classData.tacticalStrength}</div>
          </div>
          <div>
            <div className="text-health-low">- {classData.tacticalWeakness}</div>
          </div>
        </div>

        {/* Price */}
        <div className="divider-roman" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-roman-marble-500">Price</div>
            <div className={clsx(
              'font-roman text-2xl',
              canAfford ? 'text-roman-gold-400' : 'text-roman-crimson-500'
            )}>
              {gladiator.purchasePrice}g
            </div>
          </div>
          <Button
            variant={canAfford ? 'gold' : 'crimson'}
            size="lg"
            onClick={onBuy}
            disabled={!canAfford}
          >
            {canAfford ? 'Purchase' : 'Insufficient Gold'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Stat Bar Component
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
