import React from 'react';
import { useAppSelector } from '@app/hooks';
import { 
  TitleScreen, 
  NewGameScreen, 
  DashboardScreen,
  MarketplaceScreen,
  GladiatorsScreen,
  LudusScreen,
  TrainingScreen,
  StaffScreen,
  ArenaScreen,
  CombatScreen,
  FameScreen,
  PoliticsScreen,
  QuestsScreen,
  SettingsScreen,
  CodexScreen,
} from '@components/screens';

const App: React.FC = () => {
  const currentScreen = useAppSelector(state => state.game?.currentScreen || 'title');

  // Render the appropriate screen based on game state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen />;
      case 'newGame':
        return <NewGameScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'ludus':
        return <LudusScreen />;
      case 'gladiators':
        return <GladiatorsScreen />;
      case 'training':
        return <TrainingScreen />;
      case 'staff':
        return <StaffScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'arena':
        return <ArenaScreen />;
      case 'combat':
        return <CombatScreen />;
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
