# 📋 **LUDUS MAGNUS: REBORN - Comprehensive Project Setup Plan**

> **Version**: 2.0  
> **Created**: January 26, 2026  
> **Status**: In Development  
> **Based on**: New Game Concept - Gladiator Management RPG

---

## **Executive Summary**

This is a browser-based **gladiator management RPG** built with **React + TypeScript**. The game focuses on building and managing a ludus (gladiator school), training fighters, competing in tournaments, and exploring the ancient Roman world. The project features:

### **Core Game Concept**

**Ludus Magnus: Reborn** is a management/RPG hybrid where players build their gladiator empire through three distinct playing paths:

#### **1. Gladiator Path** ⚔️
- Start as a slave gladiator fighting for survival
- Win battles to earn reputation and eventually your freedom
- **After Freedom**: Choose to explore the world for quests OR build your own ludus from the ground up
- Experience the journey from prisoner to powerful lanista

#### **2. Lanista Path** 🏛️
- Begin as an established ludus owner with resources
- Recruit, train, and manage multiple gladiators
- Compete in tournaments to earn prizes and prestige
- **Dual Focus**: Manage your ludus operations AND explore the world for talent, equipment, and opportunities
- Balance economic management with strategic combat decisions

#### **3. Explorer Path** 🗺️
- Start as a free adventurer in the Roman world
- Participate in fights to earn money and reputation
- **Multiple Progression Options**:
  - Purchase land and build your own ludus
  - Continue as a mercenary fighter
  - Explore the world for quests and treasures
  - Mix combat, exploration, and eventual ludus management

### **Key Features**

- **Ludus Management System** - Build facilities, upgrade training grounds, manage finances
- **Gladiator Training** - Recruit fighters, assign training regimens, manage equipment and stats
- **Tournament System** - Enter arena battles with stakes, prizes, and crowd reputation
- **World Exploration** - Travel between cities, discover locations, complete quests
- **Economic Simulation** - Buy/sell land, invest in facilities, manage revenue streams
- **Character Progression** - Level up gladiators with skills, talents, and equipment
- **Story Campaigns** - Unique narrative paths for each playing style

### **Technical Architecture**

- **Modern React Stack** (React 18+ with TypeScript)
- **Utility-First Styling** (Tailwind CSS + custom SCSS)
- **Robust State Management** (Redux Toolkit for complex game state)
- **Modern Build System** (Vite 5)
- **Comprehensive Testing** (Vitest + Playwright)
- **Type-Safe Architecture** (TypeScript with strict mode)
- **Modular Component Architecture** (Management UI + Combat Systems + Exploration)

---

## **Game Design Overview** 🎮

### **Core Game Loop**

The game operates on multiple interconnected loops depending on the chosen path:

#### **Management Loop** (All Paths)
1. **Recruit/Train Gladiators** - Hire fighters, assign training programs
2. **Manage Resources** - Balance gold, food, equipment inventory
3. **Upgrade Facilities** - Improve ludus buildings (training grounds, barracks, medical wing)
4. **Enter Tournaments** - Select fighters, enter competitions
5. **Earn Rewards** - Win prizes, reputation, unlock new opportunities
6. **Reinvest** - Use earnings to improve ludus and gladiators

#### **Combat Loop**
1. **Select Fighter(s)** - Choose who fights (Gladiator path: yourself, Lanista path: your roster)
2. **Pre-Battle Prep** - Assign equipment, review opponent stats
3. **Tactical Combat** - Turn-based grid combat with positioning and skills
4. **Victory/Defeat** - Earn rewards or suffer consequences
5. **Post-Battle** - Heal injuries, repair equipment, review performance

#### **Exploration Loop**
1. **Choose Destination** - Travel between cities and regions
2. **Discover Locations** - Find new training grounds, markets, quest givers
3. **Complete Quests** - Story missions, side quests, random encounters
4. **Acquire Resources** - Find equipment, recruit talent, earn gold
5. **Unlock Content** - Open new regions, storylines, and opportunities

### **Playing Paths Deep Dive**

#### **Path 1: Gladiator (Rags to Riches)** ⚔️

**Starting Conditions:**
- Begin as a slave gladiator with minimal stats
- No gold or resources
- Restricted to assigned fights
- Cannot refuse battles

**Early Game (Survival Phase):**
- Fight for survival in mandatory arena battles
- Earn small rewards for victories
- Train stats between fights
- Build reputation with crowd and sponsors

**Mid Game (Freedom Phase):**
- Accumulate enough wins/reputation to earn freedom
- **Critical Decision Point**: Buy freedom or win it through special tournament
- Upon freedom, receive starting resources

**Late Game (Two Branches):**

**Branch A: World Explorer**
- Keep fighting as independent gladiator
- Accept contracts from various sponsors
- Travel the world for high-paying fights
- Accumulate wealth and legendary equipment
- Optional: Eventually purchase land and build ludus

**Branch B: Ludus Builder**
- Use earnings to purchase land
- Build first ludus facility
- Recruit first gladiators
- Transition to management gameplay
- Experience both sides (former slave becomes master)

**Unique Features:**
- First-person combat experience
- Strong narrative focus on freedom and identity
- Moral choices (treat your gladiators well vs. profit-focused)
- Special storyline tied to your former master

---

#### **Path 2: Lanista (Established Manager)** 🏛️

**Starting Conditions:**
- Begin with a small but functional ludus
- 3-5 starting gladiators (varied quality)
- Modest gold reserve (500-1000)
- Basic facilities (training ground, barracks)
- Access to local tournament circuit

**Core Gameplay:**

**Ludus Management:**
- **Roster Management**: 
  - Recruit gladiators from slave markets, free agents, or discover talents
  - Assign individual training programs (strength, speed, defense, skills)
  - Manage morale and loyalty
  - Decide retirement, sale, or release of fighters

- **Facility Management**:
  - Upgrade training grounds (improves stat gains)
  - Build medical wing (faster healing, lower death risk)
  - Construct armory (equipment bonuses, repair costs)
  - Add barracks (house more gladiators)
  - Build reputation hall (attract better recruits)

- **Financial Management**:
  - Balance income (tournament prizes, betting, sponsorships)
  - Manage expenses (food, salaries, equipment, repairs, taxes)
  - Invest in expansions vs. save for emergencies
  - Take loans for rapid expansion (with interest)

**Tournament System:**
- **Local Circuit**: Small prizes, low risk, good for training
- **Regional Championships**: Medium stakes, higher rewards
- **Imperial Games**: Massive prizes, extreme difficulty, champion gladiators only
- **Team Battles**: Enter multiple fighters, coordinate tactics
- **Special Events**: Themed tournaments with unique rules/rewards

**World Exploration:**
- Travel to other cities to:
  - Scout new talent at different markets
  - Purchase rare equipment
  - Enter prestigious tournaments
  - Complete quests (rescue captured gladiator, retrieve stolen equipment)
  - Establish satellite ludus locations

**Unique Features:**
- Strategic team composition
- Risk management (injuries can lose valuable fighters)
- Reputation system affects recruit quality and tournament invitations
- Political intrigue (rival lanistas, corrupt officials, noble patrons)
- Economic simulation depth

---

#### **Path 3: Explorer (Open World Freedom)** 🗺️

**Starting Conditions:**
- Begin as free person with modest resources (200-300 gold)
- Basic equipment (sword, leather armor)
- No ludus or permanent base
- Full world map unlocked from start

**Core Gameplay:**

**Mercenary Combat:**
- Accept fight contracts from various sources:
  - **Gladiator Arenas**: One-off exhibition matches
  - **Noble Patrons**: Private battles for entertainment
  - **Military Contracts**: Serve as arena trainer or demonstrator
  - **Underground Fights**: High risk, high reward illegal battles
- Choose your battles based on:
  - Payout vs. difficulty
  - Reputation gain/loss
  - Equipment rewards
  - Story implications

**World Exploration:**
- **15+ Cities/Regions**:
  - Rome (capital, biggest tournaments, highest prices)
  - Capua (famous gladiator schools)
  - Pompeii (wealthy patrons, exotic weapons)
  - Alexandria (Egyptian fighting styles, unique equipment)
  - Britannia (barbarian challenges, wilderness survival)
  - And more...

- **Random Encounters**:
  - Bandit ambushes (combat + looting)
  - Merchant caravans (trading opportunities)
  - Wandering gladiators (duel challenges)
  - Hidden locations (treasure, rare items)

**Quest System:**
- **Main Story Quests**: Uncover conspiracy, ancient artifacts, political intrigue
- **Side Quests**: Help NPCs, solve local problems, retrieve items
- **Reputation Quests**: Build standing with factions (Senators, Merchants, Military, Underground)
- **Exploration Quests**: Discover hidden locations, map unknown regions

**Ludus Building (Optional):**
- At any point, can:
  - Purchase land in various cities (prices vary)
  - Build ludus from scratch
  - Recruit first gladiators
  - Transition to partial management gameplay
- **Hybrid Gameplay**: Continue exploring + fighting while managing small ludus
- Can build multiple ludus locations in different cities

**Unique Features:**
- Maximum freedom and flexibility
- No forced path - every choice matters
- Can completely avoid ludus management if desired
- Rich world with deep lore and secrets
- Economic opportunities (trading, gambling, investments)
- Social system (make friends, rivals, enemies)

---

### **Shared Systems Across All Paths**

#### **Combat System**
- **Turn-Based Grid Combat** (9x9 tactical battlefield)
- **Positioning Matters**: Flanking, high ground, terrain effects
- **Skills & Abilities**: Class-based abilities with cooldowns
- **Equipment System**: Weapons, armor, accessories with stats/bonuses
- **Status Effects**: Bleed, burn, stun, poison, buffs/debuffs
- **Combo System**: Chain attacks for bonus damage
- **Crowd Reaction**: Affects morale and rewards

#### **Progression System**
- **Character Levels**: 1-20 with XP curve
- **Talent Trees**: 3 specialization trees per class (30+ total trees)
- **Skill System**: Unlockable abilities with upgrades
- **Equipment Tiers**: Common → Uncommon → Rare → Epic → Legendary
- **Reputation Tiers**: Unknown → Known → Famous → Legend
- **Class System**: 10 gladiator classes (Warrior, Tank, Assassin, Mage, Berserker, Paladin, Necromancer, Bruiser, Balanced, Glass Cannon)

#### **Economic System**
- **Gold**: Primary currency for purchases
- **Denarii**: Premium currency for rare items (optional, can earn in-game)
- **Trade Goods**: Buyable items that can be sold for profit in other cities
- **Betting**: Wager on yourself or others in tournaments
- **Investments**: Buy property, businesses, or ludus shares

#### **Save System**
- **Multiple Save Slots**: 3+ character saves
- **Auto-Save**: Automatic saves after battles/major events
- **Manual Save**: Save at any time (outside combat)
- **Cloud Save** (Future): Cross-device play
- **Import/Export**: Share saves as files

---

## **Technical Implementation Priorities**

Based on the three paths, the development needs to support:

1. **Core Combat Engine** - Used by all paths
2. **Gladiator Entity System** - Stats, skills, equipment, progression
3. **Tournament/Arena System** - Matchmaking, brackets, rewards
4. **Ludus Management System** - Facilities, finances, roster
5. **World Map System** - Travel, locations, discovery
6. **Quest System** - Story missions, side quests, objectives
7. **Economic System** - Gold, trading, investments
8. **Save/Load System** - Multiple slots, compression, versioning
9. **UI Systems**:
   - Combat UI (turn-based grid interface)
   - Management UI (ludus dashboard, roster management)
   - Exploration UI (world map, city interfaces)
   - Character UI (stats, equipment, talents)
   - Quest Log UI
   - Tournament UI (brackets, standings, rewards)

---

## **Phase 1: Foundation & Infrastructure** 🏗️

### **1.1 Project Initialization**

**Actions:**
- Initialize `package.json` with project metadata
- Setup Git (already initialized)
- Create `.gitignore` for node_modules, dist, coverage
- Initialize npm/pnpm workspace

**Dependencies to Install:**

```json
{
  "name": "ludus-magnus-reborn",
  "version": "5.0.0",
  "description": "A gladiator management RPG where you build your ludus, manage fighters, and conquer the arena",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:unit && npm run test:e2e",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,scss}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,scss}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@reduxjs/toolkit": "^2.1.0",
    "react-redux": "^9.1.0",
    "lz-string": "^1.5.0",
    "clsx": "^2.1.0",
    "immer": "^10.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/lz-string": "^1.5.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.4.11",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "sass": "^1.70.0",
    "@vitest/ui": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0",
    "vitest": "ts` - Vite build configuration with React plugin
- `vitest.config.ts` - Test configuration
- `playwright.config.ts` - E2E test configuration
- `tsconfig.json` - TypeScript configuration (strict mode)
- `tsconfig.node.json` - TypeScript config for Node environment
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.cjs` - ESLint rules for React + TypeScript,
    "@testing-library/user-event": "^14.5.2",
    "jsdom": "^24.0.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.2.4",
    "prettier-plugin-tailwindcss": "^0.5.11"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### **1.2 Build Configuration**

**Files to Create:**
- `vite.config.js` - Vite build configuration
- `vitest.config.js` - Test configuration
- `playwright.config.js` - E2E test configuration
- `eslint.config.js` - Code quality rules
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git exclusions

---

## **Phase 2: Core Directory Structure** 📁

### **2.1 Source Directory (`src/`)**
ts
│   ├── BehaviorTree.ts
│   ├── AIPersonality.ts
│   ├── CombatBehaviors.ts
│   └── types.ts             # AI type definitions
│
├── components/              # 34+ React Components
│   ├── common/              # Shared components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── combat/              # Combat-related components
│   │   ├── CombatArena.tsx
│   │   ├── FighterCard.tsx
│   │   ├── ActionSelection.tsx
│   │   ├── CombatLog.tsx
│   │   └── StatusEffectDisplay.tsx
│   ├── grid/                # Grid combat components
│   │   ├── GridCombatUI.tsx
│   │   ├── GridCell.tsx
│   │   ├── TerrainDisplay.tsx
│   │   └── GridControls.tsx
│   ├── screens/             # Main screen components
│   │   ├── TitleScreen.tsx
│   │   ├── CharacterCreation.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── TalentTreeScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   ├── CampaignMap.tsx
│   │   ├── AchievementScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── layout/              # Layout components
│   │   ├── NavigationBar.tsx
│   │   ├── MainLayout.tsx
│   │   └── GameContainer.tsx
│   └── ui/                  # UI-specific components
│       ├── ThemeToggle.tsx
│       ├── SoundToggle.tsx
│       ├── ProgressBar.tsx
│       └── Tooltip.tsx
│
├── config/                  # Configuration
│   ├── routes.ts            # Route definitions
│   ├── gameConfig.ts        # Game constants
│   └── constants.ts         # Global constants
│
├── data/                    # Static game data
│   ├── classes.ts           # 10 character classes
│   ├── equipment.ts         # 24+ equipment items
│   ├── talents.ts           # Talent tree definitions
│   ├── achievements.ts      # 25 achievements
│   ├── comboDefinitions.ts  # Combo patterns
│   ├── storyPaths.ts        # Story path definitions
│   ├── missions/            # Mission data
│   │   ├── slaveGladiator.ts
│   │   ├── romanLegionnaire.ts
│   │   ├── lanista.ts
│   │   ├── barbarianTraveller.ts
│   │   └── desertNomad.ts
│   └── index.ts             # Data exports
│
├── entities/                # Core entities (classes)
│   ├── Fighter.ts
│   ├── BaseEntity.ts
│   ├── Referee.ts
│   ├── Team.ts
│   └── types.ts             # Entity type definitions
│
├── game/                    # 26+ game systems
│   ├── Game.ts              # Main game loop
│   ├── CombatEngine.ts
│   ├── GridManager.ts
│   ├── GridCombatIntegration.ts
│   ├── TerrainSystem.ts
│   ├── SkillSystem.ts
│   ├── ComboSystem.ts
│   ├── StatusEffectSystem.ts
│   ├── TalentManager.ts
│   ├── EquipmentManager.ts
│   ├── DurabilityManager.ts
│   ├── EconomyManager.ts
│   ├── MarketplaceManager.ts
│   ├── LevelingSystem.ts
│   ├── AchievementManager.ts
│   ├── DifficultyManager.ts
│   ├── StoryMode.ts
│   ├── TournamentMode.ts
│   ├── CombatPhaseManager.ts
│   ├── ActionQueue.ts
│   └── types.ts             # Game system types
│
├── hooks/                   # Custom React hooks
│   ├── useGame.ts           # Game state hook
│   ├── useCombat.ts         # Combat hook
│   ├── usePlayer.ts         # Player state hook
│   ├── useInventory.ts      # Inventory hook
│   ├── useKeyboard.ts       # Keyboard shortcuts
│   └── useLocalStorage.ts   # localStorage hook
│
├── store/                   # Redux Toolkit state
│   ├── ints                 # Global test setup
├── mocks/                   # Mock data and handlers
│   ├── handlers.ts
│   └── data.ts
├── utils/                   # Test utilities
│   ├── testHelpers.ts
│   └── renderWithProviders.tsx
├── unit/
│   ├── components/          # Component tests
│   │   ├── FighterCard.test.tsx
│   │   ├── CombatArena.test.tsx
│   │   └── GridCombatUI.test.tsx
│   ├── game/                # Game system tests
│   │   ├── Fighter.test.ts
│   │   ├── ComboSystem.test.ts
│   │   ├── TalentManager.test.ts
│   │   └── GridManager.test.ts
│   ├── store/               # Redux tests
│   │   ├── playerSlice.test.ts
│   │   └── combatSlice.test.ts
│   └── hooks/               # Hook tests
│       ├── useGame.test.ts
│       └── useCombat.test.ts
├── integration/
│   └── CombatFlow.test.tsx
└── e2e/
    └── gameFlow.spec.t      # Store type definitions
│
├── styles/                  # Styles
│   ├── index.css            # Tailwind imports & global
│   ├── components/          # Component-specific SCSS
│   │   ├── combat.scss
│   │   ├── grid.scss
│   │   └── talents.scss
│   └── utilities/           # SCSS utilities
│       ├── animations.scss
│       └── mixins.scss
│
├── types/                   # Global TypeScript types
│   ├── game.types.ts        # Game-related types
│   ├── combat.types.ts      # Combat types
│   ├── state.types.ts       # State types
│   └── index.ts             # Type exports
│
├── utils/                   # Utilities
│   ├── SaveManagerV2.ts
│   ├── Logger.ts
│   ├── SoundManager.ts
│   ├── LazyLoader.ts
│   ├── ObjectPool.ts
│   ├── PerformanceMonitor.ts
│   ├── EnemyIconMapper.ts
│   └── helpers.ts           # Helper functions
│
├── App.tsx                  # Main App component
├── main.tsx                 # React entry point
└── vite-env.d.ts            # Vite type definition
│   └── EnemyIconMapper.js
│
├── main-new.js              # App initialization
└── index.css                # Global styles
```

### **2.2 Test Directory (`tests/`)**

```
tests/
├── setup.js                 # Global test setup
├── utils/
│   └── testHelpers.js       # Test utilities
├── unit/
│   ├── Fighter.test.js
│   ├── ComboSystem.test.js
│   ├── TalentManager.test.js
│   ├── GridManats
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json            # TypeScript config
├── tsconfig.node.json       # Node TypeScript config
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
├── .eslintrc.cjs            # ESLint config
├── .prettierrc              # Prettier config
    └── gameFlow.spec.js
```

### **2.3 Root Files**

```
root/
├── index.html               # Main HTML entry
├── package.json
├─Technology Choice: Redux Toolkit**

Redux Toolkit is chosen over Context API due to:
- Complex nested state (26+ game systems)
- Time-travel debugging capabilities
- Excellent DevTools integration
- Built-in middleware support
- Better performance for frequent updates
- Immer for immutable updates
- RTK Query for potential future API integration

**Implementation Order:**
1. **store/index.ts** - Redux store configuration with RTK
2. **store/slices/** - Feature-based slices (7+ slices)
3. **store/middleware/** - Custom middleware (save, logger)
4. **hooks/useAppDispatch.ts** - Typed dispatch hook
5. **hooks/useAppSelector.ts** - Typed selector hook

**State Structure (Redux Toolkit Slices)            # Already exists
├── CHANGELOG.md             # Already exists
├── LICENSE                  # Already exists
└── ... (other docs)
```

---

## **Phase 3: Core System Implementation** ⚙️

### **3.1 State Management System (Priority: CRITICAL)**

**Implementation Order:**
1. **Store.js** - Redux-like store implementation
2. **actions.js** - All action creators (50+ actions)
3. **reducers.js** - All state reducers
4. **gameStore.js** - Singleton game store instance

**State Structure:**
```javascript
{
  player: { 
    characterCreated: false,
    name: '', 
    class: '', 
    level: 1, 
    xp: 0, 
    gold: 100, 
    talents: {},
    storyPath: null,
    pathSelected: false,
    pathProgress: {},
    pathMechanics: {},
    createdAt: null,
    lastPlayedAt: null
  },
  combat: { 
    active: false, 
    fighter1: null, 
    fighter2: null, 
    round: 0, 
    currentTurn: 'fighter1',
    winner: null 
  },
  gameMode: 'single' | 'tournament' | 'story',
  tournament: { 
    active: false, 
    opponents: [], 
    currentRound: 0,
    roundsWon: 0 
  },
  story: { 
    currentMission: null, 
    currentMissionState: null,
    completedMissions: {},
    unlockedRegions: [],
    unlockedMissions: []
  },
  inventory: { 
    equipment: [],
    consumables: {}
  },
  equipped: { 
    weapon: null, 
    head: null,
    torso: null, 
    arms: null,
    trousers: null,
    shoes: null,
    coat: null,
    accessory: null 
  },
  equipmentDurability: {},
  stats: { 
    totalWins: 0,
    totalLosses: 0,
    totalFightsPlayed: 0,
    winStrReact Component System (Priority: HIGH)**

**Component Architecture Principles:**
- **Functional Components** - All components use React FC with TypeScript
- **Custom Hooks** - Extract reusable logic into hooks
- **Compound Components** - Use composition for complex UI
- **Props Typing** - Strict TypeScript interfaces for all props
- **Error Boundaries** - Catch and handle component errors
- **Code Splitting** - Lazy load heavy components

**Implementation Order:**
1. **Common Components** - Shared UI primitives
   - Button, Card, Modal, LoadingSpinner
   - Type-safe props with TypeScript interfaces
2. **Layout Components** - App structure
   - MainLayout, NavigationBar, GameContainer
3. **Screen Components** - Major views
   - TitleScreen, CharacterCreation, CombatArena
4. **Feature Components** - Specific features
   - FighterCard, ActionSelection, GridCombatUI

**React Component Pattern (TypeScript):**
```typescript
// Component with TypeScript
interface FighterCardProps {
  fighter: Fighter;
  isActive?: boolean;
  onSelect?: (fighter: Fighter) => void;
  className?: string;
}

export const FighterCard: React.FC<FighterCardProps> = ({
  fighter,
  isActive = false,
  onSelect,
  className
}) => {
  const handleClick = useCallback(() => {
    onSelect?.(fighter);
  }, [fighter, onSelect]);

  return (
    <div 
      className={clsx(
        'p-4 rounded-lg border-2 transition-all',
        isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        className
      )}
      onClick={handleClick}
    >
      <h3 className="text-xl font-bold">{fighter.name}</h3>
      <div className="mt-2">
        <span className="text-sm text-gray-600">{fighter.class}</span>
      </div>
      {/* More fighter details */}
    </div>
  );
};

// Custom hook example
export const useFighter = (fighterId: string) => {
  const fighter = useAppSelector(state => 
    selectFighterById(state, fighterId)
  );
  const dispatch = useAppDispatch();

  const updateFighter = useCallback((updates: Partial<Fighter>) => {
    dispatch(updateFighterAction({ id: fighterId, updates }));
  }, [fighterId, dispatch]);
entities/BaseEntity.ts** - Attack mechanics with TypeScript types
2. **entities/Fighter.ts** - Fighter class with type-safe properties
3. **game/CombatEngine.ts** - Pure functions with type annotations
4. **game/Game.ts** - Main game loop with state integration
5. **game/CombatPhaseManager.ts** - Phase system with enum types
6. **game/ActionQueue.ts** - Type-safe action queue
7. **store/slices/combatSlice.ts** - Redux slice for combat state
8. **components/combat/CombatArena.tsx** - Main combat UI
9. **hooks/useCombat.ts** - Combat logic hook

**TypeScript Combat Types:**
```typescript
// Type definitions
interface CombatState {
  active: boolean;
  fighter1: Fighter | null;
  fighter2: Fighter | null;
  round: number;
  currentTurn: 'fighter1' | 'fighter2';
  winner: Fighter | null;
  combatLog: CombatLogEntry[];
}

enum CombatPhase {
  IDLE = 'IDLE',
  BATTLE_START = 'BATTLE_START',
  TURN_START = 'TURN_START',
  ACTION_SELECTION = 'ACTION_SELECTION',
  ACTION_EXECUTION = 'ACTION_EXECUTION',
  ACTION_RESOLUTION = 'ACTION_RESOLUTION',
  TURN_END = 'TURN_END',
  BATTLE_END = 'BATTLE_END'
}

interface DamageResult {
  damage: number;
  isCritical: boolean;
  damageType: 'physical' | 'magical';
  blocked?: boolean;
}

// Pure function example
export const calculateDamage = (
  attacker: Fighter,
  defender: Fighter,
  actionType: ActionType,
  options: DamageOptions = {}
): DamageResult => {
  // Type-safe damage calculation
  const baseDamage = attacker.strength * 0.4;
  const isCritical = Math.random() < attacker.critChance;
  const damage = isCritical 
    ? baseDamage * attacker.critDamage 
    : baseDamage;
  
  return {
    damage: Math.max(1, damage - defender.defense),
    isCritical,
    damageType: 'physical'
  };
};
```
    this._state = {};
  }
  
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      ${this.template()}
    `;
    this.attachEventListeners();
  }
  
  emit(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail, bubbles: true, composed: true
    }));
  }
  
  // Override in subclasses
  styles() { return ''; }
  template() { return ''; }
  attachEventListeners() {}
}
```

### **3.3 Combat System (Priority: HIGH)**

**Implementation Order:**
1. **BaseEntity.js** - Attack mechanics (hit, normalAttack, specialAttack)
2. **Fighter.js** - Fighter entity with stats, skills, equipment integration
3. **CombatEngine.js** - Pure damage calculation functions
4. **game.js** - Main game loop, turn management
5. **CombatPhaseManager.js** - Phase system (8 phases)
6. **ActionQueue.js** - Action queueing and execution

**Combat Flow:**
```
Turn Start → Status Effects → Action Selection → 
Action Execution → Combo Check → Turn End → 
Check Victory → Next Turn
```

### **3.4 Grid Combat System (Priority: HIGH)**

**Implementation Order:**
1. **GridManager.js** - 9x9 grid management, pathfinding (BFS), LOS (Bresenham)
2. **TerrainSystem.js** - 10 terrain types, effects, battlefield generation
3. **GridCombatIntegration.js** - Bridge between grid and combat systems
4. **GridCombatUI.js** - Visual grid component with terrain rendering

**Grid Specifications:**
- 9x9 grid (81 cells)
- 10 terrain types with movement costs and stat modifiers
- Spawn zones: Player (rows 6-8), Enemy (rows 0-2)
- Pathfinding with BFS algorithm
- Line of sight with Bresenham's algorithm

---

## **Phase 4: Game Systems** 🎮

### **4.1 Character Systems**

**Priority Order:**
1. **SkillSystem.js** - 3 skills per class × 10 classes
   - Movement skills (mana cost 10-15, cooldown 0-2)
   - Offensive skills
   - Utility skills (heal/buff/debuff)

2. **TalentManager.js** - 3 talent trees per class (30 trees total)
   - Talent point system (1 per level, start at level 2)
   - Dependencies and prerequisites
   - Stat modifiers and passive abilities
   - Respec functionality

3. **StatusEffectSystem.js** - 17 status effects with 11 interactions
   - DOT effects (poison, burn, bleed)
   - Buffs (strength boost, regen, bless)
   - Debuffs (curse, weakness, slow)
   - CC effects (stun, frozen)
   - Interaction matrix (Fire vs Ice, etc.)

4. **ComboSystem.js** - 20+ combo patterns
   - Action tracking (last 5 actions)
   - Pattern matching
   - Combo effects (damage multipliers, healing, status application)

### **4.2 Progression Systems**

**Priority Order:**
1. **LevelingSystem.js** - XP and leveling (1-20)
   - XP calculation: baseXP × (1.5 ^ level)
   - Stat increases per level
   - Talent point awards

2. **EconomyManager.js** - Gold management
   - Battle rewards (difficulty-based)
   - Tournament rewards (50/100/200)
   - Story mission rewards

3. **EquipmentManager.js** - Equipment handling
   - 8 equipment slots
   - Stat application to fighters
   - Equip/unequip operations
   - Class requirements validation

4. **DurabilityManager.js** - Equipment wear
   - Durability loss per battle (5-10)
   - Effectiveness tiers (100%, 90%, 75%, 0%)
   - Auto-unequip broken items

5. **AchievementManager.js** - 25 achievements
   - 7 categories
   - XP and gold rewards
   - Unlock tracking

### **4.3 Game Mode Systems**

**Priority Order:**
1. **StoryMode.js** - 5 story paths with 68 missions
   - Path-specific mission loading
   - Mission state tracking
   - Star rating system (1-3 stars)
   - Objectives and rewards

2. **TournamentMode.js** - 3-round tournaments
   - Bracket generation
   - Round progression
   - Scaling rewards

3. **MarketplaceManager.js** - Shop system
   - Rotating inventory (24-hour refresh)
   - Buy/sell/repair operations
   - Force refresh (100 gold)
   - Level-based rarity scaling

4. **DifficultyManager.js** - Difficulty scaling
   - 4 difficulty levels (Easy, Normal, Hard, Nightmare)
   - XP/Gold/Drop rate multipliers
   - AI mistake chances

### **4.4 AI System**

**Priority Order:**
1. **BehaviorTree.js** - Tree structure
   - Selector node (OR logic)
   - Sequence node (AND logic)
   - Condition node
   - Action node
   - Decorators (Inverter, Repeater, UntilFail)

2. **AIPersonality.js** - 5 personality archetypes
   - AGGRESSIVE (high offense, low caution)
   - DEFENSIVE (high caution, low offense)
   - TACTICAL (balanced, high skill preference)
   - BERSERKER (maximum aggression and risk)
   - OPPORTUNIST (balanced, high risk)

3. **AIManager.js** - AI coordination
   - Decision making via behavior trees
   - Combat event recording
   - Difficulty scaling integration

4. **CombatBehaviors.js** - Combat-specific behaviors
   - Attack/skill/defend/item decision trees
   - Health-based decisions
   - Mana management

---

## **Phase 5: Data & Content** 📊

### **5.1 Character Classes** (`classes.js`)

Create 10 classes with unique stat modifiers:

| Class | HP Mod | STR Mod | DEF Mod | Crit % | Range | Specialty |
|-------|--------|---------|---------|--------|-------|-----------|
| BALANCED | 1.0x | 1.0x | 1.0x | 15% | 1 | Versatile |
| WARRIOR | 0.9x | 1.3x | 0.95x | 20% | 1 | High damage |
| TANK | 1.5x | 0.6x | 1.5x | 10% | 1 | High HP/Defense |
| GLASS_CANNON | 0.75x | 2.0x | 0.7x | 25% | 1 | Extreme damage |
| BRUISER | 1.25x | 0.9x | 1.1x | 12% | 1 | Sustain fighter |
| MAGE | 0.85x | 0.8x | 0.9x | 10% | 3 | Ranged magic |
| ASSASSIN | 0.8x | 1.2x | 0.85x | 30% | 1 | Highest crit |
| BERSERKER | 1.1x | 1.15x | 0.8x | 18% | 1 | Rage mechanic |
| PALADIN | 1.2x | 1.05x | 1.15x | 15% | 1 | Healing |
| NECROMANCER | 0.9x | 0.85x | 0.95x | 12% | 3 | Life drain |

### **5.2 Equipment Database** (`equipment.js`)

Create 24+ items across 4 rarity tiers:

**Rarity Distribution:**
| Rarity | Color | Stats | Price Range |
|--------|-------|-------|-------------|
| Common | Gray | Low | 50-150g |
| Rare | Blue | Medium | 200-500g |
| Epic | Purple | High | 600-1200g |
| Legendary | Orange | Very High | 1500-3000g |

**Equipment Slots:** weapon, head, torso, arms, trousers, shoes, coat, accessory

**Equipment Stats:** strength, health, defense, critChance, critDamage, manaRegen, movementBonus

### **5.3 Story Content** (5 mission files)

Create 68 missions across 5 story paths:

1. **Slave Gladiator Path** (`slave_gladiator_missions.js`) - 12 missions
   - Mechanic: Freedom meter (0-100)
   - Arc: Captivity → Proving Ground → Choice → Freedom/Champion

2. **Roman Legionnaire Path** (`roman_legionnaire_missions.js`) - 15 missions
   - Mechanics: Rank progression, territory control
   - Arc: Training → Barbarian Wars → Conquest → Political Intrigue

3. **Lanista Path** (`lanista_missions.js`) - 14 missions
   - Mechanics: Gladiator roster (1-6), reputation, profit
   - Arc: Apprentice → Lanista → Business Growth → Arena Empire

4. **Barbarian Traveller Path** (`barbarian_traveller_missions.js`) - 13 missions
   - Mechanics: Location discovery (8 regions), tribal reputation
   - Arc: Exile → Exploration → Alliance Building → United Tribes

5. **Desert Nomad Path** (`desert_nomad_missions.js`) - 14 missions
   - Mechanics: Water management (100 starting), oasis discovery (6)
   - Arc: Survival → Prosperity → Desert Kingdom → Eternal Master

**Mission Types:**
- Standard Battle (1v1)
- Survival Mode (3 waves)
- Boss Battle (enhanced enemy)

**Star Rating Objectives:**
- no_items, no_healing, no_defend
- rounds ≤ X, damage_dealt ≥ X, damage_taken ≤ X
- health_percent ≥ X%, crits ≥ X, combo ≥ X

### **5.4 Talent Trees** (`talents.js`)

Create 30 talent trees (3 per class × 10 classes):

**Example - Warrior Trees:**
1. **Arms (DPS)**: Weapon Mastery, Precise Strikes, Execute, Mortal Strike, Bladestorm
2. **Fury (Burst)**: Building Rage, Enrage, Rampage, Bloodthirst, Reckless Abandon
3. **Protection (Tank)**: Thick Skin, Toughness, Shield Block, Challenging Shout, Shield Wall

**Example - Mage Trees:**
1. **Fire (Burn)**: Flame Touched, Critical Mass, Ignite, Pyroblast, Combustion
2. **Frost (Control)**: Ice Veins, Frost Nova, Ice Barrier, Deep Freeze, Blizzard
3. **Arcane (Power)**: Arcane Power, Arcane Intellect, Arcane Missiles, Arcane Surge, Arcane Mastery

**Talent Node Structure:**
- ID, name, description, icon
- Max rank (1-5)
- Row/column position
- Prerequisites
- Point requirements
- Effects (stats or passives)

### **5.5 Other Data**

1. **Achievements** (`achievements.js`) - 25 achievements
   - Categories: COMBAT, STRATEGIC, SPECIAL, PROGRESSION, ECONOMY, STORY, MISC
   - Rewards: XP (50-500), Gold (0-500)

2. **Combo Definitions** (`comboDefinitions.js`) - 20+ combos
   - Universal combos (all classes)
   - Class-specific combos
   - Combo effects: damage multipliers, healing, mana restore, status effects

3. **Story Paths** (`storyPaths.js`) - Path definitions
   - Path metadata (id, name, icon, description)
   - Starting bonuses
   - Path-specific mechanics

---

## **Phase 6: Utilities & Infrastructure** 🔧

### **6.1 Core Utilities**

**Priority Order:**
1. **Router.js** - Client-side routing
   - History API integration
   - Route guards (characterCreated, minimumLevel)
   - Query parameter support
   - Navigation functions

2. **SaveManagerV2.js** - Save system
   - Multiple save slots (3)
   - LZ-String compression
   - Auto-backup (max 5 per slot)
   - Import/export functionality
   - Version migration

3. **Logger.js** - Logging system
   - Categories: UI, COMBAT, STORE, ROUTER, AI, PERFORMANCE
   - Log levels: DEBUG, INFO, WARN, ERROR
   - Conditional logging (dev/prod)

### **6.2 Performance Systems**

**Priority Order:**
1. **LazyLoader.js** - Dynamic module loading
   - Module caching
   - Image asset loading
   - Batch loading
   - Preload queue
   - Intersection Observer integration

2. **ObjectPool.js** - Object pooling
   - Generic pool implementation
   - Pre-configured pools (vectors, particles, damage numbers, events)
   - Pool manager
   - Utilization tracking

3. **PerformanceMonitor.js** - Performance tracking
   - FPS monitoring
   - Frame time measurement
   - Memory usage tracking
   - Custom profiling marks
   - Performance timers
   - Metric history (60 samples)

### **6.3 Audio & UI Utilities**

1. **SoundManager.js** - Web Audio API wrapper
   - Sound loading and caching
   - Volume control
   - Sound effects and music
   - Spatial audio (future)

2. **EnemyIconMapper.js** - Story-aware enemy icons
   - 68+ icon mappings
   - Name-based keyword matching
   - Story path themes
   - Class fallbacks
   - Boss indicators

3. **PerformanceMonitorUI.js** - Performance metrics display
   - Real-time FPS counter
   - Memory usage display
   - Expandable detailed view
   - Pool utilization
   - Color-coded status indicators

---

## **Phase 7: Testing Infrastructure** ✅

### **7.1 Unit Tests** (Vitest)

**Test Coverage Targets:** 70% lines/functions/branches/statements

**Priority Tests:**
1. **Fighter.test.js** - Fighter mechanics
   - Creation, stat calculation
   - Equipment integration
   - Talent application
   - Skill execution

2. **ComboSystem.test.js** - Combo detection
   - Action tracking
   - Pattern matching
   - Combo triggering
   - Effect application

3. **TalentManager.test.js** - Talent system
   - Learning/unlearning
   - Prerequisites
   - Respec functionality
   - Effect aggregation
Tailwind CSS + Custom SCSS Architecture:**

**Tailwind Configuration (`tailwind.config.js`):**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#6c5ce7',
          600: '#5b4bc4',
          700: '#4a3da1',
        },
        secondary: {
          500: '#a29bfe',
        },
        success: {
          500: '#00b894',
        },
        danger: {
          500: '#d63031',
        },
        warning: {
          500: '#fdcb6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        gaming: ['Cinzel', 'serif'],
      },
      animation: {
        'damage-number': 'damageNumber 1s ease-out forwards',
        'combo-banner': 'comboBanner 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'water-shimmer': 'waterShimmer 3s ease-in-out infinite',
        'fire-pulse': 'firePulse 2s ease-in-out infinite',
      },
      keyframes: {
        damageNumber: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-50px) scale(1.2)', opacity: '0' },
        },
        comboBanner: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

**SCSS Architecture (for complex components):**
```
src/styles/
├── index.css              # Tailwind imports + global styles
├── components/            # Component-specific SCSS
│   ├── combat.scss        # Complex combat animations
│   ├── grid.scss          # Grid-specific styles
│   └── talents.scss       # Talent tree visualizations
└── utilities/             # SCSS utilities
    ├── animations.scss    # Custom animations
    └── mixins.scss        # Reusable mixins
```

**Main CSS File (`src/styles/index.css`):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --grid-cell-size: 60px;
  }
  
  body {
    @apply font-sans text-gray-900 dark:text-gray-100;
    @apply bg-gray-50 dark:bg-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-500 text-white rounded-lg;
    @apply hover:bg-primary-600 transition-colors;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md;
    @apply border border-gray-200 dark:border-gray-700;
  }
  
  .fighter-card {
    @apply card p-4 transition-all duration-200;
    @apply hover:shadow-xl hover:scale-105;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .glass-effect {
    @apply bg-white/10 backdrop-blur-md;
    @apply border border-white/20;
  }
}
```

**Component-Specific SCSS Example:**
```scss
// src/styles/components/combat.scss
.combat-arena {
  @apply relative min-h-screen;
  
  &__background {
    @apply absolute inset-0 -z-10;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &__fighters {
    @apply grid grid-cols-2 gap-8 max-w-6xl mx-auto;
  }
}

// Import in component
// import '@/styles/components/combat.scss';
```n screens
   - State persistence

2. **characterCreation.spec.js** - Character creation
   - Class selection
   - Name input
   - Starting bonuses
   - State initialization

3. **singleCombat.spec.js** - Combat mode
   - Opponent selection
   - Action selection
   - Combat execution
   - Victory/defeat screens

4. **storyMode.spec.js** - Story mode
   - Path selection
   - Mission selection
   - Mission completion
   - Star rating system

5. **responsive.spec.js** - Responsive design
   - Mobile viewport
   - Tablet viewport
   - Desktop viewport
   - Touch interactions

**E2E CFavicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cinzel:wght@600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  
  <!-- React App Entry -->
  <script type="module" src="/src/main.tsx
src/styles/
├── main.scss              # Main entry point
├── theme.scss             # Theme variables
├── _variables.scss        # SCSS variables
├── _mixins.scss           # Reusable mixins
├── components/            # Component styles
│   ├── _combat-arena.scss
│   ├── _grid-combat.scss
│   ├── _talent-tree.scss
│   └── ...React Entry** (`src/main.tsx`)

**Initialization Flow:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { loadGameState } from './store/slices/playerSlice';
import { SaveManagerV2 } from './utils/SaveManagerV2';
import App from './App';
import './styles/index.css';

// Load saved game state
const saveData = SaveManagerV2.load();
if (saveData) {
  store.dispatch(loadGameState(saveData));
}

// Start auto-save
if (store.getState().player.characterCreated) {
  startAutoSave(store);
}

// Expose for debugging (dev only)
if (import.meta.env.DEV) {
  window.__GAME_STORE__ = store;
  window.__GAME_STATE__ = () => store.getState();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@game': path.resolve(__dirname, './src/game'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@game': path.resolve(__dirname, './src/game'),
      '@store': path.resolve(__dirname, './src/store'),Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModulests:**
```typeEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@game/*": ["./src/game/*"],
      "@store/*": ["./src/store/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@hooks/*": ["./src/hooks/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**tsconfig.node.json:**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  .eslintrc.cjs:**
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/e,
  "plugins": ["prettier-plugin-tailwindcss"]xplicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
}   tailwindcss: {},
    autoprefixer: {},
  },
}st CharacterCreation = lazy(() => import('./components/screens/CharacterCreation'));
const CombatArena = lazy(() => import('./components/combat/CombatArena'));
const ProfileScreen = lazy(() => import('./components/screens/ProfileScreen'));
const TalentTreeScreen = lazy(() => import('./components/screens/TalentTreeScreen'));
const MarketplaceScreen = lazy(() => import('./components/screens/MarketplaceScreen'));
const CampaignMap = lazy(() => import('./components/screens/CampaignMap'));

const App: React.FC = () => {
  const characterCreated = useAppSelector(state => state.player.characterCreated);

  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/" 
              element={
                characterCreated 
                  ? <Navigate to="/title" replace /> 
                  : <Navigate to="/character-creation" replace />
              } 
            />
            <Route path="/character-creation" element={<CharacterCreation />} />
            <Route path="/title" element={<TitleScreen />} />
            <Route path="/combat" element={<CombatArena />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/talents" element={<TalentTreeScreen />} />
            <Route path="/marketplace" element={<MarketplaceScreen />} />
            <Route path="/story" element={<CampaignMap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default App; --bg-color: #2d3436;
  --bg-secondary: #1e272e;
}
```

**Bootstrap 5.3.8 Integration:**
- Use Bootstrap grid system
- Customize Bootstrap variables
- Override with custom classes
- Responsive utilities

### **8.2 Responsive Design**

**Breakpoints:**
```scss
$breakpoints: (
  'mobile': 576px,
  'tablet': 768px,
  'desktop': 992px,
  'large': 1200px
);
```

**Mobile Optimizations:**
- Touch-friendly buttons (min 44x44px)
- Simplified grid UI (smaller cells)
- Collapsible menus
- Swipe gestures for navigation
- Bottom navigation bar

**Tablet Optimizations:**
- Side-by-side layouts
- Larger hit areas
- Touch and mouse support

**Desktop Optimizations:**
- Multi-column layouts
- Hover states
- Keyboard shortcuts
- Tooltips

### **8.3 Animations & Effects**

**CSS Animations:**
```css
/* Terrain animations */
@keyframes water-shimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes fire-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes ice-sparkle {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

/* Combat effects */
@keyframes damage-number {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
}

@keyframes combo-banner {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.1) rotate(0deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

**Transition Effects:**
- Screen fade transitions (300ms)
- Button hover states (150ms)
- Card flip animations (400ms)
- Slide-in menus (250ms)
- Loading spinners

**Particle Effects** (via Canvas/SVG):
- Critical hit sparks
- Heal particles
- Status effect indicators
- Level up effects
- Achievement unlocks

### **8.4 Accessibility**

**ARIA Labels:**
- Semantic HTML5 elements
- ARIA roles for custom components
- Screen reader announcements
- Focus management

**Keyboard Navigation:**
- Tab order
- Keyboard shortcuts (documented)
- ESC to close modals
- Arrow keys for grid navigation

**Visual Accessibility:**
- Color contrast ratios (WCAG AA)
- Focus indicators
- Text alternatives for icons
- Adjustable font sizes

---

## **Phase 9: Entry Points & Configuration** 🚀

### **9.1 HTML Entry** (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ludus Magnus: Reborn</title>
  <meta name="description" content="Browser-based RPG fighting game with tactical grid combat">
  
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Main Styles -->
  <link rel="stylesheet" href="/src/index.css">
</head>
<body>
  <div id="app"></div>
  
  <!-- Main Script (ES Module) -->
  <script type="module" src="/src/main-new.js"></script>
</body>
</html>
```

### **9.2 Main JavaScript** (`main-new.js`)

**Initialization Flow:**
```javascript
// 1. Import dependencies
import { gameStore } from './store/gameStore.js';
import { router } from './utils/Router.js';
import { SaveManagerV2 } from './utils/SaveManagerV2.js';
import './components/index.js'; // Register all components

// 2. Initialize state from save
const saveData = SaveManagerV2.load();
if (saveData) {
  gameStore.dispatch({ type: 'LOAD_STATE', payload: saveData });
}

// 3. Setup router
setupRouter();

// 4. Setup global event handlers
setupEventHandlers();

// 5. Start auto-save (if character created)
const state = gameStore.getState();
if (state.player.characterCreated) {
  startAutoSave();
}

// 6. Initial navigation
const initialRoute = state.player.characterCreated ? '/title' : '/character-creation';
router.navigate(initialRoute);

// 7. Expose for debugging (dev only)
if (import.meta.env.DEV) {
  window.__GAME_STORE__ = gameStore;
}
```

### **9.3 Configuration Files**

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['bootstrap', 'lz-string'],
          'components': [/src\/components\/.*/],
          'game-systems': [/src\/game\/.*/]
        }
      }
    }
  },
  optimizeDeps: {
    include: ['bootstrap', 'lz-string']
  }
});
```

**vitest.config.js:**
```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js'
      ],React | 18.2+ | UI library with hooks |
| Language | TypeScript | 5.3+ | Type safety & IntelliSense |
| Routing | React Router | 6.22+ | Client-side routing |
| State | Redux Toolkit | 2.1+ | Complex state management |
| Build | Vite | 5.4.11 | Fast dev server & HMR |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| Custom Styles | SCSS | 1.70+ | Complex component styles |
| Storage | localStorage + LZ-String | 1.5.0 | Save data compression |
| Testing | Vitest | 2.1.0 | Unit/integration tests |
| Testing Library | React Testing Library | 14.1+ | Component testing |
| E2E | Playwright | 1.48.0 | End-to-end tests |
| Linting | ESLint + TS | 8.56+ | Code quality |
| Formatting | Prettier | 3.2+ | Code style |
| Type Checking | TypeScript Compiler | 5.3+ | Static type checking
```

**playwright.config.js:**
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...de80+ files (TypeScript + React) |
| Lines of Code | ~28,000+ lines (includes types) |
| Components | 34+ React Components |
| Game Systems | 26+ managers (TypeScript) |
| Type Definitions | 20+ type files |
| Custom Hooks | 10+ hooks |
| Redux Slices | 7+ slices |
| Data Files | 10+ configuration files |
| Test Files | 40+ test suites |
| Development Time | 14-18
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  TypeScript learning curve | Medium | Medium | Strong typing from start, comprehensive types |
| Performance issues | Medium | Medium | React.memo, useMemo, lazy loading, profiling |
| Cross-browser compatibility | Low | Low | Modern browsers only, Playwright testing |
| State management complexity | Medium | Medium | Redux Toolkit simplifies, clear slice patterns |
| Mobile touch controls | Medium | Medium | React-friendly touch handlers, extensive testing |
| Save data corruption | Low | Low | Auto-backup system, version migration |
| Test maintenance burden | Medium | High | React Testing Library best practices |
| Bundle size | Medium | Low | Code splitting, tree shaking, dynamic imports |
| Type safety violations | Low | Low | Strict TypeScript mode, ESLint
```

**eslint.config.js:**
```javascript
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        customElements: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
    Type safety: Zero TypeScript errors with strict mode
- ✅ Bundle size < 500KB initial (with code splitting)
- ✅ Lighthouse score > 90 (performance, accessibility)
- ✅ Fast Refresh (HMR) < 100ms
- ✅ Build time < 30 seconds

### **Quality Requirements**
- ✅ Zero ESLint errors (TypeScript + React rules)
- ✅ All Prettier rules enforced (including Tailwind plugin)
- ✅ 100% TypeScript coverage (no any types without justification)
- ✅ WCAG AA accessibility compliance
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Mobile compatibility (iOS Safari, Chrome Android)
- ✅ Clean component hierarchy (max 3 levels of nesting)
- ✅ Reusable hooks for all business logic
**.prettierrc:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**.gitignore:**
```
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build output
dist/
build/

# Testing
coverage/
.nyc_output/
playwright-report/
test-results/

# Environment
.envKey Architectural Decisions** 🎯

### **Why React + TypeScript?**
1. **Type Safety**: Catch errors at compile time, not runtime
2. **Developer Experience**: Best-in-class tooling and IntelliSense
3. **Maintainability**: Self-documenting code with type annotations
4. **Scalability**: Easy to refactor with confidence
5. **Community**: Massive ecosystem and resources

### **Why Redux Toolkit?**
1. **Complexity**: 26+ game systems require robust state management
2. **DevTools**: Time-travel debugging invaluable for game development
3. **Middleware**: Easy to add save system, logging, analytics
4. **Performance**: Normalized state with selectors
5. **Patterns**: Clear, predictable state updates

### **Why Tailwind CSS?**
1. **Rapid Development**: Utility classes speed up UI creation
2. **Consistency**: Design system built-in
3. **Performance**: Purges unused CSS automatically
4. **Responsive**: Mobile-first by default
5. **Dark Mode**: Built-in dark mode support
6. **Customization**: Easy to extend with SCSS for complex components

### **Code Quality Principles**
1. **DRY (Don't Repeat Yourself)**: Extract reusable logic into hooks
2. **SOLID**: Single Responsibility for components and functions
3. **Composition**: Build complex UIs from simple components
4. **Type Safety**: Strict TypeScript with no implicit any
5. **Testing**: Test behavior, not implementation
6. **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

---

## **Revision History**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-26 | Initial comprehensive plan created | AI Assistant |
| 2.0 | 2026-01-26 | Updated to React + TypeScript + Tailwind stack
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

## **Phase 10: Documentation & Deployment** 📚

### **10.1 Code Documentation**

**JSDoc Standards:**
```javascript
/**
 * Calculates damage dealt from attacker to defender
 * @param {Fighter} attacker - The attacking fighter
 * @param {Fighter} defender - The defending fighter
 * @param {string} actionType - Type of action ('attack' | 'skill')
 * @param {Object} options - Additional options
 * @param {number} options.damageMultiplier - Damage multiplier
 * @param {boolean} options.ignoreDefense - Whether to ignore defense
 * @returns {Object} Damage result
 * @returns {number} returns.damage - Final damage amount
 * @returns {boolean} returns.isCritical - Whether it was a critical hit
 */
export function calculateDamage(attacker, defender, actionType, options = {}) {
  // Implementation
}
```

**README Sections:**
- Quick start guide
- Feature overview
- Technology stack
- Development setup
- Testing guide
- Contribution guidelines
- License information

**CHANGELOG Maintenance:**
- Follow Keep a Changelog format
- Semantic versioning
- Document all breaking changes
- Link to relevant PRs/issues

### **10.2 Build & Deploy**

**Build Process:**
```bash
# Development
npm run dev           # Start dev server

# Production build
npm run build         # Build to dist/
npm run preview       # Preview production build

# Testing
npm run test:all      # Run all tests
npm run test:coverage # Generate coverage report

# Code quality
npm run lint          # Check for errors
npm run format        # Format code
```

**Deployment Options:**

1. **GitHub Pages:**
   - Build: `npm run build`
   - Deploy: Push `dist/` to `gh-pages` branch
   - Configure: Set base URL in `vite.config.js`

2. **Netlify:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Auto-deploy on push

3. **Vercel:**
   - Import GitHub repo
   - Auto-detect Vite
   - Zero-config deployment

**CI/CD Setup (GitHub Actions):**
```yaml
name: CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:e2e
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## **Implementation Priority Matrix** 🎯

### **Phase A - Must Have (Weeks 1-4)** 🔴

**Sprint 1 (Week 1): Foundation**
- ✅ Initialize project structure
- ✅ Setup package.json and dependencies
- ✅ Create build configurations (Vite, ESLint, Prettier)
- ✅ Create .gitignore
- ✅ Setup test infrastructure (Vitest, Playwright)

**Sprint 2 (Week 2): Core Systems**
- ✅ State Management (Store.js, actions.js, reducers.js, gameStore.js)
- ✅ BaseComponent implementation
- ✅ Component registry system
- ✅ Router system with guards

**Sprint 3 (Week 3): Combat Foundation**
- ✅ BaseEntity with attack mechanics
- ✅ Fighter entity
- ✅ CombatEngine (damage calculations)
- ✅ Main game loop (game.js)
- ✅ SaveManagerV2 (basic save/load)

**Sprint 4 (Week 4): Basic UI**
- ✅ TitleScreen component
- ✅ CharacterCreation component
- ✅ CombatArena component
- ✅ ActionSelection component
- ✅ FighterCard component
- ✅ Single combat mode (basic)

### **Phase B - Core Features (Weeks 5-8)** 🟠

**Sprint 5 (Week 5): Grid Combat**
- ✅ GridManager (9x9 grid, pathfinding, LOS)
- ✅ TerrainSystem (10 terrain types)
- ✅ GridCombatUI component
- ✅ GridCombatIntegration

**Sprint 6 (Week 6): Character Systems**
- ✅ SkillSystem (skills for all classes)
- ✅ Classes data (10 classes)
- ✅ Equipment data (24+ items)
- ✅ EquipmentManager

**Sprint 7 (Week 7): Effects & AI**
- ✅ StatusEffectSystem (17 effects)
- ✅ BehaviorTree implementation
- ✅ AIPersonality (5 archetypes)
- ✅ AIManager and CombatBehaviors

**Sprint 8 (Week 8): Progression**
- ✅ LevelingSystem
- ✅ EconomyManager
- ✅ DurabilityManager
- ✅ ProfileScreen component

### **Phase C - Advanced Features (Weeks 9-12)** 🟡

**Sprint 9 (Week 9): Talent System**
- ✅ TalentManager
- ✅ Talents data (30 trees)
- ✅ TalentTreeScreen component
- ✅ Talent integration with combat

**Sprint 10 (Week 10): Combo & Marketplace**
- ✅ ComboSystem
- ✅ Combo definitions (20+ combos)
- ✅ MarketplaceManager
- ✅ MarketplaceScreen component

**Sprint 11 (Week 11): Story Mode Part 1**
- ✅ StoryMode manager
- ✅ Story paths data (5 paths)
- ✅ Mission data (68 missions across 5 files)
- ✅ CampaignMap component

**Sprint 12 (Week 12): Story Mode Part 2 & Tournament**
- ✅ MissionBriefing component
- ✅ Path-specific progress tracking
- ✅ TournamentMode
- ✅ AchievementManager & AchievementScreen

### **Phase D - Polish & Testing (Weeks 13-16)** 🟢

**Sprint 13 (Week 13): Testing**
- ✅ Unit tests for all core systems
- ✅ Integration tests for combat flow
- ✅ E2E tests for game modes
- ✅ 70% coverage target

**Sprint 14 (Week 14): Performance & Optimization**
- ✅ LazyLoader implementation
- ✅ ObjectPool system
- ✅ PerformanceMonitor
- ✅ Bundle size optimization

**Sprint 15 (Week 15): UI/UX Polish**
- ✅ SCSS theme system
- ✅ Dark/light mode
- ✅ Animations and transitions
- ✅ Mobile responsive design
- ✅ Accessibility improvements

**Sprint 16 (Week 16): Documentation & Deployment**
- ✅ JSDoc comments
- ✅ README updates
- ✅ User guides
- ✅ Production build
- ✅ GitHub Pages deployment

---

## **Technology Stack Summary** 🛠️

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Core | Vanilla JavaScript | ES2022 | No framework dependencies |
| Components | Web Components | Native | UI layer (34+ components) |
| Build | Vite | 5.4.11 | Fast dev server & build |
| Styling | Bootstrap + SCSS | 5.3.8 | UI framework + custom styles |
| State | Custom Redux-like | - | Single source of truth |
| Storage | localStorage + LZ-String | 1.5.0 | Save data compression |
| Testing | Vitest | 2.1.0 | Unit/integration tests |
| E2E | Playwright | 1.48.0 | End-to-end tests |
| Linting | ESLint | 9.0.0 | Code quality |
| Formatting | Prettier | 3.0.0 | Code style |
| Audio | Web Audio API | Native | Sound effects |

---

## **Estimated Metrics** 📈

| Metric | Estimate |
|--------|----------|
| Total Files | ~150+ files |
| Lines of Code | ~25,000+ lines |
| Components | 34+ Web Components |
| Game Systems | 26+ managers |
| Data Files | 10+ configuration files |
| Test Files | 30+ test suites |
| Development Time | 12-16 weeks (1 developer) |
| Team Size | 1-3 developers |
| Estimated Cost | $0 (open source) |

---

## **Risk Assessment** ⚠️

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Scope creep | High | High | Strict phase adherence, MVP first approach |
| Performance issues | Medium | Medium | Object pooling, lazy loading, profiling from start |
| Cross-browser compatibility | Low | Low | Modern browsers only, Playwright testing |
| State management complexity | Medium | Medium | Comprehensive docs, unit tests, clear patterns |
| Mobile touch controls | Medium | Medium | Progressive enhancement, extensive touch testing |
| Save data corruption | Low | Low | Auto-backup system, version migration |
| Test maintenance burden | Medium | High | Well-structured tests, good coverage |
| Documentation debt | Medium | High | Write docs alongside code, JSDoc enforcement |

---

## **Success Criteria** ✨

### **Functional Requirements**
- ✅ All 3 playing paths fully functional (Gladiator, Lanista, Explorer)
- ✅ Ludus management system complete (facilities, finances, roster)
- ✅ Tournament system with brackets and rewards
- ✅ World exploration with 15+ cities/regions
- ✅ Quest system with main story and side quests
- ✅ All 10 gladiator classes playable with unique mechanics
- ✅ Grid combat with tactical positioning and terrain
- ✅ Talent system with 30 trees (3 per class)
- ✅ Equipment system with 5 rarity tiers
- ✅ Economic system with trading and investments
- ✅ Save/load system with multiple slots
- ✅ Achievement system tracking milestones

### **Technical Requirements**
- ✅ 70% test coverage (lines, functions, branches, statements)
- ✅ 60 FPS performance target (desktop)
- ✅ Mobile responsive (576px minimum width)
- ✅ Bundle size < 3MB (production build, increased for management systems)
- ✅ Lighthouse score > 90 (performance, accessibility)
- ✅ Redux state management for complex game state
- ✅ TypeScript strict mode with zero type errors

### **Quality Requirements**
- ✅ Zero ESLint errors
- ✅ All Prettier rules enforced
- ✅ WCAG AA accessibility compliance
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Mobile compatibility (iOS Safari, Chrome Android)

---

## **Future Enhancements** 🚀

### **Post-Launch Features (v6.0+)**
1. **Multiplayer** - PvP tournaments, ludus vs ludus competitions
2. **More Classes** - 5-10 additional gladiator classes (Retiarius, Thraex, Secutor)
3. **Advanced Management** - Staff hiring (trainers, doctors, scouts), building customization
4. **Dynamic Events** - Natural disasters, plagues, political upheavals affecting gameplay
5. **Breeding System** - Train children of famous gladiators, legacy mechanics
6. **Expanded World** - More regions (Gaul, Germania, Greece, Carthage)
7. **Naval Combat** - Ship battles, pirate encounters
8. **Gladiatrix Path** - Female gladiator storyline
9. **Beast Fights** - Lions, tigers, bears as opponents or allies
10. **Mod Support** - Custom classes, equipment, quests
3. **More Content** - Additional story paths, 100+ missions
4. **Audio System** - Music and sound effects
5. **Visual Effects** - Particle systems, advanced animations
6. **Mod Support** - Allow community-created content
7. **Leaderboards** - Global rankings
8. **Daily Challenges** - Rotating special missions
9. **Guild System** - Player organizations
10. **Advanced AI** - Machine learning opponents

---

## **Next Steps - Pending Approval** 🚦

**This comprehensive plan is ready for implementation. Awaiting approval to proceed with:**

1. ✅ **Phase 1** - Create project foundation (package.json, configs, .gitignore)
2. ✅ **Phase 2** - Scaffold complete directory structure
3. ✅ **Phase 3** - Implement core systems (state management, base component)
4. ✅ **Iterative development** through all remaining phases

**Upon approval, implementation will begin with Phase A (Weeks 1-4) focusing on:**
- Project initialization
- Core systems (State, Router, Components)
- Basic combat functionality
- Foundational UI

---

## **Revision History**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-26 | Initial comprehensive plan created | AI Assistant |

---

**This plan is based entirely on the AI development documents and ready for implementation. Ready to proceed upon your approval!** 🎮⚔️
