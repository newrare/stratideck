# Battle System

The battle scene is the main combat gameplay of Stratideck. It opposes the player's deck against a grid of hidden enemy cards in a strategic card-vs-card combat.

## Scene Layout

The battle scene is divided into **4 zones**:

| Zone             | English Name  | Position     | Size                   |
|------------------|---------------|--------------|------------------------|
| Battlefield grid | **Arena**     | Top-left     | 80% width × 80% height |
| Card selection   | **Hand**      | Bottom-left  | 80% width × 20% height |
| Last fought card | **Opponent**  | Top-right    | 20% width × 50% height |
| Player deck pile | **Stockpile** | Bottom-right | 20% width × 50% height |

```
┌──────────────────────────────┬──────────┐
│                              │          │
│          Arena               │ Opponent │
│        (8×4 grid)            │          │
│                              │          │
│                              ├──────────┤
├──────────────────────────────┤          │
│           Hand               │Stockpile │
│     (4 mini cards)           │          │
└──────────────────────────────┴──────────┘
```

## Arena Zone

The arena is an **8×4 grid** (8 columns × 4 rows) of tiny cards (55×55 px).

- All cards start face-down as **mystery cards** — tiny cards rendered with a grey gradient (`cvm-mystery` CSS class).
- The **bottom row** (row 3) represents the initial attack line. These cards are displayed as **animated colored mystery cards** (`cvm-mystery cvm-attack`) showing a colorful animated gradient, indicating they are available targets.
- When a player defeats an enemy card, it is **removed from the grid** permanently. **Enemy cards never move** — the cell simply becomes empty.
- When the player loses, the enemy card **stays on the grid** and returns to animated colored mystery state.

### Attackability & Path System

A tiny card is attackable if the player can trace a **path** from below the grid to reach it:

1. The player enters from a **virtual row just below the bottom row** (accessible in all columns).
2. The player can walk through **empty cells** (4-directional: up, down, left, right) inside the grid.
3. An enemy card is **attackable** when one of its adjacent cells is reachable by this path.

**Example progression:**
- At game start the grid is full → the entire bottom row is directly reachable from below → all 8 bottom-row cards are attackable.
- When a bottom-row card is defeated, its cell becomes empty → the player can now step into that cell and attack the card directly above it (and potentially adjacent cards in the same row if more gaps exist).
- Chains of empty cells create **corridors** that the player navigates deeper into the arena column by column.

### Mystery Card Styles

Two visual states for face-down cards:
1. **Grey mystery** (`cvm-mystery`): static grey gradient — represents unreachable enemy cards.
2. **Animated mystery** (`cvm-mystery cvm-attack`): colorful animated gradient — represents attackable cards reachable via a path from the bottom.

## Hand Zone

Displays the **next 4 cards** from the player's deck as **mini cards** (110×110 px).

- The player selects a card by **clicking** on it, then **clicking** on an attackable tiny card in the arena.
- Alternatively, the player can **drag & drop** a mini card onto an attackable tiny card.
- After selection, the chosen mini card is consumed and cannot be reused.

## Combat Resolution

When the player attacks an enemy card:

1. **Animation**: The player's mini card and the targeted tiny card animate toward each other and merge.
2. **VS Modal**: A modal appears for **2 seconds** displaying:
   - Left side: the enemy card (revealed)
   - Right side: the player's card
   - Center text: **"VS"**
3. **Resolution**: The card with the **lowest level** (type level) wins.
   - If levels are equal, the card with the **best rank** wins (SSS > SS > S > A > B > C > D > E > F, i.e. lower rank index wins).
   - If both level and rank are identical, the **player loses** (defender advantage).
4. **Outcome**:
   - **Player wins**: The enemy tiny card is removed from the grid. The player's card returns to the **bottom of the deck**.
   - **Player loses**: The player's card is **permanently destroyed**. The enemy tiny card stays on the grid and returns to attackable state.

After a card is removed from the arena grid, **the empty cell remains in place** — enemy cards do not shift. The empty cell instead opens a new corridor that the player may use to reach deeper rows.

## Opponent Zone

Always displays the **last enemy card** that was fought, shown as a full reveal. Empty at the start of battle.

## Stockpile Zone

Shows the player's remaining deck as a **stacked pile** with only the top card visible (tiny card back). A **counter** displays the number of remaining cards.

### Deck Initialization

- The player starts with **10 cards** (randomly selected via `Card.dropRandom()`).
- The deck is **shuffled** at the start of battle (Fisher-Yates via `shuffle()`).
- The first 4 cards are drawn into the Hand zone.

## Win / Loss Conditions

| Condition                                          | Result                                                       |
|----------------------------------------------------|--------------------------------------------------------------|
| All enemy tiny cards in the arena are defeated     | **Victory** → navigate to EndBattle with `{ victory: true }` |
| Player has no cards left (deck empty + hand empty) | **Defeat** → navigate to EndBattle with `{ victory: false }` |

## Architecture

### BattleManager (`src/managers/battle-manager.js`)

Pure logic class (no Phaser dependency) that manages the battle state:

- `grid[row][col]` — 4×8 array of enemy Card instances (or `null` if defeated). **Positions are fixed** — no gravity.
- `deck` — array of player Card instances (remaining draw pile)
- `hand` — array of up to 4 Card instances (currently drawable)
- `lastOpponent` — last enemy Card fought (for Opponent zone display)
- `initBattle()` — generates grid enemies, shuffles player deck, draws initial hand
- `drawHand()` — fills hand up to 4 cards from deck
- `resolveAttack(handIndex, row, col)` — resolves combat, returns result object
- `applyGravity(col)` — utility to collapse empty cells in a column (not called during normal combat)
- `getAttackableTargets()` — BFS from a virtual row below the grid through empty cells; returns all enemy cards adjacent to a reachable cell
- `isVictory()` / `isDefeat()` — checks end conditions

### BattleScene (`src/scenes/battle-scene.js`)

Phaser scene that renders the battle and handles user interaction:

- Creates zone layouts (Arena, Hand, Opponent, Stockpile)
- Renders the grid of tiny mystery cards
- Renders the hand of mini cards
- Handles click and drag-and-drop card selection
- Plays attack and VS modal animations
- Updates zones after each combat round
- Detects victory/defeat and navigates to EndBattle
