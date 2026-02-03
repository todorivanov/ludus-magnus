import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import { Button } from '@components/ui';

export const TitleScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasSaveData = useAppSelector(state => state.player.name !== '');

  const handleNewGame = () => {
    dispatch(setScreen('newGame'));
  };

  const handleContinue = () => {
    dispatch(setScreen('dashboard'));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-roman-marble-900 via-roman-marble-800 to-roman-marble-900" />
      <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-5" />
      
      {/* Decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-roman-gold-600 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-roman-gold-600 to-transparent" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="font-roman text-6xl md:text-7xl text-gradient-gold text-shadow-roman mb-2">
            LUDUS MAGNUS
          </h1>
          <h2 className="font-roman text-2xl md:text-3xl text-roman-gold-600 tracking-[0.3em] uppercase mb-8">
            Reborn
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-roman-marble-400 text-lg mb-12 max-w-md mx-auto"
        >
          Build your gladiator school. Train legendary fighters. Conquer the arena.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-64 h-px bg-gradient-to-r from-transparent via-roman-gold-500 to-transparent mx-auto mb-12"
        />

        {/* Menu buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <Button
            variant="gold"
            size="lg"
            onClick={handleNewGame}
            className="w-64"
          >
            New Game
          </Button>

          {hasSaveData && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              className="w-64"
            >
              Continue
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={() => dispatch(setScreen('settings'))}
            className="w-64"
          >
            Settings
          </Button>
        </motion.div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-roman-marble-600 text-sm mt-12"
        >
          Version 1.0.0
        </motion.p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-10 text-8xl"
      >
        🏛️
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1.7 }}
        className="absolute top-20 right-10 text-8xl"
      >
        ⚔️
      </motion.div>
    </div>
  );
};
