/**
 * CombatLog Component
 * 
 * Displays combat events and messages in a scrollable log
 */

import React, { useEffect, useRef } from 'react';

export interface CombatLogEntry {
  id: string;
  message: string;
  type: 'attack' | 'damage' | 'heal' | 'skill' | 'status' | 'system' | 'victory' | 'defeat';
  timestamp: number;
}

interface CombatLogProps {
  entries: CombatLogEntry[];
  maxHeight?: string;
  autoScroll?: boolean;
}

export const CombatLog: React.FC<CombatLogProps> = ({
  entries,
  maxHeight = '400px',
  autoScroll = true,
}) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries, autoScroll]);

  // Get styling based on entry type
  const getEntryStyle = (type: CombatLogEntry['type']): string => {
    const baseStyle = 'px-3 py-2 rounded-md mb-2 text-sm transition-all duration-200';

    switch (type) {
      case 'attack':
        return `${baseStyle} bg-orange-100 text-orange-900 border-l-4 border-orange-500`;
      case 'damage':
        return `${baseStyle} bg-red-100 text-red-900 border-l-4 border-red-500`;
      case 'heal':
        return `${baseStyle} bg-green-100 text-green-900 border-l-4 border-green-500`;
      case 'skill':
        return `${baseStyle} bg-purple-100 text-purple-900 border-l-4 border-purple-500`;
      case 'status':
        return `${baseStyle} bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500`;
      case 'victory':
        return `${baseStyle} bg-green-200 text-green-900 border-l-4 border-green-600 font-bold`;
      case 'defeat':
        return `${baseStyle} bg-red-200 text-red-900 border-l-4 border-red-600 font-bold`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 border-l-4 border-gray-400`;
    }
  };

  // Get icon based on entry type
  const getEntryIcon = (type: CombatLogEntry['type']): string => {
    switch (type) {
      case 'attack':
        return '⚔️';
      case 'damage':
        return '💥';
      case 'heal':
        return '💚';
      case 'skill':
        return '✨';
      case 'status':
        return '🌟';
      case 'victory':
        return '🏆';
      case 'defeat':
        return '💀';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="rounded-lg border-2 border-gray-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-300 bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-3">
        <h3 className="text-lg font-bold text-white">📜 Combat Log</h3>
      </div>

      {/* Log Entries */}
      <div
        className="overflow-y-auto p-4"
        style={{ maxHeight }}
      >
        {entries.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p className="text-lg">⚔️ Battle will begin soon...</p>
            <p className="mt-2 text-sm">Combat events will appear here</p>
          </div>
        ) : (
          <>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={getEntryStyle(entry.type)}
              >
                <span className="mr-2">{getEntryIcon(entry.type)}</span>
                <span dangerouslySetInnerHTML={{ __html: entry.message }} />
              </div>
            ))}
            <div ref={logEndRef} />
          </>
        )}
      </div>

      {/* Footer with entry count */}
      {entries.length > 0 && (
        <div className="border-t-2 border-gray-300 bg-gray-50 px-4 py-2 text-center">
          <p className="text-xs text-gray-600">
            {entries.length} {entries.length === 1 ? 'event' : 'events'}
          </p>
        </div>
      )}
    </div>
  );
};
