import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppSelector';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';

// Lazy load screens for better performance
const TitleScreen = lazy(() => import('./components/screens/TitleScreen'));
const CharacterCreation = lazy(() => import('./components/screens/CharacterCreation'));
const ProfileScreen = lazy(() => import('./components/screens/ProfileScreen'));

const App: React.FC = () => {
  const characterCreated = useAppSelector((state) => state.player.characterCreated);

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
            <Route path="/title" element={<TitleScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default App;
