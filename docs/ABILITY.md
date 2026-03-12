# Abilities

Abilities are special powers that can be loaded onto cards. Each card has **3 ability slots** available. An ability must be loaded into one of these slots to take effect during gameplay.

## Properties

| Property         | Type      | Description                                                                |
|------------------|-----------|----------------------------------------------------------------------------|
| `id`             | `number`  | Unique numeric identifier                                                  |
| `imageKey`       | `string`  | Asset key for the ability icon                                             |
| `key`            | `string`  | Unique string identifier used to resolve ability effects in gameplay logic |
| `title`          | `string`  | Display name (English)                                                     |
| `descriptionKey` | `string`  | i18n key prefix for the ability description (en + fr)                      |
| `totalUses`      | `number`  | Maximum number of times this ability can be used across the entire game    |
| `usesPerBattle`  | `number`  | Maximum number of times this ability can be used per battle                |
| `price`          | `number`  | Acquisition cost                                                           |

> Player state (owned, usage counts) is managed by the **SaveManager** — see [SAVE.md](SAVE.md).

## Ability Examples

| Key              | Effect                                                 |
|------------------|--------------------------------------------------------|
| `bomb_immunity`  | The card is immune to bomb attacks                     |
| `reveal_enemy`   | Reveals a hidden enemy card                            |
| `return_to_deck` | After attacking an enemy, the card returns to the deck |
| `battle_heal`    | Heals one wound per battle                             |

> More abilities will be added as the game develops.

## Visual Layout

Abilities are displayed as **circles**:

```
        ┌─────────┐
        │  Title  │  ← clickable → opens description modal
        │         │
        │  ┌───┐  │
        │  │ ? │  │  ← ability image (centered)
        │  └───┘  │
        │         │
        │  3 | #1 │  ← total uses | ability ID (small text)
        └─────────┘
```

- **Top**: Title text (clickable — opens a modal with the full description in the current locale)
- **Center**: Ability image
- **Bottom**: Total uses count `|` ability ID (small text)

## Data Architecture

| File                               | Purpose                                                                        |
|------------------------------------|--------------------------------------------------------------------------------|
| `src/configs/ability-data.js`      | Static registry of all abilities (`ABILITY_REGISTRY`) + `getAbilityDataById()` |
| `src/entities/ability.js`          | `Ability` entity class — pure data, no Phaser dependency                       |
| `src/components/ability-visual.js` | `AbilityVisual` component — renders one ability circle in a Phaser scene       |
| `src/scenes/ability-scene.js`      | `AbilityScene` — scrollable grid listing all abilities                         |

## Scene — Ability List

- Accessible from the **Deck scene** (button) and from a **card that has a loaded ability** (future)
- Displays all abilities in a scrollable grid of circles
- Same navigation pattern as the Deck scene (in-game menu or Title Screen button)
- Scene key: `AbilityScene`

## Localization

Keys follow the pattern:

- `ability.title` — Scene title ("Abilities" / "Capacités")
- `ability.<key>.description` — Per-ability description (en + fr)
- `title.abilities` — Title screen menu entry
- `ingame.abilities` — In-game menu entry
