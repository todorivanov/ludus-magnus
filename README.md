# Ludus Magnus: Reborn

<div align="center">

![Ludus Magnus: Reborn](https://img.shields.io/badge/Status-Released-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=for-the-badge&logo=tailwindcss)

**A Roman Gladiator Ludus Management Simulation**

*Build your gladiator school. Train legendary fighters. Conquer the arena.*

[Play Now](#getting-started) • [Features](#features) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 📜 About

**Ludus Magnus: Reborn** is a web-based management simulation game where you take on the role of a *lanista* - the owner of a Roman gladiator school (*ludus*). Set in ancient Rome, you'll recruit and train gladiators, manage your facilities, navigate treacherous politics, and compete for glory in the arena.

This game is built entirely with modern web technologies and runs in your browser with no backend required. All game data is saved locally using your browser's storage.

## ✨ Features

### 🏛️ Ludus Management
- **11 Building Types** with 3 upgrade levels each
- Construction system with prerequisites and timers
- Building synergies that boost staff effectiveness
- Visual ludus layout management

### ⚔️ Gladiator System
- **8 Unique Gladiator Classes**: Murmillo, Retiarius, Thraex, Secutor, Hoplomachus, Dimachaerus, Samnite, Velitus
- **Detailed Stats**: Strength, Agility, Dexterity, Endurance, Constitution
- Skill trees with class-specific abilities
- Training regimens and nutrition management
- Injury and recovery system

### 🏟️ Arena Combat
- Turn-based tactical combat system
- Multiple match types (Pit Fights, Provincial Munera, Championships)
- AI opponents with difficulty scaling
- Combat effects and status conditions
- Crowd favor and mercy mechanics

### 👥 Staff & Personnel
- **7 Staff Roles**: Doctore, Medicus, Faber, Architect, Educator, Bard, Spy
- Hiring costs and ongoing wages
- Staff skill trees and progression
- Satisfaction and loyalty system

### 💰 Economy
- Gold-based economy with income/expense tracking
- Dynamic marketplace with price fluctuations
- Merchandise and passive income streams
- Bankruptcy prevention mechanics

### ⭐ Fame System
- Dual fame tracking (Ludus Fame + Individual Gladiator Fame)
- Fame tiers unlocking new opportunities
- Sponsorships and merchandise deals
- Hall of Fame for legendary gladiators

### 🏛️ Political Factions
- **4 Factions**: Optimates, Populares, Military Legion, Merchant Guild
- Favor system with benefits and penalties
- Political actions and sabotage mechanics
- Alliance system

### 📜 Quest System
- Story-driven campaign with 5 chapters
- Side quests and daily challenges
- Branching dialogue with consequences
- Endless mode after completion

### 🌙 Time System
- Day/night cycle with time phases
- Daily processing (expenses, recovery, events)
- Random events and encounters
- Rebellion/unrest mechanics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/legends-of-the-arena.git

# Navigate to project directory
cd legends-of-the-arena

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

### Starting Out

1. **Create Your Ludus**: Choose a name for your gladiator school and select a difficulty level
2. **Recruit Gladiators**: Visit the marketplace to purchase your first fighters
3. **Build Facilities**: Construct training posts and other buildings
4. **Train Your Fighters**: Assign training regimens to improve stats
5. **Enter the Arena**: Schedule matches to earn gold and fame

### Tips for Success

- Start with defensive gladiator classes (Murmillo, Samnite) - they're forgiving for beginners
- Build the Valetudinarium (medical facility) early - injuries happen!
- Don't rush into death matches - submission fights are safer for training
- Keep your treasury above 50 gold to avoid bankruptcy penalties
- Balance training with rest to manage fatigue

### In-Game Documentation

The **Codex** (📖) contains extensive in-game documentation including:
- Roman history and lore
- Gladiator class guides
- Combat tactics
- Building descriptions
- Staff role information
- Gameplay tips

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS with custom Roman theme
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Emoji-based for accessibility

## 📁 Project Structure

```
src/
├── app/                    # Redux store configuration
├── components/
│   ├── layout/            # App shell, navigation
│   ├── screens/           # Page components
│   └── ui/                # Reusable UI components
├── data/                   # Static game data
│   ├── buildings.ts       # Building definitions
│   ├── combat.ts          # Combat mechanics
│   ├── factions.ts        # Political factions
│   ├── fame.ts            # Fame system
│   ├── gladiatorClasses.ts # Class definitions
│   ├── lore.ts            # In-game documentation
│   ├── quests.ts          # Quest definitions
│   ├── skillTrees.ts      # Skill system
│   ├── staff.ts           # Staff definitions
│   └── training.ts        # Training system
├── features/              # Redux slices by feature
│   ├── combat/
│   ├── economy/
│   ├── factions/
│   ├── fame/
│   ├── game/
│   ├── gladiators/
│   ├── ludus/
│   ├── player/
│   ├── quests/
│   └── staff/
├── game/                   # Game logic
│   ├── CombatEngine.ts    # Combat calculations
│   └── GameLoop.ts        # Daily processing
├── styles/                # Global styles
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions
```

## 🎨 Design Philosophy

### Roman Aesthetic
The game features a cohesive Roman-themed design with:
- **Colors**: Gold, bronze, marble, and crimson
- **Typography**: Decorative headers with "roman" font styling
- **UI Elements**: Cards with border decorations, gradient buttons
- **Iconography**: Thematic emojis (⚔️🏛️🏟️📜)

### Accessibility
- Responsive design for desktop, tablet, and mobile
- High contrast color schemes
- Keyboard navigation support
- Screen reader friendly semantic HTML

## 📊 Game Balance

### Economy
| Difficulty | Starting Gold | Expense Modifier |
|------------|---------------|------------------|
| Easy       | 750g          | 0.8x             |
| Normal     | 500g          | 1.0x             |
| Hard       | 300g          | 1.2x             |

### Combat
- Base hit chance: 70%
- Critical hit base: 5%
- Dodge base: 10%
- Class matchups provide ±10% modifiers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Component-based architecture
- Feature-based folder structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic management games and Roman history
- Built with love for the gladiatorial genre
- Special thanks to the open-source community

---

<div align="center">

**Ave Imperator! Those about to code salute you!** 🏛️⚔️

Made with ❤️ and ☕

</div>
