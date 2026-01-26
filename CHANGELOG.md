# Changelog

All notable changes to **Ludus Magnus: Reborn** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### In Development 🚧

**Current Sprint**: Phase 7 - Story Path Integration & Character Creation

**Status**: Combat UI ✅ + Ludus UI ✅ + Tournament UI ✅ + Screen Integration ✅ + Persistence ✅ + Story Paths ✅ complete!

**Next Priority**: Phase 8 - Testing, bug fixes, and polish

### Added - Phase 7: Story Path Integration (2026-01-26) 📖

**Character Creation System**:
- **Multi-Step Creation Flow** - 5-step immersive character creation (896 lines)
  - Step 1: Historical intro (193 AD - Year of Five Emperors)
  - Step 2: Path selection (Gladiator, Lanista, Explorer)
  - Step 3: Origin selection (3 origins per path)
  - Step 4: Class selection (recommended classes per path)
  - Step 5: Name input with summary
  
- **Three Story Paths** (from lore documentation):
  - **⚔️ The Gladiator** - "The Chain Breaker"
    - Theme: Survival, Grit, and the Price of Liberty
    - Starting Status: Slave (Debt: 5000 Denarii)
    - Origins: Thracian Veteran, Disgraced Noble, Barbarian Prisoner
    
  - **🏛️ The Lanista** - "The Architect of Glory"
    - Theme: Management, Ambition, and the Burden of Command
    - Starting Status: Owner of a Ludus
    - Origins: The Heir, The Merchant, The Retired Champion
    
  - **🗺️ The Explorer** - "The Hunter of Myths"
    - Theme: Freedom, Discovery, and the Choice of Legacy
    - Starting Status: Free Agent (Mobile Caravan)
    - Origins: The Venator, The Merchant Prince, The Wandering Lanista

**State Management Updates**:
- Updated [state.types.ts](src/types/state.types.ts) with path/origin types
  - `StoryPath` type: 'gladiator' | 'lanista' | 'explorer'
  - `CharacterOrigin` types: GladiatorOrigin, LanistaOrigin, ExplorerOrigin
  - Added `origin` field to PlayerState
  
- Updated [playerSlice.ts](src/store/slices/playerSlice.ts) with new action
  - `createCharacterWithPath` - Creates character with path, origin, and class
  - Path-specific starting gold (0 for gladiators, 500-10,000 for others)
  - Origin-specific bonuses (traits, items, quests)

**Routing Updates**:
- Updated [App.tsx](src/App.tsx) with protected routes
  - All screens redirect to character creation if no character exists
  - No-save detection forces character creation on first visit
  - saveManager integration for hasSave() check

**UI Enhancements**:
- Updated [ProfileScreen](src/components/screens/ProfileScreen.tsx)
  - Displays selected story path and origin
  - Path name formatting with icons
  - Origin name with subtitle
  
- **Historical Lore Integration**:
  - All three paths based on lore/Path X Design.md documentation
  - 193 AD historical context (Year of Five Emperors)
  - Real locations: Capua, Philippopolis (Trimontium), Thrace
  - Septimius Severus timeline integration

**Features**:
- ✅ 5-step immersive character creation
- ✅ 3 story paths with unique themes
- ✅ 9 total origins (3 per path)
- ✅ Path-specific class recommendations
- ✅ Historical context and lore
- ✅ Origin-specific bonuses and quests
- ✅ Path-specific starting gold (0-10,000)
- ✅ Protected routing (requires character)
- ✅ No-save detection and forced creation

**Future Enhancements**:
- Path-specific quests and storylines
- Origin-specific unique items (Legionary Ring, Signet Ring, Wolf Pelt, etc.)
- Path progression and branching narratives
- Origin-specific NPCs and dialogue
- Historical events tied to 193 AD timeline

### Added - Phase 6: Persistence & Save System (2026-01-26) 💾

**SaveManager**:
- **SaveManager.ts** - Game state persistence utility (150 lines)
  - Save Redux state to localStorage with JSON serialization
  - Load saved state on app startup with preloadedState
  - Auto-save every 30 seconds (only when character created)
  - Save on page exit (beforeunload event)
  - Version tracking (currently v1.0.0)
  - Timestamp tracking for last save
  - Export/import save files (JSON format)
  - Delete save functionality
  - Save info metadata (version, timestamp)

**Store Integration**:
- Updated [store/index.ts](src/store/index.ts) with persistence
  - `loadSavedState()` function loads from SaveManager
  - `preloadedState` restores Redux state on startup
  - `startAutoSave()` function begins 30-second interval
  - `stopAutoSave()` function clears interval
  - `saveGame()` function for manual saves
  - Auto-save only runs after character creation

**UI Integration**:
- Updated [ProfileScreen](src/components/screens/ProfileScreen.tsx) with save management
  - 💾 Save Game button (manual save)
  - 📥 Export Save button (download JSON)
  - 📤 Import Save button (upload JSON)
  - 🗑️ Delete Save button (with confirmation)
  - Last saved timestamp display
  - Save version display
  - Status messages (success/error feedback)
  - Auto-save info footer

**Lifecycle Integration**:
- Updated [main.tsx](src/main.tsx) with save lifecycle
  - Loads saved state on app mount
  - Starts auto-save if character exists
  - Saves on page exit (beforeunload)
  - Logging for save events

**Features**:
- ✅ Automatic persistence (30-second interval)
- ✅ Manual save/load controls
- ✅ Export/import for backups
- ✅ Version migration support (placeholder)
- ✅ Error handling with console logging
- ✅ Save state validation
- ✅ Character creation check before auto-save

**Future Enhancements**:
- LZ-String compression for smaller save files
- Cloud save integration
- Multiple save slots
- Save versioning and migration
- Save corruption recovery

### Added - Phase 5: Screen Integration & Routing (2026-01-26) 🎮

**Screen Components**:
- **MainGameScreen** - Combat arena screen (240 lines)
  - Pre-battle setup with fighter display
  - Difficulty selection (Easy ⭐ → Nightmare ⭐⭐⭐⭐)
  - Enemy generation based on difficulty
  - CombatArena integration for turn-based battles
  - Post-battle rewards (gold + XP based on difficulty)
  - Victory/defeat stat tracking
  - Navigation back to title screen
  
- **LudusScreen** - Ludus management screen (210 lines)
  - LudusDashboard integration with full state management
  - Sample gladiator roster (Spartacus, Crixus, Gannicus)
  - Facility build/upgrade handlers with cost validation
  - Gladiator recruit/train/release actions
  - Financial tracking (revenue, expenses, income, spent)
  - Prestige and reputation visualization
  - Redux integration for gold management
  
- **TournamentScreen** - Tournament management screen (220 lines)
  - TournamentBrowser with 5 sample tournaments
  - Difficulty filtering (easy, medium, hard, legendary)
  - Status filtering (open, in_progress, completed)
  - Tournament registration flow with TournamentEntry modal
  - TournamentBracket visualization for active tournaments
  - Fighter eligibility checks (level, HP)
  - Gold affordability validation
  - View mode switching (browser → entry → bracket)

**Routing & Navigation**:
- Updated [App.tsx](src/App.tsx) with 3 new routes:
  - `/game` - MainGameScreen
  - `/ludus` - LudusScreen
  - `/tournament` - TournamentScreen
- Updated [TitleScreen](src/components/screens/TitleScreen.tsx) navigation:
  - ⚔️ Enter Arena (primary) → `/game`
  - 🏛️ Manage Ludus (primary) → `/ludus`
  - 🏆 Enter Tournament (primary) → `/tournament`
  - 📊 View Profile (secondary) → `/profile`
  - 🗺️ Explore World (disabled - coming soon)
- Lazy loading for all screens (better performance)
- Protected routes based on character creation status

**State Management Integration**:
- Redux hooks in all screens (useAppSelector, useAppDispatch)
- Gold spending/earning via Redux actions
- Stat tracking (wins, losses, fights played)
- XP/level progression hooks
- Equipment integration preparation

**Sample Data**:
- 5 tournaments with varied difficulties and statuses
- 4 sample gladiators with different classes
- 2 sample facilities (Barracks Lv2, Training Ground Lv1)
- Enemy name pool (10 names: Brutus, Maximus, etc.)
- Gladiator name pool (10 names: Spartacus, Crixus, etc.)

### Added - Phase 4: Tournament UI Components (2026-01-26) 🏆

**Tournament Components**:
- **TournamentBrowser** - Browse and register for tournaments (280 lines)
  - Tournament list with filtering (difficulty: easy/medium/hard/legendary, status: open/in_progress/completed)
  - Tournament cards with prize pool, entry fee, participants, min level
  - Registration requirements validation (level, gold, spots available)
  - Difficulty badges with color coding
  - Status indicators (🟢 Open, 🟡 In Progress, ⚫ Completed)
  - Selected tournament highlighting
  - Register button with affordability checks
  - Empty state when no tournaments match filters
  
- **TournamentBracket** - Visualize tournament progression (210 lines)
  - Multi-round bracket visualization (8, 16, 32, 64 fighters)
  - Match cards with fighter names and VS divider
  - Winner indicators (✅) and status colors
  - Round headers (Finals, Semi-Finals, Round X)
  - Match selection with detailed view
  - Fighter highlighting for tracking your gladiator
  - Status legend (Pending, Ready, Completed)
  - Horizontal scrolling for large brackets
  
- **TournamentEntry** - Registration modal (240 lines)
  - Full-screen modal overlay
  - Tournament details: prize pool, entry fee, min level, participants
  - Gladiator selection interface (grid view)
  - Eligibility filtering (level requirement + HP > 0)
  - Fighter cards with HP bars, stats, class colors
  - Selected gladiator summary
  - Financial validation: current gold, remaining gold after entry
  - Gold warning when insufficient funds
  - Empty state when no eligible gladiators
  - Confirm/Cancel actions

**Component Organization**:
- Created `/src/components/tournament/` directory
- Barrel export via `index.ts`
- Full TypeScript type safety
- Integration with Tournament types (TournamentBracket, TournamentMatch)
- Modal pattern for registration flow

**Tournament System Integration**:
- Tournament filtering by difficulty and status
- Bracket visualization with rounds and matches
- Fighter eligibility checks (level, HP)
- Gold affordability validation
- Prize pool and entry fee display

### Added - Phase 4: Ludus Management UI (2026-01-26) 🏛️

**Ludus Components**:
- **LudusDashboard** - Main ludus management screen (460 lines)
  - 4 tabs: Overview, Roster, Facilities, Finance
  - Ludus header with prestige, reputation, and gold display
  - Quick stats bar: prestige level, reputation status, gladiator count, facilities, daily net
  - Overview tab: comprehensive ludus information and financial summary
  - Quick action buttons for navigation
  - Responsive layout with gradient styling
  
- **RosterManagement** - Gladiator roster interface (320 lines)
  - Grid and list view modes
  - Fighter cards with HP bars, level, stats (STR/DEF/SPD)
  - Train/Release actions with cost validation
  - Roster capacity tracking (current/max)
  - Stats bar: total gladiators, average level, highest level, capacity
  - Class-specific color coding (10 class colors)
  - Empty state for new ludus
  - Add new gladiator card when under capacity
  
- **FacilityManagement** - Build and upgrade facilities (260 lines)
  - Two-tab interface: "My Facilities" vs "Build New"
  - 12 facility types with icons: BARRACKS 🏚️, TRAINING_GROUND ⚔️, ARMORY 🛡️, INFIRMARY 🏥, TAVERN 🍺, SHRINE ⛪, LIBRARY 📚, FORGE 🔨, STABLE 🐴, MARKET 🏪, ARENA 🏛️, TREASURY 💰
  - Owned facilities: level display (1-5/MAX), maintenance cost, bonus %, upgrade button
  - Available facilities: build cost, starting stats, build button
  - Affordability validation with visual feedback
  - Empty states for zero facilities and all facilities built
  - FacilityManager integration for costs and bonuses
  
- **FinancePanel** - Financial overview (145 lines)
  - Large gold balance display
  - Daily revenue (green) and expenses (red) cards
  - Net daily income with profit/loss indicator
  - Bankruptcy warning when losing money
  - Profit margin percentage calculation
  - Detailed stats grid: total income, total spent, net lifetime, days of reserve
  - Financial health progress bar (red/yellow/green gradient)

**Component Organization**:
- Created `/src/components/ludus/` directory
- Barrel export via `index.ts`
- Full TypeScript type safety
- Integration with FacilityManager singleton
- Callback-based parent state management

**Ludus System Integration**:
- Fighter roster display with Fighter class properties
- Facility build/upgrade with cost calculations
- Financial tracking with formatGold/formatNumber helpers
- Prestige and reputation visualization
- Roster capacity management

### Added - Phase 4: Combat UI Components (2026-01-26) 🎨

**Combat Components**:
- **FighterCard** - Fighter display component
  - Real-time HP/Mana bars with color-coded health
  - Detailed stats display (STR, DEF, SPD, CRT)
  - Status effects visualization
  - Player vs Enemy styling (blue/red borders)
  - Defeated state indicator
  
- **CombatLog** - Battle event logger
  - Scrollable combat history with auto-scroll
  - 8 event types: attack, damage, heal, skill, status, system, victory, defeat
  - Color-coded entries with icons
  - Timestamp tracking
  - Event count display

- **ActionSelection** - Combat action interface
  - 4 main actions: Attack, Defend, Skills, Wait
  - Expandable skills panel with 30 class skills
  - Real-time mana/cooldown validation
  - Skill descriptions and mana costs
  - Turn indicator (player/enemy)
  - Gradient button styling

- **CombatArena** - Main combat orchestrator
  - Full turn-based combat flow
  - Player vs AI battle system
  - 4 difficulty levels (easy, normal, hard, nightmare)
  - Skill cooldown management
  - Battle phase system (preparation → turns → victory/defeat)
  - Real-time fighter state updates
  - Combat log integration
  - Victory/Defeat screens

**Component Organization**:
- Created `/src/components/combat/` directory
- Barrel export via `index.ts`
- Full TypeScript type safety
- Tailwind CSS styling throughout

---

## [1.1.0] - 2026-01-26

### Added - Phase 3: Core Game Systems ⚙️

**Game Engines & Systems**:
- **CombatEngine** - Pure damage calculation functions with TypeScript types
  - `calculateDamage()` - Base damage with critical hits and defense
  - `applyDamage()` - HP reduction with safety checks
  - `healFighter()` - Healing with overheal tracking
  - `performAttack()` - Complete attack with hit chance
  - `canAct()` / `isAlive()` / `isDefeated()` - Fighter state checks
  - Combat stats tracking system
  
- **SkillSystem** - Character abilities and skills
  - 30 skills total (3 per class × 10 classes)
  - Skill types: offensive, defensive, utility, movement
  - Mana costs and cooldown system
  - `getClassSkills()` - Class-specific skill sets
  - `canUseSkill()` - Validation with mana/cooldown checks
  - `useSkill()` - Skill execution with effects
  - Movement skills for grid combat (10-15 mana, 0-2 turn cooldowns)

- **AISystem** - Opponent AI behavior
  - 4 difficulty levels: easy, normal, hard, nightmare
  - AI personalities with 4 traits: aggression, skillUsage, preservation, intelligence
  - `makeAIDecision()` - Strategic decision making
  - `makeRandomDecision()` - Random AI for testing
  - `makeAggressiveDecision()` - Pure offense AI
  - `makeDefensiveDecision()` - Survival-focused AI
  - Health evaluation (critical/low/medium/high)
  - Threat calculation system

**Utility Systems**:
- **Logger** - Centralized logging with categories
  - 11 log categories: SYSTEM, COMBAT, UI, STORE, ROUTER, AI, PERFORMANCE, LUDUS, TOURNAMENT, FACILITY, ERROR
  - 4 log levels: DEBUG, INFO, WARN, ERROR
  - Performance profiling with `perf()` and `profile()`
  - Development-only logging
  - Timestamp formatting

- **helpers** - Common utility functions (40+ functions)
  - ID generation, random utilities (int, float, element, shuffle)
  - Math utilities (clamp, lerp, easeInOutCubic, distance)
  - Number formatting (comma separators, gold, percentage, win rate)
  - Time utilities (delay, formatDuration, formatTimestamp)
  - Array utilities (shuffle, randomElement)
  - Function utilities (debounce, throttle)
  - Object utilities (deepClone, isEmpty)
  - String utilities (capitalize, pluralize)
  - XP/Level calculations

**Refactoring & Code Quality**:
- Extracted CHARACTER_BASE_STATS to `data/characterStats.ts`
- **Extracted CLASS_SKILLS to `data/classSkills.ts`** (410 lines of skills data)
  - SkillSystem.ts reduced from 526 to 120 lines (77% reduction)
  - All 30 skills (10 classes × 3 skills) in dedicated data file
  - Better separation of data vs logic
- Created FacilityManager class (170+ lines)
- Refactored LudusManager to use FacilityManager
- Split monolithic ludus.types.ts into 7 focused files:
  - ludus.core.types (80 lines) - Core ludus & prestige
  - facility.types (50 lines) - 12 facility types
  - gladiator.roster.types (80 lines) - Roster management
  - tournament.types (70 lines) - Tournament system
  - location.types (40 lines) - 10 cities & world
  - quest.types (40 lines) - Quest system
  - event.types (50 lines) - Dynamic game events
- Removed 170+ lines of hardcoded stats from Fighter.ts
- Updated imports to use modular type files

**Technical Improvements**:
- All game systems use TypeScript with strict types
- Pure functions for combat calculations (testable)
- Singleton pattern for managers (FacilityManager, LudusManager, TournamentManager)
- Logger integration throughout all systems
- ESLint compliance with proper type safety

### Changed
- Fighter.ts now imports CHARACTER_BASE_STATS from external file
- LudusManager delegates facility operations to FacilityManager
- TournamentManager imports from modular type files

### Removed
- Deprecated ludus.types.ts (replaced by 7 modular files)
- Inline character stats from Fighter.ts (moved to data file)
- Duplicate facility methods from LudusManager (moved to FacilityManager)
- Unused TypeScript imports (TournamentStatus)

### Fixed
- TypeScript errors in Fighter.ts (type compatibility)
- ESLint errors in Logger.ts (console statements, any types)
- ESLint errors in helpers.ts (any types, array access safety)
- TypeScript path alias conflicts (CityId export)

---

## [1.0.0] - 2026-01-26

### Added - Project Initialization 🎉

**Initial Release**: Ludus Magnus: Reborn

This marks the beginning of a new gladiator management RPG focused on building and managing your own ludus (gladiator school).

#### Core Features Planned
- **Three Playing Paths**:
  - 🗡️ Gladiator Path - Fight for freedom, then explore or build your ludus
  - 🏛️ Lanista Path - Manage your established ludus and explore the world
  - 🗺️ Explorer Path - Fight for money, purchase land, build ludus, or explore
- **Ludus Management System** - Build facilities, upgrade training grounds, manage finances
- **Tournament System** - Enter arena battles with stakes, prizes, and crowd reputation
- **World Exploration** - Travel between cities, discover locations, complete quests
- **Economic Simulation** - Buy/sell land, invest in facilities, manage revenue streams

#### Technical Foundation
- **Stack**: React 18 + TypeScript 5 + Tailwind CSS 3 + Redux Toolkit 2
- **Build System**: Vite 5 with HMR and path aliases
- **State Management**: Redux Toolkit with 7 slices (player, inventory, equipped, stats, story, unlocks, settings)
- **Testing**: Vitest for unit/integration, Playwright for E2E
- **Code Quality**: ESLint + Prettier with TypeScript support
- **Styling**: Tailwind CSS with custom theme and SCSS for complex animations

#### Files Created (Phase 1)
**Configuration Files**:
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Build configuration with path aliases
- `tsconfig.json` / `tsconfig.node.json` - TypeScript strict mode
- `tailwind.config.js` - Custom theme (colors, fonts, animations)
- `postcss.config.js` - Tailwind processing
- `.eslintrc.cjs` - React + TypeScript linting rules
- `.prettierrc` - Code formatting
- `.gitignore` - Git exclusions
- `vitest.config.ts` - Testing configuration
- `playwright.config.ts` - E2E testing setup

**Application Files**:
- `index.html` - React entry point
- `src/main.tsx` - Application bootstrap
- `src/App.tsx` - Root component with routing
- `src/styles/index.css` - Global styles and utilities

**Type Definitions**:
- `src/types/game.types.ts` - Game entities (Fighter, Equipment, Mission, etc.)
- `src/types/state.types.ts` - Redux state interfaces
- `src/types/index.ts` - Type exports

**Redux Store**:
- `src/store/index.ts` - Store configuration
- `src/store/slices/playerSlice.ts` - Player character state (10 actions)
- `src/store/slices/inventorySlice.ts` - Equipment inventory (3 actions)
- `src/store/slices/equippedSlice.ts` - Equipped items (3 actions)
- `src/store/slices/statsSlice.ts` - Combat statistics (3 actions)
- `src/store/slices/storySlice.ts` - Story progression (4 actions)
- `src/store/slices/unlocksSlice.ts` - Achievements (1 action)
- `src/store/slices/settingsSlice.ts` - Game settings (6 actions)

**Custom Hooks**:
- `src/hooks/useAppDispatch.ts` - Typed dispatch hook
- `src/hooks/useAppSelector.ts` - Typed selector hook

**Components**:
- `src/components/common/LoadingSpinner.tsx` - Loading indicator
- `src/components/common/ErrorBoundary.tsx` - Error handling
- `src/components/layout/MainLayout.tsx` - App layout wrapper
- `src/components/screens/CharacterCreation.tsx` - Character creation form
- `src/components/screens/TitleScreen.tsx` - Main menu
- `src/components/screens/ProfileScreen.tsx` - Player stats display

**Documentation**:
- `docs/COMPREHENSIVE_PROJECT_SETUP_PLAN.md` - Complete project roadmap with game design
- `README.md` - Project overview (to be updated)

#### Architecture Decisions
- **Redux Toolkit over Context API** - Complex game state requires robust state management
- **Strict TypeScript** - Type safety from the ground up
- **Path Aliases** - Clean imports with `@/`, `@components/`, `@store/`, etc.
- **Tailwind-First** - Utility-first CSS with SCSS for complex animations
- **Component Modularity** - Separation of concerns (common, layout, screens)

### Changed
- Focus shifted from tactical combat to ludus management and strategic gameplay
- Architecture modernized with React + TypeScript (was vanilla JS + Web Components)

---

## Version History

- **1.0.0** - Initial release, foundation setup (2026-01-26)

[Unreleased]: https://github.com/yourusername/ludus-magnus-reborn/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/ludus-magnus-reborn/releases/tag/v1.0.0