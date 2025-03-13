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
  - Designed to be responsive and maintain game aspect ratio

- **`/client/index.js`**: 
  - Initializes the PixiJS application with 800x600 resolution
  - Sets up the game canvas and adds it to the DOM
  - Will be the foundation for rendering game elements, handling user input, and integrating Socket.io for multiplayer functionality
  - Currently displays a loading message, which will later be replaced with game rendering

### Server-Side Architecture

- **`/server/server.js`**: 
  - Core server file that initializes Express application
  - Sets up HTTP server and integrates Socket.io for real-time communication
  - Configures CORS to allow connections from all origins (development setting)
  - Includes basic Socket.io connection handling
  - Will grow to include player authentication, game state management, and arena matchmaking

### Asset Management Architecture

- **`/assets`**: Main directory for all game assets, structured for optimal organization:

  - **`/assets/sprites`**: Character and object sprites:
    - **`/player`**: Player wizard sprites in different states (idle, moving, casting)
    - **`/enemies`**: Various enemy sprites (slime, skeleton, dark wizard)

  - **`/assets/backgrounds`**: Environmental visuals:
    - **`/tiles`**: Individual tileset components (floor, wall, water)
    - **`arena_tileset.png`**: Combined tileset for efficient rendering

  - **`/assets/effects`**: Visual effects for game interactions:
    - **`/spells`**: Spell effects (fireball, ice spike, lightning)

  - **`/assets/audio`**: Sound files:
    - **`/sfx`**: Sound effects for game actions (spell casting, hit, defeat)
    - **`/music`**: Background music tracks

### Utility Tools

- **`/tools/generate-assets.js`**: 
  - Node.js script that generates pixel art assets programmatically
  - Creates consistent 8-bit style sprites, effects, and tiles
  - Optimizes assets for web performance

- **`/tools/sprite_generator.html`**: 
  - Browser-based tool for visualizing and exporting game sprites
  - Provides an interactive interface for asset creation

## Design Principles

1. **Modular Architecture**: Each component has a single responsibility, housed in its own file/directory.

2. **Separation of Concerns**: 
   - Client code focuses solely on rendering and user input
   - Server code handles game logic, state management, and networking
   - Shared resources provide common functionality

3. **Real-time Communication**: 
   - Socket.io enables low-latency communication between client and server
   - Will be used for player movements, spellcasting, and game state updates

4. **Scalability Considerations**:
   - Structure supports future expansion of features
   - MongoDB integration (coming in Step 7) will provide persistent storage
   - Socket.io rooms (coming in Step 8) will manage player arenas

5. **Asset Management**:
   - Assets are organized in a logical directory structure for easy access
   - Sprite sheets and tilesets optimize rendering performance
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