/**
 * Asset Generator for Wizards' Ascent
 * 
 * This script creates the basic pixel art assets required for the game:
 * - Player wizard sprites (idle, moving, casting)
 * - Basic enemy sprites (slime, skeleton, dark wizard)
 * - Spell effect visuals (fireball, ice spike, lightning)
 * - Arena background tileset (floor, wall, water)
 * - Basic sound effects (placeholder files)
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Save canvas as PNG
function saveCanvasToPNG(canvas, filePath) {
  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`✅ Saved: ${filePath}`);
      resolve();
    });
    out.on('error', reject);
  });
}

// Create placeholder audio file
function createPlaceholderAudio(filePath) {
  // Create a very simple WAV file header (44 bytes)
  const buffer = Buffer.alloc(44);
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36, 4); // Chunk size (36 bytes)
  buffer.write('WAVE', 8);
  // Format chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Format chunk size (16 bytes)
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // Mono channel
  buffer.writeUInt32LE(8000, 24); // Sample rate (8kHz)
  buffer.writeUInt32LE(8000, 28); // Byte rate (8000 bytes/sec)
  buffer.writeUInt16LE(1, 32); // Block align (1 byte)
  buffer.writeUInt16LE(8, 34); // Bits per sample (8 bits)
  // Data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(0, 40); // Data size (0 bytes)

  fs.writeFileSync(filePath, buffer);
  console.log(`✅ Saved placeholder audio: ${filePath}`);
}

// Base directories
const assetsDir = path.join(__dirname, '..', 'assets');
const spritesDir = path.join(assetsDir, 'sprites');
const playerSpritesDir = path.join(spritesDir, 'player');
const enemySpritesDir = path.join(spritesDir, 'enemies');
const effectsDir = path.join(assetsDir, 'effects');
const spellsDir = path.join(effectsDir, 'spells');
const backgroundsDir = path.join(assetsDir, 'backgrounds');
const tilesDir = path.join(backgroundsDir, 'tiles');
const audioDir = path.join(assetsDir, 'audio');
const sfxDir = path.join(audioDir, 'sfx');
const musicDir = path.join(audioDir, 'music');

// Ensure all directories exist
[
  playerSpritesDir, 
  enemySpritesDir, 
  spellsDir, 
  tilesDir, 
  sfxDir, 
  musicDir
].forEach(ensureDirectoryExists);

// Color palettes
const palette = {
  wizard: ['#4B0082', '#9370DB', '#E6E6FA', '#FFFFFF'],
  enemy: ['#8B0000', '#FF4500', '#FFFF00', '#000000'],
  spells: ['#FF4500', '#00BFFF', '#FFFF00', '#FFFFFF'],
  tiles: ['#8B4513', '#006400', '#1E90FF', '#F5F5DC']
};

// Create a 32x32 canvas for sprites
const spriteSize = 32;
const canvas = createCanvas(spriteSize, spriteSize);
const ctx = canvas.getContext('2d');

// === SPRITE DRAWING FUNCTIONS ===

// Generate wizard idle sprite
function drawWizardIdle(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Wizard hat
  ctx.fillStyle = palette.wizard[0];
  ctx.fillRect(10, 5, 12, 3);
  ctx.fillRect(12, 2, 8, 3);
  
  // Wizard face
  ctx.fillStyle = palette.wizard[2];
  ctx.fillRect(12, 8, 8, 8);
  
  // Eyes
  ctx.fillStyle = '#000000';
  ctx.fillRect(14, 10, 2, 2);
  ctx.fillRect(18, 10, 2, 2);
  
  // Mouth
  ctx.fillRect(15, 14, 4, 1);
  
  // Robe
  ctx.fillStyle = palette.wizard[1];
  ctx.fillRect(10, 16, 12, 12);
  
  // Arms
  ctx.fillRect(8, 18, 2, 6);
  ctx.fillRect(22, 18, 2, 6);
  
  // Staff
  ctx.fillStyle = palette.wizard[3];
  ctx.fillRect(24, 14, 2, 14);
  ctx.fillRect(22, 14, 6, 2);
}

// Generate wizard moving sprite
function drawWizardMoving(ctx) {
  drawWizardIdle(ctx);
  
  // Modify legs to show movement
  ctx.fillStyle = palette.wizard[1];
  ctx.clearRect(10, 26, 12, 4);
  ctx.fillRect(10, 26, 4, 4);
  ctx.fillRect(18, 26, 4, 4);
}

// Generate wizard casting sprite
function drawWizardCasting(ctx) {
  drawWizardIdle(ctx);
  
  // Raise arm for casting
  ctx.clearRect(22, 18, 2, 6);
  ctx.fillStyle = palette.wizard[1];
  ctx.fillRect(22, 12, 2, 6);
  
  // Add spell effect at staff tip
  ctx.fillStyle = palette.spells[2];
  ctx.fillRect(26, 10, 4, 4);
}

// Generate slime enemy
function drawSlimeEnemy(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Slime body
  ctx.fillStyle = '#00AA00';
  ctx.fillRect(8, 16, 16, 8);
  ctx.fillRect(6, 18, 20, 6);
  ctx.fillRect(4, 20, 24, 8);
  
  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(10, 18, 4, 4);
  ctx.fillRect(18, 18, 4, 4);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(11, 19, 2, 2);
  ctx.fillRect(19, 19, 2, 2);
}

// Generate skeleton enemy
function drawSkeletonEnemy(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Skeleton
  ctx.fillStyle = '#FFFFFF';
  
  // Skull
  ctx.fillRect(12, 6, 8, 8);
  
  // Eyes
  ctx.fillStyle = '#000000';
  ctx.fillRect(14, 8, 2, 2);
  ctx.fillRect(18, 8, 2, 2);
  
  // Bones
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(14, 14, 4, 14);  // spine
  ctx.fillRect(10, 16, 12, 2);  // ribs
  ctx.fillRect(10, 20, 12, 2);  // ribs
  
  // Arms and legs
  ctx.fillRect(8, 16, 2, 10);   // left arm
  ctx.fillRect(22, 16, 2, 10);  // right arm
  ctx.fillRect(12, 28, 2, 4);   // left leg
  ctx.fillRect(18, 28, 2, 4);   // right leg
}

// Generate dark wizard enemy
function drawDarkWizardEnemy(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Dark wizard hat
  ctx.fillStyle = '#4A0000';
  ctx.fillRect(10, 5, 12, 3);
  ctx.fillRect(12, 2, 8, 3);
  
  // Face (hooded/shadowed)
  ctx.fillStyle = '#000000';
  ctx.fillRect(12, 8, 8, 8);
  
  // Glowing eyes
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(14, 10, 2, 2);
  ctx.fillRect(18, 10, 2, 2);
  
  // Dark robe
  ctx.fillStyle = '#4A0000';
  ctx.fillRect(10, 16, 12, 12);
  
  // Arms
  ctx.fillRect(8, 18, 2, 6);
  ctx.fillRect(22, 18, 2, 6);
  
  // Staff
  ctx.fillStyle = '#000000';
  ctx.fillRect(24, 14, 2, 14);
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(22, 14, 6, 2);
}

// Generate fireball spell
function drawFireballSpell(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Fireball center
  ctx.fillStyle = '#FF4500';
  ctx.fillRect(12, 12, 8, 8);
  
  // Fireball outer flames
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(10, 10, 2, 12);  // left
  ctx.fillRect(20, 10, 2, 12);  // right
  ctx.fillRect(10, 10, 12, 2);  // top
  ctx.fillRect(10, 20, 12, 2);  // bottom
  
  // Flame particles
  ctx.fillRect(8, 8, 2, 2);
  ctx.fillRect(22, 8, 2, 2);
  ctx.fillRect(8, 22, 2, 2);
  ctx.fillRect(22, 22, 2, 2);
}

// Generate ice spike spell
function drawIceSpell(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Ice crystal
  ctx.fillStyle = '#A5F2F3';
  ctx.fillRect(14, 8, 4, 16);
  ctx.fillRect(10, 12, 12, 8);
  
  // Ice highlights
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(12, 14, 2, 4);
  ctx.fillRect(18, 14, 2, 4);
  ctx.fillRect(15, 10, 2, 12);
}

// Generate lightning spell
function drawLightningSpell(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Lightning bolt
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(14, 6, 4, 6);   // top
  ctx.fillRect(12, 12, 8, 4);   // middle
  ctx.fillRect(14, 16, 6, 4);   // middle-bottom
  ctx.fillRect(16, 20, 4, 6);   // bottom
  
  // Highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(15, 8, 2, 2);
  ctx.fillRect(14, 14, 2, 2);
  ctx.fillRect(16, 18, 2, 2);
}

// Generate floor tile
function drawFloorTile(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Base floor
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, spriteSize, spriteSize);
  
  // Floor pattern
  ctx.fillStyle = '#A0522D';
  
  for (let x = 0; x < spriteSize; x += 8) {
    for (let y = 0; y < spriteSize; y += 8) {
      if ((x + y) % 16 === 0) {
        ctx.fillRect(x, y, 4, 4);
        ctx.fillRect(x + 4, y + 4, 4, 4);
      }
    }
  }
}

// Generate wall tile
function drawWallTile(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Base wall
  ctx.fillStyle = '#696969';
  ctx.fillRect(0, 0, spriteSize, spriteSize);
  
  // Brick pattern
  ctx.fillStyle = '#808080';
  
  // First row
  ctx.fillRect(0, 0, 16, 8);
  ctx.fillRect(18, 0, 14, 8);
  
  // Second row
  ctx.fillRect(8, 10, 16, 8);
  
  // Third row
  ctx.fillRect(0, 20, 16, 8);
  ctx.fillRect(18, 20, 14, 8);
  
  // Cracks
  ctx.fillStyle = '#404040';
  ctx.fillRect(4, 4, 2, 4);
  ctx.fillRect(20, 14, 4, 2);
  ctx.fillRect(10, 24, 2, 4);
}

// Generate water tile
function drawWaterTile(ctx) {
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  
  // Base water
  ctx.fillStyle = '#1E90FF';
  ctx.fillRect(0, 0, spriteSize, spriteSize);
  
  // Water waves
  ctx.fillStyle = '#4169E1';
  
  // Wave pattern
  for (let x = 0; x < spriteSize; x += 8) {
    ctx.fillRect(x, 8, 4, 2);
    ctx.fillRect(x + 4, 16, 4, 2);
    ctx.fillRect(x, 24, 4, 2);
  }
  
  // Highlights
  ctx.fillStyle = '#87CEFA';
  ctx.fillRect(4, 4, 2, 2);
  ctx.fillRect(20, 12, 2, 2);
  ctx.fillRect(28, 20, 2, 2);
  ctx.fillRect(12, 28, 2, 2);
}

// === ASSET GENERATION ===

// Generate and save all sprites
async function generateAllAssets() {
  console.log("🎮 Generating assets for Wizards' Ascent...");
  
  // Player wizard sprites
  drawWizardIdle(ctx);
  await saveCanvasToPNG(canvas, path.join(playerSpritesDir, 'wizard_idle.png'));
  
  drawWizardMoving(ctx);
  await saveCanvasToPNG(canvas, path.join(playerSpritesDir, 'wizard_moving.png'));
  
  drawWizardCasting(ctx);
  await saveCanvasToPNG(canvas, path.join(playerSpritesDir, 'wizard_casting.png'));
  
  // Enemy sprites
  drawSlimeEnemy(ctx);
  await saveCanvasToPNG(canvas, path.join(enemySpritesDir, 'slime.png'));
  
  drawSkeletonEnemy(ctx);
  await saveCanvasToPNG(canvas, path.join(enemySpritesDir, 'skeleton.png'));
  
  drawDarkWizardEnemy(ctx);
  await saveCanvasToPNG(canvas, path.join(enemySpritesDir, 'dark_wizard.png'));
  
  // Spell effects
  drawFireballSpell(ctx);
  await saveCanvasToPNG(canvas, path.join(spellsDir, 'fireball.png'));
  
  drawIceSpell(ctx);
  await saveCanvasToPNG(canvas, path.join(spellsDir, 'ice_spike.png'));
  
  drawLightningSpell(ctx);
  await saveCanvasToPNG(canvas, path.join(spellsDir, 'lightning.png'));
  
  // Background tiles
  drawFloorTile(ctx);
  await saveCanvasToPNG(canvas, path.join(tilesDir, 'floor.png'));
  
  drawWallTile(ctx);
  await saveCanvasToPNG(canvas, path.join(tilesDir, 'wall.png'));
  
  drawWaterTile(ctx);
  await saveCanvasToPNG(canvas, path.join(tilesDir, 'water.png'));
  
  // Create a 2x2 tileset from the individual tiles
  const tilesetCanvas = createCanvas(64, 64);
  const tilesetCtx = tilesetCanvas.getContext('2d');
  
  drawFloorTile(ctx);
  tilesetCtx.drawImage(canvas, 0, 0);
  
  drawWallTile(ctx);
  tilesetCtx.drawImage(canvas, 32, 0);
  
  drawWaterTile(ctx);
  tilesetCtx.drawImage(canvas, 0, 32);
  
  // Empty tile for the bottom right
  ctx.clearRect(0, 0, spriteSize, spriteSize);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, spriteSize, spriteSize);
  tilesetCtx.drawImage(canvas, 32, 32);
  
  await saveCanvasToPNG(tilesetCanvas, path.join(backgroundsDir, 'arena_tileset.png'));
  
  // Create placeholder sound files
  const soundFiles = [
    path.join(sfxDir, 'spell_cast.wav'),
    path.join(sfxDir, 'hit.wav'),
    path.join(sfxDir, 'defeat.wav'),
    path.join(musicDir, 'background_music.wav')
  ];
  
  soundFiles.forEach(createPlaceholderAudio);
  
  console.log("✅ All assets have been generated successfully!");
}

// Run the asset generation
generateAllAssets().catch(console.error);
