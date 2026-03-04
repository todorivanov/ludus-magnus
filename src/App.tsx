import React, { useEffect } from 'react';
import { useAppSelector } from '@app/hooks';
import { 
  TitleScreen, 
  ModeSelectScreen,
  NewGameScreen, 
  DashboardScreen,
  MarketplaceScreen,
  GladiatorsScreen,
  LudusScreen,
  StaffScreen,
  ArenaScreen,
  CombatScreen,
  TournamentsScreen,
  FameScreen,
  PoliticsScreen,
  QuestsScreen,
  SettingsScreen,
  CodexScreen,
  StatisticsScreen,
  NewGameGladiatorScreen,
  GladiatorDashboardScreen,
  GladiatorTrainingScreen,
  GladiatorLudusLifeScreen,
  GladiatorArenaScreen,
  GladiatorFreedomScreen,
  GladiatorPeculiumScreen,
} from '@components/screens';
import { audioManager } from '@/audio/AudioManager';
import { useScreenMusic } from '@/audio/useAudio';
import { getSeason } from '@features/game/gameSlice';

const App: React.FC = () => {
  const currentScreen = useAppSelector(state => state.game?.currentScreen || 'title');
  const soundEnabled = useAppSelector(state => state.game?.settings?.soundEnabled ?? true);
  const musicEnabled = useAppSelector(state => state.game?.settings?.musicEnabled ?? true);
  const sfxVolume = useAppSelector(state => state.game?.settings?.sfxVolume ?? 0.7);
  const musicVolume = useAppSelector(state => state.game?.settings?.musicVolume ?? 0.4);

  useEffect(() => {
    audioManager.setSFXEnabled(soundEnabled);
    audioManager.setMusicEnabled(musicEnabled);
    audioManager.setSFXVolume(sfxVolume);
    audioManager.setMusicVolume(musicVolume);
  }, []);

  useScreenMusic();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen />;
      case 'modeSelect':
        return <ModeSelectScreen />;
      case 'newGame':
        return <NewGameScreen />;
      case 'newGameGladiator':
        return <NewGameGladiatorScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'ludus':
        return <LudusScreen />;
      case 'gladiators':
        return <GladiatorsScreen />;
      case 'training':
        return <GladiatorsScreen />;
      case 'staff':
        return <StaffScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'arena':
        return <ArenaScreen />;
      case 'combat':
        return <CombatScreen />;
      case 'tournaments':
        return <TournamentsScreen />;
      case 'fame':
        return <FameScreen />;
      case 'politics':
        return <PoliticsScreen />;
      case 'quests':
        return <QuestsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'codex':
        return <CodexScreen />;
      case 'statistics':
        return <StatisticsScreen />;
      // Gladiator mode screens
      case 'gladiatorDashboard':
        return <GladiatorDashboardScreen />;
      case 'gladiatorTraining':
        return <GladiatorTrainingScreen />;
      case 'gladiatorLudusLife':
        return <GladiatorLudusLifeScreen />;
      case 'gladiatorArena':
        return <GladiatorArenaScreen />;
      case 'gladiatorFreedom':
        return <GladiatorFreedomScreen />;
      case 'gladiatorPeculium':
        return <GladiatorPeculiumScreen />;
      default:
        return <TitleScreen />;
    }
  };

  const currentMonth = useAppSelector(state => state.game?.currentMonth ?? 1);
  const season = getSeason(currentMonth);
  const seasonalAccent: Record<string, string> = {
    Spring: 'from-green-900/20 via-transparent',
    Summer: 'from-amber-900/20 via-transparent',
    Autumn: 'from-orange-900/20 via-transparent',
    Winter: 'from-blue-900/20 via-transparent',
  };
  const isInGame = !['title', 'modeSelect', 'newGame', 'newGameGladiator'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-roman-marble-900 text-roman-marble-100 relative">
      {isInGame && (
        <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${seasonalAccent[season.name] || ''} to-transparent pointer-events-none z-0`} />
      )}
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
