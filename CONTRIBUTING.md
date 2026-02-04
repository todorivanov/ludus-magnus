# Contributing to Ludus Magnus: Reborn

Thank you for your interest in contributing to Ludus Magnus: Reborn! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Game Design Guidelines](#game-design-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community and the game
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/legends-of-the-arena.git
   cd legends-of-the-arena
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-new-gladiator-class` - New features
- `fix/combat-damage-calculation` - Bug fixes
- `docs/update-readme` - Documentation changes
- `refactor/combat-engine` - Code refactoring
- `style/button-animations` - Visual/styling changes

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add Provocator gladiator class

- Add class definition with stats and equipment
- Implement special ability "Taunt"
- Add sprite and animations
- Update combat matchup logic
```

Prefix commits with:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Styling/UI changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Testing Your Changes

Before submitting:

1. **Run TypeScript check**:
   ```bash
   npm run type-check
   ```

2. **Run linting**:
   ```bash
   npm run lint
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Test in browser**: Verify your changes work as expected

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add yourself** to CONTRIBUTORS.md (if not already listed)
3. **Fill out the PR template** completely
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** if requested

### PR Template

When opening a PR, include:

- **Description**: What does this change do?
- **Motivation**: Why is this change needed?
- **Testing**: How did you test this?
- **Screenshots**: If UI changes, include before/after

## Coding Standards

### TypeScript

- Enable strict mode
- Use explicit types for function parameters and returns
- Prefer interfaces over type aliases for object shapes
- Use enums or union types for fixed sets of values

```typescript
// Good
interface Gladiator {
  id: string;
  name: string;
  class: GladiatorClass;
  stats: GladiatorStats;
}

// Avoid
type Gladiator = {
  id: any;
  name: string;
  // ...
};
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop typing

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'gold';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
}) => {
  // ...
};
```

### State Management

- Use Redux Toolkit for global state
- Keep slices focused on a single domain
- Use selectors for derived data
- Avoid putting UI state in Redux (use local state)

### Styling

- Use Tailwind CSS utility classes
- Follow the established Roman theme
- Use the custom color palette (roman-gold, roman-marble, etc.)
- Keep responsive design in mind

```tsx
// Good - uses theme colors
<button className="bg-roman-gold-600 hover:bg-roman-gold-500 text-roman-marble-900">

// Avoid - arbitrary colors
<button className="bg-yellow-500 hover:bg-yellow-400">
```

## Game Design Guidelines

### Balance Considerations

When adding or modifying game mechanics:

1. **Consider early/mid/late game** impact
2. **Check interaction** with existing systems
3. **Avoid power creep** - new isn't always better
4. **Maintain risk/reward** balance

### Content Guidelines

- **Historical authenticity**: Research Roman gladiatorial culture
- **Engaging gameplay**: Fun should come first
- **Clear feedback**: Players should understand cause and effect
- **Meaningful choices**: Avoid obvious "correct" options

### Adding New Content

#### New Gladiator Class

1. Add definition to `src/data/gladiatorClasses.ts`
2. Add skill tree to `src/data/skillTrees.ts`
3. Add lore entry to `src/data/lore.ts`
4. Update combat matchups if needed
5. Test balance in combat

#### New Building

1. Add definition to `src/data/buildings.ts`
2. Include all 3 levels with appropriate scaling
3. Define prerequisites and synergies
4. Add construction costs that fit economy
5. Update UI to display new building

#### New Quest

1. Add quest definition to `src/data/quests.ts`
2. Include objectives, rewards, and conditions
3. Add any required dialogue
4. Test complete flow from start to completion

## Questions?

If you have questions or need help:

1. Check existing [issues](https://github.com/yourusername/legends-of-the-arena/issues)
2. Join our [Discord](https://discord.gg/example) (if available)
3. Open a new issue with the "question" label

---

Thank you for contributing to Ludus Magnus: Reborn! Your efforts help make this game better for everyone. 🏛️⚔️
