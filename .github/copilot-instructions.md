# Ludus Magnus: Reborn - Copilot Instructions (React/Redux Edition)

## Project Overview
Ludus Magnus: Reborn is a browser-based gladiator management RPG built with **React 18+, TypeScript 5+, Redux Toolkit, and Tailwind CSS**. The game blends tycoon-style ludus management, tactical turn-based grid combat, and story-driven campaigns set in the Roman era.

## Architecture Principles

### UI & Component System
- **All UI is built with React functional components** (no Web Components)
- **Component organization:**
  - `src/components/` for all UI (combat, ludus, tournament, screens, common, layout, etc.)
  - Use hooks for state and logic (`useAppSelector`, `useAppDispatch`, custom hooks)
  - Styling via Tailwind CSS and component-level SCSS
- **Naming:** PascalCase for components, camelCase for props/variables

### State Management
- **Single source of truth:** Redux Toolkit store (`src/store/`)
- **Slices:** player, inventory, equipped, stats, story, unlocks, settings
- **Never mutate state directly** – always use Redux actions
- **Persistence:** SaveManager utility for localStorage, auto-save every 30s, manual save/export/import
- **Access state:**
  - Read: `useAppSelector((state) => state.player)`
  - Write: `dispatch(playerActions.updatePlayer(...))`

### Combat & Game Systems
- **Combat:** Turn-based, grid-based tactical system (9x9 battlefield)
- **Game logic:** Modular managers in `src/game/` (CombatEngine, GridManager, FacilityManager, etc.)
- **Entities:** Fighter, LudusFacility, Tournament, etc. in `src/entities/`
- **Data:** Static data in `src/data/` (classes, equipment, talents, story paths, missions)

### Routing
- **React Router v6** for all navigation (`src/App.tsx`, `src/config/routes.ts`)
- **Protected routes:** Require character creation before accessing main screens

### Testing
- **Unit:** Vitest (`tests/unit/`)
- **E2E:** Playwright (`tests/e2e/`)
- **Coverage:** 70%+ target
- **Test utilities:** `tests/setup.js`, `utils/testHelpers.ts`

## Development Workflows

### Running the Project
```bash
npm run dev          # Start Vite dev server (port 3000)
npm run build        # Production build to /dist
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint issues
```

### Testing
```bash
npm run test:unit    # Vitest unit tests with coverage
npm run test:e2e     # Playwright E2E tests
npm run test:watch   # Watch mode for TDD
npm run test:all     # Full test suite
```

## File Organization
```
src/
  components/      # React UI components
  game/            # Game logic (managers, systems)
  entities/        # Core entities (Fighter, Facility, etc.)
  store/           # Redux Toolkit state (slices, store)
  data/            # Static game data (classes, equipment, talents, story)
  utils/           # Helpers (SaveManager, Logger, etc.)
  config/          # Routing and constants
  hooks/           # Custom React hooks
  styles/          # Tailwind and SCSS
```

## Common Tasks & Conventions

### Adding a New Feature
1. **State:** Add/extend Redux slice in `store/`
2. **UI:** Add React component in `components/`
3. **Logic:** Add/extend manager in `game/`
4. **Data:** Add to `data/` if needed
5. **Tests:** Add/extend tests in `tests/`

### Combat & Grid
- Use `CombatEngine`, `GridManager`, `GridCombatIntegration` for all combat logic
- All grid actions, movement, and skills are managed via Redux and game managers

### Facilities & Management
- Facility types: `'barracks'`, `'training_ground'`, `'medical_wing'`, `'armory'`, `'library'`, `'arena'`, `'market'`, `'temple'`, `'treasury'`, `'stable'`, `'forge'`, `'tavern'`
- Use `FacilityManager` for all facility logic (costs, upgrades, bonuses)

### Story Paths & Character Creation
- Multi-step character creation: path, origin, class, name
- Story path types: `'gladiator'`, `'lanista'`, `'explorer'`
- Origin-specific bonuses and quests

### Code Style
- **TypeScript strict mode**
- **Naming:** camelCase for variables, PascalCase for types/classes, UPPER_SNAKE_CASE for constants
- **Prefer functional components and hooks**
- **JSDoc** for public functions
- **Error handling:** Use try/catch for async, log with Logger

## Project-Specific Gotchas
1. **Never mutate Redux state directly** – always use actions
2. **All facility/entity types must match union types**
3. **No Web Components or vanilla JS patterns**
4. **All UI is React, all state is Redux**
5. **Use Tailwind for styling, not Bootstrap**
6. **All static data is imported from `data/`**
7. **Auto-save only after character creation**
8. **Test coverage target: 70%+**

## Documentation References
- [docs/COMPREHENSIVE_PROJECT_SETUP_PLAN.md](../docs/COMPREHENSIVE_PROJECT_SETUP_PLAN.md)
- [CHANGELOG.md](../CHANGELOG.md)
- [docs/STATE_MANAGEMENT.md](../docs/STATE_MANAGEMENT.md)
- [guides/TALENT_SYSTEM_GUIDE.md](../guides/TALENT_SYSTEM_GUIDE.md)
- [guides/GRID_COMBAT_SYSTEM.md](../guides/GRID_COMBAT_SYSTEM.md)

---
**When in doubt, follow the React/Redux/TypeScript patterns and check the docs above.**
