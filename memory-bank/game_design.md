# Game Design Document: Wizards' Ascent

## 1. Game Overview

**Wizards' Ascent** is a multiplayer endless PvE game with PvP elements, set in a retro 8-bit world themed around wizards and magic. Players aim to climb an Elo ladder by defeating AI-controlled enemies and other players within arenas sorted by Elo level. The game features top-down gameplay, using WASD keys for movement and the mouse for attack controls. Defeated players drop items that provide buffs, with higher Elo-ranked opponents dropping better items. Matchmaking is Elo-based to ensure fair competition, and the endless nature of the game encourages continuous progression up the ladder.

## 2. Core Mechanics

### 2.1 Controls

- **Movement:** WASD keys move the player character in four directions.
- **Attacks:** Mouse controls spellcasting:
  - *Left-click:* Primary spell (e.g., a basic magical projectile).
  - *Right-click:* Secondary spell (e.g., a stronger or area-effect spell).
- Additional abilities may be mapped to keys like Q or E for variety.

### 2.2 Combat

- Players, as wizards, cast spells to defeat enemies and other players.
- Spells vary in effects (e.g., direct damage, area of effect, or status debuffs).
- Combat includes:
  - **PvE:** Fighting AI enemies to gain Elo and items.
  - **PvP:** Attacking other players for greater Elo gains and item drops.

### 2.3 Elo System

- Players begin with an Elo rating of 0.
- **Elo Gains:**
  - Defeating AI enemies provides a small Elo increase.
  - Defeating other players grants a larger Elo boost, scaled by the opponent’s rating.
- **Elo Loss:** Being defeated by another player reduces the loser’s Elo.
- Elo determines the player’s current arena and matchmaking pool.

## 3. Game World

### 3.1 Arenas

- The game is structured into arenas, each tied to a specific Elo bracket:
  - *Example Brackets:*
    - Arena 1: Elo 0–999
    - Arena 2: Elo 1000–1999
    - Arena 3: Elo 2000–2999
    - And so on, extending infinitely.
- Players can only enter arenas matching their current Elo bracket.
- Higher arenas feature tougher AI enemies and stronger players.

### 3.2 AI Enemies

- Enemies range from basic minions to powerful bosses.
- Difficulty scales with the arena’s Elo level.
- Defeating AI enemies grants Elo and has a chance to drop items.

### 3.3 Items

- **Function:** Items provide buffs (e.g., increased spell damage, health, or unique effects).
- **Sources:** Dropped by defeated AI enemies and players.
- **Quality:** The higher the Elo of the defeated entity, the better the dropped items.
- Items are generated upon defeat, not taken from the player’s inventory, to avoid excessive punishment.

## 4. Player Interaction

### 4.1 PvE Gameplay

- The primary focus is defeating AI enemies in arenas to gain Elo and items.
- Players may informally cooperate against AI but compete for rewards.

### 4.2 PvP Gameplay

- Players can attack each other freely within arenas.
- **Rewards:**
  - Defeating a player increases the victor’s Elo.
  - The defeated player drops items, generated based on their Elo level, for the victor to collect.
- **Consequences:** Defeated players lose Elo, retain their own items, and respawn after a short delay.

### 4.3 Matchmaking

- Matchmaking assigns players to arenas based on their Elo, ensuring fair matchups with opponents of similar skill.

## 5. Art and Audio

- **Visual Style:** Retro 8-bit pixel art, featuring wizards, magical effects, and arena environments.
- **Audio:** Chiptune music for background tracks, paired with simple sound effects for spells, hits, and item pickups.

## 6. Technical Requirements

- **Platform:** PC (Windows, Mac, Linux).
- **Multiplayer:** Server-based system to manage matchmaking and arena instances.
- **Graphics:** 2D top-down perspective with pixel art assets.

## 7. Character Progression

- **Item-Based:** Players enhance their wizard’s power by collecting and equipping items dropped from enemies and players.
- **Endless Climb:** No level cap exists; progression is driven by climbing the Elo ladder and acquiring superior items.
- Higher Elo arenas offer greater challenges and better rewards, sustaining long-term engagement.