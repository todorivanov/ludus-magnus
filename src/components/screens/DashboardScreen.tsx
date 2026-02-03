import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { advanceDay } from '@features/game/gameSlice';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar } from '@components/ui';
import { MainLayout } from '@components/layout';

export const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentDay } = useAppSelector(state => state.game);
  const { gold, ludusFame, resources, ludusName, name } = useAppSelector(state => state.player);
  const { roster } = useAppSelector(state => state.gladiators);
  const { buildings } = useAppSelector(state => state.ludus);
  const { employees, totalDailyWages } = useAppSelector(state => state.staff);

  const handleEndDay = () => {
    dispatch(advanceDay());
    // In Phase 10, we'll add daily processing logic here
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
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
            Welcome, {name}
          </h1>
          <p className="text-roman-marble-400">
            Day {currentDay} at {ludusName}
          </p>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">🪙</div>
              <div className="font-roman text-2xl text-roman-gold-400">{gold}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Gold</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">⚔️</div>
              <div className="font-roman text-2xl text-roman-marble-200">{roster.length}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Gladiators</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">🏗️</div>
              <div className="font-roman text-2xl text-roman-marble-200">{buildings.length}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Buildings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl mb-1">⭐</div>
              <div className="font-roman text-2xl text-roman-marble-200">{ludusFame}</div>
              <div className="text-xs text-roman-marble-500 uppercase">Fame</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          {/* Ludus Fame Progress */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Ludus Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  value={ludusFame}
                  max={1000}
                  variant="fame"
                  size="lg"
                  showLabel
                  label="Fame"
                />
                <div className="mt-4 text-sm text-roman-marble-400">
                  {ludusFame < 100 && 'Unknown School - Only pit fights available'}
                  {ludusFame >= 100 && ludusFame < 300 && 'Local Recognition - Provincial Munera unlocked'}
                  {ludusFame >= 300 && ludusFame < 500 && 'Regional Fame - Better marketplace access'}
                  {ludusFame >= 500 && ludusFame < 750 && 'Famous School - Elite options available'}
                  {ludusFame >= 750 && "Legendary Ludus - Emperor's Games invitation"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌾</div>
                    <div className="font-bold text-roman-marble-200">{resources.grain}</div>
                    <div className="text-xs text-roman-marble-500">Grain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">💧</div>
                    <div className="font-bold text-roman-marble-200">{resources.water}</div>
                    <div className="text-xs text-roman-marble-500">Water</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🍷</div>
                    <div className="font-bold text-roman-marble-200">{resources.wine}</div>
                    <div className="text-xs text-roman-marble-500">Wine</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-roman-marble-400">Staff Wages</span>
                    <span className="text-roman-crimson-400">-{totalDailyWages}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-roman-marble-400">Food Costs</span>
                    <span className="text-roman-crimson-400">-{roster.length * 2}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-roman-marble-400">Staff Members</span>
                    <span className="text-roman-marble-200">{employees.length}</span>
                  </div>
                  <div className="divider-roman my-2" />
                  <div className="flex justify-between items-center font-roman">
                    <span className="text-roman-gold-400">Est. Daily Cost</span>
                    <span className="text-roman-crimson-400">-{totalDailyWages + roster.length * 2}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full">
                    Visit Marketplace
                  </Button>
                  <Button variant="primary" className="w-full">
                    View Arena Schedule
                  </Button>
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={handleEndDay}
                  >
                    End Day →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Notifications */}
        {roster.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card variant="gold">
              <CardContent className="flex items-center gap-4">
                <span className="text-3xl">💡</span>
                <div>
                  <div className="font-roman text-roman-gold-400">Getting Started</div>
                  <div className="text-roman-marble-300">
                    Visit the Marketplace to recruit your first gladiator and begin building your legacy!
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};
