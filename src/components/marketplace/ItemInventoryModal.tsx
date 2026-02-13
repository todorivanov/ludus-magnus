import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { Modal, Button, Card, CardContent } from '@components/ui';
import { ALL_MARKET_ITEMS } from '@data/marketplace';
import { applyItemEffect } from '@features/marketplace/marketplaceSlice';
import { applyItemToGladiator } from '@utils/marketplaceEffects';
import type { Gladiator, MarketItem } from '@/types';
import { clsx } from 'clsx';

interface ItemInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gladiator: Gladiator;
  onApplyItem: (updatedGladiator: Gladiator, message: string) => void;
}

export const ItemInventoryModal: React.FC<ItemInventoryModalProps> = ({
  isOpen,
  onClose,
  gladiator,
  onApplyItem,
}) => {
  const dispatch = useAppDispatch();
  const { purchasedItems } = useAppSelector(state => state.marketplace);
  const { currentDay } = useAppSelector(state => state.game);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  const availableItems = purchasedItems
    .filter(p => p.quantity > 0)
    .map(p => ({
      ...ALL_MARKET_ITEMS[p.itemId],
      quantity: p.quantity,
    }))
    .filter(item => item !== undefined) as (MarketItem & { quantity: number })[];

  const handleUseItem = (item: MarketItem) => {
    // Check if gladiator already has this equipment
    if (item.effect.type === 'equipment' && gladiator.equippedItems?.includes(item.id)) {
      // Already equipped, show message
      onApplyItem(gladiator, `${item.name} is already equipped on ${gladiator.name}!`);
      setSelectedItem(null);
      return;
    }

    // Apply the item effect
    const result = applyItemToGladiator(gladiator, item, currentDay);

    // Dispatch to marketplace slice to track the effect (for temporary buffs)
    if (result.effect) {
      dispatch(applyItemEffect(result.effect));
    } else if (item.effect.type !== 'equipment') {
      // For items without temporary effects (healing, XP, stat boosts, etc.)
      // Equipment items are NOT consumed, they're equipped
      // We need to manually reduce the quantity for non-equipment items
      const purchased = purchasedItems.find(p => p.itemId === item.id);
      if (purchased && purchased.quantity > 0) {
        // Reduce quantity by dispatching a consumption action
        dispatch(applyItemEffect({
          id: `consume-${Date.now()}`,
          itemId: item.id,
          type: 'consumed',
          value: 0,
        }));
      }
    }

    // Update the gladiator through parent component
    onApplyItem(result.updatedGladiator, result.message);
    
    setSelectedItem(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Use Item">
      <div className="space-y-4">
        <div className="text-sm text-roman-marble-400">
          Select an item to use on <span className="text-roman-gold-400 font-roman">{gladiator.name}</span>
        </div>

        {availableItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-roman-marble-400">No items in inventory</p>
              <p className="text-xs text-roman-marble-500 mt-2">
                Purchase items from the marketplace
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {availableItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem(item)}
                className={clsx(
                  'p-3 rounded-lg border-2 transition-all text-left',
                  selectedItem?.id === item.id
                    ? 'border-roman-gold-500 bg-roman-marble-800'
                    : 'border-roman-marble-700 bg-roman-marble-900 hover:border-roman-marble-600'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-roman text-sm text-roman-marble-100">
                      {item.name}
                    </div>
                    <div className="text-xs text-roman-marble-500">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-roman-marble-400 line-clamp-2">
                  {item.description}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Selected Item Details */}
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-roman-marble-700 pt-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl">{selectedItem.icon}</span>
                <div className="flex-1">
                  <div className="font-roman text-lg text-roman-gold-400 mb-1">
                    {selectedItem.name}
                  </div>
                  <div className="text-sm text-roman-marble-300 mb-2">
                    {selectedItem.description}
                  </div>
                  {getItemCompatibilityMessage(selectedItem, gladiator) && (
                    <div className="text-xs text-roman-marble-500 bg-roman-marble-800 p-2 rounded">
                      💡 {getItemCompatibilityMessage(selectedItem, gladiator)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={() => handleUseItem(selectedItem)}
                >
                  Use Item
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedItem && availableItems.length > 0 && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Helper function to provide context-aware messages
function getItemCompatibilityMessage(item: MarketItem, gladiator: Gladiator): string | null {
  switch (item.effect.type) {
    case 'heal':
      if (gladiator.currentHP === gladiator.maxHP && gladiator.currentStamina === gladiator.maxStamina) {
        return 'This gladiator is already at full health and stamina.';
      }
      break;
    case 'injury_heal':
      if (gladiator.injuries.length === 0) {
        return 'This gladiator has no injuries to heal.';
      }
      break;
    case 'morale_boost':
      if (gladiator.morale >= 1.5) {
        return 'This gladiator\'s morale is already at maximum.';
      }
      break;
    case 'stat_boost':
      if (item.effect.stat && gladiator.stats[item.effect.stat] >= 100) {
        return `This gladiator's ${item.effect.stat} is already at maximum.`;
      }
      break;
  }
  return null;
}
