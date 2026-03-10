# Scenes & Navigation

## Overview

Stratideck uses a scene-based navigation system. Each screen is a Phaser Scene, and navigation between scenes is handled via `scene.start()`.

## Scenes

| Scene            | Key              | Description                                                           |
|------------------|------------------|-----------------------------------------------------------------------|
| **Title Screen** | `TitleScene`     | Entry point — displays title + "Press any button", then the main menu |
| **Base Camp**    | `BaseCampScene`  | Home base between battles                                             |
| **Map**          | `MapScene`       | Battle selection map                                                  |
| **Battle**       | `BattleScene`    | Main combat scene                                                     |
| **End Battle**   | `EndBattleScene` | Battle result (victory or defeat)                                     |
| **Deck**         | `DeckScene`      | Card collection viewer (unlocked/locked cards)                        |
| **Options**      | `OptionsScene`   | Game settings                                                         |

## Navigation Flow

```
Boot → Preload → Title Screen
                     │
                     ├─ New Game ──────► Base Camp ──► Map ──► Battle ──► End Battle
                     │                      ▲           ▲                   │
                     │                      └───────────└───────────────────┘
                     ├─ Continue ──────► Base Camp
                     ├─ Deck ──────────► Deck Screen
                     ├─ Options ───────► Options Screen
                     └─ Quit ──────────► Close game
```

## Title Screen

1. Displays the game title "STRATIDECK" and a pulsing "Press any button" message.
2. On any input (click, touch, keypress), the main menu appears with:
   - **New Game** — Starts a new game. If a game is already in progress, shows a confirmation warning before resetting.
   - **Continue** — Resumes the current game (only visible when a game is in progress).
   - **Deck** — Opens the deck viewer.
   - **Options** — Opens settings.
   - **Quit** — Closes the application.

## In-Game Menu

When a game is in progress, a **☰ menu button** appears in the top-right corner on all scenes (except the Title Screen). Clicking it opens a modal overlay with quick navigation:

- **Base Camp** — Go to the base camp
- **Map** — Go to the battle map
- **Deck** — View card collection
- **Options** — Open settings
- **Quit Game** — End the current game and return to the Title Screen

The in-game menu replaces the need for individual "back" buttons on each scene.

## Scene Details

### Base Camp (`BaseCampScene`)
- Displays the "Base Camp" title
- Button: **Go to Map** → navigates to `MapScene`

### Map (`MapScene`)
- Displays the "Map" title
- Button: **Start Battle** → navigates to `BattleScene`

### Battle (`BattleScene`)
- Displays the "Battle" title
- Temporary buttons: **Victory** / **Defeat** → navigates to `EndBattleScene` with result data

### End Battle (`EndBattleScene`)
- Displays "Victory!" or "Defeat..." depending on the battle result
- Button: **Back to Camp** → navigates to `BaseCampScene`
- Button: **New Battle** → navigates to `MapScene`

### Deck (`DeckScene`)
- Displays the "Deck" title and placeholder text
- If accessed from Title Screen (no game in progress): shows a **Title Screen** button to return
- If accessed during a game: uses the in-game menu for navigation

### Options (`OptionsScene`)
- Displays the "Options" title and placeholder text
- Same navigation logic as Deck scene

## State Management

The `stateManager` singleton tracks whether a game is in progress via the `gameInProgress` key:
- Set to `true` when "New Game" is selected
- Set to `false` when "Quit Game" is selected from the in-game menu
- Used to toggle visibility of the "Continue" button and the in-game menu
