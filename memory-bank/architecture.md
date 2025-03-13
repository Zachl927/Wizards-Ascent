# Wizards' Ascent Architecture Documentation

This document outlines the architectural structure of the Wizards' Ascent game, providing insights into each file's purpose and how the components interact within our modular design.

## Project Structure Overview

The project follows a client-server architecture with a clear separation of concerns:

```
/Wizards Ascent
├── /client           # Frontend PixiJS code
├── /server           # Backend Node.js, Express, Socket.io code
├── /shared           # Shared resources between client and server
├── /assets           # Game assets (sprites, backgrounds, audio, effects)
└── /tools            # Utility scripts for development
```

## Component Details

### Client-Side Architecture

- **`/client/index.html`**: 
  - Entry point for the web application
  - Sets up the HTML structure and imports necessary scripts
  - Creates a container for the PixiJS canvas with proper styling
  - Uses module-based ES6 imports for improved code organization

- **`/client/index.js`**: 
  - Implements a modular, object-oriented game architecture
  - Follows the single responsibility principle with specialized classes:
    - **`AssetLoader`**: Handles loading and fallback for game assets
    - **`InputHandler`**: Manages keyboard input for player movement
    - **`Player`**: Manages player state, movement, and rendering
    - **`Game`**: Coordinates initialization, game loop, and component interactions
    - **`Spell`**: Manages spell projectile dynamics
  - Uses canvas-based rendering for efficient 2D graphics
  - Implements requestAnimationFrame for smooth animation
  - Includes performance optimization with normalized movement and boundary detection
  - Uses absolute URL paths (`/assets/...`) for reliable asset referencing in browser context

### Server-Side Architecture

- **`/server/server.js`**: 
  - Core server file that initializes Express application
  - Sets up HTTP server and integrates Socket.io for real-time communication
  - Configures CORS to allow connections from all origins (development setting)
  - Implements static file serving for both client files and assets:
    - Serves client files from the project root
    - Serves assets from the `/assets` URL path
  - Configures optimized routing for the main game entry point
  - Includes enhanced logging for better debugging and monitoring
  - Will grow to include player authentication, game state management, and arena matchmaking

### Asset Management Architecture

- **`/assets`**: Main directory for all game assets, structured for optimal organization:

  - **`/assets/sprites`**: Character and object sprites:
    - **`/player`**: Player wizard sprites in different states (idle, moving, casting)
    - **`/enemies`**: Various enemy sprites (slime, skeleton, dark wizard)
    - **`/spells`**: Spell effect sprites

  - **`/assets/backgrounds`**: Environmental visuals:
    - **`/tiles`**: Individual tileset components (floor, wall, water)
    - **`arena_tileset.png`**: Combined tileset for efficient rendering

  - **`/assets/effects`**: Visual effects for game interactions:
    - **`/spells`**: Spell effects (fireball, ice spike, lightning)

  - **`/assets/audio`**: Sound files:
    - **`/sfx`**: Sound effects for game actions (spell casting, hit, defeat)
    - **`/music`**: Background music tracks

- **Asset Loading Strategy**:
  - Assets are referenced using absolute URL paths (`/assets/...`) for reliable browser loading
  - Server is configured to serve assets from the correct location regardless of client directory structure
  - Fallback mechanisms are implemented for graceful handling of missing assets
  - Asset loading is managed asynchronously to prevent blocking the main thread

### Utility Tools

- **`/tools/generate-assets.js`**: 
  - Node.js script that generates pixel art assets programmatically
  - Creates consistent 8-bit style sprites, effects, and tiles
  - Optimizes assets for web performance

- **`/tools/sprite_generator.html`**: 
  - Browser-based tool for visualizing and exporting game sprites
  - Provides an interactive interface for asset creation

## Modular Game Architecture

### Class Responsibilities

1. **`AssetLoader` Class**: 
   - Manages the loading of game assets (sprites, images, audio)
   - Provides fallback mechanisms when assets fail to load
   - Creates and manages temporary sprites for failed asset loads
   - Implements a promise-based loading system for asynchronous operation

2. **`InputHandler` Class**:
   - Captures and processes keyboard inputs (WASD keys)
   - Manages the active state of game controls
   - Provides normalized directional vectors for player movement
   - Prevents default browser behavior for game control keys
   - **Mouse Position Tracking**: Captures mouse coordinates relative to canvas
   - **Mouse Click Detection**: Monitors left mouse button for spellcasting

3. **`Player` Class**:
   - Represents the player character in the game
   - Maintains player state (position, movement speed, visual state)
   - Updates position based on input and applies boundary constraints
   - Handles sprite rendering based on current player state (idle/moving)
   - Manages sprite scaling and positioning for visual consistency
   - **Spellcasting**: Handling player spell casting mechanics with cooldowns
   - **State Priority System**: Managing visual states with clear priorities (casting > moving > idle)

4. **`Game` Class**:
   - Serves as the central game coordinator
   - Initializes the game canvas, assets, and components
   - Manages the game loop using requestAnimationFrame
   - Coordinates updates and rendering of all game objects
   - Provides debugging and error handling mechanisms
   - Displays user interface elements and instructions
   - **Spell Management**: Creating, tracking, and removing spell projectiles

5. **`Spell` Class**:
   - Manages spell projectile dynamics
   - Trajectory calculation toward mouse target
   - Velocity and distance management
   - Rotation alignment with travel direction
   - Visual rendering with proper orientation
   - Lifecycle management (creation to disposal)
   - Performance optimizations for multiple concurrent spells

### Communication Flow

The components interact with the following communication flow:

1. **Initialization Flow**:
   ```
   Game (constructor) → Asset Loading → Player Initialization → Game Loop Start
   ```

2. **Game Loop Flow**:
   ```
   requestAnimationFrame → Game.update() → Player.update() → InputHandler (get input)
                              ↓
                        Game.draw() → Player.draw() → Canvas Rendering
   ```

3. **Input Processing Flow**:
   ```
   Keyboard Event → InputHandler → Game → Player Movement
   ```

4. **Spellcasting Flow**:
   ```
   User presses left mouse button
   InputHandler detects click and captures mouse coordinates
   Player receives click event during update cycle
   Player enters casting state and requests spell creation
   Game creates new Spell instance with:
     - Starting position (player's location)
     - Target position (mouse coordinates)
     - Appropriate sprite from AssetLoader
   Spell calculates trajectory, rotation, and movement
   During game loop, Spell updates position until reaching maximum distance
   Game removes inactive spells to maintain performance
   ```

## Design Principles

1. **Modular Architecture**: Each component has a single responsibility, housed in its own class with clear interfaces.

2. **Separation of Concerns**: 
   - Input handling is separated from game logic
   - Rendering is separated from state management
   - Asset loading is separated from game mechanics
   - Server-side and client-side code have distinct responsibilities

3. **Defensive Programming**:
   - Robust error handling for asset loading
   - Fallback mechanisms for missing assets
   - Boundary detection to prevent out-of-bounds movement
   - Graceful error recovery for better user experience

4. **Performance Optimization**:
   - Efficient rendering using canvas
   - Normalized movement vectors for consistent speed
   - Minimal redraws by tracking state changes
   - Optimized asset loading with proper URL paths

5. **Asset Management**:
   - Assets are organized in a logical directory structure for easy access
   - Sprite sheets and tilesets optimize rendering performance
   - Server is configured to serve static assets efficiently
   - Absolute URL paths ensure reliable asset loading in browser context
   - Tools for asset generation ensure consistent style and quality
   - Pixel art assets are designed with an 8-bit retro aesthetic

## Future Architectural Expansion

The current foundation will expand to include:
- User authentication and account management
- Game state synchronization
- Arena-based matchmaking using Socket.io rooms
- AI enemy implementation
- Combat mechanics
- Elo rating system
- Persistent data storage with MongoDB