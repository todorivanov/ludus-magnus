import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setScreen } from '@features/game/gameSlice';
import { Button } from '@components/ui';

// Version from build
const APP_VERSION = __APP_VERSION__;
const REPO_URL = 'https://github.com/todorivanov/ludus-magnus';

// Floating particle component
const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 15 + Math.random() * 10;
  
  return (
    <motion.div
      initial={{ y: '100vh', x: `${randomX}vw`, opacity: 0 }}
      animate={{ 
        y: '-10vh', 
        opacity: [0, 0.3, 0.3, 0],
      }}
      transition={{ 
        duration: randomDuration, 
        delay,
        repeat: Infinity,
        ease: 'linear'
      }}
      className="absolute w-1 h-1 bg-roman-gold-500 rounded-full"
    />
  );
};

export const TitleScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasSaveData = useAppSelector(state => state.player?.name !== '');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Slight delay before showing content for a smoother entrance
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNewGame = () => {
    dispatch(setScreen('newGame'));
  };

  const handleContinue = () => {
    dispatch(setScreen('dashboard'));
  };

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-roman-marble-900 via-roman-marble-800 to-roman-marble-900" />
      
      {/* Radial glow effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 164, 24, 0.08) 0%, transparent 70%)',
        }}
      />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.5} />
      ))}
      
      {/* Decorative borders with animation */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-roman-gold-600 to-transparent origin-center" 
      />
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-roman-gold-600 to-transparent origin-center" 
      />

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-roman-gold-600"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-roman-gold-600"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-roman-gold-600"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-roman-gold-600"
      />

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 text-center px-4"
          >
            {/* Logo/Title */}
            <motion.div variants={itemVariants}>
              <motion.h1 
                className="font-roman text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gradient-gold mb-2"
                style={{ textShadow: '0 0 40px rgba(212, 164, 24, 0.3)' }}
              >
                LEGENDS
              </motion.h1>
              <motion.h2 
                className="font-roman text-xl sm:text-2xl md:text-3xl text-roman-gold-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2"
              >
                of the Arena
              </motion.h2>
            </motion.div>

            {/* Subtitle */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-roman-gold-500" />
              <span className="text-roman-gold-600 text-xs sm:text-sm uppercase tracking-widest">Gladiator Ludus Simulator</span>
              <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-roman-gold-500" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-roman-marble-400 text-base sm:text-lg mb-10 sm:mb-12 max-w-md mx-auto leading-relaxed"
            >
              Build your gladiator school. Train legendary fighters. Conquer the arena.
            </motion.p>

            {/* Roman laurel decoration */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-2 mb-10 sm:mb-12"
            >
              <span className="text-2xl sm:text-3xl opacity-50">🏆</span>
            </motion.div>

            {/* Menu buttons */}
            <motion.div
              variants={itemVariants}
              className="space-y-3 sm:space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleNewGame}
                  className="w-56 sm:w-64 pulse-gold"
                >
                  New Game
                </Button>
              </motion.div>

              {hasSaveData && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                    className="w-56 sm:w-64"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => dispatch(setScreen('settings'))}
                  className="w-56 sm:w-64"
                >
                  Settings
                </Button>
              </motion.div>
            </motion.div>

            {/* Version & Credits */}
            <motion.div
              variants={itemVariants}
              className="mt-10 sm:mt-12 space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <span className="text-roman-marble-600">
                  v{APP_VERSION}
                </span>
                <span className="text-roman-marble-700">•</span>
                <a
                  href={`${REPO_URL}/blob/main/CHANGELOG.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-roman-marble-500 hover:text-roman-gold-500 transition-colors"
                >
                  Changelog
                </a>
              </div>
              <p className="text-roman-marble-700 text-xs">
                A Roman Gladiator Management Game
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Large decorative icons */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.05, x: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-5 sm:left-10 text-6xl sm:text-8xl select-none pointer-events-none"
      >
        🏛️
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.05, x: 0 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute top-20 right-5 sm:right-10 text-6xl sm:text-8xl select-none pointer-events-none"
      >
        ⚔️
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="absolute top-1/4 left-1/4 text-6xl sm:text-8xl select-none pointer-events-none"
      >
        🛡️
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 2.1, duration: 1 }}
        className="absolute bottom-1/4 right-1/4 text-6xl sm:text-8xl select-none pointer-events-none"
      >
        🗡️
      </motion.div>
    </div>
  );
};
