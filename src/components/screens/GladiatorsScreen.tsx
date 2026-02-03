import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { selectGladiator, sellGladiator, setTraining, setResting } from '@features/gladiators/gladiatorsSlice';
import { setScreen } from '@features/game/gameSlice';
import { addGold } from '@features/player/playerSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar, Modal } from '@components/ui';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { calculateSellValue } from '@utils/gladiatorGenerator';
import type { Gladiator } from '@/types';
import { clsx } from 'clsx';

export const GladiatorsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roster, selectedGladiatorId } = useAppSelector(state => state.gladiators);
  const { currentDay } = useAppSelector(state => state.game);
  
  const [showSellModal, setShowSellModal] = useState(false);
  const [gladiatorToSell, setGladiatorToSell] = useState<Gladiator | null>(null);

  const selectedGladiator = roster.find(g => g.id === selectedGladiatorId);

  const handleSelect = (gladiator: Gladiator) => {
    dispatch(selectGladiator(gladiator.id));
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
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
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
              Gladiator Roster
            </h1>
            <p className="text-roman-marble-400">
              {roster.length} fighter{roster.length !== 1 ? 's' : ''} in your ludus
            </p>
          </div>
        </motion.div>

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
          <div className="grid grid-cols-3 gap-6">
            {/* Roster List */}
            <motion.div variants={itemVariants} className="col-span-2 space-y-3">
              {roster.map((gladiator) => (
                <RosterCard
                  key={gladiator.id}
                  gladiator={gladiator}
                  isSelected={selectedGladiatorId === gladiator.id}
                  onClick={() => handleSelect(gladiator)}
                />
              ))}
            </motion.div>

            {/* Selected Gladiator Details */}
            <motion.div variants={itemVariants}>
              {selectedGladiator ? (
                <GladiatorDetailPanel
                  gladiator={selectedGladiator}
                  onSell={() => handleSellClick(selectedGladiator)}
                  onToggleTraining={() => handleToggleTraining(selectedGladiator)}
                  onToggleResting={() => handleToggleResting(selectedGladiator)}
                />
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
      </motion.div>
    </MainLayout>
  );
};

// Roster Card Component
interface RosterCardProps {
  gladiator: Gladiator;
  isSelected: boolean;
  onClick: () => void;
}

const RosterCard: React.FC<RosterCardProps> = ({ gladiator, isSelected, onClick }) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  const getStatusBadge = () => {
    if (gladiator.isInjured) return { text: 'Injured', color: 'bg-roman-crimson-600' };
    if (gladiator.isTraining) return { text: 'Training', color: 'bg-roman-bronze-600' };
    if (gladiator.isResting) return { text: 'Resting', color: 'bg-stamina-high' };
    return { text: 'Ready', color: 'bg-health-high' };
  };

  const status = getStatusBadge();

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
            <span className={clsx('text-xs px-2 py-0.5 rounded text-white', status.color)}>
              {status.text}
            </span>
          </div>
          <div className="text-sm text-roman-marble-400 mb-2">
            {classData.name} • {gladiator.wins}W / {gladiator.losses}L
          </div>
          
          {/* Health & Stamina bars */}
          <div className="flex gap-4">
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

        {/* Fame & Stats */}
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-1">
            <span className="text-sm">⭐</span>
            <span className="text-roman-gold-400">{gladiator.fame}</span>
          </div>
          <div className="text-xs text-roman-marble-500">
            Morale: {Math.round(gladiator.morale * 100)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Detail Panel Component
interface GladiatorDetailPanelProps {
  gladiator: Gladiator;
  onSell: () => void;
  onToggleTraining: () => void;
  onToggleResting: () => void;
}

const GladiatorDetailPanel: React.FC<GladiatorDetailPanelProps> = ({
  gladiator,
  onSell,
  onToggleTraining,
  onToggleResting,
}) => {
  const classData = GLADIATOR_CLASSES[gladiator.class];

  return (
    <Card variant="gold" className="sticky top-4">
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
        {/* Health & Stamina */}
        <div className="space-y-2">
          <ProgressBar
            value={gladiator.currentHP}
            max={gladiator.maxHP}
            variant="health"
            showLabel
            label="Health"
          />
          <ProgressBar
            value={gladiator.currentStamina}
            max={gladiator.maxStamina}
            variant="stamina"
            showLabel
            label="Stamina"
          />
        </div>

        {/* Experience */}
        <div>
          <div className="flex justify-between text-xs text-roman-marble-400 mb-1">
            <span>Experience</span>
            <span>{gladiator.experience} / {gladiator.level * 100}</span>
          </div>
          <ProgressBar
            value={gladiator.experience}
            max={gladiator.level * 100}
            variant="gold"
            size="sm"
          />
        </div>

        {/* Stats */}
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

        {/* Combat Record */}
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

        {/* Actions */}
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
            variant="crimson"
            className="w-full"
            onClick={onSell}
          >
            💰 Sell ({calculateSellValue(gladiator)}g)
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
