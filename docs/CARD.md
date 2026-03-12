# Card System

## Overview

Cards are the core collectible entities in Stratideck. Each card represents an alchemist character with unique properties, tied to a type hierarchy and rarity rank system.

## Card Properties

| Property          | Description                                                         |
|-------------------|---------------------------------------------------------------------|
| **id**            | Unique identifier (1–99)                                            |
| **type**          | One of the 10 card types (determines color palette and description) |
| **rank**          | Power tier from SSS (highest) to F (lowest)                         |
| **color**         | Hex color derived from type + rank (each type has 9 nuances)        |
| **dropRate**      | Probability of obtaining the card, inversely proportional to rank   |
| **characterName** | Funny English alchemist name (unique per id)                        |
| **personality**   | Character trait (e.g. choleric, calm) — localized (en/fr)           |
| **image**         | Visual asset key for the card artwork                               |
| **abilities**     | 3 special ability slots (empty by default — represented as dots)    |
| **description**   | Flavor text tied to the card type — localized (en/fr)               |

> Player state (unlocked, usage counts) is managed by the **SaveManager** — see [SAVE.md](SAVE.md).

## Types (ordered by power)

Each type spans IDs in a 10-card block (rank: SSS → F).

| level | Type     | IDs   | Color Palette |
|-------|----------|-------|---------------|
| 1     | Overlord | 1–9   | violet        |
| 2     | Warlord  | 10–18 | darker blue   |
| 3     | Guardian | 19–27 | light blue    |
| 4     | Veteran  | 28–36 | darker green  |
| 5     | Elite    | 37–45 | light green   |
| 6     | Vanguard | 46–54 | red           |
| 7     | Grunt    | 55–63 | orange        |
| 8     | Breacher | 64–72 | brown         |
| 9     | Runner   | 73–81 | yellow        |
| 0     | Assassin | 82–90 | black         |
| -     | Object   | > 90  | white         |

## Ranks & Drop Rates

| Rank | Drop Rate |
|------|-----------|
| SSS  | 0.5%      |
| SS   | 1%        |
| S    | 2%        |
| A    | 4%        |
| B    | 7%        |
| C    | 12%       |
| D    | 18%       |
| E    | 25%       |
| F    | 30.5%     |

Total drop rate: 100%.

## Character Names

Each card (id 1–99) has a unique funny English alchemist-themed character name. Names are defined in the card data registry and are **not localized** (always English).

## Personality (localized)

Each card has a personality trait (e.g. "Choleric", "Serene") that enriches the game universe. Personalities are localized (en/fr) via the i18n system.

## Descriptions (localized)

Each **type** (not individual card) has a description explaining its role. Descriptions are localized (en/fr). There are 10 descriptions total.

## Card Visual Layout

Cards follow a traditional playing card vertical format (portrait aspect ratio ≈ 2.5:3.5).

- `docs/card-styles-preview.html` - Full card layout with all properties (id, type, rank, character name, personality, description, abilities).
- `docs/card-styles-mini-preview.html` - Compact version for in-battle display (only type, rank, character name, ability dots).

### Interactions

- **Click on Character Name** → Opens a modal showing the character's personality trait.
- **Click on Type** → Opens a modal showing the type description.

## Architecture

### Data Layer

- `src/configs/card-data.js` — Static registry of all 99 cards (id, type, rank, characterName, personality key, image key).
- `src/configs/card-types.js` — Type definitions (name, colors array, description i18n key).
- `src/configs/card-ranks.js` — Rank definitions (label, dropRate, colorIndex).

### Entity

- `src/entities/card.js` — Pure data class representing a card instance. No Phaser dependency. Holds all computed properties (color, dropRate) derived from its type and rank. Exposes a static `Card.fromId(id)` factory method and a `Card.dropRandom()` method to get a random card based on drop rates.

### Component

- `src/components/card-visual.js` — Phaser UI component that renders a `Card` entity visually in a scene. Receives a `scene` and a `Card` instance. Handles click interactions (personality modal, type description modal).

### Localization

- Translation keys: `card.type.<typeName>` for type descriptions, `card.personality.<id>` for personality traits.

### Deck Scene Integration

- `src/scenes/deck-scene.js` displays a scrollable grid of all 90 cards using `CardVisual` components.

## Drop System

When a card is "dropped" (obtained after battle or other event):

1. Call `Card.dropRandom()` — selects a rank based on weighted drop rates, then a random type.
2. Instantiate the card: `Card.fromId(computedId)`.
3. Display with `new CardVisual(scene, x, y, card)`.

## Future

- **Special abilities** will fill the 3 ability slots (currently dots).
- **IDs 91–99** are reserved for special/event cards.
