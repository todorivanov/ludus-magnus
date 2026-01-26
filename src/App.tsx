import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppSelector';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { saveManager } from './utils/SaveManager';

// Lazy load screens for better performance
const TitleScreen = lazy(() => import('./components/screens/TitleScreen'));
const CharacterCreation = lazy(() => import('./components/screens/CharacterCreation'));
const ProfileScreen = lazy(() => import('./components/screens/ProfileScreen'));
const MainGameScreen = lazy(() => import('./components/screens/MainGameScreen'));
const LudusScreen = lazy(() => import('./components/screens/LudusScreen'));
const TournamentScreen = lazy(() => import('./components/screens/TournamentScreen'));

const App: React.FC = () => {
  const characterCreated = useAppSelector((state) => state.player.characterCreated);
  const hasSave = saveManager.hasSave();

  // If no save exists and no character created, force character creation
  // If save exists but not loaded, character will be created after load
  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                characterCreated ? (
                  <Navigate to="/title" replace />
                ) : (
                  <Navigate to="/character-creation" replace />
                )
              }
            />
            <Route path="/character-creation" element={<CharacterCreation />} />
            <Route 
              path="/title" 
              element={
                characterCreated ? (
                  <TitleScreen />
                ) : (
                  <Navigate to="/character-creation" replace />
                )
              } 
            />
            <Route 
              path="/profile" 
              element={
                characterCreated ? (
                  <ProfileScreen />
                ) : (
                  <Navigate to="/character-creation" replace />
                )
              } 
            />
            <Route 
              path="/game" 
              element={
                characterCreated ? (
                  <MainGameScreen />
                ) : (
                  <Navigate to="/character-creation" replace />
                )
              } 
            />
            <Route 
              path="/ludus" 
              element={
                characterCreated ? (
                  <LudusScreen />
                ) : (
                  <Navigate to="/character-creation" replace />
                )
              } 
            />
            <Route 
              path="/tournament" 
              element={
                characterCreated ? (
                  <TournamentScreen />
                ) : (
                  <Navigate to="/character-creation" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default App;
