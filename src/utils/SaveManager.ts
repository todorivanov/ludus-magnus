/**
 * SaveManager
 * 
 * Handles game state persistence to localStorage with compression
 */

import type { RootState } from '@/store';

const SAVE_KEY = 'ludus_magnus_save';
const SAVE_VERSION = '1.0.0';

export interface SaveData {
  version: string;
  timestamp: number;
  state: RootState;
}

export class SaveManager {
  private static instance: SaveManager;

  private constructor() {}

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  /**
   * Save current Redux state to localStorage
   */
  public save(state: RootState): boolean {
    try {
      const saveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state,
      };

      const serialized = JSON.stringify(saveData);
      
      // Compress if available (optional - can add lz-string later)
      const compressed = serialized;
      
      localStorage.setItem(SAVE_KEY, compressed);
      console.log('✅ Game saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load saved state from localStorage
   */
  public load(): SaveData | null {
    try {
      const compressed = localStorage.getItem(SAVE_KEY);
      
      if (!compressed) {
        console.log('ℹ️ No saved game found');
        return null;
      }

      // Decompress if needed
      const serialized = compressed;
      
      const saveData = JSON.parse(serialized) as SaveData;

      // Version migration (if needed)
      if (saveData.version !== SAVE_VERSION) {
        console.warn(`⚠️ Save version mismatch: ${saveData.version} vs ${SAVE_VERSION}`);
        // Could add migration logic here
      }

      console.log(`✅ Game loaded successfully (saved ${new Date(saveData.timestamp).toLocaleString()})`);
      return saveData;
    } catch (error) {
      console.error('❌ Failed to load game:', error);
      return null;
    }
  }

  /**
   * Delete saved game
   */
  public deleteSave(): boolean {
    try {
      localStorage.removeItem(SAVE_KEY);
      console.log('✅ Save deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete save:', error);
      return false;
    }
  }

  /**
   * Check if a save exists
   */
  public hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  /**
   * Get save metadata without loading full state
   */
  public getSaveInfo(): { version: string; timestamp: number } | null {
    try {
      const compressed = localStorage.getItem(SAVE_KEY);
      if (!compressed) return null;

      const saveData = JSON.parse(compressed) as SaveData;
      return {
        version: saveData.version,
        timestamp: saveData.timestamp,
      };
    } catch (error) {
      console.error('❌ Failed to get save info:', error);
      return null;
    }
  }

  /**
   * Export save as JSON file
   */
  public exportSave(): void {
    const compressed = localStorage.getItem(SAVE_KEY);
    if (!compressed) {
      alert('No save found to export!');
      return;
    }

    const blob = new Blob([compressed], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ludus_magnus_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ Save exported successfully');
  }

  /**
   * Import save from JSON file
   */
  public async importSave(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      
      // Validate JSON
      JSON.parse(text);
      
      // Save to localStorage
      localStorage.setItem(SAVE_KEY, text);
      console.log('✅ Save imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import save:', error);
      return false;
    }
  }
}

export const saveManager = SaveManager.getInstance();
