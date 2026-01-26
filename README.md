# ludus-magnus
Ludus Magnus: Reborn is a browser-based strategy and role-playing game built with React. Set in the Roman era, the game blends tycoon-style management with tactical turn-based combat.

# Ludus Magnus: Reborn

A modern, open-source gladiator management RPG for the browser. Build your ludus, train legendary fighters, and conquer the Roman arena through tactical turn-based combat, deep management, and branching story campaigns.

---

## Features

- **Three Playable Paths:**
	- ⚔️ Gladiator: Fight for freedom, then explore or build your own ludus
	- 🏛️ Lanista: Manage an established ludus, recruit and train gladiators, compete in tournaments
	- 🗺️ Explorer: Roam the Roman world, take contracts, build your legend, or start a ludus from scratch
- **Ludus Management:** Build, upgrade, and manage 12 unique facilities (barracks, training ground, medical wing, armory, etc.)
- **Tactical Grid Combat:** 9x9 turn-based battles with terrain, flanking, skills, and status effects
- **Talent Trees:** 3 specialization trees per class, 30+ unique builds
- **Equipment System:** 24+ items, rarity tiers, durability, and upgrades
- **Story Campaigns:** 5 story paths, 68+ missions, historical lore, and branching choices
- **Tournament System:** Bracketed tournaments, prize pools, and prestige
- **World Exploration:** 15+ cities, random encounters, trading, and quests
- **Progression:** Level up, unlock talents, earn achievements, and build your legend
- **Save System:** Auto-save, manual save, import/export, and version migration

---

## Tech Stack

- **Frontend:** React 18+, TypeScript 5+, Redux Toolkit, Tailwind CSS, SCSS
- **Build:** Vite 5
- **Testing:** Vitest (unit), Playwright (E2E)
- **State:** Redux Toolkit (7+ slices)
- **Persistence:** LocalStorage + LZ-String compression

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/ludus-magnus-reborn.git
cd ludus-magnus-reborn

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Build & Test
```bash
npm run build        # Production build
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Lint code
```

---

## Project Structure
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

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- All code must pass linting and tests

---

## Documentation
- [Comprehensive Project Plan](docs/COMPREHENSIVE_PROJECT_SETUP_PLAN.md)
- [State Management](docs/STATE_MANAGEMENT.md)
- [Talent System Guide](guides/TALENT_SYSTEM_GUIDE.md)
- [Grid Combat System](guides/GRID_COMBAT_SYSTEM.md)
- [Changelog](CHANGELOG.md)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements
- Inspired by classic management sims and tactical RPGs
- Built with ❤️ by the open source community
