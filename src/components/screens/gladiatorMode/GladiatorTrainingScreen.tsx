import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import {
  addExperience, updatePlayerStats, healPlayer, setPlayerFatigue,
  adjustDominusFavor, markTrainedThisMonth, spendSkillPoint,
} from '@features/gladiatorMode/gladiatorModeSlice';
import type { GladiatorStats } from '@/types';
import { Button, Card, CardContent, Modal } from '@components/ui';
import { GladiatorLayout } from '@components/layout/GladiatorLayout';
import { clsx } from 'clsx';

interface TrainingOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseXP: number;
  statGains: { stat: string; min: number; max: number }[];
  fatigueGain: number;
  injuryRisk: number;
}

const TRAINING_OPTIONS: TrainingOption[] = [
  {
    id: 'palus_drill', name: 'Palus Drill', icon: '🪵',
    description: 'Strike the wooden post. Build muscle memory and power.',
    baseXP: 20, statGains: [{ stat: 'strength', min: 0, max: 2 }, { stat: 'dexterity', min: 0, max: 1 }],
    fatigueGain: 15, injuryRisk: 0.03,
  },
  {
    id: 'sparring', name: 'Sparring', icon: '⚔️',
    description: 'Fight another gladiator in practice. Real combat skills.',
    baseXP: 25, statGains: [{ stat: 'strength', min: 0, max: 1 }, { stat: 'dexterity', min: 0, max: 1 }, { stat: 'agility', min: 0, max: 1 }],
    fatigueGain: 20, injuryRisk: 0.08,
  },
  {
    id: 'endurance', name: 'Endurance Drills', icon: '🏃',
    description: 'Running, swimming, carrying weights. Build stamina.',
    baseXP: 18, statGains: [{ stat: 'endurance', min: 0, max: 2 }, { stat: 'constitution', min: 0, max: 1 }],
    fatigueGain: 25, injuryRisk: 0.02,
  },
  {
    id: 'agility', name: 'Agility Training', icon: '🌀',
    description: 'Dodge, weave, roll. Learn to avoid the blade.',
    baseXP: 18, statGains: [{ stat: 'agility', min: 0, max: 2 }, { stat: 'dexterity', min: 0, max: 1 }],
    fatigueGain: 15, injuryRisk: 0.04,
  },
  {
    id: 'strength', name: 'Strength Training', icon: '💪',
    description: 'Heavy stones, wrestling, raw power.',
    baseXP: 20, statGains: [{ stat: 'strength', min: 0, max: 2 }, { stat: 'constitution', min: 0, max: 1 }],
    fatigueGain: 20, injuryRisk: 0.05,
  },
  {
    id: 'tactics', name: 'Tactical Studies', icon: '📜',
    description: 'Study opponents, learn formations, plan your approach to combat.',
    baseXP: 18, statGains: [{ stat: 'dexterity', min: 0, max: 2 }, { stat: 'agility', min: 0, max: 1 }],
    fatigueGain: 8, injuryRisk: 0.01,
  },
  {
    id: 'weapon_mastery', name: 'Weapon Mastery', icon: '🗡️',
    description: 'Drill with your weapon of choice until it becomes an extension of your arm.',
    baseXP: 22, statGains: [{ stat: 'strength', min: 0, max: 1 }, { stat: 'dexterity', min: 0, max: 2 }],
    fatigueGain: 18, injuryRisk: 0.04,
  },
  {
    id: 'showmanship', name: 'Showmanship', icon: '🎭',
    description: 'Play to the crowd. Learn the theatrics of the arena.',
    baseXP: 15, statGains: [{ stat: 'dexterity', min: 0, max: 1 }, { stat: 'agility', min: 0, max: 1 }],
    fatigueGain: 10, injuryRisk: 0.01,
  },
];

export const GladiatorTrainingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gm = useAppSelector(state => state.gladiatorMode);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');

  const player = gm.playerGladiator;
  const currentOrder = gm.currentOrder;

  if (!player) return null;

  const isAssignedTraining = currentOrder?.type === 'train';
  const assignedRegimen = currentOrder?.trainingRegimen;

  const hasTrainedThisMonth = gm.trainedThisMonth ?? false;

  const handleTrain = (option: TrainingOption, isSneakTraining: boolean) => {
    if (hasTrainedThisMonth) return;

    let resultLines: string[] = [];

    // XP
    const xp = option.baseXP + Math.floor(Math.random() * 10);
    dispatch(addExperience(xp));
    resultLines.push(`Gained ${xp} XP from ${option.name}.`);

    // Stat gains
    option.statGains.forEach((sg) => {
      const gain = sg.min + Math.floor(Math.random() * (sg.max - sg.min + 1));
      if (gain > 0) {
        dispatch(updatePlayerStats({ [sg.stat]: gain }));
        resultLines.push(`+${gain} ${sg.stat}`);
      }
    });

    // Fatigue
    dispatch(setPlayerFatigue(Math.min(100, player.fatigue + option.fatigueGain)));
    resultLines.push(`Fatigue increased by ${option.fatigueGain}.`);

    // Injury risk
    if (Math.random() < option.injuryRisk) {
      const damage = 5 + Math.floor(Math.random() * 10);
      dispatch(healPlayer(-damage));
      resultLines.push(`Suffered a minor injury! (-${damage} HP)`);
    }

    // Sneak training consequences
    if (isSneakTraining) {
      if (Math.random() < 0.3) {
        dispatch(adjustDominusFavor(-5));
        resultLines.push('The doctore noticed your unauthorized training. Your dominus is displeased. (-5 favor)');
      } else {
        resultLines.push('You trained in secret without being caught.');
      }
    }

    dispatch(markTrainedThisMonth());
    setResultText(resultLines.join('\n'));
    setShowResult(true);
  };

  return (
    <GladiatorLayout>
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500 mb-1">Training Grounds</h1>
          <p className="text-sm text-roman-marble-400">
            {isAssignedTraining
              ? `The doctore has assigned you to ${assignedRegimen?.replace('_', ' ') || 'training'} this month.`
              : 'Train to improve your skills and prepare for the arena.'}
          </p>
        </div>

        {/* Current status */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-roman-marble-500">Level:</span>
                <span className="text-roman-marble-200 ml-1">{player.level}</span>
              </div>
              <div>
                <span className="text-roman-marble-500">XP:</span>
                <span className="text-roman-marble-200 ml-1">{player.experience}/{player.level * 100}</span>
              </div>
              <div>
                <span className="text-roman-marble-500">Fatigue:</span>
                <span className={clsx('ml-1', player.fatigue > 70 ? 'text-red-400' : player.fatigue > 40 ? 'text-yellow-400' : 'text-green-400')}>
                  {player.fatigue}/100
                </span>
              </div>
              <div>
                <span className="text-roman-marble-500">HP:</span>
                <span className="text-roman-marble-200 ml-1">{player.currentHP}/{player.maxHP}</span>
              </div>
              {player.skillPoints > 0 && (
                <div className="text-roman-gold-400">
                  {player.skillPoints} skill points available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skill Point Allocation */}
        {player.skillPoints > 0 && (
          <Card className="mb-4 ring-2 ring-roman-gold-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-roman text-lg text-roman-gold-500">Allocate Skill Points</h2>
                <span className="text-sm text-roman-gold-400 font-bold">
                  {player.skillPoints} points remaining
                </span>
              </div>
              <p className="text-sm text-roman-marble-400 mb-4">
                You have leveled up. Invest your skill points to grow stronger.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {(
                  [
                    { key: 'strength' as keyof GladiatorStats, label: 'Strength', abbr: 'STR', desc: 'Damage, shield power' },
                    { key: 'agility' as keyof GladiatorStats, label: 'Agility', abbr: 'AGI', desc: 'Evasion, movement' },
                    { key: 'dexterity' as keyof GladiatorStats, label: 'Dexterity', abbr: 'DEX', desc: 'Accuracy, crits' },
                    { key: 'endurance' as keyof GladiatorStats, label: 'Endurance', abbr: 'END', desc: 'Stamina, recovery' },
                    { key: 'constitution' as keyof GladiatorStats, label: 'Constitution', abbr: 'CON', desc: 'Health, toughness' },
                  ]
                ).map((stat) => (
                  <div key={stat.key} className="flex flex-col items-center p-3 bg-roman-marble-800 rounded">
                    <div className="text-xs text-roman-marble-500 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-roman-marble-100 mb-1">
                      {player.stats[stat.key]}
                    </div>
                    <div className="text-[10px] text-roman-marble-600 mb-2">{stat.desc}</div>
                    <Button
                      variant="gold"
                      size="sm"
                      disabled={player.skillPoints <= 0 || player.stats[stat.key] >= 100}
                      onClick={() => dispatch(spendSkillPoint(stat.key))}
                      className="w-full text-xs"
                    >
                      +1 {stat.abbr}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Training options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRAINING_OPTIONS.map((option) => {
            const isAssigned = isAssignedTraining && assignedRegimen === option.id;
            const isSneakTraining = isAssignedTraining && !isAssigned;

            return (
              <Card key={option.id} className={clsx(isAssigned && 'ring-2 ring-roman-gold-500')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-roman text-roman-marble-100">{option.name}</div>
                      {isAssigned && <span className="text-xs text-roman-gold-500">Assigned</span>}
                    </div>
                  </div>
                  <p className="text-xs text-roman-marble-400 mb-3">{option.description}</p>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Base XP</span>
                      <span className="text-green-400">+{option.baseXP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Stat gains</span>
                      <span className="text-roman-marble-300">
                        {option.statGains.map(sg => sg.stat.slice(0, 3).toUpperCase()).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Fatigue</span>
                      <span className="text-orange-400">+{option.fatigueGain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Injury risk</span>
                      <span className={option.injuryRisk > 0.05 ? 'text-red-400' : 'text-roman-marble-300'}>
                        {(option.injuryRisk * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <Button
                    variant={isAssigned ? 'gold' : 'ghost'}
                    size="sm"
                    className="w-full"
                    disabled={hasTrainedThisMonth || player.fatigue >= 90}
                    onClick={() => handleTrain(option, isSneakTraining)}
                  >
                    {isAssigned ? 'Train (Assigned)' : isSneakTraining ? 'Sneak Train (Risky)' : 'Train'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {hasTrainedThisMonth && (
          <div className="mt-4 text-center text-sm text-roman-marble-500 italic">
            You have completed your training for this month.
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResult && (
        <Modal isOpen={showResult} onClose={() => setShowResult(false)} title="Training Complete">
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
