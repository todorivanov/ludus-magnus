import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { createCharacterWithPath } from '@store/slices/playerSlice';
import { CharacterClass } from '@/types/game.types';
import { StoryPath, GladiatorOrigin, LanistaOrigin, ExplorerOrigin, CharacterOrigin } from '@/types/state.types';

// Character classes with path-specific recommendations
const CHARACTER_CLASSES: Array<{
  id: CharacterClass;
  name: string;
  description: string;
  recommendedFor: StoryPath[];
}> = [
  { 
    id: 'WARRIOR', 
    name: 'Warrior', 
    description: 'Balanced fighter with strong offense', 
    recommendedFor: ['gladiator', 'lanista', 'explorer'] 
  },
  { 
    id: 'TANK', 
    name: 'Tank', 
    description: 'High defense, protects allies', 
    recommendedFor: ['gladiator', 'lanista'] 
  },
  { 
    id: 'BALANCED', 
    name: 'Balanced', 
    description: 'Jack of all trades', 
    recommendedFor: ['gladiator', 'lanista', 'explorer'] 
  },
  { 
    id: 'MAGE', 
    name: 'Mage', 
    description: 'Powerful magic attacks', 
    recommendedFor: ['explorer'] 
  },
  { 
    id: 'ASSASSIN', 
    name: 'Assassin', 
    description: 'Fast and deadly', 
    recommendedFor: ['gladiator', 'explorer'] 
  },
  { 
    id: 'BRAWLER', 
    name: 'Brawler', 
    description: 'Raw power and resilience', 
    recommendedFor: ['gladiator', 'lanista'] 
  },
];

// Story paths with lore (see lore folder for full details)
const STORY_PATHS = [
  {
    id: 'gladiator' as StoryPath,
    name: 'The Gladiator',
    subtitle: 'The Chain Breaker',
    icon: '⚔️',
    description: 'Fight for survival, earn your freedom, and rise from the blood-soaked sands of the arena.',
    theme: 'Survival, Grit, and the Price of Liberty',
    startingStatus: 'Slave (Debt: 5000 Denarii)',
    location: 'The Ludus of Batiatus (Capua) or The Pit of Philippopolis (Thrace)',
  },
  {
    id: 'lanista' as StoryPath,
    name: 'The Lanista',
    subtitle: 'The Architect of Glory',
    icon: '🏛️',
    description: 'Manage your ludus, train gladiators, and build an empire of blood and gold.',
    theme: 'Management, Ambition, and the Burden of Command',
    startingStatus: 'Owner of a Ludus',
    location: 'The Ruins of Philippopolis (Thrace) or The Slums of Capua',
  },
  {
    id: 'explorer' as StoryPath,
    name: 'The Explorer',
    subtitle: 'The Hunter of Myths',
    icon: '🗺️',
    description: 'Travel the frontiers, hunt beasts, discover artifacts, and choose your own destiny.',
    theme: 'Freedom, Discovery, and the Choice of Legacy',
    startingStatus: 'Free Agent (Mobile Caravan)',
    location: 'The Rhodope Mountains (Thrace) → The World Map',
  },
];

// Origins for each path (see lore/Path X Design.md for details)
const GLADIATOR_ORIGINS = [
  {
    id: 'thracian_veteran' as GladiatorOrigin,
    name: 'The Thracian Veteran',
    subtitle: 'The Soldier',
    description: 'A former auxiliary from the Hemus Mountains, betrayed and sold into slavery.',
    stats: '+2 Strength, +1 Discipline',
    uniqueItem: 'Rusted Legionary Ring',
    quest: 'Hunt down the Centurion who sold you',
  },
  {
    id: 'disgraced_noble' as GladiatorOrigin,
    name: 'The Disgraced Noble',
    subtitle: 'The Politician',
    description: 'A patrician who backed the wrong Emperor, stripped of rank and enslaved.',
    stats: '+2 Charisma, +1 Intelligence',
    uniqueItem: 'Hidden Signet Ring',
    quest: 'Reclaim your family estate in Capua',
  },
  {
    id: 'barbarian_prisoner' as GladiatorOrigin,
    name: 'The Barbarian Prisoner',
    subtitle: 'The Beast',
    description: 'A warrior from beyond the Danube who knows only how to kill.',
    stats: '+3 Constitution, -1 Charisma',
    uniqueItem: 'Wolf Pelt',
    quest: 'Earn enough gold to buy your tribe\'s freedom',
  },
];

const LANISTA_ORIGINS = [
  {
    id: 'the_heir' as LanistaOrigin,
    name: 'The Heir',
    subtitle: 'The Legacy',
    description: 'Your father was a legendary Lanista, but died leaving massive debts.',
    stats: 'Large ruined Ludus (Level 3, 20% condition)',
    uniqueItem: 'The Iron Key of the Ludus',
    bonus: 'Ancestral Doctore (Level 10 Trainer)',
    startingGold: 500,
  },
  {
    id: 'the_merchant' as LanistaOrigin,
    name: 'The Merchant',
    subtitle: 'The Investor',
    description: 'You made a fortune trading grain and oil. You see flesh as just another commodity.',
    stats: 'High Wealth, Zero Dignitas',
    uniqueItem: 'The Scales of Mercury',
    bonus: '20% discount on food and basic slaves',
    startingGold: 10000,
  },
  {
    id: 'the_veteran' as LanistaOrigin,
    name: 'The Retired Champion',
    subtitle: 'The Mentor',
    description: 'A former Primus who earned the Rudis. You know fighting, not business.',
    stats: 'High Dignitas, Low Gold',
    uniqueItem: 'Your Old Rudis',
    bonus: 'All gladiators gain +10% XP in training',
    startingGold: 2000,
  },
];

const EXPLORER_ORIGINS = [
  {
    id: 'the_venator' as ExplorerOrigin,
    name: 'The Venator',
    subtitle: 'The Beast Master',
    description: 'You supplied the Colosseum with exotic beasts. Now, you hunt the monsters of legend.',
    stats: 'Iron Cage Wagon + Tamed Wolf',
    uniqueItem: 'The Hunter\'s Whistle',
    bonus: 'Capture beasts instead of hiring gladiators',
    startingGold: 1000,
  },
  {
    id: 'the_merchant_prince' as ExplorerOrigin,
    name: 'The Merchant Prince',
    subtitle: 'The Trader',
    description: 'A wealthy exile traveling with a private retinue. You fight for profit, not glory.',
    stats: 'Luxury Carriage (Passive Morale regen)',
    uniqueItem: 'The Heavy Silver (1937 100 Leva)',
    bonus: 'Diplomacy and Trade focus',
    startingGold: 5000,
  },
  {
    id: 'the_wandering_lanista' as ExplorerOrigin,
    name: 'The Wandering Lanista',
    subtitle: 'The Mobile Trainer',
    description: 'Your Ludus burned down, but your spirit didn\'t. You train fighters in the mud.',
    stats: '3 Rookie Gladiators + Training Wagon',
    uniqueItem: 'The Ancient Map',
    bonus: 'Units level up faster than anyone else',
    startingGold: 1000,
  },
];

type Step = 'intro' | 'path' | 'origin' | 'class' | 'name';

const CharacterCreation: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [name, setName] = useState('');
  const [selectedPath, setSelectedPath] = useState<StoryPath | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<CharacterOrigin | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | ''>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (!name.trim() || !selectedPath || !selectedOrigin || !selectedClass) {
      alert('Please complete all steps');
      return;
    }

    dispatch(
      createCharacterWithPath({
        name: name.trim(),
        class: selectedClass as CharacterClass,
        path: selectedPath,
        origin: selectedOrigin,
      })
    );
    
    navigate('/title');
  };

  const getOrigins = () => {
    if (selectedPath === 'gladiator') return GLADIATOR_ORIGINS;
    if (selectedPath === 'lanista') return LANISTA_ORIGINS;
    if (selectedPath === 'explorer') return EXPLORER_ORIGINS;
    return [];
  };

  const getRecommendedClasses = () => {
    if (!selectedPath) return CHARACTER_CLASSES;
    return CHARACTER_CLASSES.filter((c) => c.recommendedFor.includes(selectedPath));
  };

  // Intro Screen
  if (step === 'intro') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-4xl p-8">
          <h1 className="mb-4 text-center font-gaming text-5xl font-bold text-primary-400">
            Ludus Magnus: Reborn
          </h1>
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-200">
            The Chronicle of the Iron Year
          </h2>
          <p className="mb-8 text-center text-xl text-gray-400">193 AD - The Year of the Five Emperors</p>

          <div className="mb-8 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6">
            <h3 className="mb-4 text-2xl font-bold text-warning-400">⚠️ Historical Context</h3>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong className="text-white">December 31, 192 AD:</strong> Emperor Commodus is
                strangled. The Golden Age ends.
              </p>
              <p>
                <strong className="text-white">March 28, 193 AD:</strong> Pertinax is assassinated by
                mutinous guards.
              </p>
              <p>
                <strong className="text-white">The Shameful Auction:</strong> The Praetorian Guard
                sells the Empire to Didius Julianus.
              </p>
              <p>
                <strong className="text-white">April 9, 193 AD:</strong> Septimius Severus is hailed
                Emperor by his troops.
              </p>
              <p className="pt-2 text-lg font-bold text-primary-400">
                "When the Wolf fights the Lion, the Jackals feast."
              </p>
            </div>
          </div>

          <p className="mb-6 text-center text-lg text-gray-300">
            You stand at the edge of chaos. The Empire burns, and blood fills the arenas.
            <br />
            <strong className="text-primary-400">Choose your path through history...</strong>
          </p>

          <button
            onClick={() => setStep('path')}
            className="btn-primary w-full py-4 text-xl font-bold"
          >
            Begin Your Chronicle
          </button>
        </div>
      </div>
    );
  }

  // Path Selection
  if (step === 'path') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-6xl p-8">
          <h1 className="mb-2 text-center font-gaming text-4xl font-bold text-primary-400">
            Choose Your Path
          </h1>
          <p className="mb-8 text-center text-lg text-gray-400">
            Three roads diverge in the blood-soaked sands of history...
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {STORY_PATHS.map((path) => (
              <button
                key={path.id}
                onClick={() => {
                  setSelectedPath(path.id);
                  setStep('origin');
                }}
                className="group relative overflow-hidden rounded-lg border-2 border-gray-600 p-6 text-left transition-all hover:border-primary-500 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-3 text-6xl">{path.icon}</div>
                  <h3 className="mb-1 text-2xl font-bold text-white">{path.name}</h3>
                  <p className="mb-3 text-sm font-semibold text-primary-400">{path.subtitle}</p>
                  <p className="mb-4 text-sm text-gray-300">{path.description}</p>
                  <div className="space-y-2 text-xs text-gray-400">
                    <p>
                      <strong className="text-gray-300">Theme:</strong> {path.theme}
                    </p>
                    <p>
                      <strong className="text-gray-300">Status:</strong> {path.startingStatus}
                    </p>
                    <p>
                      <strong className="text-gray-300">Location:</strong> {path.location}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('intro')}
            className="btn-secondary mt-6 w-full py-3"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Origin Selection
  if (step === 'origin') {
    const origins = getOrigins();
    const currentPath = STORY_PATHS.find((p) => p.id === selectedPath);

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-6xl p-8">
          <h1 className="mb-2 text-center font-gaming text-4xl font-bold text-primary-400">
            Choose Your Origin
          </h1>
          <p className="mb-2 text-center text-xl text-gray-300">
            {currentPath?.name} - {currentPath?.subtitle}
          </p>
          <p className="mb-8 text-center text-gray-400">
            Every warrior has a beginning. What is yours?
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {origins.map((origin) => (
              <button
                key={origin.id}
                onClick={() => {
                  setSelectedOrigin(origin.id);
                  setStep('class');
                }}
                className="group relative overflow-hidden rounded-lg border-2 border-gray-600 p-6 text-left transition-all hover:border-primary-500 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <h3 className="mb-1 text-xl font-bold text-white">{origin.name}</h3>
                  <p className="mb-3 text-sm font-semibold text-primary-400">{origin.subtitle}</p>
                  <p className="mb-4 text-sm text-gray-300">{origin.description}</p>
                  <div className="space-y-2 text-xs text-gray-400">
                    <p>
                      <strong className="text-success-400">Stats:</strong> {origin.stats}
                    </p>
                    <p>
                      <strong className="text-warning-400">Item:</strong> {origin.uniqueItem}
                    </p>
                    {'bonus' in origin && (
                      <p>
                        <strong className="text-blue-400">Bonus:</strong> {origin.bonus}
                      </p>
                    )}
                    {'quest' in origin && (
                      <p>
                        <strong className="text-danger-400">Quest:</strong> {origin.quest}
                      </p>
                    )}
                    {'startingGold' in origin && (
                      <p>
                        <strong className="text-warning-400">Gold:</strong> {origin.startingGold}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('path')}
            className="btn-secondary mt-6 w-full py-3"
          >
            ← Back to Paths
          </button>
        </div>
      </div>
    );
  }

  // Class Selection
  if (step === 'class') {
    const recommendedClasses = getRecommendedClasses();
    const currentPath = STORY_PATHS.find((p) => p.id === selectedPath);

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-6xl p-8">
          <h1 className="mb-2 text-center font-gaming text-4xl font-bold text-primary-400">
            Choose Your Fighting Style
          </h1>
          <p className="mb-2 text-center text-xl text-gray-300">
            {currentPath?.name}
          </p>
          <p className="mb-8 text-center text-gray-400">
            How will you face the challenges ahead?
          </p>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-300">
              Recommended for {currentPath?.name}:
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {recommendedClasses.map((charClass) => (
                <button
                  key={charClass.id}
                  onClick={() => {
                    setSelectedClass(charClass.id);
                    setStep('name');
                  }}
                  className="rounded-lg border-2 border-primary-500/50 bg-primary-500/10 p-4 text-left transition-all hover:border-primary-500 hover:bg-primary-500/20"
                >
                  <h3 className="mb-1 text-xl font-bold text-white">{charClass.name}</h3>
                  <p className="text-sm text-gray-400">{charClass.description}</p>
                  <span className="mt-2 inline-block rounded bg-primary-500/20 px-2 py-1 text-xs text-primary-400">
                    ⭐ Recommended
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-300">All Classes:</h3>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {CHARACTER_CLASSES.filter((c) => !c.recommendedFor.includes(selectedPath!)).map(
                (charClass) => (
                  <button
                    key={charClass.id}
                    onClick={() => {
                      setSelectedClass(charClass.id);
                      setStep('name');
                    }}
                    className="rounded-lg border-2 border-gray-600 p-4 text-left transition-all hover:border-primary-500/50"
                  >
                    <h3 className="mb-1 text-lg font-bold text-white">{charClass.name}</h3>
                    <p className="text-xs text-gray-400">{charClass.description}</p>
                  </button>
                )
              )}
            </div>
          </div>

          <button
            onClick={() => setStep('origin')}
            className="btn-secondary mt-6 w-full py-3"
          >
            ← Back to Origins
          </button>
        </div>
      </div>
    );
  }

  // Name Input (Final Step)
  if (step === 'name') {
    const currentPath = STORY_PATHS.find((p) => p.id === selectedPath);
    const currentOrigin = getOrigins().find((o) => o.id === selectedOrigin);
    const currentClass = CHARACTER_CLASSES.find((c) => c.id === selectedClass);

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-4xl p-8">
          <h1 className="mb-2 text-center font-gaming text-4xl font-bold text-primary-400">
            Name Your Character
          </h1>
          <p className="mb-8 text-center text-lg text-gray-400">
            History will remember this name in blood and glory...
          </p>

          {/* Summary */}
          <div className="mb-6 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6">
            <h3 className="mb-4 text-xl font-bold text-white">Your Choice:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Path</p>
                <p className="text-lg font-bold text-primary-400">
                  {currentPath?.icon} {currentPath?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Origin</p>
                <p className="text-lg font-bold text-success-400">{currentOrigin?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Class</p>
                <p className="text-lg font-bold text-warning-400">{currentClass?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Starting Gold</p>
                <p className="text-lg font-bold text-warning-400">
                  {selectedPath === 'gladiator' && '0 (In Debt)'}
                  {selectedPath === 'lanista' &&
                    selectedOrigin === 'the_merchant' &&
                    '10,000'}
                  {selectedPath === 'lanista' &&
                    selectedOrigin === 'the_veteran' &&
                    '2,000'}
                  {selectedPath === 'lanista' &&
                    selectedOrigin === 'the_heir' &&
                    '500'}
                  {selectedPath === 'explorer' &&
                    selectedOrigin === 'the_merchant_prince' &&
                    '5,000'}
                  {selectedPath === 'explorer' &&
                    selectedOrigin !== 'the_merchant_prince' &&
                    '1,000'}
                </p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-lg font-semibold text-gray-300">
              Enter Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What shall history call you?"
              className="input-field text-2xl"
              maxLength={30}
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('class')}
              className="btn-secondary w-1/3 py-3"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="btn-primary w-2/3 py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⚔️ Enter the Arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CharacterCreation;
