# Changelog

All notable changes to Ludus Magnus: Reborn will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Sound effects and music
- Additional gladiator classes
- More story content
- Multiplayer features (future consideration)

---

## [1.0.1] - 2026-02-04

Bug fixes and balance improvements for the initial release.

### Fixed
- **Gladiator Recovery**: Rest and recovery now properly updates gladiator HP, stamina, fatigue, and morale
- **Quest Progress**: Purchasing gladiators now correctly updates quest objectives (recruit_gladiator type)
- **Quest Progress**: Winning arena battles now correctly updates quest objectives (win_matches type)
- **Fame Tracking**: Fame changes now properly update quest objectives (gain_fame type)
- **Fame Display**: Ludus fame now correctly displays on the dashboard (was reading from wrong Redux slice)
- **Building Construction**: Building construction and upgrades now properly progress when ending the day
- **Training System**: Training regimens now properly apply XP gains, stat improvements, and fatigue
- **Nutrition System**: Nutrition quality now affects healing, training effectiveness, morale, and injury resistance
- **Resource Consumption**: Daily resource consumption (grain, water, wine) based on gladiator nutrition levels
- **Game Reset**: Reset game now properly clears all saved data from localStorage

### Changed
- **Starting Gold**: Increased starting gold for all difficulty levels for a smoother early game:
  - Easy: 500g → 750g
  - Normal: 300g → 500g
  - Hard: 150g → 300g

### Improved
- **Title Screen**: Settings button now only visible when there's a saved game
- **Save Detection**: More robust check for detecting existing save data

---

## [1.0.0] - 2026-02-04

This is the first public release of **Ludus Magnus: Reborn**, a complete Roman gladiator ludus management simulation.

### Added

#### Core Systems
- Complete gladiator management simulation
- 8 unique gladiator classes (Murmillo, Retiarius, Thraex, Secutor, Hoplomachus, Dimachaerus, Samnite, Velitus)
- Turn-based combat system with AI opponents
- 11 building types with 3 upgrade levels each
- 7 staff roles with skill trees
- Day/night cycle with daily processing

#### Game Features
- **Ludus Management**: Build and upgrade your gladiator school
- **Gladiator System**: Recruit, train, and manage fighters with detailed stats
- **Training System**: Multiple training regimens and nutrition options
- **Combat Arena**: Multiple match types (Pit Fights, Munera, Grand Munera, Championships)
- **Staff System**: Hire and manage personnel (Doctore, Medicus, Faber, Cook, Guard, Accountant, Scout)
- **Economy**: Gold-based economy with marketplace for gladiators and resources
- **Fame System**: Dual fame tracking for Ludus and individual Gladiators
- **Political Factions**: 4 factions (Optimates, Populares, Military, Merchants) with favor system
- **Quest System**: Story campaign with 5 chapters + side quests and daily quests
- **Time System**: Day progression with random events and rebellion mechanics

#### UI/UX
- Roman-themed visual design with custom color palette
- Responsive layout for desktop, tablet, and mobile
- Framer Motion animations throughout
- In-game Codex with lore, tutorials, and game mechanics
- Toast notification system
- Settings screen with difficulty options
- Dynamic version display with changelog link

#### Technical
- React 18 with TypeScript
- Redux Toolkit for state management
- Redux Persist for save games (localStorage)
- Tailwind CSS with custom Roman theme
- Vite build system with optimized builds
- GitHub Actions CI/CD pipeline
- Deployment to GitHub Pages on release

### Documentation
- Comprehensive README with getting started guide
- Contributing guidelines (CONTRIBUTING.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- Security policy (SECURITY.md)
- In-game Codex with historical Roman lore
- GitHub issue templates for bugs, features, and balance feedback

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.0.1 | 2026-02-04 | Bug fixes, training/nutrition systems, balance improvements |
| 1.0.0 | 2026-02-04 | Initial public release with full game systems |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this project.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
