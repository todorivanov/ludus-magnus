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
} from '@components/screens';
import { MainLayout } from '@components/layout';

// Placeholder screens for features we'll build in later phases
const PlaceholderScreen: React.FC<{ name: string }> = ({ name }) => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="font-roman text-2xl text-roman-gold-500 mb-4">{name}</h2>
          <p className="text-roman-marble-400">Coming soon in the next phase...</p>
        </div>
      </div>
    </MainLayout>
  );
};

// LudusScreen is now imported from screens
const StaffScreen = () => <PlaceholderScreen name="Staff & Personnel" />;
const ArenaScreen = () => <PlaceholderScreen name="Arena" />;
const CombatScreen = () => <PlaceholderScreen name="Combat" />;
const QuestsScreen = () => <PlaceholderScreen name="Quests" />;
const SettingsScreen = () => <PlaceholderScreen name="Settings" />;

const App: React.FC = () => {
  const currentScreen = useAppSelector(state => state.game.currentScreen);

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
      case 'quests':
        return <QuestsScreen />;
      case 'settings':
        return <SettingsScreen />;
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
