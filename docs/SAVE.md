# Save System

## Overview

The **SaveManager** is the single source of truth for all player progression and game state. It persists data to `localStorage` and provides an observable API (subscribe to changes) that replaces the former `StateManager`.

## Architecture

| File                          | Purpose                                                |
|-------------------------------|--------------------------------------------------------|
| `src/managers/save-manager.js`| SaveManager singleton — persistence + observable state |

### Design Principles

- **Entities stay pure** — `Card` and `Ability` hold only static game design data (rank, type, dropRate, totalUses…). No player state.
- **Single writer** — Only `SaveManager` reads/writes `localStorage`. No other code touches persistence.
- **Auto-persist** — Every mutation calls `save()` automatically.
- **Observable** — `saveManager.on(key, callback)` for reactive UI (replaces the old `StateManager`).
- **Versioned** — The save structure includes a `version` field for future migrations.

## Save Data Structure

```json
{
  "version": 1,
  "gameInProgress": false,
  "stats": {
    "gamesStarted": 0,
    "battlesPlayed": 0,
    "victories": 0,
    "defeats": 0
  },
  "cards": {
    "5":  { "unlocked": true, "useCount": 2 },
    "12": { "unlocked": true, "useCount": 0 }
  },
  "abilities": {
    "1": { "unlocked": true, "useCount": 3 }
  }
}
```

## API

### Persistence

| Method            | Description                                 |
|-------------------|---------------------------------------------|
| `load()`          | Read from `localStorage` (called on import) |
| `save()`          | Write current state to `localStorage`       |
| `reset()`         | Clear all data and persist (new game)       |

### Observable (replaces StateManager)

| Method              | Description                                         |
|---------------------|-----------------------------------------------------|
| `get(key)`          | Get a top-level value (`gameInProgress`, etc.)      |
| `set(key, value)`   | Set a value, persist, and notify listeners          |
| `on(key, callback)` | Subscribe to changes — returns unsubscribe function |
| `clear(key?)`       | Remove listeners for a key (or all)                 |

### Game Stats

| Method                 | Description                                                   |
|------------------------|---------------------------------------------------------------|
| `getStats()`           | Returns `{ gamesStarted, battlesPlayed, victories, defeats }` |
| `incrementStat(stat)`  | Increment a stat counter and persist                          |

### Cards

| Method                  | Description                            |
|-------------------------|----------------------------------------|
| `unlockCard(cardId)`    | Mark a card as unlocked                |
| `useCard(cardId)`       | Increment a card's use counter         |
| `isCardUnlocked(id)`    | `true` if the card has been unlocked   |
| `isCardUsed(id)`        | `true` if useCount > 0                 |
| `getCardUseCount(id)`   | Number of times the card has been used |

### Abilities

| Method                     | Description                               |
|----------------------------|-------------------------------------------|
| `unlockAbility(abilityId)` | Mark an ability as unlocked               |
| `useAbility(abilityId)`    | Increment an ability's use counter        |
| `isAbilityUnlocked(id)`    | `true` if the ability has been unlocked   |
| `isAbilityUsed(id)`        | `true` if useCount > 0                    |
| `getAbilityUseCount(id)`   | Number of times the ability has been used |

## Usage Examples

```js
import { saveManager } from '../managers/save-manager.js';

// Check if game is in progress
if (saveManager.get('gameInProgress')) { /* ... */ }

// Start a new game
saveManager.set('gameInProgress', true);
saveManager.incrementStat('gamesStarted');

// Card tracking
saveManager.unlockCard(42);
saveManager.useCard(42);
saveManager.isCardUnlocked(42); // true
saveManager.getCardUseCount(42); // 1

// Ability tracking
saveManager.unlockAbility(1);
saveManager.useAbility(1);
saveManager.isAbilityUsed(1); // true
```


## Future

- **Capacitor Preferences** — When moving to native storage, only `save-manager.js` needs to change.
- **Cloud sync** — Save structure is JSON-serialisable by design.
- **Save migration** — Bump `version` and add a migration path in `load()`.
