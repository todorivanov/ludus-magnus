/**
 * Generates minimal silent MP3 placeholder files for all game audio.
 * Replace these with real audio assets for production use.
 * 
 * A minimal valid MP3 frame: MPEG1, Layer 3, 128kbps, 44100Hz, stereo
 * This is a single valid silent frame that any MP3 decoder can play.
 */
const fs = require('fs');
const path = require('path');

// Minimal valid MP3 file: ID3 header + one silent MPEG frame + padding
// This produces a ~0.02s silent MP3 that loads and plays without errors
const SILENT_MP3 = Buffer.from([
  // ID3v2 header (10 bytes)
  0x49, 0x44, 0x33, // "ID3"
  0x03, 0x00,       // Version 2.3
  0x00,             // Flags
  0x00, 0x00, 0x00, 0x00, // Size (0)
  // MPEG Audio Frame Header (4 bytes) - MPEG1, Layer 3, 128kbps, 44100Hz, stereo
  0xFF, 0xFB, 0x90, 0x00,
  // Frame data (padding to minimum frame size ~417 bytes for 128kbps/44100Hz)
  ...new Array(413).fill(0x00),
]);

const sfxFiles = [
  'click', 'attack', 'heavy-attack', 'block', 'dodge', 'miss',
  'critical', 'special', 'victory', 'defeat', 'death',
  'gold-gain', 'gold-spend', 'purchase', 'error',
  'level-up', 'milestone', 'quest-complete',
  'build', 'upgrade', 'month-advance', 'event',
  'crowd-cheer', 'crowd-boo',
  'notification', 'warning', 'freedom', 'sold', 'taunt',
];

const musicFiles = [
  'title', 'dashboard', 'combat', 'arena', 'marketplace', 'gladiator-cell',
];

const publicDir = path.join(__dirname, '..', 'public', 'audio');

// Create SFX placeholders
sfxFiles.forEach(name => {
  const filePath = path.join(publicDir, 'sfx', `${name}.mp3`);
  fs.writeFileSync(filePath, SILENT_MP3);
});

// Create Music placeholders  
musicFiles.forEach(name => {
  const filePath = path.join(publicDir, 'music', `${name}.mp3`);
  fs.writeFileSync(filePath, SILENT_MP3);
});

console.log(`Generated ${sfxFiles.length} SFX and ${musicFiles.length} music placeholder files.`);
console.log('Replace these with real audio assets for production use.');
