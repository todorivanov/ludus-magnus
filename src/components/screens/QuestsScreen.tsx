import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { 
  startQuest,
  completeQuest,
  abandonQuest,
  recordChoice,
  setActiveDialogue,
  advanceChapter,
  updateObjective,
} from '@features/quests/questsSlice';
import { addGold, spendGold } from '@features/player/playerSlice';
import { addLudusFame } from '@features/fame/fameSlice';
import { adjustFavor } from '@features/factions/factionsSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, ProgressBar } from '@components/ui';
import { 
  getQuestById,
  getAvailableQuests,
  calculateQuestProgress,
  type Quest,
  type QuestDialogue,
  type QuestObjective,
} from '@data/quests';
import { clsx } from 'clsx';

type FactionId = 'optimates' | 'populares' | 'military' | 'merchants';

export const QuestsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const questsState = useAppSelector(state => state.quests);
  const activeQuests = questsState?.activeQuests || [];
  const completedQuestIds = questsState?.completedQuestIds || [];
  const questCooldowns = questsState?.questCooldowns || {};
  const currentChapter = questsState?.currentChapter || 1;
  const storyProgress = questsState?.storyProgress || 0;
  const isEndlessMode = questsState?.isEndlessMode || false;

  const { gold } = useAppSelector(state => state.player);
  const { currentDay } = useAppSelector(state => state.game);
  const fameState = useAppSelector(state => state.fame);
  const ludusFame = fameState?.ludusFame || 0;
  const gladiatorsState = useAppSelector(state => state.gladiators);
  const roster = gladiatorsState?.roster || [];
  const ludusState = useAppSelector(state => state.ludus);
  const buildings = ludusState?.buildings || [];
  const factionsState = useAppSelector(state => state.factions);
  const factionFavors = factionsState?.factionFavors || { optimates: 0, populares: 0, military: 0, merchants: 0 };
  const staffState = useAppSelector(state => state.staff);
  const employees = staffState?.employees || [];

  const [activeTab, setActiveTab] = useState<'story' | 'side' | 'daily' | 'completed'>('story');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showDialogueModal, setShowDialogueModal] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState<QuestDialogue | null>(null);

  // Calculate game state for quest conditions
  const gameState = useMemo(() => ({
    fame: ludusFame,
    gold,
    gladiatorCount: roster.length,
    wins: roster.reduce((sum, g) => sum + g.wins, 0),
    buildingCount: buildings.length,
    currentDay,
    factionFavors: factionFavors as Record<string, number>,
    completedQuests: completedQuestIds,
  }), [ludusFame, gold, roster, buildings, currentDay, factionFavors, completedQuestIds]);

  // Get available quests
  const availableQuests = useMemo(() => 
    getAvailableQuests(
      gameState,
      activeQuests.map(q => q.questId),
      completedQuestIds,
      questCooldowns
    ),
  [gameState, activeQuests, completedQuestIds, questCooldowns]);

  // Filter quests by tab
  const filteredQuests = useMemo(() => {
    switch (activeTab) {
      case 'story':
        return availableQuests.filter(q => q.type === 'story');
      case 'side':
        return availableQuests.filter(q => q.type === 'side' || q.type === 'event');
      case 'daily':
        return availableQuests.filter(q => q.type === 'daily');
      case 'completed':
        return completedQuestIds.map(id => getQuestById(id)).filter((q): q is Quest => q !== undefined);
      default:
        return [];
    }
  }, [activeTab, availableQuests, completedQuestIds]);

  // Get active quest data
  const getActiveQuestData = (questId: string) => {
    return activeQuests.find(q => q.questId === questId);
  };

  // Handle quest acceptance
  // Helper to update fame objectives in all active quests
  const updateFameObjectives = (newFameTotal: number) => {
    activeQuests.forEach(activeQuest => {
      const questData = getQuestById(activeQuest.questId);
      if (questData) {
        questData.objectives.forEach(objective => {
          if (objective.type === 'gain_fame') {
            dispatch(updateObjective({
              questId: activeQuest.questId,
              objectiveId: objective.id,
              progress: newFameTotal,
              required: objective.required,
            }));
          }
        });
      }
    });
  };

  // Calculate initial progress for an objective based on current game state
  const calculateInitialProgress = (objective: Omit<QuestObjective, 'current' | 'completed'>): number => {
    switch (objective.type) {
      case 'gain_fame':
        // Fame objectives check current fame level
        return ludusFame;
      case 'build':
        // Check if the target building exists
        if (objective.target) {
          const hasBuilding = buildings.some(b => b.type === objective.target && !b.isUnderConstruction);
          return hasBuilding ? 1 : 0;
        }
        return 0;
      case 'recruit_gladiator':
        // Count current gladiators
        return roster.length;
      case 'reach_favor':
        // Check faction favor level
        if (objective.target) {
          return factionFavors[objective.target as keyof typeof factionFavors] || 0;
        }
        return 0;
      case 'hire_staff':
        // Check if staff of target type exists
        if (objective.target) {
          const hasStaff = employees.some(e => e.role === objective.target);
          return hasStaff ? 1 : 0;
        }
        return 0;
      // win_matches, train, earn_gold, custom - start at 0 as they track NEW actions
      default:
        return 0;
    }
  };

  const handleAcceptQuest = (quest: Quest) => {
    // Calculate initial progress for all objectives at quest start
    const objectivesWithProgress = quest.objectives.map(o => ({
      id: o.id,
      required: o.required,
      initialProgress: calculateInitialProgress(o),
    }));

    dispatch(startQuest({
      questId: quest.id,
      startDay: currentDay,
      objectives: objectivesWithProgress,
    }));

    // Show intro dialogue if available
    if (quest.introDialogue && quest.introDialogue.length > 0) {
      setCurrentDialogue(quest.introDialogue[0]);
      setShowDialogueModal(true);
      dispatch(setActiveDialogue({ questId: quest.id, dialogueId: quest.introDialogue[0].id }));
    }

    setShowQuestModal(false);
  };

  // Handle dialogue choice
  const handleDialogueChoice = (quest: Quest, dialogue: QuestDialogue, choiceId: string) => {
    const choice = dialogue.choices?.find(c => c.id === choiceId);
    if (!choice) return;

    // Record the choice
    dispatch(recordChoice({
      questId: quest.id,
      dialogueId: dialogue.id,
      choiceId,
    }));

    // Apply consequences
    choice.consequences.forEach(consequence => {
      switch (consequence.type) {
        case 'gold':
          if (consequence.value > 0) {
            dispatch(addGold({
              amount: consequence.value,
              description: `Quest: ${quest.title}`,
              category: 'quest',
              day: currentDay,
            }));
          } else {
            dispatch(spendGold({
              amount: -consequence.value,
              description: `Quest: ${quest.title}`,
              category: 'quest',
              day: currentDay,
            }));
          }
          break;
        case 'fame':
          dispatch(addLudusFame({
            amount: consequence.value,
            source: `Quest: ${quest.title}`,
            day: currentDay,
          }));
          // Update fame objectives in other active quests
          updateFameObjectives(ludusFame + consequence.value);
          break;
        case 'favor':
          if (consequence.target) {
            dispatch(adjustFavor({
              faction: consequence.target as FactionId,
              amount: consequence.value,
            }));
          }
          break;
      }
    });

    // Progress to next dialogue or close
    if (choice.nextDialogue) {
      const allDialogues = [...(quest.introDialogue || []), ...(quest.completionDialogue || [])];
      const nextDlg = allDialogues.find(d => d.id === choice.nextDialogue);
      if (nextDlg) {
        setCurrentDialogue(nextDlg);
        return;
      }
    }

    // Close dialogue
    setShowDialogueModal(false);
    setCurrentDialogue(null);
    dispatch(setActiveDialogue(null));
  };

  // Handle next dialogue
  const handleNextDialogue = (quest: Quest, dialogue: QuestDialogue) => {
    if (dialogue.nextDialogue) {
      const allDialogues = [...(quest.introDialogue || []), ...(quest.completionDialogue || [])];
      const nextDlg = allDialogues.find(d => d.id === dialogue.nextDialogue);
      if (nextDlg) {
        setCurrentDialogue(nextDlg);
        return;
      }
    }

    // Close dialogue
    setShowDialogueModal(false);
    setCurrentDialogue(null);
    dispatch(setActiveDialogue(null));
  };

  // Handle quest completion (manually for testing)
  const handleCompleteQuest = (quest: Quest) => {
    dispatch(completeQuest({
      questId: quest.id,
      completedDay: currentDay,
      cooldownDays: quest.cooldownDays,
    }));

    // Apply rewards
    quest.rewards.forEach(reward => {
      switch (reward.type) {
        case 'gold':
          dispatch(addGold({
            amount: reward.value,
            description: `Quest Reward: ${quest.title}`,
            category: 'quest',
            day: currentDay,
          }));
          break;
        case 'fame':
          dispatch(addLudusFame({
            amount: reward.value,
            source: `Quest Reward: ${quest.title}`,
            day: currentDay,
          }));
          // Update fame objectives in other active quests
          updateFameObjectives(ludusFame + reward.value);
          break;
        case 'faction_favor':
          if (reward.target) {
            dispatch(adjustFavor({
              faction: reward.target as FactionId,
              amount: reward.value,
            }));
          }
          break;
      }
    });

    // Advance chapter for story quests
    if (quest.type === 'story') {
      dispatch(advanceChapter());
    }

    // Show completion dialogue
    if (quest.completionDialogue && quest.completionDialogue.length > 0) {
      setCurrentDialogue(quest.completionDialogue[0]);
      setShowDialogueModal(true);
    }
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
              Quests & Story
            </h1>
            <p className="text-roman-marble-400">
              {isEndlessMode 
                ? 'You have completed the main story. Continue your endless journey!'
                : 'Follow your path to glory in the Roman arena.'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="font-roman text-lg text-roman-gold-400">
              Chapter {currentChapter} / 5
            </div>
            <ProgressBar value={storyProgress} max={100} variant="fame" size="sm" />
          </div>
        </div>

        {/* Active Quests Summary */}
        {activeQuests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Quests ({activeQuests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {activeQuests.map(active => {
                  const quest = getQuestById(active.questId);
                  if (!quest) return null;
                  
                  const progress = calculateQuestProgress(quest, active.objectives.map(o => ({
                    ...o,
                    description: '',
                    type: 'custom' as const,
                    required: quest.objectives.find(qo => qo.id === o.id)?.required || 1,
                  })));

                  return (
                    <ActiveQuestCard
                      key={active.questId}
                      quest={quest}
                      activeData={active}
                      progress={progress}
                      onComplete={() => handleCompleteQuest(quest)}
                      onAbandon={() => dispatch(abandonQuest(quest.id))}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-roman-marble-700 pb-2">
          {(['story', 'side', 'daily', 'completed'] as const).map(tab => (
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

        {/* Quest List */}
        <div className="grid grid-cols-2 gap-4">
          {filteredQuests.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-roman-marble-500">
              {activeTab === 'completed' 
                ? 'No completed quests yet'
                : 'No quests available. Check back later or progress further in the game.'
              }
            </div>
          ) : (
            filteredQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompleted={activeTab === 'completed'}
                isActive={activeQuests.some(q => q.questId === quest.id)}
                onSelect={() => {
                  setSelectedQuest(quest);
                  setShowQuestModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* Quest Detail Modal */}
        <Modal
          isOpen={showQuestModal}
          onClose={() => setShowQuestModal(false)}
          title={selectedQuest?.title || 'Quest Details'}
          size="lg"
        >
          {selectedQuest && (
            <QuestDetailView
              quest={selectedQuest}
              activeData={getActiveQuestData(selectedQuest.id)}
              isCompleted={completedQuestIds.includes(selectedQuest.id)}
              onAccept={() => handleAcceptQuest(selectedQuest)}
              onClose={() => setShowQuestModal(false)}
            />
          )}
        </Modal>

        {/* Dialogue Modal */}
        <AnimatePresence>
          {showDialogueModal && currentDialogue && selectedQuest && (
            <DialogueModal
              dialogue={currentDialogue}
              quest={selectedQuest}
              onChoice={(choiceId) => handleDialogueChoice(selectedQuest, currentDialogue, choiceId)}
              onNext={() => handleNextDialogue(selectedQuest, currentDialogue)}
              onClose={() => {
                setShowDialogueModal(false);
                setCurrentDialogue(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
};

// Quest Card Component
interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  isActive: boolean;
  onSelect: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  isCompleted,
  isActive,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        'p-4 rounded-lg border cursor-pointer transition-all',
        isCompleted
          ? 'border-health-high bg-health-high/10'
          : isActive
            ? 'border-roman-gold-500 bg-roman-gold-500/10'
            : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{quest.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-roman text-lg text-roman-marble-100">{quest.title}</span>
            {quest.chapter && (
              <span className="text-xs px-2 py-0.5 bg-roman-gold-600 rounded">
                Ch.{quest.chapter}
              </span>
            )}
            {isActive && (
              <span className="text-xs px-2 py-0.5 bg-blue-600 rounded">Active</span>
            )}
          </div>
          <p className="text-sm text-roman-marble-400 mt-1 line-clamp-2">
            {quest.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className={clsx(
              'px-2 py-0.5 rounded capitalize',
              quest.type === 'story' && 'bg-roman-gold-600',
              quest.type === 'side' && 'bg-blue-600',
              quest.type === 'daily' && 'bg-green-600',
              quest.type === 'event' && 'bg-purple-600'
            )}>
              {quest.type}
            </span>
            {quest.timeLimit && (
              <span className="text-roman-marble-500">
                ⏱️ {quest.timeLimit} days
              </span>
            )}
            {quest.repeatable && (
              <span className="text-roman-marble-500">🔄 Repeatable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Active Quest Card
interface ActiveQuestCardProps {
  quest: Quest;
  activeData: { objectives: { id: string; current: number; completed: boolean }[]; startDay: number };
  progress: { completed: boolean; progress: number };
  onComplete: () => void;
  onAbandon: () => void;
}

const ActiveQuestCard: React.FC<ActiveQuestCardProps> = ({
  quest,
  activeData,
  progress,
  onComplete,
  onAbandon,
}) => {
  return (
    <div className="p-3 bg-roman-marble-800 rounded-lg border border-roman-gold-600">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{quest.icon}</span>
        <span className="font-roman text-roman-marble-100 flex-1">{quest.title}</span>
        {progress.completed && (
          <Button variant="gold" size="sm" onClick={onComplete}>
            Complete
          </Button>
        )}
      </div>
      <ProgressBar value={progress.progress} max={100} variant="fame" size="sm" />
      <div className="mt-2 space-y-1">
        {activeData.objectives.map(obj => {
          const questObj = quest.objectives.find(o => o.id === obj.id);
          return (
            <div key={obj.id} className="flex items-center gap-2 text-xs">
              <span className={obj.completed ? 'text-health-high' : 'text-roman-marble-500'}>
                {obj.completed ? '✓' : '○'}
              </span>
              <span className={obj.completed ? 'text-roman-marble-300 line-through' : 'text-roman-marble-400'}>
                {questObj?.description || obj.id}
              </span>
              <span className="text-roman-marble-600 ml-auto">
                {obj.current}/{questObj?.required || 1}
              </span>
            </div>
          );
        })}
      </div>
      {quest.type !== 'story' && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 w-full text-roman-crimson-400"
          onClick={onAbandon}
        >
          Abandon
        </Button>
      )}
    </div>
  );
};

// Quest Detail View
interface QuestDetailViewProps {
  quest: Quest;
  activeData?: { objectives: { id: string; current: number; completed: boolean }[] };
  isCompleted: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const QuestDetailView: React.FC<QuestDetailViewProps> = ({
  quest,
  activeData,
  isCompleted,
  onAccept,
  onClose,
}) => {
  const isActive = !!activeData;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-5xl mb-2">{quest.icon}</div>
        <div className="text-sm text-roman-marble-500 capitalize">{quest.type} Quest</div>
      </div>

      <p className="text-roman-marble-300">{quest.description}</p>

      {/* Objectives */}
      <div className="bg-roman-marble-800 p-4 rounded-lg">
        <h4 className="font-roman text-roman-gold-400 mb-3">Objectives</h4>
        <div className="space-y-2">
          {quest.objectives.map(obj => {
            const activeObj = activeData?.objectives.find(o => o.id === obj.id);
            const current = activeObj?.current || 0;
            const completed = activeObj?.completed || false;

            return (
              <div key={obj.id} className="flex items-center gap-3">
                <span className={clsx(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                  completed ? 'bg-health-high' : 'bg-roman-marble-700'
                )}>
                  {completed ? '✓' : ''}
                </span>
                <span className={completed ? 'text-roman-marble-400 line-through' : 'text-roman-marble-200'}>
                  {obj.description}
                </span>
                {isActive && (
                  <span className="ml-auto text-roman-marble-500">
                    {current}/{obj.required}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-roman-gold-500/10 border border-roman-gold-600 p-4 rounded-lg">
        <h4 className="font-roman text-roman-gold-400 mb-3">Rewards</h4>
        <div className="flex flex-wrap gap-3">
          {quest.rewards.map((reward, idx) => (
            <div 
              key={idx}
              className="px-3 py-1 bg-roman-marble-800 rounded text-sm"
            >
              {reward.description}
            </div>
          ))}
        </div>
      </div>

      {/* Time Limit Warning */}
      {quest.timeLimit && (
        <div className="bg-roman-crimson-600/20 border border-roman-crimson-600 p-3 rounded-lg text-sm text-roman-crimson-400">
          ⏱️ This quest must be completed within {quest.timeLimit} days
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose}>
          Close
        </Button>
        {!isActive && !isCompleted && (
          <Button variant="gold" className="flex-1" onClick={onAccept}>
            Accept Quest
          </Button>
        )}
      </div>
    </div>
  );
};

// Dialogue Modal
interface DialogueModalProps {
  dialogue: QuestDialogue;
  quest: Quest;
  onChoice: (choiceId: string) => void;
  onNext: () => void;
  onClose: () => void;
}

const DialogueModal: React.FC<DialogueModalProps> = ({
  dialogue,
  quest,
  onChoice,
  onNext,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-roman-marble-800 border-2 border-roman-gold-600 rounded-lg max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-roman-marble-900 px-6 py-3 border-b border-roman-gold-700">
          <div className="font-roman text-roman-gold-400">{quest.title}</div>
        </div>

        {/* Dialogue Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            {dialogue.portrait && (
              <div className="text-5xl">{dialogue.portrait}</div>
            )}
            <div className="flex-1">
              <div className="font-roman text-roman-gold-400 mb-2">{dialogue.speaker}</div>
              <p className="text-roman-marble-200 leading-relaxed">{dialogue.text}</p>
            </div>
          </div>

          {/* Choices or Continue */}
          {dialogue.choices && dialogue.choices.length > 0 ? (
            <div className="space-y-2">
              {dialogue.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice.id)}
                  className="w-full p-3 text-left bg-roman-marble-900 border border-roman-marble-600 rounded-lg hover:border-roman-gold-500 transition-colors"
                >
                  <span className="text-roman-marble-200">{choice.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-end gap-3">
              {dialogue.nextDialogue ? (
                <Button variant="gold" onClick={onNext}>
                  Continue
                </Button>
              ) : (
                <Button variant="gold" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
