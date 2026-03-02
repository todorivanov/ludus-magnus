import React from 'react';
import { useAppSelector } from '@app/hooks';
import { Card, CardContent } from '@components/ui';
import { GladiatorLayout } from '@components/layout/GladiatorLayout';
import { formatGameDate } from '@features/game/gameSlice';
import { clsx } from 'clsx';

export const GladiatorPeculiumScreen: React.FC = () => {
  const gm = useAppSelector(state => state.gladiatorMode);
  const player = gm.playerGladiator;

  if (!player) return null;

  const manumissionPrice = gm.freedom.manumissionPrice;
  const canBuyFreedom = gm.peculium >= manumissionPrice;
  const percentSaved = Math.min(100, (gm.peculium / Math.max(1, manumissionPrice)) * 100);

  return (
    <GladiatorLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500 mb-1">Peculium</h1>
          <p className="text-sm text-roman-marble-400">
            Your personal fund. Every coin brings you closer to freedom.
          </p>
        </div>

        {/* Balance Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="text-4xl text-roman-gold-500 font-bold mb-1">
                {gm.peculium}g
              </div>
              <div className="text-sm text-roman-marble-500">Current Balance</div>
            </div>

            <div className="divider-roman my-4" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg text-roman-marble-200 font-bold">{manumissionPrice}g</div>
                <div className="text-xs text-roman-marble-500">Manumission Price</div>
              </div>
              <div>
                <div className={clsx('text-lg font-bold', canBuyFreedom ? 'text-green-400' : 'text-roman-marble-400')}>
                  {canBuyFreedom ? 'Enough!' : `${(manumissionPrice - gm.peculium)}g needed`}
                </div>
                <div className="text-xs text-roman-marble-500">Until Freedom</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-roman-marble-500 mb-1">Savings Progress</div>
              <div className="h-4 bg-roman-marble-800 rounded overflow-hidden">
                <div
                  className={clsx('h-full rounded transition-all', canBuyFreedom ? 'bg-green-500' : 'bg-roman-gold-500')}
                  style={{ width: `${percentSaved}%` }}
                />
              </div>
              <div className="text-xs text-roman-marble-400 text-right mt-1">{percentSaved.toFixed(1)}%</div>
            </div>

            <p className="mt-4 text-xs text-roman-marble-500 italic text-center">
              The better you fight, the more your dominus values you — and the more expensive freedom becomes.
            </p>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-roman text-lg text-roman-gold-500 mb-3">Transaction History</h2>
            {gm.peculiumHistory.length > 0 ? (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {[...gm.peculiumHistory].reverse().map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 px-3 bg-roman-marble-800 rounded text-sm"
                  >
                    <div>
                      <div className="text-roman-marble-200">{tx.source}</div>
                      <div className="text-xs text-roman-marble-500">
                        {formatGameDate(tx.year, tx.month)}
                      </div>
                    </div>
                    <div className={clsx('font-bold', tx.amount >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount}g
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-roman-marble-500 italic">
                No transactions yet. Win fights to earn crowd tips.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GladiatorLayout>
  );
};
