# Changelog

All notable changes to Ludus Magnus: Reborn will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Event effect application system (market price changes, stat modifiers, etc.)
- Advanced loan features (early payoff, refinancing)
- Bulk maintenance payment options
- Sound effects and music
- Additional gladiator classes
- More story content
- Expanded historical events

---

## [1.4.0] - 2026-02-27

Major expansion adding comprehensive time-based systems that leverage the monthly game cycle for strategic depth and immersion.

### Added

#### Gladiator Aging System
- **Age Tracking**: All gladiators now have age, birth date, and career start tracking
- **Age-Based Development**:
  - Youth (15-19): Fast learners (+25% XP), weaker stats
  - Prime (20-29): Optimal performance, standard XP gain
  - Veteran (30-35): Experience vs. decline (-10% XP, slow stat decline)
  - Aging (36-40): Significant decline (-25% XP, moderate stat decline)
  - Old (41+): High death risk (-40% XP, severe stat decline)
- **Monthly Stat Decline**: Gladiators 30+ experience gradual physical decline
  - Agility and endurance decline fastest
  - Constitution most resistant to aging
- **Death from Old Age**: Monthly probability check for gladiators 30+
  - Veteran: 0.1% per month
  - Aging: 0.5% per month  
  - Old: 2% per month
- **Age-Based Pricing**: Market prices adjusted based on gladiator age
- **Birthday Celebrations**: Gladiators celebrate birthdays with morale boost

#### Banking & Loan System
- **Three Loan Types**:
  - Short-term (6 months): 100-500 gold at 15% interest
  - Medium-term (12 months): 500-2000 gold at 25% interest
  - Long-term (24 months): 2000-5000 gold at 40% interest
- **Automatic Monthly Payments**: Loans deducted automatically each month
- **Missed Payment Penalties**: Faction favor loss and risk of sabotage/building seizure
- **Loan History Tracking**: Complete record of all loan activity

#### Building Maintenance System
- **Condition Tracking**: Buildings have 0-100% condition
- **Monthly Degradation**:
  - Base: -2% per month without maintenance
  - Maintained: -0.5% per month
  - Neglected: -5% per month
- **Effectiveness Based on Condition**:
  - Excellent (100%): Full effectiveness
  - Good (75-99%): Normal operation
  - Fair (50-74%): -25% effectiveness
  - Poor (25-49%): -50% effectiveness
  - Dilapidated (<25%): Non-functional
- **Maintenance Costs**: Monthly costs based on building type and level
  - Basic buildings: 5-10 gold/month
  - Advanced buildings: 15-25 gold/month
  - Luxury buildings: 30-50 gold/month

#### Historical Events Calendar
- **Major Fixed Events**: Scripted historical events at specific dates
  - 79 AD (Augustus): Mount Vesuvius eruption
  - 80 AD (Julius): Colosseum grand opening
  - 84 AD (Januarius): Domitian's reign of terror
- **Annual Recurring Events**:
  - Saturnalia (December): Winter festival with morale boost
  - Ludi Romani (September): Great Games with fame bonuses
  - Imperial Taxes (Aprilis): 10% gold tax collection
  - Munera Gladiatoria (Martius): Traditional games
- **Random Monthly Events**: Probability-based events
  - Plague outbreaks, imperial visits, trade disruptions
  - Wealthy patrons, rival challenges, bountiful harvests
  - Some events are season-specific

#### Gladiator Career Milestones
- **Time-Based Milestones**:
  - 6 months: "Tiro" title (+morale)
  - 12 months: "Veteran" title (+25 fame)
  - 24 months: "Champion" title (+50 fame, +stat bonuses)
  - 36 months: "Legend" title (+100 fame, +500 gold)
  - Birthday celebrations (annual)
- **Achievement Milestones**:
  - First Victory: +10 fame
  - 10 Victories: "Victor" badge (+25 fame)
  - 25 Victories: "Conqueror" badge (+50 fame, +200 gold)
  - 50 Victories: "Immortal" badge (+100 fame, +500 gold, +stat bonuses)
  - Undefeated streaks (5, 10 fights)
- **Survival Milestones**:
  - Age 35: "Survivor" (+50 fame)
  - Age 40: "Living Legend" (+100 fame, +400 gold)
- **Milestone Rewards**: Automatic fame, gold, stat bonuses, and title awards
- **Career Tracking**: Complete history of achievements

### Changed
- **Gladiator Generation**: New gladiators assigned age and birth date
  - Age ranges vary by origin (POW: 18-29, Criminal: 20-34, Volunteer: 18-37, Elite: 22-29)
  - Purchase prices adjusted based on age
- **Training System**: XP gains now modified by gladiator age
- **Sell Value**: Gladiator age factored into resale calculations
- **Store Configuration**: Removed migration code (no backwards compatibility needed)

### UI Enhancements
- **Dashboard**: 
  - Added Active Loans card showing all loans, payments, and remaining duration
  - Loan modal for taking out new loans with detailed term selection
  - Loan payment tracking with missed payment warnings
- **Gladiator Screens**: 
  - Age displayed with color-coded categories (Youth/Prime/Veteran/Aging/Old)
  - Career titles shown in header
- **Marketplace**:
  - Age and category shown for all purchasable gladiators
  - Color-coded age indicators
- **Ludus Management**:
  - Maintenance summary card showing all building conditions
  - Building condition bars on each building card
  - Maintenance modal for repairing individual buildings
  - Minor and major repair options with cost calculations

### Technical
- New utility systems: `ageSystem.ts`, `buildingMaintenance.ts`, `milestoneSystem.ts`
- New data files: `loans.ts`, `historicalEvents.ts`
- New Redux slice: `loansSlice.ts`
- Extended types: Age & career fields added to Gladiator, condition & maintenance to Building
- Enhanced GameLoop: Monthly processing for aging, milestones, building degradation, and loans
- Comprehensive milestone and event checking systems integrated

### Notes
- Event effects are logged but full application system pending
- All core systems are functional and tested

---

## [1.3.0] - 2026-02-13

Major time system overhaul changing the game cycle from daily to monthly progression with full year/month tracking.

### Changed
- **Monthly Game Cycle**: Complete conversion from daily to monthly time progression
  - Game now advances month by month instead of day by day
  - Time displayed as Roman month names with year: "Januarius, 73 AD"
  - Game starts in **Januarius (January), 73 AD** - the year of the Colosseum construction
  - Years and months tracked separately for better immersion and historical accuracy
  - Month transitions properly handle year rollover (December → January of next year)
  
- **UI Updates**:
  - MainLayout header now shows current month and year in Roman style
  - "Advance Day" button changed to "Advance Month"
  - Month report modal replaces day report modal
  - Mobile view shows abbreviated month names (e.g., "Jan 73")
  - Roman month names used throughout:
    - Januarius, Februarius, Martius, Aprilis, Maius, Junius
    - Julius, Augustus, September, October, November, December
    
- **Economic Adjustments**:
  - All costs and income scaled to monthly cycle
  - Food costs: ~60g per gladiator per month (2g/day × 30)
  - Staff wages remain the same but paid monthly
  - Building construction and upgrades progress monthly
  - Resource consumption balanced for monthly scale

- **Technical**:
  - Game state now stores `currentYear` and `currentMonth` instead of `currentDay`
  - Backward compatibility maintained with `yearMonthToDay()` helper function
  - All game systems updated to work with new time model
  - Save games from previous versions will automatically migrate
  - New selectors: `selectCurrentYear()`, `selectCurrentMonth()`
  - Helper functions: `getMonthName()`, `formatGameDate()`, `yearMonthToDay()`

### Fixed
- Time-based calculations properly scale to monthly progression
- Cooldowns and timers adjusted for new time scale
- Quest progression and objectives work with monthly cycle
- Tournament scheduling compatible with monthly system

---

## [1.2.1] - 2026-02-13

Quality of life improvements and bug fixes for the marketplace system.

### Fixed
- **Injury Time Display**: Gladiator roster and detail panel now show exact days remaining for injuries
  - Roster cards show status as "Injured (Xd)" where X is the longest injury recovery time
  - Detail panel displays comprehensive injury information with severity badges
  - Each injury shows recovery days, stat penalties, and severity level
- **Injury Healing Items**: Items that reduce injury recovery time now properly remove injuries when they reach 0 days
  - Pain Relief Salve and similar items correctly filter out healed injuries
  - Provides better feedback when injury is completely healed vs. partially healed
- **XP Items Auto-Level-Up**: Experience-granting items (Combat Manual, Master's Techniques, etc.) now properly trigger automatic level-up when gladiators reach the XP threshold
  - Gladiators correctly level up when using XP items
  - Grants skill points and updates max HP/Stamina on level-up
  - Shows how many levels were gained in the success message
  - Multiple level-ups work correctly if the XP item grants enough experience
- **Item Quantity Reduction**: Using items now properly reduces their quantity in inventory
  - All item types (healing, XP, stat boosts, etc.) correctly consume one unit when used
  - Items with 0 quantity are removed from inventory
  - Previously only temporary effect items (buffs) were reducing quantity

### Added
- **Unified Gladiator Management Screen**: Complete redesign consolidating all gladiator functionality into one powerful interface
  - **New Layout**: Left sidebar roster list + right panel with comprehensive management tabs
  - **5 Management Tabs**:
    - **Overview**: Combat stats, injuries, equipment, combat record, morale/fatigue, quick actions (training/resting toggles, use items, sell)
    - **Training**: Training regimen selection with real-time XP estimates, building bonuses, and injury risk display
    - **Nutrition**: Nutrition plan selection affecting training effectiveness, healing speed, and morale
    - **Skills**: Complete skill tree interface with offense/defense/utility branches for class-specific and universal skills
    - **Items**: Dedicated item management - use consumables, view equipped gear, manage inventory
  - **Integrated Functionality**: All gladiator features (previously split across Gladiators and Training screens) unified
  - **Better UX**: No more screen switching - manage training, skills, items, and stats all from one location
  - **Gladiator Header**: Quick view of name, level, fame, XP progress, core stats, health, stamina, morale, and fatigue
  - **Smart Status Badges**: Roster cards show current activity (Ready, Training, Resting, Injured with days remaining)
  - **Improved Navigation**: Training screen removed from main navigation - all features accessible via Gladiators screen tabs
  
- **Equipment Display**: Gladiator detail panel now shows equipped items
  - New "Equipment" section displays all items equipped on a gladiator
  - Shows item icon, name, description, and quality badge
  - Equipment items are tracked separately and don't consume from inventory when equipped
  - Equipped items persist with the gladiator
  
- **Equipment Slot System**: Equipment items now have specific slots to prevent duplicate types
  - **4 Equipment Slots**: Weapon, Shield, Armor, Accessory
  - Only one item per slot can be equipped
  - Equipping a new item in a slot automatically replaces the old one
  - Examples:
    - Can't equip two shields (Scutum) at once
    - Can't equip two weapons (Gladius) at once
    - Can equip: 1 weapon + 1 shield + 1 armor + 1 accessory = 4 items max
  - Slot assignments:
    - Weapon: Gladius (basic/masterwork)
    - Shield: Reinforced Scutum
    - Armor: Champion's Panoply
    - Accessory: Training Weights, Mercury's Sandals

### Improved
- **Optimized Layout & Spacing**: Refined the unified Gladiator Management Screen for better space utilization
  - Tighter, more efficient spacing throughout (reduced gaps and padding)
  - Compact roster cards with improved information density
  - Smaller, cleaner gladiator header with better visual hierarchy
  - Fixed sidebar width (320px) for consistency
  - Responsive height calculations for better scrolling behavior
  - Improved tab styling with better visual indicators
  - Enhanced roster card design with cleaner borders and hover states
  - Better use of vertical space - less scrolling required
  - More professional, polished appearance overall
  
- **Gladiator Sell Value**: Selling gladiators now properly reflects their training and experience:
  - Significant level-based value increase (compound growth per level)
  - Experience progress toward next level adds value
  - Stats improvements from training increase value (+2g per stat point above base)
  - Unused skill points add value (+30g each)
  - Combat record (wins, kills, win ratio) increases value
  - Morale affects value (high morale increases, low morale decreases)
  - Injuries reduce value based on severity (permanent: -100g, major: -50g, minor: -25g)
  - Fatigue reduces value when high
  - Sell price now 70-80% of calculated value (up from 60-80%, less random variance)
  - Well-trained gladiators can now sell for 2-5x their purchase price depending on development

---

## [1.2.0] - 2026-02-13

Major marketplace expansion with 35+ purchasable items, tournament system enhancements, and expanded building options for deeper ludus management.

### Added

#### Marketplace Items System
- **35+ New Purchasable Items** across 6 categories:
  - **Equipment** (6 items): Weapons and armor providing permanent stat boosts
    - Standard Gladius, Masterwork Gladius, Reinforced Scutum, Champion's Panoply (legendary)
    - Training Weights, Mercury's Sandals
  - **Consumables** (7 items): Potions and tonics for immediate effects
    - Healing Potion, Stamina Tonic, Gladiator's Brew
    - Pain Relief Salve, Miracle Cure, Berserker Mushroom, Focus Elixir
  - **Training Items** (4 items): Manuals and scrolls to accelerate progression
    - Combat Manual (100 XP), Master's Techniques (1 skill point)
    - Legendary Combat Scroll (3 skill points), Elite Training Regimen (+50% training speed)
  - **Luxury Items** (5 items): Morale and fame boosters
    - Falernian Wine, Silk Bedding, Golden Laurel Crown
    - Arabian Perfume (affects all gladiators), Marble Statue (ludus fame)
  - **Beasts** (4 items): Animals for training and spectacle
    - Training Wolf, Wild Boar, Arena Lion, Caledonian Bear
  - **Services** (4 items): Special services from experts
    - Greek Physician, Master Trainer Visit, Oracle's Blessing, Imperial Introduction

#### Item Management Features
- **Item Inventory System**: Track purchased items with quantities and usage history
- **Item Application**: Use items on gladiators from the Gladiators screen via new "🎒 Use Item" button
- **Smart Item Effects**: Context-aware item effects with immediate or temporary benefits:
  - Permanent stat boosts from equipment
  - Instant healing of HP/stamina
  - Injury treatment (reduce recovery time or instant heal)
  - XP grants and skill points
  - Temporary combat buffs for next fight
  - Multi-day training efficiency boosts
  - Morale improvements (individual or roster-wide)
  - Fame increases (gladiator or ludus)
- **Limited Stock Items**: 6 legendary items with limited availability (1 in stock each)
- **Fame Requirements**: High-tier items unlock at specific ludus fame levels (50-500 fame)
- **Item Categories Tab**: New marketplace interface with separate tabs for each item category
- **Item Preview**: Detailed item cards showing effects, requirements, stock, and owned quantity
- **Effect Tracking**: Redux state management for active temporary effects (buffs, training boosts)

#### Expanded Buildings
- **13 New Buildings** across multiple categories for enhanced ludus management:
  - **Training**: Gymnasium (advanced training), Arena Replica (practice arena), Library (tactical knowledge)
  - **Production**: Forge (weapon crafting), Oil Press (oil production)
  - **Commerce**: Marketplace (income generation), Triclinium (dining hall)
  - **Security**: Guard Tower (enhanced security), Barracks (staff housing)
  - **Entertainment**: Spectator Seats (fame generation), Beast Pens (beast training)
  - **Infrastructure**: Hypocaust (heating system), Ludus Office (administration)
- **New Building Categories**: Added 'commerce' and 'entertainment' categories
- **Building Bonuses**: Each building provides unique bonuses (training speed, morale, fame, security, income)
- **Building Prerequisites**: Some buildings require other buildings or staff roles to unlock
- **Multi-Level Progression**: All new buildings have 3 upgrade levels with scaling costs and bonuses

#### Tournament System (Integrated with Marketplace)
- **Tournament Brackets**: 8, 16, or 32-gladiator tournaments with bracket progression
- **Tournament Types**: 4 tournament tiers (Local, Regional, Grand Arena, Imperial Games)
- **Multiple Gladiators**: Enter multiple gladiators from your ludus
- **Tournament Rewards**: Progressive stage rewards plus final placement bonuses
- **Death Tournaments**: Sine missione tournaments where gladiators can die
- **Player Combat Choice**: Choose full turn-based combat or auto-simulation for each match
- **HP Persistence**: Gladiator HP carries between tournament rounds
- **Tournament Completion**: Special rewards and fame for tournament victories

#### Content Expansion
- **150+ New Gladiator Names**: Significantly expanded Roman name pool:
  - 50+ new Roman first names (Decimus, Lucius, Tiberius, Gaius, etc.)
  - 40+ new cognomens (Corvus, Lupus, Aquila, Ferox, etc.)
  - 60+ new foreign names (Spartacus, Brennus, Alaric, Atticus, etc.)
- **Enhanced Name Generation**: Better variety and authenticity for generated gladiators

### Technical

#### New Redux Slices
- **Marketplace Slice**: Manages purchased items, inventory, active effects, and item stock
- **Tournaments Slice**: Manages active tournaments, brackets, matches, and progression

#### New Components
- **ItemInventoryModal**: Modal interface for selecting and using items on gladiators
- **MarketItemCard**: Display component for marketplace items with stock and requirements
- **MarketItemDetails**: Detailed item preview with effects and purchase options
- **TournamentsScreen**: Tournament selection and management interface
- **BracketView**: Visual tournament bracket display with match progression

#### New Utilities
- **marketplaceEffects.ts**: Apply item effects to gladiators with proper calculations
- **TournamentEngine.ts**: Bracket generation, match simulation, and progression logic

#### Data Structures
- **marketplace.ts**: Complete item catalog with categories, effects, and pricing
- **tournaments.ts**: Tournament types, rules, rewards, and helper functions

### Improved
- **Marketplace UI**: Reorganized with category tabs for better navigation
- **Gladiator Management**: Added item usage capability to gladiator detail panel
- **Arena Screen**: Integrated tournaments alongside regular fights with tabbed interface
- **Economic Depth**: More meaningful spending options beyond gladiators and resources

### Documentation
- **MARKETPLACE_ITEMS.md**: Complete guide to all marketplace items, usage, and strategy tips
- **Item Categories**: Detailed documentation of each category and its game mechanic connections
- **Strategic Tips**: Guidance on optimal item usage and purchasing strategies

---

## [1.1.0] - 2026-02-05

Major content expansion: extended storyline with branching paths, new side quests, random events, expanded fame system, and numerous bug fixes.

### Added
- **Extended Storyline**: Expanded from 5 to 12 chapters with branching narrative paths
  - Chapter 5: "The Shadow of Spartacus" - dealing with the famous rebellion
  - Chapter 6: "At the Crossroads" - choose your patron (Military, Political, or Merchant path)
  - Chapter 7A-C: Unique storylines based on your choice
  - Chapter 8A-C: Continued branching with path-specific challenges
  - Chapter 9-10: The road to Rome and the Colosseum
  - Chapter 11: "The Emperor's Games" - the ultimate challenge
  - Chapter 12: Endless mode epilogue

- **New Side Quests** (20+ new quests):
  - Staff recruitment: "The Legendary Doctore"
  - Gladiator recruitment: "The Captured Barbarian", "The Greek Olympian", "The Gladiatrix"
  - Rivalry quests: "Sabotage!", "The Grudge Match"
  - Special events: "The Beast Hunt", "The Naumachia" (naval battle)
  - Political quests: "Games for the Senate", "Champion of the People"
  - Merchant quests: "Protecting the Trade Route", "The Great Auction"
  - Military quests: "Training the Legion", "The Veteran"
  - Patron quests: "The Noble's Request"

- **New Random Events** (15+ new events):
  - Crisis events: "The Plague", "Fire!", "Escaped Gladiator"
  - Opportunity events: "The Famous Actor", "A Mysterious Gift", "The High Roller"
  - Social events: "Invitation to a Feast", "A Political Marriage"
  - Military events: "Legion Recruitment", "The Deserter"
  - Religious events: "An Omen from the Gods", "Temple Donation Request"

- **Branching Dialogue**: Many quests now feature meaningful choices with different consequences


- **Ludus Fame Tiers**: Expanded from 5 to 11 tiers for smoother progression:
  - Unknown (0) → Local (50) → Neighborhood (100) → District (175) → City (250) → Regional (400) → Provincial (600) → Famous (850) → Renowned (1200) → Legendary (1800) → Immortal (3000)
  - New benefits include: supply discounts, building discounts, better gladiator prices, training bonuses, and combat stat bonuses at highest tiers
  
- **Gladiator Fame Tiers**: Expanded from 5 to 12 tiers:
  - Novice (0) → Initiate (25) → Fighter (50) → Warrior (100) → Veteran (175) → Elite (275) → Champion (400) → Hero (550) → Legend (750) → Mythic (1000) → Immortal (1500)
  - New titles: Novicius, Bellator, Praestans, Heros, Mythicus, Immortalis
  - Progressive benefits for morale, crowd favor, critical hit chance, and intimidation
  
- **Merchandise Items**: Expanded from 8 to 22 items across 7 tiers:
  - Basic: Clay Figurines, Painted Tiles, Ludus Banners
  - Local: Leather Wristbands, Fighter Masks, Commemorative Cups
  - City: Bronze Statuettes, Training Weapons, Replica Tridents, Gladiator Sandals
  - Regional: Gladiator Portraits, Victory Coins, Silver Figurines
  - Provincial: Arena Paintings, Mosaic Tile Art, Champion's Cloaks
  - Renowned: Marble Busts, Silk Banners, Jeweled Replica Swords
  - Legendary: Grand Portraits, Golden Statues, Imperial Collections
  
- **Sponsorship Deals**: Expanded from 5 to 19 deals across 5 tiers:
  - Early (0-75 fame): Local Merchant, Tavern Partnership, Baker Sponsorship
  - Growing (100-200 fame): Wine Trader, Olive Oil Partnership, Leather Crafter, Grain Supplier
  - Established (250-400 fame): Noble Patron, Weapon Master, Bathhouse Partnership, Horse Breeder
  - Elite (500-800 fame): Senator's Endorsement, Physicians Guild, Textile Magnate, Military Patronage
  - Prestigious (1000+ fame): Imperial Favor, Maritime Merchant, Banking House, Temple Blessing, Arena Partnership, Consular Patronage, Imperial Games Contract
  - New bonus types: grain discounts, healing bonuses, armor, weapon damage, training XP, discipline, political favor

### Fixed
- **Quest: "Train a gladiator to level X"**: Fixed quest objective that was incorrectly tracking number of training assignments instead of actual gladiator level
  - New `reach_level` objective type now properly tracks the highest level among all gladiators
  - Quest progress updates when gladiators level up from training or combat victories
  - Initial progress correctly recognizes existing gladiator levels when accepting the quest
- **Codex Unlock Bug**: Fixed Codex entries not unlocking when requirements were met
  - CodexScreen and MainLayout were reading fame from wrong state slice (`playerState` instead of `fameState`)
  - Fame-based unlocks now correctly check against actual ludus fame
- **Sabotage System**: Sabotage events from hostile factions now actually trigger
  - `checkSabotageRisk` is now called during end-of-day processing
  - Low faction favor increases chance of sabotage attacks
  - Guards provide protection against sabotage
  - Pending sabotage shows alert in Politics screen and day report
  - Sabotage History now tracks prevented and occurred events
- **Staff Skill Learning**: Fixed staff skills not updating in UI after learning
  - Staff detail panel now properly reflects skill changes immediately
  - Changed from storing full staff object to using ID reference for live updates
- **Staff Skill Bonuses**: All staff skill bonuses are now properly applied:
  - **Doctore**: +25% base training XP, plus skill bonuses (Drill Master +15%, Weapon Expert +10%, Legendary Trainer +25%)
  - **Medicus**: +30% base healing speed per medicus, plus skill bonuses (Field Medicine +20%, Surgeon +15%, Master Healer +25%)
  - **Lanista**: +20% base gold from fights, plus skill bonuses (Negotiator +15%, Promoter +20% fame/+10% gold, Master Dealer +25% gold)
  - **Coquus**: +15% base nutrition effectiveness per cook, plus skill bonuses for stamina recovery and morale
  - **Guard**: Security bonuses (already working from 1.0.6)
- **Daily Processing**: Staff bonuses now correctly calculated and applied during end-of-day processing
- **Combat Rewards**: Lanista bonuses now apply to arena victory gold and fame rewards

---

## [1.0.6] - 2026-02-05

Automatic gladiator level-up, faction favor quest tracking, death match consequences, staff XP system.

### Added
- **Staff Experience System**: Staff members now gain XP daily based on their work:
  - Doctore: +3 XP per gladiator training
  - Medicus: +3 XP per gladiator treated
  - Coquus: +2 XP per gladiator fed
  - Guard: XP based on roster size
  - Lanista: XP based on gold transactions
  - Lorarius: XP for maintaining discipline
  - Faber: +2 XP per maintained building
  - All staff: +5 base XP per day worked
- **Staff Auto Level-Up**: Staff automatically level up when reaching XP threshold (level × 50)
- **Gladiator Death System**: Gladiators who lose death matches now actually die and are removed from the roster
- **Fallen Warriors Memorial**: New "Fallen" tab in the Gladiators screen to honor deceased gladiators
  - View death details (day, cause, killer)
  - Review their final combat record and stats
  - Memorial tribute for each fallen warrior
- **Death Tracking**: Each death records the day, cause of death, and name of the opponent who killed them

### Fixed
- **Staff XP**: Staff members were not gaining any experience - now properly gain XP during daily processing
- **Guard Security Bonus**: Guards now properly contribute to security rating (+10 per guard, plus skill and level bonuses)
- **Security Display**: Ludus screen now shows correct security rating immediately when viewing (including guard contributions)
- **Death Match Consequences**: Losing a death match now results in actual gladiator death instead of just a severe injury
- **Combat Injuries**: Non-lethal defeats now add appropriate combat wounds (14-day recovery)
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
- **Faction Favor Quest Tracking**: Fixed `reach_favor` quest objectives not being tracked properly:
  - Initial progress now correctly uses highest faction favor when no specific faction is targeted
  - Political actions (gifts, bribes, alliances, etc.) now update quest progress when faction favor changes
  - Both successful and failed actions properly update quest objectives

---

## [1.0.5] - 2026-02-05

Training XP calculation fix, Gladiator market refresh system, income calculation fixes.

### Fixed
- **Training XP Mismatch**: Fixed bug where actual XP gained was much lower than displayed estimate. The morale value was being passed incorrectly (raw 0.1-1.5 instead of converted 0-100 scale), causing calculations to use ~50% effectiveness instead of proper morale bonus
- **Stat Gains**: Same fix applied to stat gain calculations during training
- **Sponsorship Duration**: Sponsorship days remaining now decrements daily when ending the day (was stuck at initial value). Sponsorships will now properly expire when their duration ends
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
| 1.3.0 | 2026-02-13 | Monthly game cycle: Year/month tracking, Roman calendar, time system overhaul |
| 1.2.1 | 2026-02-13 | Unified gladiator management, layout optimization, bug fixes |
| 1.2.0 | 2026-02-13 | Marketplace expansion: 35+ items, tournament system, 13 new buildings |
| 1.1.0 | 2026-02-05 | Major content expansion: 12 chapters, branching storylines, 35+ quests, bug fixes |
| 1.0.6 | 2026-02-05 | Staff XP system, death system, fallen memorial, auto level-up |
| 1.0.5 | 2026-02-05 | Training XP fix, market refresh, sponsorship/merchandise income |
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
