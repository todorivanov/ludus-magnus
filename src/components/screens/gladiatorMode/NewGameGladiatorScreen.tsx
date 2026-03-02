import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '@app/hooks';
import { startNewGame, setScreen } from '@features/game/gameSlice';
import { initializeGladiatorMode } from '@features/gladiatorMode/gladiatorModeSlice';
import { Button, Card, CardContent } from '@components/ui';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import type { 
  Difficulty, GladiatorClass, GladiatorModeOrigin, GladiatorModeRegion, Gladiator 
} from '@/types';
import { clsx } from 'clsx';

type CreationStep = 'origin' | 'identity' | 'class' | 'stats' | 'confirm';

const ORIGINS: { id: GladiatorModeOrigin; name: string; subtitle: string; description: string; icon: string; statBonuses: Record<string, number>; traits: string[] }[] = [
  {
    id: 'pow',
    name: 'Prisoner of War',
    subtitle: 'Captured soldier',
    description: 'You were a warrior once, fighting for your people. Now you are spoils of conquest. Your military training gives you an edge, but your pride makes you dangerous to control.',
    icon: '⛓️',
    statBonuses: { strength: 8, constitution: 5, endurance: 2, agility: 0, dexterity: 0 },
    traits: ['Higher strength/constitution', 'Medium obedience', 'Bitter pride'],
  },
  {
    id: 'criminal',
    name: 'Criminal',
    subtitle: 'Condemned to the arena',
    description: 'Murder, theft, treason -- your crimes brought you here. The arena is your sentence and your chance at redemption. You answer to no code but survival.',
    icon: '🔗',
    statBonuses: { strength: 3, agility: 5, dexterity: 3, endurance: 2, constitution: 2 },
    traits: ['Balanced stats', 'Low obedience', 'Unpredictable'],
  },
  {
    id: 'volunteer',
    name: 'Volunteer (Auctoratus)',
    subtitle: 'Sold yourself for coin or glory',
    description: 'Debt, desperation, or a craving for glory drove you to the oath. You chose this life. You signed the contract. That makes you the most dangerous kind -- the willing.',
    icon: '📜',
    statBonuses: { strength: 2, agility: 2, dexterity: 3, endurance: 3, constitution: 0 },
    traits: ['Higher morale', 'Good obedience', 'Can negotiate'],
  },
  {
    id: 'slave',
    name: 'Slave',
    subtitle: 'Born into servitude',
    description: 'You have known nothing but chains. The ludus is just another master. But your obedience hides a mind that learns faster than any free man -- survival demands it.',
    icon: '🏺',
    statBonuses: { strength: 0, agility: 2, dexterity: 2, endurance: 3, constitution: 0 },
    traits: ['Highest obedience', 'Lowest starting stats', '+25% XP bonus'],
  },
];

const REGIONS: { id: GladiatorModeRegion; name: string; icon: string }[] = [
  { id: 'thrace', name: 'Thrace', icon: '🏔️' },
  { id: 'gaul', name: 'Gaul', icon: '🌲' },
  { id: 'germania', name: 'Germania', icon: '🐺' },
  { id: 'britannia', name: 'Britannia', icon: '🌧️' },
  { id: 'numidia', name: 'Numidia', icon: '🏜️' },
  { id: 'hispania', name: 'Hispania', icon: '🌅' },
  { id: 'greece', name: 'Greece', icon: '🏛️' },
  { id: 'rome', name: 'Rome', icon: '🦅' },
];

const DIFFICULTIES: { id: Difficulty; label: string; description: string }[] = [
  { id: 'easy', label: 'Novice', description: 'Crowd is merciful, dominus is fair' },
  { id: 'normal', label: 'Gladiator', description: 'The true arena experience' },
  { id: 'hard', label: 'Champion', description: 'The mob thirsts for blood' },
];

const CLASS_LIST = Object.values(GLADIATOR_CLASSES);

export const NewGameGladiatorScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<CreationStep>('origin');
  const [origin, setOrigin] = useState<GladiatorModeOrigin>('pow');
  const [name, setName] = useState('');
  const [region, setRegion] = useState<GladiatorModeRegion>('thrace');
  const [gladiatorClass, setGladiatorClass] = useState<GladiatorClass>('murmillo');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [bonusPoints, setBonusPoints] = useState(10);
  const [statAllocations, setStatAllocations] = useState({
    strength: 0, agility: 0, dexterity: 0, endurance: 0, constitution: 0,
  });

  const steps: CreationStep[] = ['origin', 'identity', 'class', 'stats', 'confirm'];
  const stepIndex = steps.indexOf(step);

  const originData = ORIGINS.find(o => o.id === origin)!;
  const classData = GLADIATOR_CLASSES[gladiatorClass];

  const getBaseStats = () => {
    const base = { ...classData.baseStats };
    const bonuses = originData.statBonuses;
    return {
      strength: base.strength + (bonuses.strength || 0),
      agility: base.agility + (bonuses.agility || 0),
      dexterity: base.dexterity + (bonuses.dexterity || 0),
      endurance: base.endurance + (bonuses.endurance || 0),
      constitution: base.constitution + (bonuses.constitution || 0),
    };
  };

  const getFinalStats = () => {
    const base = getBaseStats();
    return {
      strength: Math.min(100, base.strength + statAllocations.strength),
      agility: Math.min(100, base.agility + statAllocations.agility),
      dexterity: Math.min(100, base.dexterity + statAllocations.dexterity),
      endurance: Math.min(100, base.endurance + statAllocations.endurance),
      constitution: Math.min(100, base.constitution + statAllocations.constitution),
    };
  };

  const allocateStat = (stat: keyof typeof statAllocations, delta: number) => {
    const newValue = statAllocations[stat] + delta;
    if (newValue < 0) return;
    const newTotal = bonusPoints - delta;
    if (newTotal < 0) return;
    setStatAllocations({ ...statAllocations, [stat]: newValue });
    setBonusPoints(newTotal);
  };

  const resetAllocations = () => {
    setStatAllocations({ strength: 0, agility: 0, dexterity: 0, endurance: 0, constitution: 0 });
    setBonusPoints(10);
  };

  const handleNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      if (step === 'class') resetAllocations();
      setStep(steps[idx + 1]);
    }
  };

  const handleBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) {
      setStep(steps[idx - 1]);
    } else {
      dispatch(setScreen('modeSelect'));
    }
  };

  const canProceed = () => {
    if (step === 'identity') return name.trim().length > 0;
    return true;
  };

  const handleStartGame = () => {
    const finalStats = getFinalStats();
    const maxHP = 50 + Math.floor(finalStats.constitution * 1.5);
    const maxStamina = 30 + Math.floor(finalStats.endurance * 1.2);

    const baseMorale = origin === 'volunteer' ? 1.0 : origin === 'slave' ? 0.7 : origin === 'pow' ? 0.6 : 0.5;
    const baseObedience = origin === 'slave' ? 80 : origin === 'volunteer' ? 70 : origin === 'pow' ? 40 : 30;

    const gladiator: Gladiator = {
      id: uuidv4(),
      name: name.trim(),
      class: gladiatorClass,
      origin: origin === 'slave' ? 'pow' : origin,
      stats: finalStats,
      morale: baseMorale,
      fatigue: 0,
      obedience: baseObedience,
      currentHP: maxHP,
      maxHP,
      currentStamina: maxStamina,
      maxStamina,
      level: 1,
      experience: 0,
      skillPoints: 0,
      skills: [],
      age: origin === 'slave' ? 18 + Math.floor(Math.random() * 6) : 20 + Math.floor(Math.random() * 10),
      birthYear: 73 - 22,
      birthMonth: 1 + Math.floor(Math.random() * 12),
      careerStartYear: 73,
      careerStartMonth: 1,
      monthsOfService: 0,
      milestones: [],
      titles: [],
      injuries: [],
      fame: 0,
      purchasePrice: 100 + Math.floor(Math.random() * 100),
      wins: 0,
      losses: 0,
      kills: 0,
      isTraining: false,
      isResting: false,
      isInjured: false,
    };

    gladiator.birthYear = 73 - gladiator.age;

    dispatch(initializeGladiatorMode({
      gladiator,
      origin,
      region,
      difficulty,
    }));
    dispatch(startNewGame({ difficulty, gameMode: 'gladiator' }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 'origin':
        return (
          <div className="space-y-4">
            <h2 className="font-roman text-2xl text-roman-gold-500 text-center mb-2">Your Origin</h2>
            <p className="text-roman-marble-400 text-center text-sm mb-4">How did you end up in the arena?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ORIGINS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOrigin(o.id)}
                  className={clsx(
                    'text-left p-4 rounded border-2 transition-all',
                    origin === o.id
                      ? 'border-roman-gold-500 bg-roman-gold-500/10'
                      : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{o.icon}</span>
                    <div>
                      <div className="font-roman text-roman-marble-100">{o.name}</div>
                      <div className="text-xs text-roman-marble-500">{o.subtitle}</div>
                    </div>
                  </div>
                  <p className="text-xs text-roman-marble-400 mb-2">{o.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {o.traits.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-roman-marble-700 text-roman-marble-300">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-6">
            <h2 className="font-roman text-2xl text-roman-gold-500 text-center mb-2">Your Identity</h2>
            <div>
              <label className="block font-roman text-sm text-roman-gold-400 uppercase tracking-wide mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your gladiator name..."
                className="w-full px-4 py-3 bg-roman-marble-800 border border-roman-marble-600 rounded
                         text-roman-marble-100 placeholder-roman-marble-500
                         focus:outline-none focus:border-roman-gold-500 focus:ring-1 focus:ring-roman-gold-500
                         transition-colors"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block font-roman text-sm text-roman-gold-400 uppercase tracking-wide mb-2">
                Region of Origin
              </label>
              <div className="grid grid-cols-4 gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={clsx(
                      'p-3 rounded border-2 text-center transition-all',
                      region === r.id
                        ? 'border-roman-gold-500 bg-roman-gold-500/10'
                        : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
                    )}
                  >
                    <div className="text-xl mb-1">{r.icon}</div>
                    <div className="text-xs text-roman-marble-200">{r.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-roman text-sm text-roman-gold-400 uppercase tracking-wide mb-3">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={clsx(
                      'p-3 rounded border-2 text-center transition-all',
                      difficulty === d.id
                        ? 'border-roman-gold-500 bg-roman-gold-500/10'
                        : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
                    )}
                  >
                    <div className="font-roman text-sm text-roman-marble-100">{d.label}</div>
                    <div className="text-xs text-roman-marble-400">{d.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'class':
        return (
          <div className="space-y-4">
            <h2 className="font-roman text-2xl text-roman-gold-500 text-center mb-2">Fighting Style</h2>
            <p className="text-roman-marble-400 text-center text-sm mb-4">Choose how you will fight in the arena.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CLASS_LIST.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setGladiatorClass(c.id)}
                  className={clsx(
                    'p-3 rounded border-2 text-center transition-all',
                    gladiatorClass === c.id
                      ? 'border-roman-gold-500 bg-roman-gold-500/10'
                      : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
                  )}
                >
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="font-roman text-sm text-roman-marble-100">{c.name}</div>
                  <div className="text-xs text-roman-marble-500 mt-1">{c.primaryWeapon}</div>
                </button>
              ))}
            </div>
            {classData && (
              <div className="mt-4 p-4 bg-roman-marble-800 rounded border border-roman-marble-600">
                <div className="font-roman text-roman-gold-500 mb-1">{classData.name}</div>
                <p className="text-sm text-roman-marble-300 mb-3">{classData.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-roman-marble-500">Weapon:</span> <span className="text-roman-marble-200">{classData.primaryWeapon}</span></div>
                  <div><span className="text-roman-marble-500">Armor:</span> <span className="text-roman-marble-200">{classData.armor}</span></div>
                  <div><span className="text-roman-marble-500">Strength:</span> <span className="text-green-400">{classData.tacticalStrength}</span></div>
                  <div><span className="text-roman-marble-500">Weakness:</span> <span className="text-red-400">{classData.tacticalWeakness}</span></div>
                </div>
              </div>
            )}
          </div>
        );

      case 'stats':
        const baseStats = getBaseStats();
        const finalStats = getFinalStats();
        const statNames: (keyof typeof statAllocations)[] = ['strength', 'agility', 'dexterity', 'endurance', 'constitution'];
        const statLabels: Record<string, string> = {
          strength: 'Strength', agility: 'Agility', dexterity: 'Dexterity',
          endurance: 'Endurance', constitution: 'Constitution',
        };
        const statDescriptions: Record<string, string> = {
          strength: 'Damage, shield effectiveness',
          agility: 'Movement, evasion',
          dexterity: 'Accuracy, critical hits',
          endurance: 'Stamina, recovery',
          constitution: 'Health, injury resistance',
        };

        return (
          <div className="space-y-4">
            <h2 className="font-roman text-2xl text-roman-gold-500 text-center mb-2">Allocate Stats</h2>
            <p className="text-roman-marble-400 text-center text-sm">
              Distribute <span className="text-roman-gold-500 font-bold">{bonusPoints}</span> bonus points across your attributes.
            </p>
            <div className="space-y-3">
              {statNames.map((stat) => (
                <div key={stat} className="flex items-center gap-3">
                  <div className="w-28">
                    <div className="text-sm text-roman-marble-200">{statLabels[stat]}</div>
                    <div className="text-xs text-roman-marble-500">{statDescriptions[stat]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => allocateStat(stat, -1)}
                        disabled={statAllocations[stat] <= 0}
                        className="w-7 h-7 rounded bg-roman-marble-700 text-roman-marble-300 hover:bg-roman-marble-600 disabled:opacity-30 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <div className="flex-1 bg-roman-marble-800 rounded h-6 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-roman-gold-600/30 rounded"
                          style={{ width: `${finalStats[stat]}%` }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 bg-roman-gold-500/20 rounded"
                          style={{ width: `${baseStats[stat]}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                          <span className="text-roman-marble-300">{baseStats[stat]}</span>
                          {statAllocations[stat] > 0 && (
                            <span className="text-roman-gold-400"> +{statAllocations[stat]}</span>
                          )}
                          <span className="text-roman-marble-100 ml-1">= {finalStats[stat]}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => allocateStat(stat, 1)}
                        disabled={bonusPoints <= 0 || finalStats[stat] >= 100}
                        className="w-7 h-7 rounded bg-roman-marble-700 text-roman-marble-300 hover:bg-roman-marble-600 disabled:opacity-30 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={resetAllocations}
                className="text-xs text-roman-marble-500 hover:text-roman-gold-500 transition-colors"
              >
                Reset Allocations
              </button>
            </div>
          </div>
        );

      case 'confirm':
        const stats = getFinalStats();
        return (
          <div className="space-y-4">
            <h2 className="font-roman text-2xl text-roman-gold-500 text-center mb-4">Your Gladiator</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-roman-marble-800 rounded border border-roman-marble-600">
                <div className="text-xs text-roman-marble-500 uppercase mb-1">Name</div>
                <div className="font-roman text-lg text-roman-marble-100">{name}</div>
              </div>
              <div className="p-4 bg-roman-marble-800 rounded border border-roman-marble-600">
                <div className="text-xs text-roman-marble-500 uppercase mb-1">Origin</div>
                <div className="font-roman text-lg text-roman-marble-100">{originData.icon} {originData.name}</div>
              </div>
              <div className="p-4 bg-roman-marble-800 rounded border border-roman-marble-600">
                <div className="text-xs text-roman-marble-500 uppercase mb-1">Region</div>
                <div className="font-roman text-lg text-roman-marble-100">
                  {REGIONS.find(r => r.id === region)?.icon} {REGIONS.find(r => r.id === region)?.name}
                </div>
              </div>
              <div className="p-4 bg-roman-marble-800 rounded border border-roman-marble-600">
                <div className="text-xs text-roman-marble-500 uppercase mb-1">Fighting Style</div>
                <div className="font-roman text-lg text-roman-marble-100">{classData.icon} {classData.name}</div>
              </div>
            </div>
            <div className="p-4 bg-roman-marble-800 rounded border border-roman-marble-600">
              <div className="text-xs text-roman-marble-500 uppercase mb-2">Stats</div>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.entries(stats).map(([key, val]) => (
                  <div key={key}>
                    <div className="text-lg font-bold text-roman-gold-500">{val}</div>
                    <div className="text-xs text-roman-marble-400 capitalize">{key.slice(0, 3)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-roman-marble-400 italic">
              "Those who are about to die salute you."
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card variant="gold" className="p-6 sm:p-8">
          <CardContent>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    i <= stepIndex
                      ? 'bg-roman-gold-500 text-roman-marble-900'
                      : 'bg-roman-marble-700 text-roman-marble-400'
                  )}>
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={clsx(
                      'w-8 h-0.5',
                      i < stepIndex ? 'bg-roman-gold-500' : 'bg-roman-marble-700'
                    )} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="divider-roman my-6" />

            <div className="flex gap-4">
              <Button variant="ghost" size="lg" onClick={handleBack} className="flex-1">
                Back
              </Button>
              {step === 'confirm' ? (
                <Button variant="gold" size="lg" onClick={handleStartGame} className="flex-1">
                  Enter the Arena
                </Button>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1"
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
