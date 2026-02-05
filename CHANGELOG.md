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

## [1.0.5] - 2026-02-05

Training XP calculation fix, Gladiator market refresh system, Automatic level-up system.

### Fixed
- **Training XP Mismatch**: Fixed bug where actual XP gained was much lower than displayed estimate. The morale value was being passed incorrectly (raw 0.1-1.5 instead of converted 0-100 scale), causing calculations to use ~50% effectiveness instead of proper morale bonus
- **Stat Gains**: Same fix applied to stat gain calculations during training
- **Automatic Level-Up**: Fixed bug where gladiators would not level up when reaching the XP threshold (e.g., 108/100 XP). Gladiators now automatically level up when they gain enough experience from:
  - Training regimens (daily XP gains)
  - Combat victories (50 XP base, +25 XP for kills)
  - Any other XP source via `addExperience` action
- **Level-Up Benefits**: Upon leveling up, gladiators now correctly receive:
  - 5 skill points to distribute
  - Increased max HP (based on level and constitution)
  - Increased max stamina (based on level and endurance)
  - Excess XP carries over to the next level
- **Existing Saves**: Gladiators with excess XP in existing save games will automatically level up when ending the next day
- **Sponsorship Duration**: Sponsorship days remaining now decrements daily when ending the day (was stuck at initial value) Sponsorships will now properly expire when their duration ends
- **Merchandise Income**: Purchased merchandise items now correctly add their daily income to the end-of-day gold calculation
- **Sponsorship Income**: Active sponsorship deals now correctly add their daily payment to the end-of-day gold calculation
- **Day Report**: The day report now shows separate entries for Fame Income, Merchandise Sales, and Sponsorships
- **Gold Calculation Order**: Fixed bug where the "insufficient gold" warning appeared even when income covered expenses. The system now correctly calculates `currentGold + income - expenses` before determining if you can afford expenses
- **Partial Payment**: If you can't fully afford expenses, the system now pays what it can and shows how much you're short (e.g., "Short 15g")

### Added
- **Auto Market Refresh**: Gladiator market now automatically refreshes every 10 days with new gladiators
- **Manual Market Refresh**: Pay 100 gold to instantly refresh the gladiator market for new options
- **Refresh Counter**: UI shows days remaining until the next automatic market refresh

---

## [1.0.4] - 2026-02-04

Building completion now updates quest objectives, daily quests now properly repeat after cooldown expires, Training system now properly updates quest objectives.

### Fixed
- **Repeatable Quests**: Fixed bug where the "Accept Quest" button was hidden for completed repeatable quests, preventing players from accepting them again
- **Daily Quest Visibility**: Daily quests now always show in the Daily tab, even when on cooldown
- **Building Quest Tracking**: Completing construction of a building now properly updates quest objectives with `type: 'build'` (e.g., "Build a training facility" in Building a Reputation quest)
- **Training Quest Tracking**: Assigning a training regimen to a gladiator now correctly updates quest objectives with `type: 'train'` (e.g., "Daily Training" quest)

### Added
- **Cooldown Indicator**: Daily quests on cooldown now display remaining days (e.g., "⏳ 1 day left")
- **Accept Again Button**: Repeatable quests show "Accept Again" button instead of "Accept Quest" when re-accepting

---

## [1.0.3] - 2026-02-04

Quest system fix for proper progress initialization.

### Fixed
- **Quest Progress Initialization**: Fixed a timing issue where existing progress wasn't being applied when accepting quests. Initial progress is now calculated and applied atomically in a single Redux action, ensuring:
  - Fame objectives (`gain_fame`) correctly start with your current ludus fame
  - Building objectives (`build`) properly recognize already constructed buildings
  - Gladiator objectives (`recruit_gladiator`) accurately count existing roster members
  - Faction favor objectives (`reach_favor`) start with current favor levels
  - Staff objectives (`hire_staff`) correctly recognize already hired staff

### Technical
- Modified `startQuest` reducer to accept `initialProgress` values for each objective
- Removed separate `updateObjective` dispatches that were racing with state updates

---

## [1.0.2] - 2026-02-04

Quest system improvements for better progress tracking.

### Added
- **Quest Progress Initialization**: When accepting a quest, existing progress is now recognized for cumulative objectives (fame, buildings, gladiators, faction favor, staff)

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
| 1.0.5 | 2026-02-05 | Auto level-up, training XP fix, market refresh, sponsorship/merchandise income |
| 1.0.4 | 2026-02-04 | Fixed tracking of quest objectives |
| 1.0.3 | 2026-02-04 | Fixed quest progress initialization timing issue |
| 1.0.2 | 2026-02-04 | Quest progress initialization recognizes existing game state |
| 1.0.1 | 2026-02-04 | Bug fixes, training/nutrition systems, balance improvements |
| 1.0.0 | 2026-02-04 | Initial public release with full game systems |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this project.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
