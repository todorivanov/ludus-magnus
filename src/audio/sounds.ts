export type SoundEffect =
  | 'click'
  | 'attack'
  | 'heavyAttack'
  | 'block'
  | 'dodge'
  | 'miss'
  | 'critical'
  | 'special'
  | 'victory'
  | 'defeat'
  | 'death'
  | 'goldGain'
  | 'goldSpend'
  | 'purchase'
  | 'error'
  | 'levelUp'
  | 'milestone'
  | 'questComplete'
  | 'build'
  | 'upgrade'
  | 'monthAdvance'
  | 'event'
  | 'crowdCheer'
  | 'crowdBoo'
  | 'notification'
  | 'warning'
  | 'freedom'
  | 'sold'
  | 'taunt';

export type MusicTrack =
  | 'title'
  | 'dashboard'
  | 'combat'
  | 'arena'
  | 'marketplace'
  | 'gladiatorCell';

export const SFX_FILES: Record<SoundEffect, string> = {
  click: '/audio/sfx/click.mp3',
  attack: '/audio/sfx/attack.mp3',
  heavyAttack: '/audio/sfx/heavy-attack.mp3',
  block: '/audio/sfx/block.mp3',
  dodge: '/audio/sfx/dodge.mp3',
  miss: '/audio/sfx/miss.mp3',
  critical: '/audio/sfx/critical.mp3',
  special: '/audio/sfx/special.mp3',
  victory: '/audio/sfx/victory.mp3',
  defeat: '/audio/sfx/defeat.mp3',
  death: '/audio/sfx/death.mp3',
  goldGain: '/audio/sfx/gold-gain.mp3',
  goldSpend: '/audio/sfx/gold-spend.mp3',
  purchase: '/audio/sfx/purchase.mp3',
  error: '/audio/sfx/error.mp3',
  levelUp: '/audio/sfx/level-up.mp3',
  milestone: '/audio/sfx/milestone.mp3',
  questComplete: '/audio/sfx/quest-complete.mp3',
  build: '/audio/sfx/build.mp3',
  upgrade: '/audio/sfx/upgrade.mp3',
  monthAdvance: '/audio/sfx/month-advance.mp3',
  event: '/audio/sfx/event.mp3',
  crowdCheer: '/audio/sfx/crowd-cheer.mp3',
  crowdBoo: '/audio/sfx/crowd-boo.mp3',
  notification: '/audio/sfx/notification.mp3',
  warning: '/audio/sfx/warning.mp3',
  freedom: '/audio/sfx/freedom.mp3',
  sold: '/audio/sfx/sold.mp3',
  taunt: '/audio/sfx/taunt.mp3',
};

export const MUSIC_FILES: Record<MusicTrack, string> = {
  title: '/audio/music/title.mp3',
  dashboard: '/audio/music/dashboard.mp3',
  combat: '/audio/music/combat.mp3',
  arena: '/audio/music/arena.mp3',
  marketplace: '/audio/music/marketplace.mp3',
  gladiatorCell: '/audio/music/gladiator-cell.mp3',
};

export type GameScreen = string;

export const SCREEN_MUSIC_MAP: Record<string, MusicTrack | null> = {
  title: 'title',
  modeSelect: 'title',
  newGame: 'title',
  newGameGladiator: 'title',
  dashboard: 'dashboard',
  ludus: 'dashboard',
  gladiators: 'dashboard',
  training: 'dashboard',
  staff: 'dashboard',
  fame: 'dashboard',
  politics: 'dashboard',
  quests: 'dashboard',
  settings: null,
  codex: null,
  statistics: null,
  marketplace: 'marketplace',
  arena: 'arena',
  combat: 'combat',
  tournaments: 'arena',
  gladiatorDashboard: 'gladiatorCell',
  gladiatorTraining: 'gladiatorCell',
  gladiatorLudusLife: 'gladiatorCell',
  gladiatorArena: 'combat',
  gladiatorFreedom: 'gladiatorCell',
  gladiatorPeculium: 'gladiatorCell',
};
