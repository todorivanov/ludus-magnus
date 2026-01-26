# Changelog

All notable changes to **Ludus Magnus: Reborn** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### In Development 🚧

**Current Sprint**: Foundation & Infrastructure Setup

**Status**: Setting up React + TypeScript + Tailwind CSS + Redux Toolkit architecture

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
- Project renamed from "Legends of the Arena" to "Ludus Magnus: Reborn"
- Focus shifted from tactical combat to ludus management and strategic gameplay
- Architecture modernized with React + TypeScript (was vanilla JS + Web Components)

---

## Version History

- **1.0.0** - Initial release, foundation setup (2026-01-26)

[Unreleased]: https://github.com/yourusername/ludus-magnus-reborn/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/ludus-magnus-reborn/releases/tag/v1.0.0