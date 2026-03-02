import React from 'react';
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
  NewGameGladiatorScreen,
  GladiatorDashboardScreen,
  GladiatorTrainingScreen,
  GladiatorLudusLifeScreen,
  GladiatorArenaScreen,
  GladiatorFreedomScreen,
  GladiatorPeculiumScreen,
} from '@components/screens';

const App: React.FC = () => {
  const currentScreen = useAppSelector(state => state.game?.currentScreen || 'title');

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

  return (
    <div className="min-h-screen bg-roman-marble-900 text-roman-marble-100">
      {renderScreen()}
    </div>
  );
};

export default App;
