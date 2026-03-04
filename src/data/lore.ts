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
  | 'gameplay'
  | 'gladiator_mode';

export const LORE_CATEGORIES: { id: LoreCategory; name: string; icon: string; description: string }[] = [
  { id: 'history', name: 'Roman History', icon: '🏛️', description: 'The history of gladiatorial games and the Roman world' },
  { id: 'gladiators', name: 'Gladiator Classes', icon: '⚔️', description: 'Learn about the different types of gladiators' },
  { id: 'combat', name: 'Combat & Arena', icon: '🏟️', description: 'Understanding arena combat and match rules' },
  { id: 'buildings', name: 'Ludus Buildings', icon: '🏗️', description: 'Facilities and infrastructure of a gladiator school' },
  { id: 'staff', name: 'Personnel', icon: '👥', description: 'The people who run a successful ludus' },
  { id: 'factions', name: 'Political Factions', icon: '🏛️', description: 'Navigate the dangerous waters of Roman politics' },
  { id: 'gameplay', name: 'Game Guide', icon: '📖', description: 'Tips and strategies for managing your ludus' },
  { id: 'gladiator_mode', name: 'Gladiator Mode', icon: '🗡️', description: 'Life, combat, and freedom as a gladiator' },
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

| Action | Stamina Cost | Effect |
|--------|-------------|--------|
| **Attack** | 10 | Standard strike, 1x damage |
| **Heavy Attack** | 20 | 1.5x damage, -15% accuracy, 20% stun chance |
| **Defend** | 5 | Halves incoming damage for next enemy attack |
| **Dodge** | 15 | Attempt to evade the next attack entirely |
| **Special Move** | 30 | Class-specific ability, 2x damage, 3-turn cooldown |
| **Rest** | Recovers 25 | Skip action to recover stamina |
| **Taunt** | 5 | 70% chance to enrage opponent for 2 turns |

### Class-Specific Specials

Each gladiator class has a unique special move:

| Class | Special | Damage | Effect |
|-------|---------|--------|--------|
| Murmillo | Shield Bash | 1.2x | 60% stun |
| Retiarius | Net Throw | 0.5x | 80% netted |
| Thraex | Sica Strike | 1.8x | 50% bleeding |
| Secutor | Relentless Charge | 1.5x | 40% stun |
| Hoplomachus | Spear Thrust | 2.0x | 70% bleeding |
| Dimachaerus | Twin Fury | 1.3x | Hits twice |
| Samnite | Ancestral Strike | 2.2x | 30% stun |
| Velitus | Javelin Volley | 1.4x | 60% slowed |

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

## Status Effects

Combat actions can inflict status effects that persist across turns:

- **Bleeding**: 5 HP damage per turn, stacks up to 3 times
- **Stunned**: Target loses their next action entirely
- **Exhausted**: -20% damage, -15% accuracy
- **Enraged**: +25% damage, -20% accuracy (from taunts)
- **Defended**: -50% incoming damage (from defend action)
- **Netted**: -50% evasion, -25% accuracy (Retiarius special)
- **Slowed**: -30% evasion (Velitus special)

## Crowd Favor

The crowd watches every move. Crowd favor (0-100) changes dynamically during combat:

- Flashy moves (taunts, specials, heavy attacks) increase favor
- Defensive or passive play (defend, rest) decreases favor
- High crowd favor improves your chances of receiving *missio* (mercy) if defeated
- In Gladiator Mode, crowd favor also affects peculium tips after the fight

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

Five match types offer escalating risks, rewards, and prestige. Choose wisely — the arena rewards ambition but punishes overconfidence.

| Match Type | Entry Fee | Rules | Rounds | Reward Mult | Fame Mult | Min Fame |
|------------|-----------|-------|--------|-------------|-----------|----------|
| Pit Fight | 10g | Submission | 5 | 0.5x | 0.5x | 0 |
| Local Munera | 25g | Submission | 7 | 1.0x | 1.0x | 50 |
| Grand Munera | 100g | Death | 10 | 2.0x | 2.0x | 200 |
| Championship | 500g | Death | 12 | 5.0x | 5.0x | 500 |
| Colosseum | 1000g | Death | 15 | 10.0x | 10.0x | 800 |

## Pit Fights

The lowest form of gladiatorial combat, held in small venues or practice arenas. Fights end by submission only — no gladiator dies. Ideal for blooding new recruits.

## Local Munera

Standard arena fights in regional amphitheaters. Still fought to submission, but the stakes are higher and the crowds more demanding.

## Grand Munera

The first tier where death rules apply. No surrender is permitted — fights continue until one gladiator falls. Double the fame and gold rewards make the risk worthwhile.

## Championship

Elite combat for seasoned warriors. Death rules, 12 rounds, and 5x reward multipliers. Only gladiators with 500+ fame should enter.

## Colosseum

The ultimate honor — fighting in Rome's Colosseum before the Emperor himself. 15-round death matches with 10x multipliers on all rewards. Reserved for the most famous gladiators in the Empire.

> Separate from individual matches, the **Tournament System** offers bracket-style elimination events with escalating stage rewards. See the Tournament System codex entry for details.`,
  },
  {
    id: 'combat-rules',
    title: 'Combat Rules',
    category: 'combat',
    unlockCondition: { type: 'day', value: 5 },
    content: `# Rules of the Arena

Different rules govern different matches, affecting both tactics and outcomes. The line between life and death is drawn by the match type.

## Till Submission

The standard rule for Pit Fights and Local Munera.

- Fight continues until one gladiator cannot continue
- Defeated gladiator can raise finger (*ad digitum*) to request mercy
- Crowd and magistrate decide if mercy is granted
- Base mercy chance: 50%, modified by crowd favor and fame

## Till Death (*Sine Missione*)

The rule for Grand Munera, Championships, and the Colosseum.

- No surrender allowed
- Fight continues until death
- Higher rewards but permanent consequences — your gladiator may never return
- Gladiators who die are permanently removed from your roster

## The Crowd's Will

The crowd influences the magistrate's decision on mercy:

### Factors for *Missio* (Mercy)
- High crowd favor during fight (+20% at favor >50, +20% at favor >80)
- High gladiator fame (+10% at fame >200)
- Political connections (+10% at favor >50)

### Factors Against Mercy
- Low crowd favor (-20% at favor <30)
- Cowardly performance (low crowd favor from passive play)

## The Magistrate's Judgment

The final decision rests with the presiding magistrate:

- **Missio**: Mercy granted, gladiator lives to fight another day
- **Iugula**: Death ordered — the loser is slain
- **Stantes Missi**: Both fighters spared (rare, drawn match)

## Consequences of Defeat

### If Spared
- Gladiator survives with severe injuries (14-day recovery)
- Small fame gain (+2) for surviving
- Morale penalty from the loss

### If Killed
- Gladiator is permanently dead and removed from your roster
- Recorded in the Fallen Warriors Memorial with cause of death and killer
- The arena is unforgiving — protect your investments`,
  },

  {
    id: 'combat-tournaments',
    title: 'Tournament System',
    category: 'combat',
    unlockCondition: { type: 'fame', value: 100 },
    content: `# Tournament System

Beyond individual matches, the arena hosts bracket-style elimination tournaments with escalating stakes and glory.

## Tournament Types

| Tournament | Bracket Size | Rules | Entry Fee/Glad | Min Fame | Winner Gold | Winner Fame |
|------------|-------------|-------|----------------|----------|-------------|-------------|
| **Local** | 8 | Submission | 50g | 0 | 500g | 50 |
| **Regional** | 16 | Submission | 150g | 100 | 2,000g | 200 |
| **Grand Arena** | 16 | Death | 300g | 300 | 5,000g | 500 |
| **Imperial Games** | 32 | Death | 1,000g | 600 | 15,000g | 1,000 |

## Tournament Rules

- **Bracket Elimination**: Single-elimination format — one loss and you're out
- **HP Persistence**: Damage carries between rounds. A gladiator who barely wins round 1 enters round 2 wounded
- **Stage Rewards**: Gold and fame rewards at each stage (quarterfinals, semifinals, finals), not just for winners
- **Multi-Entry**: You can enter multiple gladiators from your ludus into the same tournament
- **Combat Choice**: For each match, choose full turn-based combat or auto-simulation

## Death Tournaments

Grand Arena and Imperial Games use death rules (*sine missione*):

- No surrender permitted
- Gladiators who lose are killed — permanently removed from your roster
- The rewards justify the risk: Imperial Games winners earn 15,000 gold and 1,000 fame
- Only enter fighters you can afford to lose, or those strong enough to win

## Strategy

- Enter your best fighter in high-tier tournaments for maximum fame
- Enter expendable fighters in Local tournaments for low-risk practice
- Watch HP between rounds — a heavily wounded gladiator may not survive the next fight
- Tournament victories count toward career milestones and story objectives`,
  },
  {
    id: 'combat-status-effects',
    title: 'Status Effects & Specials',
    category: 'combat',
    unlockCondition: { type: 'day', value: 5 },
    content: `# Status Effects & Special Moves

Combat in the arena goes beyond simple strikes and blocks. Status effects and class-specific specials add tactical depth.

## Status Effects

| Effect | Duration | Impact | Inflicted By |
|--------|----------|--------|-------------|
| **Bleeding** | 3 turns | 5 HP/turn, stacks up to 3x | Sica Strike, Spear Thrust |
| **Stunned** | 1 turn | Target skips their next action | Shield Bash, Relentless Charge, Heavy Attack |
| **Exhausted** | Passive | -20% damage, -15% accuracy | Reaching 0 stamina |
| **Enraged** | 2 turns | +25% damage, -20% accuracy | Taunt action |
| **Defended** | 1 turn | -50% incoming damage | Defend action |
| **Netted** | 2 turns | -50% evasion, -25% accuracy | Net Throw (Retiarius) |
| **Slowed** | 2 turns | -30% evasion | Javelin Volley (Velitus) |

## Class Specials

Each class has a unique special move costing 30 stamina with a 3-turn cooldown:

### Heavy Classes
- **Murmillo — Shield Bash**: 1.2x damage, 60% chance to stun. Reliable crowd control that sets up follow-up attacks.
- **Secutor — Relentless Charge**: 1.5x damage, 40% stun. Designed to close distance and overwhelm the Retiarius.
- **Samnite — Ancestral Strike**: 2.2x damage, 30% stun. Highest raw damage of any heavy class.

### Medium Classes
- **Thraex — Sica Strike**: 1.8x damage, 50% bleeding. The curved blade hooks around shields for devastating wounds.
- **Hoplomachus — Spear Thrust**: 2.0x damage, 70% bleeding. Long reach with high bleed chance makes this deadly over time.

### Light Classes
- **Retiarius — Net Throw**: 0.5x damage, 80% netted. Low damage but nearly guarantees the netted debuff, crippling the opponent.
- **Dimachaerus — Twin Fury**: 1.3x damage, hits twice. Two separate damage rolls mean double the chance to land critical hits.
- **Velitus — Javelin Volley**: 1.4x damage, 60% slowed. Reduces enemy evasion, making follow-up attacks more reliable.

## Tactical Combinations

- **Taunt → Heavy Attack**: Enrage the enemy to lower their accuracy, then punish with 1.5x damage
- **Net Throw → Attack spam**: Net cripples evasion, making every subsequent attack much more likely to land
- **Bleed stacking**: Sica Strike or Spear Thrust applied repeatedly can deal 15 HP/turn passively
- **Stun chains**: Shield Bash followed by Heavy Attack on a stunned target guarantees a free hit`,
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

A successful gladiator school requires proper infrastructure. With 24 buildings across 7 categories, every construction decision shapes your ludus.

## Building Categories

| Category | Buildings | Purpose |
|----------|-----------|---------|
| **Training** | Palus, Coal Pit, Gymnasium, Arena Replica, Library | Improve gladiator development |
| **Recovery** | Valetudinarium, Balnea, Sacellum, Triclinium, Hypocaust | Heal, restore morale, reduce fatigue |
| **Production** | Armamentarium, Taberna, Water Well, Forge, Oil Press | Equipment, food, resources |
| **Commerce** | Marketplace, Ludus Office | Generate income, improve contracts |
| **Security** | Walls, Guard Tower, Barracks | Prevent escapes and sabotage |
| **Storage** | Grain Shelter, Wine Cellar | Store food and wine |
| **Entertainment** | Spectator Seats, Beast Pens | Boost fame and crowd favor |

## Building Levels

All buildings can be upgraded to three levels:

- **Level I**: Basic functionality
- **Level II**: Enhanced effectiveness, additional features
- **Level III**: Maximum effectiveness, special abilities unlock

## Construction

Building requires:
- Sufficient gold
- Construction time (varies by building, measured in months)
- Some buildings require prerequisites (other buildings or staff)

## Building Maintenance

Buildings deteriorate over time and require upkeep:

- **Condition**: Each building has a 0-100% condition rating
- **Monthly Degradation**: -2% per month without maintenance, -0.5% with
- **Neglected Buildings** (below 50%): Degrade faster at -5% per month

### Effectiveness by Condition

| Condition | Effectiveness |
|-----------|---------------|
| 75-100% (Good) | 100% — Full operation |
| 50-74% (Fair) | 75% — Reduced output |
| 25-49% (Poor) | 50% — Severely impaired |
| 0-24% (Dilapidated) | 0% — Non-functional |

### Maintenance Costs

| Building Tier | Monthly Cost |
|---------------|-------------|
| Basic (Palus, Coal Pit, etc.) | 7g × level |
| Advanced (Gymnasium, Forge, etc.) | 20g × level |
| Luxury (Hypocaust, Beast Pens, etc.) | 40g × level |

## Synergies

Certain buildings work better with specific staff:

| Building | Staff | Synergy Bonus |
|----------|-------|---------------|
| Palus / Gymnasium | Doctore | +25% training speed |
| Valetudinarium | Medicus | +30% healing |
| Armamentarium / Forge | Faber | Equipment crafting, +10% damage |
| Taberna / Triclinium | Coquus | +15% nutrition |
| Ludus Office | Lanista | +20% fight gold |

## Strategic Priorities

**Early game**: Palus, Coal Pit, Valetudinarium — train fighters and heal injuries
**Mid game**: Taberna, Marketplace, Walls — sustain your economy and security
**Late game**: Gymnasium, Arena Replica, Beast Pens — maximize fame and training`,
  },
  {
    id: 'building-training',
    title: 'Training Facilities',
    category: 'buildings',
    unlockCondition: { type: 'building', value: 'palus' },
    content: `# Training Facilities

Five buildings dedicated to gladiator development, from basic striking posts to advanced tactical libraries.

## Palus (Training Post)

The most basic training facility — a wooden post for practicing strikes.

- Lv1: +10% weapon XP | Lv2: +15% | Lv3: +20%, Advanced Techniques unlock
- **Cost**: 5g, 3 months

## Coal Pit

Soft ground for practicing footwork and evasion.

- Lv1: +10% evasion growth | Lv2: +15% | Lv3: +20% evasion, +5% agility
- **Cost**: 5g, 3 months

## Gymnasium

Advanced training hall for comprehensive development. *Requires Palus Level 2.*

- Lv1: +20% training, +10% XP | Lv2: +30%, +15% | Lv3: +50%, +25%, train 2 gladiators at once
- **Cost**: 200g, 40 months

## Arena Replica

A practice arena that simulates real combat conditions. *Requires Gymnasium Level 1.*

- Lv1: +15% combat prep, +10% first-round accuracy | Lv2: +25%, +15%, +5% crowd favor | Lv3: +40%, +20%, practice tournaments
- **Cost**: 300g, 50 months

## Library

A collection of tactical scrolls and combat manuals.

- Lv1: +10% tactics, +1 bonus skill point | Lv2: +20%, +2 | Lv3: +35%, +3, legendary techniques unlock
- **Cost**: 150g, 35 months`,
  },

  {
    id: 'building-recovery',
    title: 'Recovery & Spiritual',
    category: 'buildings',
    unlockCondition: { type: 'building', value: 'valetudinarium' },
    content: `# Recovery & Spiritual Buildings

These buildings heal your gladiators, restore morale, and provide spiritual fortitude.

## Valetudinarium (Hospital)

The ludus infirmary where injured gladiators receive medical care. *Requires a Medicus on staff.*

- Lv1: +30% healing | Lv2: +45%, -15% infection | Lv3: +60%, surgery (heal permanent injuries)
- **Cost**: 100g / 200g / 400g — 30 / 45 / 60 months

## Balnea (Bathhouse)

Roman baths for recovery and relaxation.

- Lv1: +15 morale, +20% stamina recovery | Lv2: +25, +30% | Lv3: +35, +40%, complete fatigue removal
- **Cost**: 50g / 100g / 200g — 15 / 22 / 30 months

## Sacellum (Shrine)

A small temple for prayers and spiritual preparation before combat.

- Lv1: +5% crit, +10 morale | Lv2: +8%, +15 | Lv3: +12%, +20, +10% damage first round
- **Cost**: 20g / 40g / 80g — 10 / 15 / 20 months

## Triclinium (Dining Hall)

A proper dining hall for better meals and social bonding. *Requires Taberna Level 2.*

- Lv1: +10 morale, +15% nutrition | Lv2: +20, +25% | Lv3: +30, +40%, +10% obedience
- **Cost**: 100g / 200g / 400g — 25 / 35 / 50 months

## Hypocaust (Heating System)

Underfloor heating for accelerated recovery. *Requires Balnea Level 2.*

- Lv1: +15% recovery, +5 morale | Lv2: +25%, +10, +10% healing | Lv3: +40%, +15, no cold injuries
- **Cost**: 180g / 360g / 720g — 35 / 50 / 70 months`,
  },
  {
    id: 'building-production',
    title: 'Production, Commerce & Security',
    category: 'buildings',
    unlockCondition: { type: 'fame', value: 100 },
    content: `# Production, Commerce & Security Buildings

The infrastructure that sustains your ludus — forges for weapons, markets for income, and walls for protection.

## Production

### Armamentarium (Armory)
Equipment storage and repair. *Requires a Faber on staff.*
- Lv1: -20% repair cost | Lv2: -30%, +5% weapon damage | Lv3: -40%, legendary gear crafting
- **Cost**: 40g / 80g / 160g

### Taberna (Kitchen)
Food preparation and storage.
- Lv1: +15% nutrition | Lv2: +25% | Lv3: +35%, Ash Tonic crafting
- **Cost**: 30g / 60g / 120g

### Water Well
Clean water supply for drinking and bathing.
- Lv1: +15 daily water | Lv2: +25 | Lv3: +40, +5% healing
- **Cost**: 30g / 60g / 120g

### Forge
Weapon and armor smithing. *Requires a Faber on staff.*
- Lv1: +10% weapon/armor quality | Lv2: +20%, +5% damage | Lv3: +35%, masterwork weapons
- **Cost**: 120g / 250g / 500g

### Oil Press
Olive oil production for income and massage therapy.
- Lv1: +5g/month, +10% massage | Lv2: +10g, +20% | Lv3: +20g, +30%, +10% stamina recovery
- **Cost**: 80g / 160g / 320g

## Commerce

### Marketplace (Ludus Market)
On-site trading post for income. *Requires Taberna Level 1.*
- Lv1: +10g/month, +15% merchandise | Lv2: +20g, +30% | Lv3: +40g, +50%, double income for famous gladiators
- **Cost**: 100g / 200g / 400g

### Ludus Office
Administrative center for contracts. *Requires a Lanista on staff.*
- Lv1: +10% contracts, +5% match rewards | Lv2: +20%, +10%, -5% wages | Lv3: +35%, +20%, -10% wages
- **Cost**: 80g / 160g / 320g

## Security

### Walls
Perimeter defenses to prevent escapes and intrusions.
- Lv1: +10 security | Lv2: +20 | Lv3: +35, no escapes
- **Cost**: 50g / 100g / 200g

### Guard Tower
Elevated watch post for detection. *Requires Walls Level 1.*
- Lv1: +15 security, +30% escape detection | Lv2: +30, +50% | Lv3: +50, +75%, detect sabotage
- **Cost**: 75g / 150g / 300g

### Barracks
Staff housing that reduces wages and improves security.
- Lv1: -10% wages, +5 security | Lv2: -15%, +10, +5% staff satisfaction | Lv3: -25%, +15
- **Cost**: 100g / 200g / 400g

## Storage

### Grain Shelter
Protected grain storage.
- Lv1: 100 capacity | Lv2: 200, -10% spoilage | Lv3: 400, no spoilage
- **Cost**: 25g / 50g / 100g

### Wine Cellar
Wine storage with aging benefits.
- Lv1: 50 capacity | Lv2: 100, +5% staff satisfaction | Lv3: 200, +10%
- **Cost**: 35g / 70g / 140g`,
  },
  {
    id: 'building-entertainment',
    title: 'Entertainment & Advanced',
    category: 'buildings',
    unlockCondition: { type: 'fame', value: 200 },
    content: `# Entertainment & Advanced Buildings

High-end facilities that boost fame, crowd favor, and provide advanced training capabilities.

## Spectator Seats

Allow visitors to watch training sessions, generating fame and sponsor interest. *Requires Arena Replica Level 1.*

- Lv1: +10% fame, +5% sponsor chance | Lv2: +20%, +10% | Lv3: +35%, +20%, +15g/month
- **Cost**: 150g / 300g / 600g — 30 / 45 / 60 months

## Beast Pens

Housing for wild animals used in training and spectacle.

- Lv1: +20% beast fighting, +10% crowd favor | Lv2: +35%, +20%, +15% fame | Lv3: +50%, +30%, exotic beasts
- **Cost**: 200g / 400g / 800g — 40 / 60 / 80 months

Marketplace beasts (Training Wolf, Wild Boar, Arena Lion, Caledonian Bear) require Beast Pens to house. These provide XP, stat gains, and fame bonuses for your gladiators.

## Advanced Training Buildings

These buildings are covered in the Training Facilities entry but bear repeating for their entertainment value:

- **Arena Replica**: Simulates real combat for training. At Level 3, unlocks practice tournaments with no death risk.
- **Gymnasium**: At Level 3, allows training 2 gladiators simultaneously.
- **Library**: At Level 3, unlocks legendary combat techniques.

## Building Synergy Chains

The most powerful ludus configurations chain buildings together:

1. **Training Path**: Palus → Gymnasium → Arena Replica → Spectator Seats
2. **Recovery Path**: Balnea → Hypocaust + Valetudinarium
3. **Commerce Path**: Taberna → Marketplace → Ludus Office
4. **Security Path**: Walls → Guard Tower → Barracks
5. **Entertainment Path**: Arena Replica → Spectator Seats + Beast Pens`,
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
Monthly wages are automatically deducted from your treasury. Unpaid staff will become dissatisfied and may leave.

### Satisfaction
Keep satisfaction high (50+) to retain staff:
- Pay wages on time
- Build synergy buildings
- Maintain Wine Cellar for morale

## Staff Roles

| Role | Hire Cost | Monthly Wage | Max | Primary Bonus | Synergy Building |
|------|-----------|-------------|-----|---------------|------------------|
| **Doctore** | 200g | 150g | 1 | +25% Training XP | Palus, Gymnasium |
| **Medicus** | 150g | 120g | 2 | +30% Healing Speed | Valetudinarium |
| **Lanista** | 300g | 180g | 1 | +20% Gold from Fights | Ludus Office |
| **Faber** | 175g | 120g | 2 | -25% Equipment Repair | Armamentarium, Forge |
| **Coquus** | 100g | 90g | 2 | +15% Nutrition | Taberna |
| **Guard** | 75g | 60g | 5 | +10 Security Rating | Walls |
| **Lorarius** | 100g | 90g | 1 | +20% Obedience | — |

## Staff XP & Progression

Staff gain experience daily based on their work and automatically level up (max level 5):

- **XP Threshold**: Level × 50 XP to advance
- **XP Sources**: +3-5 XP per relevant action (training gladiators, treating injuries, etc.), +5 base XP per day worked
- Each level increases effectiveness by 10%

## Skill Trees

Every staff role has a 3-tier skill tree, unlocked as they level up:

- **Doctore**: Drill Master (+15% XP) → Weapon Expert (+20% weapon skill) → Legendary Trainer (+25% XP, +1 skill point per gladiator)
- **Medicus**: Field Medicine (+20% healing) → Surgeon (-25% permanent injury) → Master Healer (+25% healing, -20% death chance)
- **Lanista**: Negotiator (+15% gold) → Promoter (+20% fame, +10% gold) → Master Dealer (+25% gold, -10% market prices)
- **Faber**: Equipment Maintenance (+20% durability) → Weaponsmith (+10% damage) → Master Smith (+15% damage, +15% armor)
- **Coquus**: Hearty Meals (+15% nutrition) → Special Diet (+20% stamina recovery) → Master Chef (+15 morale, +10% healing)
- **Guard**: Vigilant (+5 security) → Intimidating (-15% rebellion) → Elite Guard (-50% escape chance)
- **Lorarius**: Strict Discipline (+15% obedience) → Instill Fear (+20% obedience) → Iron Will (-40% rebellion, -30% escape)`,
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

Roman politics were a dangerous game. Four major factions vie for power, and your allegiance matters. Each is led by a powerful figure with their own agenda.

## The Factions

### Optimates (Conservatives) — Senator Marcus Cato
The traditional senatorial aristocracy. Rival: Populares.

**Benefits at Favor 25 / 50 / 75 / 90:**
- 10% equipment discount → Noble tournaments → +50 gold/month → 50% sabotage protection

### Populares (Reformers) — Tribune Gaius Gracchus
Champions of the common people. Rival: Optimates.

**Benefits at Favor 25 / 50 / 75 / 90:**
- +15% crowd favor → 20% cheaper recruitment → +40 gold from merchandise → +10% fame gain

### Military Legion — General Lucius Sulla
The generals and soldiers of Rome. Rival: Merchants.

**Benefits at Favor 25 / 50 / 75 / 90:**
- +10% combat stats → 25% cheaper weapons → Veteran gladiator access → +20% training effectiveness

### Merchant Guild — Guildmaster Publius Crassus
The wealthy traders and businessmen. Rival: Military.

**Benefits at Favor 25 / 50 / 75 / 90:**
- 15% trade discount → +30 gold/month → Rare goods access → +25% merchandise income

## Favor System

Favor ranges from -100 (Hostile) to +100 (Allied):

| Range | Status | Effects |
|-------|--------|---------|
| -100 to -50 | Hostile | Sabotage risk, severe penalties |
| -49 to -1 | Unfavored | Price increases, minor penalties |
| 0 | Neutral | No effects |
| 1 to 49 | Friendly | Minor benefits unlocking at 25 |
| 50 to 100 | Allied | Full benefits, alliance option |

## Political Actions

Spend gold and influence to change faction favor:

| Action | Cost | Effect | Notes |
|--------|------|--------|-------|
| Small Gift | 50g | +5 favor | Safe, reliable |
| Generous Donation | 200g | +15 favor | — |
| Lavish Banquet | 500g | +30 favor, -10 rival | — |
| Bribe Official | 150g | +10 favor | 80% success rate |
| Dedicate Victory | Free | +8 favor | After arena win |
| Political Marriage | 1000g | +50 favor, -25 rival | 90% success |
| Spread Rumors | 75g | -10 to target | 85% success |
| Sabotage Rival Ludus | 300g | Harm competitor | 70% success |

## Sabotage

When a faction becomes hostile (favor -50 or below), they may sabotage your ludus:

- **Treasury Theft**: Lose 100 gold
- **Poisoned Water**: 2 gladiators injured, 50 gold in damages
- **Arson**: 1 building damaged, 200 gold in damages
- **Slander**: -25 ludus fame
- **Staff Poaching**: 1 staff member quits
- **Assassination Attempt**: 1 gladiator injured, -50 fame

Guards and the Guard Tower provide protection against sabotage attempts.`,
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

Welcome to Ludus Magnus: Reborn! Choose your path — manage a ludus as a **Lanista**, or fight for survival and freedom as a **Gladiator**.

## Choosing Your Mode

- **Lanista Mode**: Build a gladiator school, recruit fighters, manage finances, and climb the fame ladder
- **Gladiator Mode**: Create a fighter, survive under a dominus, build relationships, and earn your freedom

This guide covers Lanista Mode. See the Gladiator Mode section of the Codex for the other path.

## Month 1: The Basics

The game runs on a monthly cycle using the Roman calendar, starting in Januarius, 73 AD.

1. **Visit the Marketplace**
   - Recruit your first gladiator (start with a Murmillo or Samnite — forgiving for beginners)
   - Consider age: Prime (20-29) fighters perform best

2. **Build Training Facilities**
   - Start with a Palus (5 gold, 3 months) and Coal Pit
   - Cheap and quick to build

3. **Set Training Regimen**
   - Assign your gladiator to Palus Drill or Sparring
   - Don't overtrain — fatigue hurts performance

## First Year Goals

- Recruit 2-3 gladiators
- Build Palus and Coal Pit
- Win several pit fights
- Reach 50+ Fame
- Hire a Doctore

## Managing Resources

**Gold**: Your primary resource. Balance expenses with income:
- Staff wages (monthly): 60-180g per staff member
- Food costs: ~60g per gladiator per month
- Building maintenance: 7-40g per building per month

**Starting Gold** (by difficulty): Easy: 750g | Normal: 500g | Hard: 300g

**Time**: Each "Advance Month" progresses one Roman month. Plan training, fights, and construction around the monthly cycle.

## Tips for Success

1. Don't rush into death matches — Grand Munera and above mean permanent death
2. Build the Valetudinarium early — injuries are inevitable
3. Hire a Doctore before expanding your roster
4. Watch your treasury — take loans from the bank if needed, but beware of interest
5. Keep buildings maintained — neglected buildings lose effectiveness`,
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

- **High Fatigue (70%+)**: Stop training, rest the gladiator
- **Injuries**: Immediate rest until healed
- **Pre-Fight**: Rest the month before important matches

### Age Management

Gladiator age heavily affects performance:

- **Youth (15-19)**: +25% XP gain but weaker base stats — invest in training early
- **Prime (20-29)**: Peak performance — this is your window for championships
- **Veteran (30-35)**: -10% XP, slow stat decline — transition to easier fights or sell
- **Aging (36-40)**: Significant decline, 0.5% monthly death risk — consider retirement
- **Old (41+)**: Severe decline, 2% monthly death risk — sell or retire immediately

Buy gladiators in their youth and sell them before they age out of their prime for maximum return.

### Career Milestones

Gladiators earn titles and rewards for longevity and achievement:
- **6 months**: "Tiro" title, morale boost
- **12 months**: "Veteran" title, +25 fame
- **24 months**: "Champion" title, +50 fame, stat bonuses
- **36 months**: "Legend" title, +100 fame, +500 gold
- **Achievement milestones**: First Blood, Victor (10 wins), Conqueror (25), Immortal (50 wins)

## Economic Mastery

### Income Streams
1. Arena victories (primary)
2. Merchandise sales (passive, scales with fame tiers)
3. Sponsorship deals (19 tiers from local merchants to imperial contracts)
4. Building income (Marketplace, Oil Press, Spectator Seats)
5. Selling gladiators (well-trained fighters sell for 2-5x purchase price)

### Banking & Loans
When gold runs low, take a loan from the bank:
- **Short-term** (6 months): 100-500g at 15% interest
- **Medium-term** (12 months): 500-2000g at 25% interest
- **Long-term** (24 months): 2000-5000g at 40% interest

Missed payments cause faction favor loss and risk building seizure.

### Building Maintenance
Neglecting maintenance is a false economy:
- Buildings below 50% condition lose effectiveness rapidly
- Schedule regular repairs to keep condition above 75%
- The Faber staff role helps reduce maintenance costs

## Political Navigation

### Faction Balance
- Never let any faction go hostile (-50 or below) — they will sabotage you
- Focus on 1-2 factions for full benefits
- Use political actions (gifts, donations, dedicated victories) to manage favor

### Alliance Timing
- Alliance at 50+ favor provides massive benefits
- But increasing one faction often decreases its rival
- Wait until mid-game to commit to a primary faction`,
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
- Rest the month before important matches
- Use Balnea for quick recovery; Hypocaust for deep restoration

### Matchup Selection
- Choose opponents your gladiator counters (e.g. Secutor vs Retiarius)
- Avoid unfavorable matchups for important fights
- Check opponent stats before committing

### Marketplace Prep
- **Healing Potion** (40g): +30 HP before a fight
- **Stamina Tonic** (30g): +40 stamina
- **Berserker Mushroom** (60g): +30% damage (but -10% accuracy)
- **Focus Elixir** (50g): +20% accuracy

## In-Combat Tactics

### Action Economy
1. **Opening**: Defend or Taunt. Taunt has 70% chance to Enrage the enemy (+25% damage but -20% accuracy for them)
2. **Mid-Fight**: Mix attacks with defense. Use Heavy Attack (1.5x damage) when you have stamina to spare
3. **Finishing**: All-out attack when enemy is low — use your Special Move for maximum damage

### Stamina in Combat
- Rest when below 30% stamina (recovers 25 stamina)
- Heavy attacks cost 20 stamina, specials cost 30 — budget accordingly
- Don't let stamina hit 0 (Exhausted status: -20% damage, -15% accuracy)

### Status Effect Management
- **Bleeding** stacks up to 3 times (15 HP/turn) — devastating over long fights
- **Stunned** enemies skip their turn — follow up with Heavy Attack
- **Netted** (from Retiarius) halves evasion and reduces accuracy — close in for the kill
- Use **Defend** to halve incoming damage when you're low on HP

### Crowd Favor
- Taunts, specials, and heavy attacks increase crowd favor
- Defending and resting decrease it
- High crowd favor means better mercy chances if your gladiator loses
- Aim for 50+ crowd favor in death matches for safety

## Post-Fight

### Injury Treatment
- Treat injuries immediately with a Medicus on staff
- Minor injuries heal in 3-5 months with Medicus
- Major injuries need 10+ months
- Use Pain Relief Salve (80g) or Miracle Cure (300g) from the Marketplace for faster recovery

### Morale Management
- Victories boost morale; defeats hurt it
- Keep morale above 0.7 for best combat performance
- Falernian Wine (30g) gives +15 morale; Arabian Perfume (150g) boosts entire roster`,
  },
  {
    id: 'gameplay-monthly',
    title: 'The Monthly Cycle',
    category: 'gameplay',
    unlockCondition: { type: 'always' },
    content: `# The Monthly Cycle

Time in Ludus Magnus: Reborn flows month by month through the Roman calendar, starting in **Januarius, 73 AD** — the year Colosseum construction began.

## Roman Calendar

The twelve months of Rome:

Januarius, Februarius, Martius, Aprilis, Maius, Junius, Julius, Augustus, September, October, November, December

Each "Advance Month" button press progresses one month. When December ends, the year advances (e.g., December 73 AD → Januarius 74 AD).

## Monthly Processing

When you advance a month, the following systems process in order:

1. **Income**: Arena winnings, merchandise sales, sponsorship payments, building income
2. **Expenses**: Staff wages, food costs (60g/gladiator), building maintenance, loan payments
3. **Training**: Gladiators in training receive XP and stat gains based on their regimen
4. **Recovery**: Injured gladiators heal; resting gladiators recover stamina and reduce fatigue
5. **Building Progress**: Construction and upgrades advance; building condition degrades
6. **Aging**: Gladiators age; stat decline applies for veterans; death checks for old gladiators
7. **Milestones**: Career milestones checked and awarded (titles, fame, gold)
8. **Events**: Historical events trigger on their calendar dates; random events may occur
9. **Loans**: Monthly loan payments deducted automatically
10. **Market**: Gladiator market refreshes every 10 months with new recruits

## Month Report

After processing, a monthly report summarizes everything that happened: income, expenses, training results, events, milestones, and any gladiator deaths or injuries.`,
  },
  {
    id: 'gameplay-marketplace',
    title: 'The Marketplace',
    category: 'gameplay',
    unlockCondition: { type: 'always' },
    content: `# The Marketplace

The marketplace offers 35+ items across 6 categories, plus gladiator recruitment and market management.

## Gladiator Recruitment

New gladiators appear in the market with varying classes, stats, ages, and origins:
- **POW**: 50-150g, strong but low obedience
- **Criminal**: 30-100g, balanced but unpredictable
- **Volunteer**: 100-300g, good morale and obedience
- **Trained Fighter**: 200-500g, best stats, high obedience

The market refreshes automatically every 10 months. Pay 100g for an instant manual refresh.

## Item Categories

### Equipment (6 items)
Permanent stat boosts equipped to gladiators. 4 equipment slots: Weapon, Shield, Armor, Accessory.

- Standard Gladius (50g), Masterwork Gladius (300g), Reinforced Scutum (200g)
- Champion's Panoply (1,500g — legendary full armor)
- Training Weights (100g), Mercury's Sandals (150g)

### Consumables (7 items)
Immediate-use potions and tonics:

- Healing Potion (40g, +30 HP), Stamina Tonic (30g, +40 stamina)
- Gladiator's Brew (150g, full HP+stamina restore)
- Pain Relief Salve (80g, -5 days injury), Miracle Cure (300g, instant heal)
- Berserker Mushroom (60g, +30% damage / -10% accuracy)
- Focus Elixir (50g, +20% accuracy)

### Training Items (4 items)
Accelerate progression:

- Combat Manual (80g, +100 XP), Master's Techniques (200g, +1 skill point)
- Legendary Scroll (600g, +3 skill points), Elite Regimen (150g, +50% training for 7 months)

### Luxury Items (5 items)
Morale and fame boosters:

- Falernian Wine (30g, +15 morale), Silk Bedding (80g, +25 morale)
- Golden Laurel Crown (200g, +50 gladiator fame)
- Arabian Perfume (150g, +20 morale to all gladiators)
- Marble Statue (500g, +100 ludus fame)

### Beasts (4 items)
Animals for training and spectacle (require Beast Pens):

- Training Wolf (120g, +50 XP), Wild Boar (180g, +75 XP, +1 AGI)
- Arena Lion (400g, +150 fame), Caledonian Bear (600g, +200 XP, +2 STR)

### Services (4 items)
One-time expert services:

- Greek Physician (150g, heal any injury), Master Trainer (250g, +200 XP, +1 skill point)
- Oracle's Blessing (300g, +40 morale for 7 months)
- Imperial Introduction (800g, +200 fame)

## Limited Stock & Fame Requirements

6 legendary items have limited availability (1 in stock). High-tier items unlock at specific fame levels (50-500).`,
  },
  {
    id: 'gameplay-banking',
    title: 'Banking & Loans',
    category: 'gameplay',
    unlockCondition: { type: 'day', value: 10 },
    content: `# Banking & Loans

When your treasury runs dry, the Roman banking system offers loans to keep your ludus running — but at a price.

## Loan Types

| Loan | Amount | Duration | Interest | Monthly Payment |
|------|--------|----------|----------|-----------------|
| **Short-Term** | 100-500g | 6 months | 15% | Principal ÷ 6 + interest |
| **Medium-Term** | 500-2,000g | 12 months | 25% | Principal ÷ 12 + interest |
| **Long-Term** | 2,000-5,000g | 24 months | 40% | Principal ÷ 24 + interest |

## Automatic Payments

Loan payments are deducted automatically each month during end-of-month processing. You don't need to manage payments manually — just ensure you have enough gold.

## Missed Payments

Failing to make a payment triggers escalating penalties:

- **1st missed**: Faction favor loss (-10 to -25 depending on loan size)
- **2nd missed (Short-term)**: Risk of sabotage from creditors
- **2nd missed (Medium-term)**: Risk of building seizure — a building may be repossessed
- **2nd missed (Long-term)**: Risk of game-ending default

## Strategy

- Short-term loans are safest — low interest, quick payoff
- Take medium-term loans for major building investments that will generate income
- Avoid long-term loans unless absolutely necessary — 40% interest is brutal
- Always maintain enough monthly income to cover loan payments before taking debt
- A well-timed loan can fund a Gymnasium or Marketplace that pays for itself`,
  },
  {
    id: 'gameplay-aging',
    title: 'Aging & Milestones',
    category: 'gameplay',
    unlockCondition: { type: 'day', value: 15 },
    content: `# Gladiator Aging & Career Milestones

Gladiators are mortal. They grow, peak, and eventually decline. Managing their careers across time is essential.

## Age Categories

| Category | Age | XP Modifier | Stat Decline | Death Risk | Price Modifier |
|----------|-----|-------------|-------------|------------|----------------|
| **Youth** | 15-19 | +25% (fast learner) | None | None | 0.7x |
| **Prime** | 20-29 | Standard | None | None | 1.0x |
| **Veteran** | 30-35 | -10% | Slow (-0.1 STR, -0.15 AGI/month) | 0.1%/month | 0.9x |
| **Aging** | 36-40 | -25% | Moderate | 0.5%/month | 0.6x |
| **Old** | 41+ | -40% | Severe | 2.0%/month | 0.4x |

### Stat Decline Details
- **Agility and Endurance** decline fastest with age
- **Constitution** is most resistant to aging
- **Strength and Dexterity** decline at moderate rates

### Age-Based Pricing
Market prices and sell values are adjusted by age category. Youth fighters are cheap but need development; prime fighters cost full price; veterans and older are discounted.

## Career Milestones

### Time-Based
| Milestone | Requirement | Reward |
|-----------|------------|--------|
| Tiro | 6 months | Morale boost |
| Veteran | 12 months | +25 fame |
| Champion | 24 months | +50 fame, stat bonuses |
| Legend | 36 months | +100 fame, +500 gold |
| Birthday | Annual | Morale boost |

### Achievement-Based
| Milestone | Requirement | Reward |
|-----------|------------|--------|
| First Blood | 1 victory | +10 fame |
| Victor | 10 victories | +25 fame |
| Conqueror | 25 victories | +50 fame, +200 gold |
| Immortal | 50 victories | +100 fame, +500 gold, stat bonuses |
| Undefeated 5 | 5-win streak | Fame bonus |
| Undefeated 10 | 10-win streak | Major fame bonus |

### Survival
| Milestone | Requirement | Reward |
|-----------|------------|--------|
| Survivor | Reach age 35 | +50 fame |
| Living Legend | Reach age 40 | +100 fame, +400 gold |

## Fallen Warriors Memorial

Gladiators who die in combat are recorded in the Fallen Warriors Memorial, viewable from the Gladiators screen. Each entry records their death date, cause, killer, and final combat record.`,
  },
  {
    id: 'gameplay-events',
    title: 'Historical Events',
    category: 'gameplay',
    unlockCondition: { type: 'day', value: 10 },
    content: `# Historical Events

The world around your ludus is alive with history. Major events, annual festivals, and random occurrences shape the game.

## Major Historical Events

These trigger at specific dates in the game timeline:

- **79 AD, Augustus**: Mount Vesuvius erupts — grain prices rise 50%, gladiator availability drops 20% for 3 months
- **80 AD, Julius**: The Colosseum grand opening — Imperial Tournament available, +50 fame, +200 gold
- **84 AD, Januarius**: Domitian's reign of terror — -10 Optimates favor, political instability

## Annual Recurring Events

| Event | Month | Effect |
|-------|-------|--------|
| **Saturnalia** | December | +20% morale across ludus, +100 gold, +20 fame |
| **Ludi Romani** | September | +30% fame gain from all fights, +150 gold |
| **Imperial Taxes** | Aprilis | 10% of your gold is collected as tax |
| **Munera Gladiatoria** | Martius | Traditional games, +25 fame |

## Random Monthly Events

Each month, random events may occur based on probability:

| Event | Chance | Season | Effect |
|-------|--------|--------|--------|
| Plague outbreak | 2% | Any | -10% morale, -50 gold |
| Imperial visit | 5% | Summer | +40 fame |
| Trade disruption | 8% | Winter | +25% prices temporarily |
| Wealthy patron | 6% | Any | +300 gold, +15 Optimates favor |
| Rival challenge | 10% | Any | Accept (+30 fame) or decline (-20 fame) |
| Bountiful harvest | 7% | Autumn | -40% grain prices for 2 months |

## Event Effects

Events are logged in the monthly report. Some events offer choices with different consequences, while others apply automatically. Plan your treasury and roster to weather disruptions.`,
  },
  {
    id: 'gameplay-fame',
    title: 'Fame & Reputation',
    category: 'gameplay',
    unlockCondition: { type: 'fame', value: 50 },
    content: `# Fame & Reputation

Fame is the currency of respect in Rome. Both your ludus and individual gladiators earn fame independently, unlocking tiers of prestige and profit.

## Ludus Fame Tiers

| Tier | Fame Required | Key Benefit |
|------|--------------|-------------|
| Unknown | 0 | — |
| Local | 50 | Basic merchandise |
| Neighborhood | 100 | Supply discounts |
| District | 175 | Building discounts |
| City | 250 | Better gladiator prices |
| Regional | 400 | Training bonuses |
| Provincial | 600 | Advanced merchandise |
| Famous | 850 | Premium sponsorships |
| Renowned | 1,200 | Elite equipment access |
| Legendary | 1,800 | Combat stat bonuses |
| Immortal | 3,000 | Maximum benefits |

## Gladiator Fame Tiers

| Tier | Fame | Latin Title |
|------|------|-------------|
| Novice | 0 | Novicius |
| Initiate | 25 | — |
| Fighter | 50 | Bellator |
| Warrior | 100 | — |
| Veteran | 175 | — |
| Elite | 275 | Praestans |
| Champion | 400 | — |
| Hero | 550 | Heros |
| Legend | 750 | — |
| Mythic | 1,000 | Mythicus |
| Immortal | 1,500 | Immortalis |

Higher gladiator fame tiers provide morale bonuses, increased crowd favor, critical hit chance, and intimidation effects in combat.

## Merchandise

22 merchandise items across 7 tiers generate passive income scaled to your ludus fame:

- **Basic** (0 fame): Clay Figurines, Painted Tiles, Ludus Banners
- **Local** (50): Leather Wristbands, Fighter Masks, Commemorative Cups
- **City** (250): Bronze Statuettes, Training Weapons, Replica Tridents
- **Regional** (400): Gladiator Portraits, Victory Coins, Silver Figurines
- **Provincial** (600): Arena Paintings, Mosaic Tile Art, Champion's Cloaks
- **Renowned** (1,200): Marble Busts, Silk Banners, Jeweled Replica Swords
- **Legendary** (1,800): Grand Portraits, Golden Statues, Imperial Collections

## Sponsorship Deals

19 sponsorship deals across 5 tiers provide monthly income and special bonuses:

- **Early** (0-75 fame): Local Merchant, Tavern Partnership, Baker Sponsorship
- **Growing** (100-200): Wine Trader, Olive Oil Partnership, Leather Crafter
- **Established** (250-400): Noble Patron, Weapon Master, Bathhouse Partnership
- **Elite** (500-800): Senator's Endorsement, Physicians Guild, Military Patronage
- **Prestigious** (1,000+): Imperial Favor, Banking House, Temple Blessing, Arena Partnership`,
  },

  // ============================================
  // GLADIATOR MODE SECTION
  // ============================================
  {
    id: 'gladiator-overview',
    title: 'Life as a Gladiator',
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# Life as a Gladiator

In Gladiator Mode, you experience the arena from the other side — not as a wealthy lanista, but as a fighter struggling for survival, glory, and ultimately freedom.

## How It Differs from Lanista Mode

| Aspect | Lanista Mode | Gladiator Mode |
|--------|-------------|----------------|
| **Role** | Manage a ludus | Fight as a gladiator |
| **Control** | Full control of all decisions | Dominus gives orders you must follow |
| **Goal** | Build fame and wealth | Earn your freedom (the Rudis) |
| **Economy** | Gold treasury | Peculium (personal savings) |
| **Social** | Staff and factions | Companions and dominus favor |
| **Combat** | Send gladiators to fight | Fight personally in the arena |

## Your Dashboard

The gladiator dashboard shows your cell — your home in the ludus:

- **Vitals**: HP, stamina, morale, fatigue — color-coded status alerts warn of danger
- **Stats**: Strength, agility, dexterity, endurance, constitution
- **Combat Record**: Wins, losses, kills, crowd favor history
- **Current Orders**: What your dominus wants you to do this month
- **Freedom Meter**: Libertas progress toward the Rudis

## Status Alerts

Color-coded banners appear when you're in danger:
- **Red**: Injured — cannot train or fight
- **Orange**: Exhausted — high fatigue impairs performance
- **Yellow**: Low morale or low stamina
- **Green**: Peak condition — all vitals optimal

## Navigation

7 screens accessible from the sidebar: Cell (dashboard), Training, Ludus Life (companions), Arena, Freedom, Peculium, and Codex.`,
  },
  {
    id: 'gladiator-creation',
    title: 'Character Creation',
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# Character Creation

Create your gladiator through a 5-step process that shapes your starting stats, background, and fighting style.

## Step 1: Origin

Your origin determines how you came to the ludus:

| Origin | Stat Bonuses | Traits |
|--------|-------------|--------|
| **Prisoner of War** | STR +8, CON +5, END +2 | High strength and constitution; medium obedience; bitter pride |
| **Criminal** | STR +3, AGI +5, DEX +3, END +2, CON +2 | Balanced stats; low obedience; unpredictable |
| **Volunteer** | STR +2, AGI +2, DEX +3, END +3 | Higher morale; good obedience; can negotiate; starts with 20 peculium |
| **Slave** | AGI +2, DEX +2, END +3 | Highest obedience; lowest base stats; +25% XP gain |

## Step 2: Identity

Choose your gladiator's name and select a difficulty level.

## Step 3: Region of Origin

8 regions representing the breadth of the Roman world:

Thrace, Gaul, Germania, Britannia, Numidia, Hispania, Greece, Rome

Your region adds flavor to your story and identity.

## Step 4: Fighting Class

Choose from all 8 gladiator classes:

- **Heavy**: Murmillo, Secutor, Samnite — high defense, slow
- **Medium**: Thraex, Hoplomachus — balanced offense and defense
- **Light**: Retiarius, Dimachaerus, Velitus — fast, fragile, specialized

See the Gladiator Classes section for full details on each class.

## Step 5: Stat Allocation

Distribute 10 bonus points across your 5 stats: Strength, Agility, Dexterity, Endurance, Constitution. These add to the base stats from your class and origin.

## Starting Conditions

- You begin as property of a randomly generated dominus with one of 5 personality types
- Your ludus has 4-8 companion gladiators
- Peculium starts at 0 (20 for Volunteers)
- Libertas starts at 0 — the long road to freedom begins`,
  },
  {
    id: 'gladiator-dominus',
    title: 'The Dominus',
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# The Dominus

Your dominus is the owner of the ludus — and of you. Their personality shapes your daily life, from the food you eat to whether you live or die.

## Personality Types

| Personality | Description | Fight Tendency | Punishment | Food Quality |
|-------------|-------------|---------------|------------|-------------|
| **Fair** | Balanced, rewards loyalty | Moderate | Proportional | Standard-Good |
| **Harsh** | Demands excellence | High | Severe | Standard |
| **Cruel** | Arbitrary and vicious | High | Extreme | Poor-Standard |
| **Indulgent** | Generous, slow to anger | Low | Light | Good-Excellent |
| **Ambitious** | Treats you as an investment | Very High | Moderate | Scales with favor |

## Monthly Orders

Each month, the dominus issues an order:

- **Train**: Assigned a specific training regimen (e.g., Palus Drill, Sparring, Strength)
- **Fight**: Sent to the arena — pit fight, munera, or championship (based on your level and fame)
- **Rest**: Ordered to recover (usually when injured or fatigued)
- **Spar as Partner**: Practice fight with a companion gladiator
- **Punishment**: Cruel or harsh dominus may punish you arbitrarily

## Obedience & Favor

The dominus tracks your favor (-100 to 100). Obedience matters:

- **Following orders**: +2 favor per month of obedience
- **Disobeying**: -15 favor (-25 if harsh or cruel dominus)
- **Winning fights**: +10 favor (+3 bonus if ambitious), +5 if crowd favor >50
- **Losing fights**: -5 favor (-10 harsh, -8 cruel)

## Being Sold

If your favor drops too low, the dominus sells you to another ludus:

- Favor ≤ 15 after 3+ months: high risk of sale
- Favor < 10: almost certain sale
- Cruel dominus + favor < 25: 15% monthly sale chance

When sold, you get a new dominus (random personality), new companions, and reset your months-in-ludus counter. Your previous dominus is recorded in your history.

## Food Quality

Your dominus controls your diet, which affects healing, training, and morale:

- **Poor**: -20% healing, -15% training, -10 morale
- **Standard**: No modifiers
- **Good**: +15% healing, +10% training, +10 morale
- **Excellent**: +30% healing, +20% training, +20 morale

Cruel dominus with low favor = poor food. Indulgent dominus = good/excellent food.`,
  },
  {
    id: 'gladiator-companions',
    title: 'Companions & Brotherhood',
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# Companions & Brotherhood

You share the ludus with 4-8 fellow gladiators. These companions can become your closest allies or bitter rivals.

## Companion Traits

Each companion has:
- **Personality**: Aggressive, Cunning, Loyal, Bitter, or Jovial
- **Rank**: Tiro (new), Veteran (experienced), or Champion (elite)
- **Relationship**: -100 (Enemy) to +100 (Brother)

## Relationship Tiers

| Range | Tier | Effect |
|-------|------|--------|
| ≤ -60 | Enemy | May sabotage you, hostile interactions |
| -59 to -20 | Rival | Tense, competitive |
| -19 to 20 | Neutral | Indifferent |
| 21 to 60 | Friend | Supportive, helpful |
| 61+ | Brother | Deep bond, strongest allies |

## Interactions (2 per month)

### Spar
Practice combat with a companion.
- **Gain**: 15-25 XP, possible stat gains
- **Risk**: 8% injury chance
- **Relationship**: Varies by personality — loyal companions bond through sparring; aggressive ones resent losing

### Talk
Conversation and bonding.
- **Gain**: +0.02-0.07 morale, +3-5 relationship
- **Special**: Cunning companions have 40% chance to share a rumor (useful intel)
- **Note**: Bitter companions give less relationship gain

### Challenge
Assert dominance over a companion.
- **Win**: -8 relationship (-12 if aggressive), but earns respect; beating a Champion gives +3 dominus favor
- **Lose**: +3 relationship (they respect your courage)
- **Based on**: Power comparison between your stats and theirs

## Companion Events

Companions aren't just static NPCs — life happens to them:
- **Sold Away**: The dominus sells a companion to another ludus (permanently removed)
- **Killed**: A companion dies in the arena
- **Freed**: A companion earns their freedom and leaves
- **New Arrival**: A new gladiator joins the ludus`,
  },
  {
    id: 'gladiator-freedom',
    title: 'Path to the Rudis',
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# Path to the Rudis

The *rudis* — a wooden sword symbolizing freedom — is the ultimate goal of every gladiator. Your journey is tracked by the Libertas meter (0-1000).

## Libertas Tiers

| Libertas | Tier | Latin Title |
|----------|------|-------------|
| 0 | Unknown | Ignotus |
| 100 | Survivor | Superstes |
| 300 | Known Name | Nomen Notum |
| 500 | The Crowd's Favorite | Dilectus Populi |
| 700 | Renowned | Celebris |
| 900 | On the Threshold | Ad Limen |
| 1000 | **Freedom** | **Liberatus** |

## Four Paths to Freedom

### Via Gloriae (Path of Glory)
Win your freedom through combat excellence.
- **Requirements**: 50 victories, 500 fame, win a championship
- The most dramatic path — prove your worth in blood

### Via Pecuniae (Path of Coin)
Buy your freedom with saved peculium.
- **Requirements**: Peculium ≥ manumission price, dominus favor > 30
- Manumission price = base (500-1200 by difficulty) + level×80 + fame×0.5 + wins×10
- The practical path — save every coin from tips and gifts

### Via Patroni (Path of Patronage)
Attract a powerful political patron who secures your release.
- **Requirements**: 300 fame, complete patron quest chain
- The political path — fame draws the attention of the powerful

### Via Misericordiae (Path of Mercy)
Earn your dominus's genuine affection and loyalty.
- **Requirements**: Dominus favor 90+, 36+ months served, 200+ fame
- The hardest path — few dominus personalities allow favor this high

## Earning Libertas

### From Combat
| Source | Libertas |
|--------|----------|
| Pit Fight | +15 |
| Local Munera | +20 |
| Championship | +30 |
| Crowd favor > 50 | +5 bonus |
| Crowd favor > 80 | +10 bonus |
| Killing opponent | +5 bonus |

### Passive Monthly Gains
- Fame 100+: +2/month | Fame 300+: +3 | Fame 500+: +5
- Dominus favor 60+: +1/month | Favor 80+: +2
- 24+ months served: +1/month | 36+: +2

## The Rudis Ceremony

When you reach 1000 Libertas and meet your chosen path's requirements, the Rudis ceremony triggers — a narrative finale with path-specific text and your full career statistics.`,
  },
  {
    id: 'gladiator-peculium',
    title: "Peculium: A Gladiator's Purse",
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# Peculium: A Gladiator's Purse

The *peculium* is a gladiator's personal fund — technically the property of your dominus, but in practice yours to accumulate. It's your lifeline on the Path of Coin.

## Earning Peculium

### Arena Tips
After every fight, the crowd may throw coins:
- **Base**: 5-15 peculium per fight (win or lose)
- **Crowd favor > 50**: +5 bonus
- **Crowd favor > 80**: +10 bonus
- **Fame > 200**: +5 bonus

### Other Sources
- **Story chapter rewards**: Each completed chapter grants peculium
- **Random events**: Gifts from admirers, gambling wins, feast leftovers
- **Companion interactions**: Rare opportunities through cunning companions

## Spending Peculium

Your primary use for peculium is buying freedom via the **Path of Coin** (Via Pecuniae):

### Manumission Price
The price to buy your freedom scales with your value:

\`\`\`
Price = Base (500-1200 by difficulty) + Level × 80 + Fame × 0.5 + Wins × 10
\`\`\`

A level 10 gladiator with 300 fame and 25 wins might need ~1,600 peculium.

## Transaction History

Every peculium gain and loss is recorded in your transaction log with the month, year, amount, and source. Access this from the Peculium screen to track your savings progress.

## Strategy

- Fight frequently — arena tips are your primary income
- Maximize crowd favor during fights for bonus tips
- Accept gifts from admirers when random events offer them
- Gambling events offer risk/reward opportunities
- If pursuing Via Pecuniae, start saving early — the price climbs with your level and fame`,
  },
  {
    id: 'gladiator-training',
    title: 'Training Under Orders',
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# Training Under Orders

Training as a gladiator is different from training gladiators. You train once per month, and your dominus dictates the regimen — unless you dare to sneak something different.

## Training Regimens

| Regimen | Base XP | Primary Stat Gains | Fatigue | Injury Risk |
|---------|---------|-------------------|---------|-------------|
| **Palus Drill** | 20 | STR 0-2, DEX 0-1 | 15 | 3% |
| **Sparring** | 25 | STR, DEX, AGI 0-1 | 20 | 8% |
| **Endurance** | 18 | END 0-2, CON 0-1 | 25 | 2% |
| **Agility** | 18 | AGI 0-2, DEX 0-1 | 15 | 4% |
| **Strength** | 20 | STR 0-2, CON 0-1 | 20 | 5% |
| **Tactics** | 18 | DEX 0-2, AGI 0-1 | 8 | 1% |
| **Weapon Mastery** | 22 | STR 0-1, DEX 0-2 | 18 | 4% |
| **Showmanship** | 15 | DEX, AGI 0-1 | 10 | 1% |

## Assigned vs Sneak Training

When your dominus orders you to train, they assign a specific regimen. You can:

- **Obey**: Train the assigned regimen. Safe, earns +1 favor.
- **Sneak Train**: Train a different regimen of your choice. 30% chance of being caught, which costs -5 dominus favor.

Sneak training is valuable when the dominus assigns a regimen that doesn't suit your build, but the risk is real — especially under a harsh or cruel dominus.

## Monthly Limit

You can only train once per month. This is tracked and persists even if you navigate away from the Training screen.

## Level Ups

When you accumulate enough XP, you level up and receive 5 skill points to distribute across your 5 stats (Strength, Agility, Dexterity, Endurance, Constitution). Spend these from the skill allocation panel on the Training screen.

## Training Tips

- **Tactics** has the lowest fatigue and injury risk — ideal when you're already tired
- **Sparring** gives the most XP but has 8% injury risk — avoid before important fights
- **Showmanship** improves crowd favor in future fights, which helps earn peculium and mercy
- If fatigue ≥ 90, you cannot train at all — rest is forced`,
  },
  {
    id: 'gladiator-story',
    title: "The Gladiator's Journey",
    category: 'gladiator_mode',
    unlockCondition: { type: 'always' },
    content: `# The Gladiator's Journey

Your story unfolds across 10 chapters, from the auction block to the Rudis ceremony. Each chapter has objectives to complete and rewards upon completion.

## Story Chapters

| Ch | Title | Key Objectives | Rewards |
|----|-------|---------------|---------|
| 1 | **The Auction Block** | Survive 1 month | 10 libertas, 5 peculium |
| 2 | **Tiro** | 3 months, talk to a companion | 15 libertas, 5 fame |
| 3 | **Blood and Sand** | Win your first fight | 25 libertas, 10 peculium, 15 fame |
| 4 | **Brotherhood of the Damned** | Reach Friend status, 5 wins | 30 libertas, 15 peculium, 20 fame |
| 5 | **The Champion's Shadow** | Level 5, 10 wins | 40 libertas, 20 peculium, 30 fame |
| 6 | **Sold!** | 12 months, 100 fame | 50 libertas, 25 peculium, 25 fame |
| 7 | **Rise to Fame** | 300 fame, 25 wins | 60 libertas, 50 peculium, 50 fame |
| 8 | **A Patron's Game** | 500 fame, level 10, 24 months | 80 libertas, 75 peculium, 50 fame |
| 9 | **The Price of Freedom** | 800 libertas, 40 wins | 100 libertas, 100 peculium, 75 fame |
| 10 | **The Rudis** | 1000 libertas | 200 peculium, 200 fame — **FREEDOM** |

## Random Events

Each month has a ~35% chance of triggering a random event. 12 event types add variety and choices:

- **Gift from Admirer**: A fan sends you a gift — accept for peculium or refuse for humility
- **Feast Day**: The ludus celebrates — boost morale and bond with companions
- **Illness**: Disease strikes — risk to health, costs time recovering
- **Rumor**: Hear gossip about the ludus — may reveal useful information
- **Visitor**: A notable person visits (requires 50+ fame) — potential patron connection
- **Dream of Freedom**: A vivid dream renews your resolve — morale and libertas boost
- **Gambling**: Companions organize a dice game — risk peculium for more
- **Escape Attempt**: Companions plot an escape (after 6+ months) — join or report
- **Sparring Accident**: Training goes wrong — injury risk
- **Punishment**: Cruel or harsh dominus punishes you without reason
- **New Arrival**: A new gladiator joins the ludus — potential friend or rival
- **Companion Sold**: A companion is sold to another ludus — permanent loss

## Choices Matter

Most events offer 2-3 choices with different consequences affecting morale, favor, peculium, relationships, and libertas. The escape attempt is particularly consequential — joining risks severe punishment but can boost companion relationships and libertas.

> "The road from slave to free man is paved with sand and blood. But at its end stands the Rudis — and a life reborn."`,
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
