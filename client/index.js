// Wizards Ascent - Client
// Main entry point for the game

// Game modules
class AssetLoader {
    constructor() {
        this.sprites = {};
        this.loaded = false;
    }

    async load() {
        try {
            // Create a fallback sprite if any assets fail to load
            const fallbackSprite = this.createFallbackSprite();
            
            this.sprites.player = {
                idle: await this.loadImage('/assets/sprites/player/wizard_idle.png', fallbackSprite),
                moving: await this.loadImage('/assets/sprites/player/wizard_moving.png', fallbackSprite),
                casting: await this.loadImage('/assets/sprites/player/wizard_casting.png', fallbackSprite)
            };
            
            // Load spell effect sprites
            this.sprites.spells = {
                fireball: await this.loadImage('/assets/effects/spells/fireball.png', fallbackSprite)
            };
            
            this.loaded = true;
            console.log('Assets loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading assets:', error);
            return false;
        }
    }

    createFallbackSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Draw a purple square as fallback
        ctx.fillStyle = '#9966FF';
        ctx.fillRect(0, 0, 32, 32);
        
        // Add an outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 28, 28);
        
        return canvas;
    }

    async loadImage(src, fallback) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}, using fallback`);
                resolve(fallback);
            };
            img.src = src;
        });
    }
}

class InputHandler {
    constructor(canvas) {
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        this.mouse = {
            x: 0,
            y: 0,
            clicked: false
        };
        this.canvas = canvas;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add keyboard event listeners
        window.addEventListener('keydown', (e) => this.handleKeyEvent(e, true));
        window.addEventListener('keyup', (e) => this.handleKeyEvent(e, false));
        
        // Add mouse event listeners
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    }

    handleKeyEvent(e, isDown) {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            this.keys[key] = isDown;
            e.preventDefault();
        }
    }
    
    handleMouseMove(e) {
        // Get mouse position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    handleMouseDown(e) {
        if (e.button === 0) { // Left mouse button
            this.mouse.clicked = true;
        }
    }
    
    handleMouseUp(e) {
        if (e.button === 0) { // Left mouse button
            this.mouse.clicked = false;
        }
    }
    
    handleMouseLeave() {
        this.mouse.clicked = false;
    }

    isMoving() {
        return this.keys.w || this.keys.a || this.keys.s || this.keys.d;
    }

    getDirection() {
        let dx = 0;
        let dy = 0;
        
        if (this.keys.w) dy -= 1;
        if (this.keys.s) dy += 1;
        if (this.keys.a) dx -= 1;
        if (this.keys.d) dx += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }
        
        return { dx, dy };
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    isMouseClicked() {
        const wasClicked = this.mouse.clicked;
        this.mouse.clicked = false; // Reset after reading to prevent multiple spells per click
        return wasClicked;
    }
}

class Spell {
    constructor(x, y, targetX, targetY, sprite) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        
        // Calculate direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction
        this.directionX = dx / distance;
        this.directionY = dy / distance;
        
        this.speed = 5;
        this.maxDistance = 500; // Maximum travel distance
        this.distanceTraveled = 0;
        this.active = true;
        
        // Visual properties
        this.sprite = sprite;
        this.width = sprite ? sprite.width : 16;
        this.height = sprite ? sprite.height : 16;
        this.scale = 1.5;
        
        // Calculate rotation angle (in radians) based on direction
        this.rotation = Math.atan2(dy, dx);
    }
    
    update() {
        if (!this.active) return;
        
        // Move the spell
        const moveX = this.directionX * this.speed;
        const moveY = this.directionY * this.speed;
        
        this.x += moveX;
        this.y += moveY;
        
        // Calculate distance traveled
        this.distanceTraveled += Math.sqrt(moveX * moveX + moveY * moveY);
        
        // Deactivate if maximum distance reached
        if (this.distanceTraveled >= this.maxDistance) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active || !this.sprite) return;
        
        // Save current context state
        ctx.save();
        
        // Translate to the spell's position
        ctx.translate(this.x, this.y);
        
        // Rotate to spell's direction
        ctx.rotate(this.rotation);
        
        // Draw the sprite with rotation applied
        ctx.drawImage(
            this.sprite,
            -this.width * this.scale / 2,
            -this.height * this.scale / 2,
            this.width * this.scale,
            this.height * this.scale
        );
        
        // Restore context state
        ctx.restore();
    }
    
    isActive() {
        return this.active;
    }
}

class Player {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.state = 'idle'; // 'idle', 'moving', 'casting'
        this.sprites = {};
        this.width = 32;
        this.height = 32;
        this.scale = 2;
        this.castingCooldown = 0;
        this.castingCooldownMax = 500; // ms between spell casts
        this.isCasting = false;
    }

    init(playerSprites) {
        this.sprites = playerSprites;
        
        // Set actual width and height based on sprite dimensions
        if (this.sprites.idle) {
            this.width = this.sprites.idle.width * this.scale;
            this.height = this.sprites.idle.height * this.scale;
        }
    }

    update(input, deltaTime) {
        // Update cooldown timer
        if (this.castingCooldown > 0) {
            this.castingCooldown -= deltaTime;
        }
        
        // Handle movement
        const isMoving = input.isMoving();
        
        if (isMoving) {
            // Get movement direction
            const { dx, dy } = input.getDirection();
            
            // Calculate new position
            let newX = this.x + dx * this.speed;
            let newY = this.y + dy * this.speed;
            
            // Apply boundary constraints
            const halfWidth = this.width / 2;
            const halfHeight = this.height / 2;
            
            newX = Math.max(halfWidth, Math.min(this.game.width - halfWidth, newX));
            newY = Math.max(halfHeight, Math.min(this.game.height - halfHeight, newY));
            
            // Update position
            this.x = newX;
            this.y = newY;
        }
        
        // Check for spellcasting
        const { x: mouseX, y: mouseY } = input.getMousePosition();
        if (input.isMouseClicked() && this.castingCooldown <= 0) {
            // Set casting flag
            this.isCasting = true;
            this.castingCooldown = this.castingCooldownMax;
            
            // Create a new spell
            this.game.createSpell(this.x, this.y, mouseX, mouseY);
            
            // Log spell cast
            console.log(`Spell cast from (${this.x}, ${this.y}) toward (${mouseX}, ${mouseY})`);
        }
        
        // Reset casting flag after a short duration
        if (this.isCasting && this.castingCooldown <= this.castingCooldownMax / 2) {
            this.isCasting = false;
        }
        
        // Update visual state (prioritize casting animation over movement)
        if (this.isCasting) {
            this.state = 'casting';
        } else if (isMoving) {
            this.state = 'moving';
        } else {
            this.state = 'idle';
        }
    }

    draw(ctx) {
        const sprite = this.sprites[this.state];
        if (sprite) {
            // Draw the sprite scaled up
            ctx.drawImage(
                sprite,
                this.x - (sprite.width * this.scale) / 2,
                this.y - (sprite.height * this.scale) / 2,
                sprite.width * this.scale,
                sprite.height * this.scale
            );
            
            // Debug: Draw the movement boundary
            if (this.game.debug) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.strokeRect(
                    this.x - this.width / 2,
                    this.y - this.height / 2,
                    this.width,
                    this.height
                );
            }
        }
    }
}

class Game {
    constructor(canvasId) {
        // Create and setup canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.getElementById(canvasId).appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Initialize game components
        this.assetLoader = new AssetLoader();
        this.input = new InputHandler(this.canvas);
        this.player = new Player(this, this.width / 2, this.height / 2);
        
        // Game state variables
        this.lastTime = 0;
        this.gameObjects = [];
        this.spells = [];
        this.isLoading = true;
        this.debug = false; // Set to true to view collision boundaries
        
        // Start the game initialization
        this.init();
    }

    async init() {
        // Display loading message
        this.showLoadingMessage();
        
        try {
            // Load assets
            await this.assetLoader.load();
            
            // Initialize player with sprites
            this.player.init(this.assetLoader.sprites.player);
            
            // Add player to game objects
            this.gameObjects.push(this.player);
            
            // Start game loop
            this.isLoading = false;
            this.startGameLoop();
            console.log('Game initialized and started');
        } catch (error) {
            console.error('Game initialization failed:', error);
            this.showErrorMessage('Failed to initialize game. Check console for details.');
        }
    }

    showLoadingMessage() {
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading Wizards Ascent...', this.width / 2, this.height / 2);
    }
    
    showErrorMessage(message) {
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#FF5555';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.width / 2, this.height / 2);
        this.ctx.fillStyle = '#AAAAAA';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Check browser console for details', this.width / 2, this.height / 2 + 30);
    }
    
    createSpell(startX, startY, targetX, targetY) {
        const spellSprite = this.assetLoader.sprites.spells.fireball;
        const newSpell = new Spell(startX, startY, targetX, targetY, spellSprite);
        this.spells.push(newSpell);
        return newSpell;
    }

    update(deltaTime) {
        if (this.isLoading) return;
        
        // Update all game objects
        this.gameObjects.forEach(object => {
            if (object.update) {
                object.update(this.input, deltaTime);
            }
        });
        
        // Update all active spells
        this.spells.forEach(spell => spell.update());
        
        // Remove inactive spells
        this.spells = this.spells.filter(spell => spell.isActive());
    }

    draw() {
        if (this.isLoading) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw all game objects
        this.gameObjects.forEach(object => {
            if (object.draw) {
                object.draw(this.ctx);
            }
        });
        
        // Draw all active spells
        this.spells.forEach(spell => spell.draw(this.ctx));
        
        // Draw instructions
        this.drawInstructions();
    }
    
    drawInstructions() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Use W, A, S, D keys to move the wizard', 20, 30);
        this.ctx.fillText('Left-click to cast a spell', 20, 50);
    }

    startGameLoop() {
        const gameLoop = (timestamp) => {
            // Calculate delta time
            const deltaTime = timestamp - this.lastTime;
            this.lastTime = timestamp;
            
            // Update and draw
            this.update(deltaTime);
            this.draw();
            
            // Request next frame
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('game-container');
});
