# Implementation Plan for Wizards' Ascent (Base Game)

This plan outlines 16 steps to create a playable version of **Wizards' Ascent**, where players climb an Elo ladder by defeating AI enemies and other players in arenas. Each step includes a clear task and a test to validate its implementation. **Note: These steps should be completed strictly in sequence.**

---

## Step 1: Set Up Development Environment
- **Task**: Prepare the tools and project structure.
  - Install Node.js, MongoDB, Git, and a code editor (e.g., VSCode).
  - Create a project directory and initialize a Git repository with `git init`.
  - Set up the following structure:
    - `/client`: Frontend code (PixiJS).
    - `/server`: Backend code (Node.js, Express, Socket.io).
    - `/shared`: Shared resources or types.
    - `/assets`: Game assets (sprites, backgrounds, audio).
  - Install dependencies:
    - In `/client`: Run `npm install pixi.js`.
    - In `/server`: Run `npm install express socket.io mongoose`.
- **Test**:
  - Verify the directory structure matches the above layout.
  - Run `git status` to confirm the repository is initialized.
  - Run `npm list` in `/client` and `/server` to ensure dependencies are installed.

---

## Step 2: Asset Preparation
- **Task**: Create or acquire basic game assets.
  - Set up the following asset structure in `/assets`:
    - `/sprites`: Character and enemy sprites.
    - `/backgrounds`: Arena background images.
    - `/audio`: Sound effects and background music.
    - `/effects`: Visual effects for spells and interactions.
  - Create or acquire minimally viable assets:
    - Player wizard sprite (idle, moving, casting).
    - Basic enemy sprites.
    - Simple spell effect visuals.
    - Arena background tileset.
    - Basic sound effects (spell casting, hit, defeat).
  - Optimize assets for web performance (appropriate sizes and formats).
- **Test**:
  - Verify all required assets are present and properly organized.
  - Ensure sprites and images load correctly.

---

## Step 3: Implement Basic Frontend with PixiJS
- **Task**: Create a simple game scene with a player character.
  - In `/client`, initialize a PixiJS application with a canvas (e.g., 800x600 pixels).
  - Add a player sprite (wizard character created in Step 2) to the scene.
  - Implement WASD movement:
    - W: move up, A: move left, S: move down, D: move right.
    - Limit movement to stay within the canvas bounds.
  - Design for desktop platforms only (not mobile-compatible).
- **Test**:
  - Open the game in a browser (e.g., via a local server like `live-server`).
  - Use WASD keys to move the player.
  - Confirm the sprite moves smoothly and stays within the canvas edges.

---

## Step 4: Add Basic Spellcasting
- **Task**: Enable a primary spell with the left mouse button.
  - Implement a spell (e.g., a projectile) that fires toward the mouse cursor on left-click.
  - Visualize it using the spell effect assets created in Step 2.
  - Remove the spell after it travels a set distance (e.g., 500 pixels).
- **Test**:
  - Left-click in the game.
  - Verify a projectile appears, moves toward the cursor, and disappears after reaching its range.

---

## Step 5: Set Up Backend Server with Node.js and Express
- **Task**: Create a basic server with authentication routes.
  - In `/server`, set up an Express app in a file (e.g., `server.js`).
  - Add routes:
    - `POST /register`: Accept a username and password, store in memory (temporary).
    - `POST /login`: Validate credentials and return a success message.
  - Start the server on a port (e.g., 3000).
- **Test**:
  - Run `node server.js` and ensure the server starts without errors.
  - Use Postman to send a `POST` request to `http://localhost:3000/register` with a username and password.
  - Send a `POST` to `/login` with the same credentials and confirm a success response.

---

## Step 6: Integrate Socket.io for Real-time Communication
- **Task**: Enable real-time player movement updates.
  - In `/server`, add Socket.io to the Express server.
  - In `/client`, connect to the Socket.io server.
  - When a player moves (WASD), emit a "playerMove" event with their new position.
  - On the server, broadcast this to all connected clients.
  - In `/client`, render other players' positions when receiving the event.
- **Test**:
  - Open two browser windows with the game.
  - Move the player in one window and confirm the other window shows the updated position in real-time.

---

## Step 7: Implement Player Data Storage with MongoDB
- **Task**: Store player data persistently.
  - Set up a MongoDB database (local or cloud-based).
  - Define a Mongoose schema in `/server`:
    - `username`: String
    - `password`: String (plain text for now, to be hashed later)
    - `elo`: Number (default 0)
  - Update `/register` and `/login` routes to use MongoDB instead of memory.
- **Test**:
  - Register a player via `/register`.
  - Check the MongoDB database (e.g., via MongoDB Compass) to confirm the player is saved.
  - Log in with the same credentials and verify a successful response.

---

## Step 8: Create Basic Arena System
- **Task**: Assign players to arenas based on Elo.
  - Define Elo brackets (e.g., 0-999, 1000-1999).
  - In `/server`, create a function to determine a player's arena from their Elo.
  - Use Socket.io rooms to group players by arena (e.g., room name = "arena_0-999").
- **Test**:
  - Register two players with Elo 500 and 1500.
  - Connect both to the server and confirm they join different rooms (e.g., check server logs).

---

## Step 9: Add AI Enemies
- **Task**: Introduce AI enemies to arenas.
  - In `/server`, spawn an AI enemy in each arena every 10 seconds (e.g., with random position).
  - Give enemies simple movement (e.g., random wandering).
  - Broadcast enemy positions to clients in the same arena.
  - In `/client`, render enemies as sprites using the assets from Step 2 and update their positions.
- **Test**:
  - Join an arena as a player.
  - Confirm enemies appear and move around, visible only in your arena.

---

## Step 10: Implement Basic Combat Mechanics
- **Task**: Allow players to attack AI enemies.
  - In `/client`, emit a "spellCast" event on left-click with spell position and direction.
  - In `/server`, check for collisions between spells and enemies (e.g., simple distance check).
  - Reduce enemy health on hit; remove it at zero health and award +10 Elo to the player.
  - Broadcast updates to clients.
- **Test**:
  - Cast a spell at an enemy.
  - Verify the enemy disappears when health reaches zero and your Elo increases by 10.

---

## Step 11: Implement Elo System
- **Task**: Update Elo based on combat outcomes.
  - In `/server`, award +10 Elo for defeating an AI enemy.
  - For PvP (later), adjust Elo based on a simple formula (e.g., winner gains 20, loser loses 20).
  - Save updated Elo to MongoDB.
- **Test**:
  - Defeat an AI enemy and check your Elo in the database increases by 10.
  - Ensure the update persists after refreshing the client.

---

## Step 12: Add Item Drops
- **Task**: Generate items when enemies are defeated.
  - In `/server`, spawn an item (e.g., "health potion") at an enemy's position on defeat.
  - Broadcast the item's position to clients in the arena.
  - In `/client`, render the item using appropriate assets; apply a buff (e.g., +50 health) when a player moves over it.
- **Test**:
  - Defeat an enemy and confirm an item appears.
  - Move over the item and verify your health increases.

---

## Step 13: Implement PvP Combat
- **Task**: Enable players to fight each other.
  - In `/server`, check spell collisions with other players in the same arena.
  - Reduce health on hit; at zero health:
    - Decrease loser's Elo by 20, increase winner's by 20.
    - Drop an item at the loser's position.
    - Respawn the loser after 5 seconds.
  - Broadcast updates to clients.
- **Test**:
  - Have two players fight; confirm health decreases.
  - When one is defeated, check Elo updates, item drop, and respawn.

---

## Step 14: Set Up Matchmaking
- **Task**: Assign players to arenas on login.
  - In `/server`, on login, place players in an arena based on their Elo (e.g., room "arena_0-999").
  - Limit interactions to players in the same room.
- **Test**:
  - Log in two players with Elo 500 and 1500.
  - Confirm they join different arenas and can't see each other's actions.

---

## Step 15: Optimize Performance
- **Task**: Ensure smooth gameplay.
  - In `/client`, use PixiJS sprite batching for enemies and items.
  - In `/server`, send only position changes (delta updates) via Socket.io.
  - Test with 10 players and 20 enemies.
- **Test**:
  - Run the game with multiple clients; ensure frame rate stays above 30 FPS and no lag occurs.

---

## Step 16: Deploy to Heroku
- **Task**: Deploy the game online.
  - Create a Heroku app and link it to your Git repository.
  - Set environment variables (e.g., MongoDB URI) in Heroku's dashboard.
  - Push the code with `git push heroku master`.
- **Test**:
  - Visit the Heroku URL, log in, and play the game.
  - Confirm all features (movement, combat, multiplayer) work as expected.