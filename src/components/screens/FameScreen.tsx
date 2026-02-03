import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { spendGold } from '@features/player/playerSlice';
import { 
  purchaseMerchandise, 
  acceptSponsorship,
  cancelSponsorship,
  toggleMerchandise,
} from '@features/fame/fameSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ProgressBar } from '@components/ui';
import { 
  LUDUS_FAME_TIERS,
  MERCHANDISE_ITEMS,
  SPONSORSHIP_DEALS,
  getLudusFameTier,
  getGladiatorFameTier,
  getNextFameTier,
  calculateMerchandiseIncome,
  getAvailableMerchandise,
  getAvailableSponsorships,
} from '@data/fame';
import { GLADIATOR_CLASSES } from '@data/gladiatorClasses';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

export const FameScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const fameState = useAppSelector(state => state.fame);
  const ludusFame = fameState?.ludusFame || 0;
  const ownedMerchandise = fameState?.ownedMerchandise || [];
  const activeSponsorships = fameState?.activeSponsorships || [];
  
  const { roster } = useAppSelector(state => state.gladiators);
  const { gold } = useAppSelector(state => state.player);
  const { currentDay } = useAppSelector(state => state.game);

  const [activeTab, setActiveTab] = useState<'overview' | 'merchandise' | 'sponsorships' | 'gladiators'>('overview');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedMerch, setSelectedMerch] = useState<typeof MERCHANDISE_ITEMS[0] | null>(null);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<typeof SPONSORSHIP_DEALS[0] | null>(null);

  // Calculate totals
  const totalGladiatorFame = roster.reduce((sum, g) => sum + g.fame, 0);
  const ludusTier = getLudusFameTier(ludusFame);
  const nextLudusTier = getNextFameTier(ludusFame, true);

  // Available items
  const availableMerchandise = getAvailableMerchandise(ludusFame);
  const availableSponsorships = getAvailableSponsorships(ludusFame);
  const ownedMerchIds = ownedMerchandise.map(m => m.itemId);

  // Handle merchandise purchase
  const handlePurchaseMerch = () => {
    if (!selectedMerch || gold < selectedMerch.baseCost) return;

    dispatch(spendGold({
      amount: selectedMerch.baseCost,
      description: `Purchased: ${selectedMerch.name}`,
      category: 'merchandise',
      day: currentDay,
    }));

    dispatch(purchaseMerchandise({
      id: uuidv4(),
      itemId: selectedMerch.id,
      day: currentDay,
    }));

    setShowPurchaseModal(false);
    setSelectedMerch(null);
  };

  // Handle sponsorship acceptance
  const handleAcceptSponsorship = () => {
    if (!selectedDeal) return;

    dispatch(acceptSponsorship({
      id: uuidv4(),
      dealId: selectedDeal.id,
      startDay: currentDay,
      daysRemaining: selectedDeal.duration,
      dailyPayment: selectedDeal.dailyPayment,
    }));

    setShowSponsorModal(false);
    setSelectedDeal(null);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
              Fame & Reputation
            </h1>
            <p className="text-roman-marble-400">
              Build your legacy and profit from your gladiators' fame
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-1">{ludusTier.icon}</div>
            <div className="font-roman text-roman-gold-400">{ludusTier.title}</div>
            <div className="text-sm text-roman-marble-500">{ludusTier.name} Ludus</div>
          </div>
        </div>

        {/* Ludus Fame Progress */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-roman-marble-400">Ludus Fame</span>
                  <span className="text-roman-gold-400 font-roman">
                    {ludusFame} / {nextLudusTier?.minFame || 'MAX'}
                  </span>
                </div>
                <ProgressBar 
                  value={ludusFame} 
                  max={nextLudusTier?.minFame || ludusFame} 
                  variant="fame"
                />
                {nextLudusTier && (
                  <div className="text-xs text-roman-marble-500 mt-1">
                    {nextLudusTier.minFame - ludusFame} fame until {nextLudusTier.name}
                  </div>
                )}
              </div>
              <div className="text-center px-4 border-l border-roman-marble-700">
                <div className="text-2xl font-roman text-roman-gold-400">{roster.length}</div>
                <div className="text-xs text-roman-marble-500">Gladiators</div>
              </div>
              <div className="text-center px-4 border-l border-roman-marble-700">
                <div className="text-2xl font-roman text-roman-gold-400">{totalGladiatorFame}</div>
                <div className="text-xs text-roman-marble-500">Total Fame</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-roman-marble-700 pb-2">
          {(['overview', 'merchandise', 'sponsorships', 'gladiators'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-2 rounded-t font-roman capitalize transition-colors',
                activeTab === tab
                  ? 'bg-roman-gold-600 text-roman-marble-100'
                  : 'text-roman-marble-400 hover:text-roman-marble-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            ludusTier={ludusTier}
            totalGladiatorFame={totalGladiatorFame}
            ownedMerchandise={ownedMerchandise}
            activeSponsorships={activeSponsorships}
            ludusFame={ludusFame}
          />
        )}

        {activeTab === 'merchandise' && (
          <MerchandiseTab
            availableMerchandise={availableMerchandise}
            ownedMerchandise={ownedMerchandise}
            ownedMerchIds={ownedMerchIds}
            gold={gold}
            ludusFame={ludusFame}
            totalGladiatorFame={totalGladiatorFame}
            onPurchase={(item) => {
              setSelectedMerch(item);
              setShowPurchaseModal(true);
            }}
            onToggle={(id) => dispatch(toggleMerchandise(id))}
          />
        )}

        {activeTab === 'sponsorships' && (
          <SponsorshipsTab
            availableSponsorships={availableSponsorships}
            activeSponsorships={activeSponsorships}
            ludusFame={ludusFame}
            onAccept={(deal) => {
              setSelectedDeal(deal);
              setShowSponsorModal(true);
            }}
            onCancel={(id) => dispatch(cancelSponsorship(id))}
          />
        )}

        {activeTab === 'gladiators' && (
          <GladiatorsFameTab roster={roster} />
        )}

        {/* Purchase Modal */}
        <Modal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          title="Purchase Merchandise"
        >
          {selectedMerch && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedMerch.icon}</div>
                <div className="font-roman text-xl text-roman-gold-400">
                  {selectedMerch.name}
                </div>
                <div className="text-sm text-roman-marble-400 mt-1">
                  {selectedMerch.description}
                </div>
              </div>

              <div className="bg-roman-marble-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Cost:</span>
                  <span className={gold >= selectedMerch.baseCost ? 'text-roman-gold-400' : 'text-roman-crimson-400'}>
                    {selectedMerch.baseCost}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Daily Income:</span>
                  <span className="text-health-high">
                    +{calculateMerchandiseIncome(selectedMerch, ludusFame, totalGladiatorFame)}g
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowPurchaseModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="gold" 
                  className="flex-1" 
                  onClick={handlePurchaseMerch}
                  disabled={gold < selectedMerch.baseCost}
                >
                  Purchase
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Sponsorship Modal */}
        <Modal
          isOpen={showSponsorModal}
          onClose={() => setShowSponsorModal(false)}
          title="Accept Sponsorship"
        >
          {selectedDeal && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedDeal.icon}</div>
                <div className="font-roman text-xl text-roman-gold-400">
                  {selectedDeal.name}
                </div>
                <div className="text-sm text-roman-marble-400 mt-1">
                  Sponsored by: {selectedDeal.sponsor}
                </div>
              </div>

              <p className="text-roman-marble-300 text-sm">{selectedDeal.description}</p>

              <div className="bg-roman-marble-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Daily Payment:</span>
                  <span className="text-roman-gold-400">+{selectedDeal.dailyPayment}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Duration:</span>
                  <span className="text-roman-marble-200">{selectedDeal.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-roman-marble-400">Total Value:</span>
                  <span className="text-roman-gold-400">
                    {selectedDeal.dailyPayment * selectedDeal.duration}g
                  </span>
                </div>
              </div>

              {selectedDeal.conditions.length > 0 && (
                <div className="bg-roman-crimson-600/20 border border-roman-crimson-600 p-3 rounded-lg">
                  <div className="text-roman-crimson-400 text-sm mb-2">Conditions:</div>
                  <ul className="text-xs text-roman-marble-300 space-y-1">
                    {selectedDeal.conditions.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowSponsorModal(false)}>
                  Decline
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleAcceptSponsorship}>
                  Accept Deal
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

// Overview Tab
interface OverviewTabProps {
  ludusTier: typeof LUDUS_FAME_TIERS[0];
  totalGladiatorFame: number;
  ownedMerchandise: { itemId: string; isActive: boolean }[];
  activeSponsorships: { dailyPayment: number }[];
  ludusFame: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  ludusTier,
  totalGladiatorFame,
  ownedMerchandise,
  activeSponsorships,
  ludusFame,
}) => {
  // Calculate daily income
  const tierIncome = ludusTier.benefits
    .filter(b => b.type === 'income')
    .reduce((sum, b) => sum + b.value, 0);
  
  const merchIncome = ownedMerchandise
    .filter(m => m.isActive)
    .reduce((sum, m) => {
      const item = MERCHANDISE_ITEMS.find(i => i.id === m.itemId);
      return sum + (item ? calculateMerchandiseIncome(item, ludusFame, totalGladiatorFame) : 0);
    }, 0);
  
  const sponsorIncome = activeSponsorships.reduce((sum, s) => sum + s.dailyPayment, 0);
  const totalIncome = tierIncome + merchIncome + sponsorIncome;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Daily Income Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Fame Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-roman-marble-400">Ludus Tier Bonus</span>
              <span className="text-roman-gold-400">+{tierIncome}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-roman-marble-400">Merchandise Sales</span>
              <span className="text-roman-gold-400">+{merchIncome}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-roman-marble-400">Sponsorships</span>
              <span className="text-roman-gold-400">+{sponsorIncome}g</span>
            </div>
            <div className="border-t border-roman-marble-700 pt-3 flex justify-between items-center">
              <span className="font-roman text-roman-marble-200">Total Daily</span>
              <span className="font-roman text-xl text-roman-gold-400">+{totalIncome}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Current Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          {ludusTier.benefits.length === 0 ? (
            <div className="text-center py-4 text-roman-marble-500">
              Increase your fame to unlock benefits
            </div>
          ) : (
            <div className="space-y-2">
              {ludusTier.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className={clsx(
                    'px-2 py-0.5 rounded text-xs',
                    benefit.type === 'income' && 'bg-roman-gold-600',
                    benefit.type === 'discount' && 'bg-green-600',
                    benefit.type === 'access' && 'bg-blue-600',
                    benefit.type === 'bonus' && 'bg-purple-600'
                  )}>
                    {benefit.type}
                  </span>
                  <span className="text-roman-marble-300">{benefit.description}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fame Tiers */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Fame Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {LUDUS_FAME_TIERS.map((tier) => (
              <div 
                key={tier.id}
                className={clsx(
                  'flex-1 p-3 rounded-lg border text-center',
                  ludusFame >= tier.minFame
                    ? 'border-roman-gold-600 bg-roman-gold-500/10'
                    : 'border-roman-marble-700 bg-roman-marble-800 opacity-60'
                )}
              >
                <div className="text-2xl mb-1">{tier.icon}</div>
                <div className="font-roman text-sm text-roman-marble-100">{tier.name}</div>
                <div className="text-xs text-roman-marble-500">{tier.minFame}+ fame</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Merchandise Tab
interface MerchandiseTabProps {
  availableMerchandise: typeof MERCHANDISE_ITEMS;
  ownedMerchandise: { id: string; itemId: string; isActive: boolean }[];
  ownedMerchIds: string[];
  gold: number;
  ludusFame: number;
  totalGladiatorFame: number;
  onPurchase: (item: typeof MERCHANDISE_ITEMS[0]) => void;
  onToggle: (id: string) => void;
}

const MerchandiseTab: React.FC<MerchandiseTabProps> = ({
  ownedMerchandise,
  ownedMerchIds,
  gold,
  ludusFame,
  totalGladiatorFame,
  onPurchase,
  onToggle,
}) => {
  return (
    <div className="space-y-6">
      {/* Owned Merchandise */}
      {ownedMerchandise.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Merchandise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {ownedMerchandise.map(owned => {
                const item = MERCHANDISE_ITEMS.find(i => i.id === owned.itemId);
                if (!item) return null;
                const income = calculateMerchandiseIncome(item, ludusFame, totalGladiatorFame);
                
                return (
                  <div 
                    key={owned.id}
                    className={clsx(
                      'p-3 rounded-lg border',
                      owned.isActive
                        ? 'border-roman-gold-600 bg-roman-gold-500/10'
                        : 'border-roman-marble-700 bg-roman-marble-800 opacity-60'
                    )}
                  >
                    <div className="text-center mb-2">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="text-sm text-center text-roman-marble-100">{item.name}</div>
                    <div className="text-xs text-center text-health-high mt-1">
                      +{income}g/day
                    </div>
                    <Button
                      variant={owned.isActive ? 'ghost' : 'primary'}
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => onToggle(owned.id)}
                    >
                      {owned.isActive ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available for Purchase */}
      <Card>
        <CardHeader>
          <CardTitle>Available Merchandise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {MERCHANDISE_ITEMS.map(item => {
              const isOwned = ownedMerchIds.includes(item.id);
              const isAvailable = ludusFame >= item.requiredLudusFame;
              const canAfford = gold >= item.baseCost;
              const income = calculateMerchandiseIncome(item, ludusFame, totalGladiatorFame);

              return (
                <div
                  key={item.id}
                  className={clsx(
                    'p-4 rounded-lg border',
                    isOwned
                      ? 'border-health-high bg-health-high/10'
                      : isAvailable
                        ? 'border-roman-marble-600 bg-roman-marble-800'
                        : 'border-roman-marble-700 bg-roman-marble-900 opacity-50'
                  )}
                >
                  <div className="text-center mb-3">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="text-sm font-roman text-center text-roman-marble-100">
                    {item.name}
                  </div>
                  <div className="text-xs text-center text-roman-marble-500 mt-1">
                    {item.description}
                  </div>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Cost:</span>
                      <span className={canAfford ? 'text-roman-gold-400' : 'text-roman-crimson-400'}>
                        {item.baseCost}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Income:</span>
                      <span className="text-health-high">+{income}g/day</span>
                    </div>
                  </div>
                  {!isAvailable && (
                    <div className="text-xs text-roman-crimson-400 text-center mt-2">
                      Requires {item.requiredLudusFame} fame
                    </div>
                  )}
                  {isOwned ? (
                    <div className="text-xs text-health-high text-center mt-2">✓ Owned</div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-3"
                      disabled={!isAvailable || !canAfford}
                      onClick={() => onPurchase(item)}
                    >
                      Purchase
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Sponsorships Tab
interface SponsorshipsTabProps {
  availableSponsorships: typeof SPONSORSHIP_DEALS;
  activeSponsorships: { id: string; dealId: string; daysRemaining: number; dailyPayment: number }[];
  ludusFame: number;
  onAccept: (deal: typeof SPONSORSHIP_DEALS[0]) => void;
  onCancel: (id: string) => void;
}

const SponsorshipsTab: React.FC<SponsorshipsTabProps> = ({
  activeSponsorships,
  ludusFame,
  onAccept,
  onCancel,
}) => {
  const activeDealIds = activeSponsorships.map(s => s.dealId);

  return (
    <div className="space-y-6">
      {/* Active Sponsorships */}
      {activeSponsorships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Sponsorships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSponsorships.map(sponsorship => {
                const deal = SPONSORSHIP_DEALS.find(d => d.id === sponsorship.dealId);
                if (!deal) return null;

                return (
                  <div 
                    key={sponsorship.id}
                    className="flex items-center justify-between p-3 bg-roman-marble-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{deal.icon}</span>
                      <div>
                        <div className="text-roman-marble-100">{deal.name}</div>
                        <div className="text-xs text-roman-marble-500">{deal.sponsor}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-roman-gold-400">+{sponsorship.dailyPayment}g/day</div>
                      <div className="text-xs text-roman-marble-500">
                        {sponsorship.daysRemaining} days remaining
                      </div>
                    </div>
                    <Button
                      variant="crimson"
                      size="sm"
                      onClick={() => onCancel(sponsorship.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Sponsorships */}
      <Card>
        <CardHeader>
          <CardTitle>Available Sponsorships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {SPONSORSHIP_DEALS.map(deal => {
              const isActive = activeDealIds.includes(deal.id);
              const isAvailable = ludusFame >= deal.requiredFame;

              return (
                <div
                  key={deal.id}
                  className={clsx(
                    'p-4 rounded-lg border',
                    isActive
                      ? 'border-health-high bg-health-high/10'
                      : isAvailable
                        ? 'border-roman-marble-600 bg-roman-marble-800'
                        : 'border-roman-marble-700 bg-roman-marble-900 opacity-50'
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{deal.icon}</span>
                    <div>
                      <div className="font-roman text-roman-marble-100">{deal.name}</div>
                      <div className="text-xs text-roman-marble-500">{deal.sponsor}</div>
                    </div>
                  </div>

                  <p className="text-xs text-roman-marble-400 mb-3">{deal.description}</p>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Daily Payment:</span>
                      <span className="text-roman-gold-400">+{deal.dailyPayment}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Duration:</span>
                      <span className="text-roman-marble-300">{deal.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-roman-marble-500">Total Value:</span>
                      <span className="text-roman-gold-400">{deal.dailyPayment * deal.duration}g</span>
                    </div>
                  </div>

                  {deal.conditions.length > 0 && (
                    <div className="text-xs text-roman-marble-500 mb-3">
                      Conditions: {deal.conditions.join(', ')}
                    </div>
                  )}

                  {!isAvailable && (
                    <div className="text-xs text-roman-crimson-400 mb-2">
                      Requires {deal.requiredFame} ludus fame
                    </div>
                  )}

                  {isActive ? (
                    <div className="text-xs text-health-high text-center">✓ Active</div>
                  ) : (
                    <Button
                      variant="gold"
                      size="sm"
                      className="w-full"
                      disabled={!isAvailable}
                      onClick={() => onAccept(deal)}
                    >
                      Accept Deal
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Gladiators Fame Tab
interface GladiatorsFameTabProps {
  roster: { id: string; name: string; class: string; fame: number; wins: number; losses: number }[];
}

const GladiatorsFameTab: React.FC<GladiatorsFameTabProps> = ({ roster }) => {
  const sortedRoster = [...roster].sort((a, b) => b.fame - a.fame);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gladiator Fame Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedRoster.length === 0 ? (
          <div className="text-center py-8 text-roman-marble-500">
            No gladiators in your roster
          </div>
        ) : (
          <div className="space-y-3">
            {sortedRoster.map((gladiator, idx) => {
              const tier = getGladiatorFameTier(gladiator.fame);
              const nextTier = getNextFameTier(gladiator.fame, false);
              const classData = GLADIATOR_CLASSES[gladiator.class as keyof typeof GLADIATOR_CLASSES];

              return (
                <div 
                  key={gladiator.id}
                  className="flex items-center gap-4 p-3 bg-roman-marble-800 rounded-lg"
                >
                  <div className="text-2xl font-roman text-roman-gold-500 w-8">
                    #{idx + 1}
                  </div>
                  <div className="text-2xl">{classData?.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-roman text-roman-marble-100">{gladiator.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-roman-gold-600 rounded">
                        {tier.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-roman-marble-500">
                      <span>{classData?.name}</span>
                      <span>{gladiator.wins}W - {gladiator.losses}L</span>
                    </div>
                  </div>
                  <div className="w-48">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-roman-marble-500">Fame</span>
                      <span className="text-roman-gold-400">{gladiator.fame}</span>
                    </div>
                    <ProgressBar 
                      value={gladiator.fame} 
                      max={nextTier?.minFame || gladiator.fame} 
                      variant="fame"
                      size="sm"
                    />
                    {nextTier && (
                      <div className="text-xs text-roman-marble-600 mt-1">
                        {nextTier.minFame - gladiator.fame} to {nextTier.title}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl">{tier.icon}</div>
                    <div className="text-xs text-roman-marble-500">{tier.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
