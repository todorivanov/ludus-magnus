/**
 * Game Lore and Encyclopedia Data
 * Contains all in-game documentation, history, and world-building content
 */

export interface LoreEntry {
  id: string;
  title: string;
  category: LoreCategory;
  content: string;
  image?: string;
  unlockCondition?: {
    type: 'fame' | 'quest' | 'building' | 'gladiator' | 'day' | 'always';
    value?: string | number;
  };
}

export type LoreCategory = 
  | 'history'
  | 'gladiators' 
  | 'combat'
  | 'buildings'
  | 'staff'
  | 'factions'
  | 'gameplay';

export const LORE_CATEGORIES: { id: LoreCategory; name: string; icon: string; description: string }[] = [
  { id: 'history', name: 'Roman History', icon: '🏛️', description: 'The history of gladiatorial games and the Roman world' },
  { id: 'gladiators', name: 'Gladiator Classes', icon: '⚔️', description: 'Learn about the different types of gladiators' },
  { id: 'combat', name: 'Combat & Arena', icon: '🏟️', description: 'Understanding arena combat and match rules' },
  { id: 'buildings', name: 'Ludus Buildings', icon: '🏗️', description: 'Facilities and infrastructure of a gladiator school' },
  { id: 'staff', name: 'Personnel', icon: '👥', description: 'The people who run a successful ludus' },
  { id: 'factions', name: 'Political Factions', icon: '🏛️', description: 'Navigate the dangerous waters of Roman politics' },
  { id: 'gameplay', name: 'Game Guide', icon: '📖', description: 'Tips and strategies for managing your ludus' },
];

export const LORE_ENTRIES: LoreEntry[] = [
  // ============================================
  // HISTORY SECTION
  // ============================================
  {
    id: 'history-origins',
    title: 'Origins of the Games',
    category: 'history',
    unlockCondition: { type: 'always' },
    content: `# Origins of Gladiatorial Combat

The gladiatorial games, or *munera*, trace their origins to the ancient Etruscan funeral rites of the 3rd century BCE. What began as a solemn ritual to honor the dead transformed into Rome's most spectacular form of entertainment.

## The First Munera

The first recorded gladiatorial combat in Rome took place in 264 BCE, when three pairs of gladiators fought at the funeral of Decimus Junius Brutus Pera. This modest beginning would eventually evolve into massive spectacles involving thousands of combatants.

## Rise of the Ludus

As demand for gladiators grew, specialized training schools called *ludi* (singular: *ludus*) emerged throughout the Roman world. The most famous was the *Ludus Magnus* in Rome, connected to the Colosseum by an underground passage.

## The Lanista

You take on the role of a *lanista* - the owner and manager of a gladiator school. While often looked down upon by Roman aristocracy, successful lanistae could accumulate tremendous wealth and influence.

> "The sand of the arena has drunk the blood of thousands, yet the people's thirst remains unquenched." - Anonymous Roman poet`,
  },
  {
    id: 'history-roman-society',
    title: 'Roman Society',
    category: 'history',
    unlockCondition: { type: 'always' },
    content: `# Roman Society and the Games

Gladiatorial games were deeply woven into the fabric of Roman society, serving multiple purposes beyond mere entertainment.

## Political Tool

Politicians used the games to curry favor with the masses. Providing spectacular *munera* could make or break political careers. The phrase "bread and circuses" (*panem et circenses*) captured this dynamic.

## Social Classes

Roman society was strictly hierarchical:

- **Patricians**: The old aristocratic families
- **Equestrians**: The wealthy merchant class  
- **Plebeians**: Common citizens
- **Freedmen**: Former slaves who had earned or bought their freedom
- **Slaves**: Property with no legal rights

Gladiators occupied a peculiar position - legally considered *infamis* (disgraced), yet celebrated as heroes by the masses.

## The Patron System

Success in Rome depended on cultivating relationships with powerful patrons. As a lanista, you must navigate these relationships carefully, balancing the demands of senators, generals, and wealthy merchants.`,
  },
  {
    id: 'history-colosseum',
    title: 'The Great Arenas',
    category: 'history',
    unlockCondition: { type: 'fame', value: 300 },
    content: `# The Great Arenas of Rome

The Roman Empire built hundreds of amphitheaters, but some stood above all others as monuments to the glory of the games.

## The Flavian Amphitheater (Colosseum)

Completed in 80 CE, the Colosseum could seat 50,000 spectators. Its ingenious design included:

- **The Velarium**: A massive retractable awning to shade spectators
- **The Hypogeum**: Underground chambers housing gladiators, animals, and stage machinery
- **Trap doors**: Allowing dramatic entrances from below

## Provincial Arenas

Every major city in the Empire had its amphitheater:

- **Capua**: Home to the famous *Ludus Magnus* where Spartacus trained
- **Pompeii**: Preserved by Vesuvius, showing typical provincial design
- **El Djem**: The African colosseum, third largest in the Empire

## The Arena Experience

A day at the games typically included:

**Morning**: *Venationes* (animal hunts)
**Midday**: Public executions
**Afternoon**: *Munera* (gladiatorial combat)

> "Those about to die salute you!" - Traditional gladiator greeting to the Emperor`,
  },

  // ============================================
  // GLADIATOR CLASSES SECTION
  // ============================================
  {
    id: 'gladiator-murmillo',
    title: 'The Murmillo',
    category: 'gladiators',
    unlockCondition: { type: 'always' },
    content: `# The Murmillo

The Murmillo (also spelled Myrmillo) represents the archetypal Roman gladiator - heavily armored and relying on strength and endurance.

## Equipment

- **Helmet**: Large crested helmet with fish motif (hence the name, from *mormylos* - a type of fish)
- **Shield**: Large rectangular *scutum* (same as Roman legionaries)
- **Weapon**: Short sword (*gladius*)
- **Armor**: Arm guard (*manica*), leg greave, thick belt

## Fighting Style

The Murmillo fights defensively, using the large shield to block attacks while waiting for opportunities to strike with the gladius. Their heavy equipment makes them slower but extremely resilient.

## Strengths
- Excellent defense
- High constitution
- Good damage output

## Weaknesses
- Slow movement
- High stamina consumption
- Vulnerable to agile opponents

## Traditional Opponents

The Murmillo traditionally faced the Thraex or Hoplomachus, representing the eternal struggle between Rome and her enemies.`,
  },
  {
    id: 'gladiator-retiarius',
    title: 'The Retiarius',
    category: 'gladiators',
    unlockCondition: { type: 'always' },
    content: `# The Retiarius

The Retiarius ("net-man") was unique among gladiators - lightly armored and wielding unusual weapons inspired by fishermen.

## Equipment

- **Net**: Weighted casting net (*rete*) to entangle opponents
- **Trident**: Three-pronged spear (*fuscina*) for stabbing
- **Dagger**: Backup weapon for close combat
- **Armor**: Only a shoulder guard (*galerus*) and arm guard

## Fighting Style

The Retiarius relied on speed and agility, dancing around opponents while attempting to ensnare them with the net. Once tangled, the opponent could be dispatched with the trident.

## Strengths
- High agility and speed
- Long reach with trident
- Net provides crowd control

## Weaknesses
- Minimal armor protection
- Net can only be used once per fight effectively
- Looked down upon as "feminine" by some Romans

## Social Status

Interestingly, the Retiarius was considered the lowest class of gladiator due to minimal armor. However, skilled Retiarii could become crowd favorites through showmanship.

> "The Retiarius fights without a mask - his shame is visible to all, yet so is his courage."`,
  },
  {
    id: 'gladiator-thraex',
    title: 'The Thraex',
    category: 'gladiators',
    unlockCondition: { type: 'always' },
    content: `# The Thraex

The Thraex (Thracian) gladiator style originated from Rome's encounters with Thracian warriors and became one of the most popular classes.

## Equipment

- **Helmet**: Distinctive griffin-crested helmet with wide brim
- **Shield**: Small rectangular *parmula*
- **Weapon**: Curved sword (*sica*) - excellent for hooking around shields
- **Armor**: High leg greaves protecting both legs, arm guard

## Fighting Style

The Thraex was a balanced fighter, combining decent protection with good mobility. The curved sica could strike around an opponent's shield, making them dangerous against heavily-shielded enemies.

## Strengths
- Good balance of offense and defense
- Curved blade bypasses shields
- High leg protection allows aggressive footwork

## Weaknesses
- Small shield provides limited protection
- Shorter range than some opponents
- Requires skill to use effectively

## Famous Thraeces

The legendary Spartacus himself fought as a Thraex before leading his famous slave rebellion in 73 BCE.`,
  },
  {
    id: 'gladiator-secutor',
    title: 'The Secutor',
    category: 'gladiators',
    unlockCondition: { type: 'fame', value: 100 },
    content: `# The Secutor

The Secutor ("pursuer") was specifically developed to fight the Retiarius, creating one of the arena's most dramatic matchups.

## Equipment

- **Helmet**: Smooth, egg-shaped helmet with tiny eye holes (to prevent net tangling)
- **Shield**: Large curved *scutum*
- **Weapon**: Short sword (*gladius*)
- **Armor**: Arm guard, leg greave

## Fighting Style

The Secutor's strategy was simple - close distance quickly and overwhelm the Retiarius before running out of breath. Their helmet, while protective against nets, severely limited vision and airflow.

## Strengths
- Heavy armor protection
- Immune to net entanglement
- Powerful in close combat

## Weaknesses
- Limited visibility
- Rapid oxygen depletion
- Must end fights quickly

## The Hunter and Hunted

The Secutor vs Retiarius matchup represented a symbolic battle between land and sea, hunter and fisherman. The crowd loved the dramatic tension of the chase.`,
  },
  {
    id: 'gladiator-hoplomachus',
    title: 'The Hoplomachus',
    category: 'gladiators',
    unlockCondition: { type: 'fame', value: 150 },
    content: `# The Hoplomachus

The Hoplomachus ("armed fighter") was modeled after Greek hoplite warriors, representing Rome's eastern enemies.

## Equipment

- **Helmet**: Crested bronze helmet with feather plumes
- **Shield**: Small round *hoplon*
- **Weapons**: Spear (*hasta*) and short sword
- **Armor**: Quilted leg protection, arm guard, bronze chest plate

## Fighting Style

The Hoplomachus was versatile, using the spear for reach and the sword when in close quarters. Their Greek-style equipment made them exotic attractions in the arena.

## Strengths
- Excellent reach with spear
- Versatile weapon options
- Good armor protection

## Weaknesses
- Small shield
- Expensive equipment to maintain
- Jack of all trades, master of none

## Cultural Significance

Romans enjoyed watching "Greek" fighters, as it reminded them of their cultural superiority over the conquered Hellenistic kingdoms.`,
  },
  {
    id: 'gladiator-dimachaerus',
    title: 'The Dimachaerus',
    category: 'gladiators',
    unlockCondition: { type: 'fame', value: 200 },
    content: `# The Dimachaerus

The Dimachaerus ("bearing two swords") was a rare and spectacular gladiator type, fighting with a blade in each hand.

## Equipment

- **Helmet**: Standard gladiator helmet
- **Weapons**: Two swords (*gladii*) or two curved *sicae*
- **Armor**: Light - typically just arm guards and leg protection
- **No Shield**: Both hands occupied by weapons

## Fighting Style

The Dimachaerus fought with incredible aggression, using dual blades to overwhelm opponents with a flurry of attacks. Defense relied entirely on parrying and footwork.

## Strengths
- High damage output
- Unpredictable attack patterns
- Spectacular showmanship

## Weaknesses
- No shield for defense
- Requires exceptional skill
- Exhausting fighting style

## The Crowd's Favorite

Dimachaeri were rare but beloved by crowds. Their aggressive style and dual-wielding made for exciting spectacles. Many became celebrities despite the extreme danger of their fighting style.`,
  },
  {
    id: 'gladiator-samnite',
    title: 'The Samnite',
    category: 'gladiators',
    unlockCondition: { type: 'fame', value: 100 },
    content: `# The Samnite

The Samnite was one of the oldest gladiator types, named after Rome's ancient Italian enemies, the Samnite tribes.

## Equipment

- **Helmet**: Large plumed helmet
- **Shield**: Large oval *scutum*
- **Weapon**: Short sword (*gladius*)
- **Armor**: Heavy - greave on left leg, arm guard, belt

## Fighting Style

The Samnite fought in the traditional heavy infantry style, emphasizing solid defense and methodical attacks. They represented the "old school" of gladiatorial combat.

## Strengths
- Excellent defense
- Reliable and consistent
- Good for training beginners

## Weaknesses
- Predictable fighting style
- Slower than lighter classes
- Less exciting for crowds

## Historical Note

As Rome's relationship with the Samnites improved, this class became less common and was eventually absorbed into other types like the Murmillo.`,
  },
  {
    id: 'gladiator-velitus',
    title: 'The Velitus',
    category: 'gladiators',
    unlockCondition: { type: 'fame', value: 250 },
    content: `# The Velitus

The Velitus (also Velite) represented light skirmishing troops, focusing on ranged combat and extreme mobility.

## Equipment

- **Helmet**: Light cap or no helmet
- **Shield**: Small *parma* or none
- **Weapons**: Javelins (*verutum*), sling, or bow
- **Armor**: Minimal - leather or quilted fabric

## Fighting Style

The Velitus was unique in using ranged weapons, pelting opponents from a distance before closing for melee. They required large arena spaces and were often used in group battles.

## Strengths
- Ranged attack capability
- Extreme mobility
- Unpredictable tactics

## Weaknesses
- Almost no armor
- Limited ammunition
- Vulnerable if caught

## Arena Usage

Velites were often used in *venationes* (beast hunts) or group battles rather than traditional duels. Their ranged capabilities made one-on-one fights less dramatic.`,
  },

  // ============================================
  // COMBAT & ARENA SECTION
  // ============================================
  {
    id: 'combat-basics',
    title: 'Combat Fundamentals',
    category: 'combat',
    unlockCondition: { type: 'always' },
    content: `# Combat Fundamentals

Understanding the basics of gladiatorial combat is essential for any lanista hoping to see their fighters survive and thrive.

## The Combat System

Combat in the arena is turn-based, with each gladiator taking actions in order of their speed (agility).

### Actions Available

- **Attack**: Strike your opponent, dealing damage based on strength and weapon
- **Defend**: Raise guard, increasing block chance for the next enemy attack
- **Special Move**: Use class-specific abilities (requires stamina)
- **Rest**: Skip action to recover stamina

## Stats in Combat

### Health Points (HP)
When HP reaches 0, the gladiator is defeated. Constitution affects maximum HP.

### Stamina
Required for actions. Heavy attacks and special moves consume more stamina. Endurance affects maximum and recovery rate.

### Damage Calculation

\`\`\`
Damage = (Strength × Weapon Modifier) × (1 - Enemy Armor)
        × Critical Multiplier × Morale Modifier
\`\`\`

## Victory Conditions

- **Submission**: Opponent surrenders or is incapacitated
- **Death**: Opponent's HP reduced to 0 (in death matches)
- **Crowd Decision**: Magistrate decides fate of incapacitated loser`,
  },
  {
    id: 'combat-matchups',
    title: 'Class Matchups',
    category: 'combat',
    unlockCondition: { type: 'day', value: 10 },
    content: `# Class Matchups

Traditional gladiatorial pairings created exciting and balanced fights. Understanding matchups is crucial for success.

## Classic Pairings

| Gladiator | Traditional Opponent | Advantage |
|-----------|---------------------|-----------|
| Murmillo | Thraex | Shield vs curved blade |
| Murmillo | Hoplomachus | Heavy vs versatile |
| Secutor | Retiarius | Armor vs mobility |
| Thraex | Hoplomachus | Similar styles, skill decides |

## Matchup Bonuses

When fighting a traditional opponent:
- +10% to hit chance
- +15% fame gain
- Crowd engagement bonus

## Unfavorable Matchups

Some pairings heavily favor one fighter:

- **Dimachaerus vs Murmillo**: Shield negates dual-wield advantage
- **Velitus vs Secutor**: Range vs anti-mobility armor
- **Retiarius vs Thraex**: Small shield makes net deadly

## Crowd Expectations

The crowd has opinions about matchups. Meeting expectations increases fame gain, while unusual pairings may confuse or excite them depending on the outcome.`,
  },
  {
    id: 'combat-match-types',
    title: 'Match Types',
    category: 'combat',
    unlockCondition: { type: 'always' },
    content: `# Types of Arena Matches

Different match types offer varying risks, rewards, and prestige.

## Pit Fights

The lowest form of gladiatorial combat, held in small venues or practice arenas.

- **Entry**: 10 gold
- **Reward**: 20-50 gold
- **Fame Gain**: Minimal
- **Death Risk**: Low (submission only)
- **Best For**: Training new gladiators

## Provincial Munera

Standard arena fights in regional amphitheaters.

- **Entry**: 25 gold
- **Reward**: 50-150 gold
- **Fame Gain**: Moderate
- **Death Risk**: Medium
- **Requirements**: Fame 100+

## Championship Tournaments

Multi-round elimination tournaments with the best fighters.

- **Entry**: 100 gold
- **Reward**: 500-2000 gold
- **Fame Gain**: High
- **Death Risk**: High
- **Requirements**: Fame 300+, Champion gladiator

## Emperor's Games

The ultimate honor - fighting in Rome's Colosseum before the Emperor.

- **Entry**: By invitation only
- **Reward**: 5000+ gold, legendary status
- **Fame Gain**: Massive
- **Requirements**: Fame 750+, story completion`,
  },
  {
    id: 'combat-rules',
    title: 'Combat Rules',
    category: 'combat',
    unlockCondition: { type: 'day', value: 5 },
    content: `# Rules of the Arena

Different rules govern different matches, affecting both tactics and outcomes.

## Till Submission

The standard rule for most matches.

- Fight continues until one gladiator cannot continue
- Defeated gladiator can raise finger (*ad digitum*) to request mercy
- Crowd and magistrate decide if mercy is granted
- Mercy chance: 70% base + Fame modifiers

## Till Death

Reserved for special occasions or condemned criminals.

- No surrender allowed
- Fight continues until death
- Higher rewards but permanent consequences
- Some gladiators gain fame bonuses from death matches

## The Crowd's Will

The crowd influences the magistrate's decision:

### Factors for Mercy
- High fame gladiator (+20%)
- Entertaining fight (+15%)
- Close match (+10%)
- Crowd favorite bonus (+25%)

### Factors Against Mercy
- Cowardly performance (-30%)
- Criminal or condemned fighter (-50%)
- Unpopular fighting style (-10%)

## The Magistrate's Judgment

The final decision rests with the presiding magistrate:

- **Missio**: Mercy granted, gladiator lives
- **Iugula**: Death ordered
- **Stantes Missi**: Both fighters spared (rare, drawn match)`,
  },

  // ============================================
  // BUILDINGS SECTION
  // ============================================
  {
    id: 'building-overview',
    title: 'Ludus Infrastructure',
    category: 'buildings',
    unlockCondition: { type: 'always' },
    content: `# Building Your Ludus

A successful gladiator school requires proper infrastructure. Each building provides unique benefits that can mean the difference between victory and defeat.

## Building Levels

All buildings can be upgraded to three levels:

- **Level I**: Basic functionality
- **Level II**: +50% effectiveness, additional features
- **Level III**: +100% effectiveness, special abilities

## Construction

Building requires:
- Sufficient gold
- Available construction slot
- Time (varies by building)
- Sometimes special resources or prerequisites

## Synergies

Certain buildings work better with specific staff:

| Building | Best Staff | Synergy Bonus |
|----------|------------|---------------|
| Palus | Doctore | +25% training speed |
| Valetudinarium | Medicus | +30% healing |
| Armamentarium | Faber | Equipment crafting |

## Strategic Considerations

Early game: Focus on training facilities (Palus, Coal Pit)
Mid game: Build support (Valetudinarium, Taberna)
Late game: Upgrade everything, unlock special abilities`,
  },
  {
    id: 'building-training',
    title: 'Training Facilities',
    category: 'buildings',
    unlockCondition: { type: 'building', value: 'palus' },
    content: `# Training Facilities

Proper training facilities are essential for developing elite gladiators.

## Palus (Training Post)

The most basic training facility - a wooden post for practicing strikes.

**Level Benefits:**
- Lv1: +10% weapon XP gain
- Lv2: +15% weapon XP gain
- Lv3: +20% weapon XP, Advanced Techniques unlock

**Cost**: 5 gold, 3 days

## Coal Pit

An area of soft ground for practicing footwork and evasion.

**Level Benefits:**
- Lv1: +10% evasion growth
- Lv2: +15% evasion growth
- Lv3: +20% evasion, +5% agility

**Cost**: 5 gold, 3 days

## Balnea (Bathhouse)

Roman baths for recovery and relaxation.

**Level Benefits:**
- Lv1: +15 morale, +20% stamina recovery
- Lv2: +25 morale, +30% stamina recovery
- Lv3: +35 morale, +40% stamina, complete fatigue removal

**Cost**: 50 gold, 15 days`,
  },

  // ============================================
  // STAFF SECTION
  // ============================================
  {
    id: 'staff-overview',
    title: 'Staff Overview',
    category: 'staff',
    unlockCondition: { type: 'always' },
    content: `# Managing Your Staff

Behind every successful ludus is a team of skilled professionals. Staff require ongoing wages but provide irreplaceable benefits.

## Staff Economics

### Hiring
Each staff member has a one-time hiring cost, paid when they join.

### Wages
Daily wages are automatically deducted from your treasury. Unpaid staff will become dissatisfied and may leave.

### Satisfaction
Keep satisfaction high (50+) to retain staff:
- Pay wages on time
- Build synergy buildings
- Maintain Wine Cellar for morale

## Staff Roles

Seven roles are available, each with unique abilities:

1. **Doctore** - Training master
2. **Medicus** - Medical expert
3. **Faber** - Equipment craftsman
4. **Architect** - Construction specialist
5. **Educator** - Morale advisor
6. **Bard** - Fame promoter
7. **Spy** - Intelligence gatherer

## Staff Progression

Staff gain experience and level up (max level 5), increasing their effectiveness by 10% per level.`,
  },

  // ============================================
  // FACTIONS SECTION
  // ============================================
  {
    id: 'factions-overview',
    title: 'Political Landscape',
    category: 'factions',
    unlockCondition: { type: 'always' },
    content: `# The Political Factions

Roman politics were a dangerous game. Four major factions vie for power, and your allegiance matters.

## The Factions

### Optimates (Conservatives)
The traditional senatorial aristocracy. They favor stability, tradition, and maintaining the status quo.

**Benefits at High Favor:**
- Reduced taxes
- Premium gladiator access
- Political protection

### Populares (Reformers)
Champions of the common people. They push for reform and social change.

**Benefits at High Favor:**
- Crowd support in arena
- Reduced food costs
- Popular uprising immunity

### Military Legion
The generals and soldiers of Rome. Military might is their currency.

**Benefits at High Favor:**
- Veteran gladiator recruitment
- Combat training bonuses
- Military equipment access

### Merchant Guild
The wealthy traders and businessmen. Gold is their power.

**Benefits at High Favor:**
- Trade discounts
- Market manipulation
- Exclusive merchandise

## Favor System

Favor ranges from -100 (Hostile) to +100 (Allied):

| Range | Status | Effects |
|-------|--------|---------|
| -100 to -50 | Hostile | Sabotage risk, penalties |
| -49 to -1 | Unfavored | Minor penalties |
| 0 | Neutral | No effects |
| 1 to 49 | Friendly | Minor benefits |
| 50 to 100 | Allied | Full benefits, alliance option |`,
  },

  // ============================================
  // GAMEPLAY SECTION
  // ============================================
  {
    id: 'gameplay-getting-started',
    title: 'Getting Started',
    category: 'gameplay',
    unlockCondition: { type: 'always' },
    content: `# Getting Started Guide

Welcome to Legends of the Arena! This guide will help you build a successful gladiator school.

## Day 1: The Basics

1. **Visit the Marketplace**
   - Recruit your first gladiator (start with a Murmillo or Samnite)
   - They're forgiving for beginners

2. **Build Training Facilities**
   - Start with a Palus (training post)
   - Cheap and quick to build

3. **Set Training Regimen**
   - Assign your gladiator to balanced training
   - Don't overtrain early - fatigue hurts performance

## First Week Goals

- [ ] Recruit 2-3 gladiators
- [ ] Build Palus and Coal Pit
- [ ] Win 3 pit fights
- [ ] Reach 50+ Fame

## Managing Resources

**Gold**: Your primary resource. Balance expenses with income:
- Staff wages (daily)
- Food costs (per gladiator)
- Building maintenance

**Food**: Keep gladiators fed or face morale penalties

**Time**: Most activities take days - plan ahead!

## Tips for Success

1. Don't rush into death matches
2. Build the Valetudinarium early - injuries happen
3. Hire a Doctore before expanding your roster
4. Watch your treasury - bankruptcy is game over`,
  },
  {
    id: 'gameplay-advanced',
    title: 'Advanced Strategies',
    category: 'gameplay',
    unlockCondition: { type: 'day', value: 30 },
    content: `# Advanced Strategies

Once you've mastered the basics, these advanced strategies will help you dominate the arena.

## Gladiator Development

### Specialization vs Versatility
- **Specialists**: Max out 2-3 stats for peak performance
- **Generalists**: Balanced stats for flexibility

Recommendation: Specialize your best fighters, keep generalists for backup.

### Optimal Training

- **High Fatigue (70%+)**: Stop training, rest gladiator
- **Injuries**: Immediate rest until healed
- **Pre-Fight**: Rest day before combat

### Fame Management

Fame = Money. Focus on:
- Spectacular victories (+50% fame)
- Fighting higher-level opponents (+75% fame)
- Using special moves (+25% fame)

## Economic Mastery

### Income Streams
1. Arena victories (primary)
2. Merchandise (passive)
3. Patron gifts (faction favor)
4. Selling gladiators (emergency)

### Cost Optimization
- Bulk buy food when prices are low
- Time building construction for minimal overlap
- Fire underperforming staff

## Political Navigation

### Faction Balance
- Never let any faction go hostile (-50 or below)
- Focus on 1-2 factions for full benefits
- Use Spy to manage reputation

### Alliance Timing
- Alliance provides massive benefits
- But locks you against other factions
- Wait until mid-game to commit`,
  },
  {
    id: 'gameplay-combat-tips',
    title: 'Combat Tips',
    category: 'gameplay',
    unlockCondition: { type: 'day', value: 15 },
    content: `# Combat Tips and Tactics

Winning in the arena requires more than strong gladiators. Here are tactics to ensure victory.

## Pre-Fight Preparation

### Stamina Management
- Never fight with less than 80% stamina
- Rest the day before important matches
- Use Balnea for quick recovery

### Matchup Selection
- Choose opponents your gladiator counters
- Avoid unfavorable matchups for important fights
- Check opponent stats before committing

## In-Combat Tactics

### Action Economy
1. **Opening**: Defend if facing aggressive enemy
2. **Mid-Fight**: Mix attacks with defense
3. **Finishing**: All-out attack when enemy is low

### Stamina in Combat
- Rest when below 30% stamina
- Heavy attacks only when you can afford them
- Don't let stamina hit 0 (massive penalty)

### Special Moves
- Use early for maximum impact
- Save one for finishing blow
- Class specials have cooldowns - time them well

## Post-Fight

### Injury Treatment
- Treat injuries immediately
- Minor injuries heal in 3-5 days with Medicus
- Major injuries need 10+ days

### Morale Management
- Victories boost morale
- Defeats hurt morale
- Keep morale above 0.7 for best performance`,
  },
];

// Helper function to get lore entries by category
export const getLoreByCategory = (category: LoreCategory): LoreEntry[] => {
  return LORE_ENTRIES.filter(entry => entry.category === category);
};

// Helper function to check if lore is unlocked
export const isLoreUnlocked = (
  entry: LoreEntry,
  gameState: {
    ludusFame: number;
    completedQuests: string[];
    buildings: string[];
    gladiatorCount: number;
    currentDay: number;
  }
): boolean => {
  if (!entry.unlockCondition || entry.unlockCondition.type === 'always') {
    return true;
  }

  const { type, value } = entry.unlockCondition;

  switch (type) {
    case 'fame':
      return gameState.ludusFame >= (value as number);
    case 'quest':
      return gameState.completedQuests.includes(value as string);
    case 'building':
      return gameState.buildings.includes(value as string);
    case 'gladiator':
      return gameState.gladiatorCount >= (value as number);
    case 'day':
      return gameState.currentDay >= (value as number);
    default:
      return true;
  }
};
