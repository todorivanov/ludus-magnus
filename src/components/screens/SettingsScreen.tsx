import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { 
  setScreen, 
  setDifficulty, 
  toggleAutosave, 
  toggleSound, 
  toggleMusic,
  resetGame 
} from '@features/game/gameSlice';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Divider } from '@components/ui';
import type { Difficulty } from '@/types';
import { clsx } from 'clsx';

// Import version from package.json
const APP_VERSION = __APP_VERSION__;
const REPO_URL = 'https://github.com/todorivanov/ludus-magnus';

export const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  const settings = gameState?.settings || {
    difficulty: 'normal',
    autosave: true,
    soundEnabled: true,
    musicEnabled: true,
    tutorialCompleted: false,
  };
  const currentScreen = gameState?.currentScreen || 'title';
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const difficulties: { value: Difficulty; label: string; description: string }[] = [
    { value: 'easy', label: 'Novice', description: 'More starting gold, easier opponents' },
    { value: 'normal', label: 'Lanista', description: 'Balanced experience' },
    { value: 'hard', label: 'Champion', description: 'Less gold, tougher opponents' },
  ];

  const handleBack = () => {
    dispatch(setScreen(currentScreen === 'title' ? 'title' : 'dashboard'));
  };

  const handleReset = () => {
    dispatch(resetGame());
    setShowResetConfirm(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-roman-marble-900 via-roman-marble-800 to-roman-marble-900 p-4 sm:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            ← Back
          </Button>
          <h1 className="font-roman text-3xl text-roman-gold-500">Settings</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </motion.div>

        {/* Difficulty */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => dispatch(setDifficulty(diff.value))}
                    className={clsx(
                      'p-4 rounded-lg border-2 transition-all text-left',
                      settings.difficulty === diff.value
                        ? 'border-roman-gold-500 bg-roman-gold-600/10'
                        : 'border-roman-marble-700 bg-roman-marble-800 hover:border-roman-marble-600'
                    )}
                  >
                    <div className={clsx(
                      'font-roman text-lg mb-1',
                      settings.difficulty === diff.value ? 'text-roman-gold-400' : 'text-roman-marble-200'
                    )}>
                      {diff.label}
                    </div>
                    <div className="text-xs text-roman-marble-500">
                      {diff.description}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Autosave */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-roman-marble-200">Autosave</div>
                  <div className="text-xs text-roman-marble-500">Automatically save progress</div>
                </div>
                <button
                  onClick={() => dispatch(toggleAutosave())}
                  className={clsx(
                    'w-14 h-8 rounded-full transition-all relative',
                    settings.autosave 
                      ? 'bg-roman-gold-600' 
                      : 'bg-roman-marble-700'
                  )}
                >
                  <motion.div
                    animate={{ x: settings.autosave ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              <Divider variant="subtle" />

              {/* Sound */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-roman-marble-200">Sound Effects</div>
                  <div className="text-xs text-roman-marble-500">Play sound effects</div>
                </div>
                <button
                  onClick={() => dispatch(toggleSound())}
                  className={clsx(
                    'w-14 h-8 rounded-full transition-all relative',
                    settings.soundEnabled 
                      ? 'bg-roman-gold-600' 
                      : 'bg-roman-marble-700'
                  )}
                >
                  <motion.div
                    animate={{ x: settings.soundEnabled ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              <Divider variant="subtle" />

              {/* Music */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-roman-marble-200">Music</div>
                  <div className="text-xs text-roman-marble-500">Play background music</div>
                </div>
                <button
                  onClick={() => dispatch(toggleMusic())}
                  className={clsx(
                    'w-14 h-8 rounded-full transition-all relative',
                    settings.musicEnabled 
                      ? 'bg-roman-gold-600' 
                      : 'bg-roman-marble-700'
                  )}
                >
                  <motion.div
                    animate={{ x: settings.musicEnabled ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-roman-crimson-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-roman-marble-200">Reset Game</div>
                  <div className="text-xs text-roman-crimson-400">This will erase all progress!</div>
                </div>
                <Button 
                  variant="crimson"
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Credits & Version */}
        <motion.div variants={itemVariants}>
          <Card variant="gold">
            <CardContent className="text-center py-6">
              <h3 className="font-roman text-xl text-roman-gold-400 mb-2">
                Ludus Magnus: Reborn
              </h3>
              <p className="text-roman-marble-400 text-sm mb-4">
                A Roman Gladiator Management Simulation
              </p>
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-roman-marble-500">
                  Version {APP_VERSION}
                </span>
                <span className="text-roman-marble-600">•</span>
                <a
                  href={`${REPO_URL}/blob/main/CHANGELOG.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-roman-gold-500 hover:text-roman-gold-400 underline underline-offset-2 transition-colors"
                >
                  Changelog
                </a>
                <span className="text-roman-marble-600">•</span>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-roman-gold-500 hover:text-roman-gold-400 underline underline-offset-2 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset Game?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-roman-marble-300">
            Are you sure you want to reset the game? This action cannot be undone and all your progress will be lost.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="crimson"
              className="flex-1"
              onClick={handleReset}
            >
              Reset Game
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
