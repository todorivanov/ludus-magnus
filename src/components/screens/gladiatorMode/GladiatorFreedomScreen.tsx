import React from 'react';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { setChosenPath } from '@features/gladiatorMode/gladiatorModeSlice';
import { Card, CardContent, Button } from '@components/ui';
import { GladiatorLayout } from '@components/layout/GladiatorLayout';
import { calculateFreedomPaths, getLibertasTier } from '@data/gladiatorMode/freedomSystem';
import { STORY_CHAPTERS } from '@data/gladiatorMode/gladiatorEvents';
import type { FreedomPath } from '@/types';
import { clsx } from 'clsx';

export const GladiatorFreedomScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const gm = useAppSelector(state => state.gladiatorMode);
  const player = gm.playerGladiator;

  if (!player) return null;

  const paths = calculateFreedomPaths(player, gm.freedom, gm.dominus, gm.totalMonthsServed, gm.peculium);
  const libertasTier = getLibertasTier(gm.freedom.totalLibertas);
  const progressPercent = (gm.freedom.totalLibertas / 1000) * 100;

  const handleChoosePath = (pathId: FreedomPath) => {
    dispatch(setChosenPath(pathId));
  };

  return (
    <GladiatorLayout>
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500 mb-1">Path to Freedom</h1>
          <p className="text-sm text-roman-marble-400">
            The rudis awaits. Four paths lead to liberty. Choose wisely.
          </p>
        </div>

        {/* Main Libertas Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h2 className="font-roman text-xl text-roman-gold-500 mb-1">{libertasTier.name}</h2>
              <p className="text-sm text-roman-marble-500 italic">{libertasTier.latin}</p>
            </div>
            <div className="h-6 bg-roman-marble-800 rounded-full overflow-hidden mb-2 relative">
              <div
                className="h-full bg-gradient-to-r from-roman-gold-700 via-roman-gold-500 to-roman-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-roman-marble-100">
                {gm.freedom.totalLibertas} / 1000 Libertas
              </div>
            </div>
            <div className="flex justify-between text-xs text-roman-marble-500">
              <span>Slave</span>
              <span>Free Man</span>
            </div>
          </CardContent>
        </Card>

        {/* Freedom Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {paths.map((path) => {
            const isChosen = gm.freedom.chosenPath === path.id;
            return (
              <Card key={path.id} className={clsx(isChosen && 'ring-2 ring-roman-gold-500')}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{path.icon}</span>
                    <div>
                      <h3 className="font-roman text-lg text-roman-gold-500">{path.name}</h3>
                      <p className="text-xs text-roman-marble-500 italic">{path.latin}</p>
                    </div>
                    {isChosen && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded bg-roman-gold-500/20 text-roman-gold-400">
                        Chosen
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-roman-marble-300 mb-4">{path.description}</p>

                  {/* Progress bar */}
                  <div className="h-3 bg-roman-marble-800 rounded overflow-hidden mb-3">
                    <div
                      className={clsx(
                        'h-full rounded transition-all',
                        path.progress > 60 ? 'bg-roman-gold-500' : path.progress > 30 ? 'bg-yellow-600' : 'bg-roman-marble-600'
                      )}
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-roman-marble-400 text-right mb-3">{path.progress.toFixed(0)}%</div>

                  {/* Requirements */}
                  <div className="space-y-1 mb-4">
                    {path.requirements.map((req, i) => (
                      <div key={i} className="text-xs text-roman-marble-400 flex items-start gap-1">
                        <span className="text-roman-marble-600 mt-0.5">-</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {path.available && !isChosen && (
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleChoosePath(path.id)}>
                      Choose This Path
                    </Button>
                  )}
                  {!path.available && (
                    <div className="text-xs text-roman-marble-600 text-center italic">
                      Not yet available
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story Progress */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-roman text-lg text-roman-gold-500 mb-4">Story Chapters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STORY_CHAPTERS.map((ch) => {
                const completed = gm.completedStoryChapters.includes(ch.id);
                const current = gm.storyChapter === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={clsx(
                      'p-3 rounded border text-center text-xs',
                      completed ? 'border-roman-gold-500 bg-roman-gold-500/10' :
                      current ? 'border-yellow-500 bg-yellow-500/10' :
                      'border-roman-marble-700 bg-roman-marble-800'
                    )}
                  >
                    <div className={clsx(
                      'font-bold mb-1',
                      completed ? 'text-roman-gold-500' : current ? 'text-yellow-400' : 'text-roman-marble-500'
                    )}>
                      {ch.id}
                    </div>
                    <div className={clsx(
                      completed ? 'text-roman-marble-200' : current ? 'text-roman-marble-300' : 'text-roman-marble-600'
                    )}>
                      {ch.title}
                    </div>
                    {completed && <div className="text-green-400 mt-1">✓</div>}
                    {current && <div className="text-yellow-400 mt-1">...</div>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </GladiatorLayout>
  );
};
