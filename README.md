# Stratideck

Stratideck is a mobile game (landscape-only) that blends deck building mechanics with grid-based defense strategy, inspired by the classic board game Stratego.

Built with **Phaser 3**, bundled with **Vite**, tested with **Vitest**, and compiled to iOS/Android via **Capacitor**.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full project structure, tech stack, design decisions, and conventions.

## Cards

Stratideck features a card system with 10 types, 9 ranks, and 99 unique alchemist characters. Cards are obtained through a weighted drop system.

See [docs/CARD.md](docs/CARD.md) for the full card system documentation (types, ranks, drop rates, visual layout, architecture).

## Abilities

Cards can be equipped with up to 3 abilities — special powers that grant unique effects during gameplay (bomb immunity, enemy reveal, battle healing, etc.). Abilities are loaded into a card's ability slots and have limited uses.

See [docs/ABILITY.md](docs/ABILITY.md) for the full ability system documentation (properties, visual layout, data architecture).

## Save System

All player progress (game stats, unlocked cards, ability usage, etc.) is managed by a **SaveManager** that persists to `localStorage`. Entities (`Card`, `Ability`) remain pure static data classes with no player state.

See [docs/SAVE.md](docs/SAVE.md) for the full save system documentation (data structure, API, migration guide).

## Localization

Stratideck supports **English** and **French**. The language can be switched at runtime via in-game options and is persisted in `localStorage`.

See [docs/TRANSLATE.md](docs/TRANSLATE.md) for the full localization guide (adding languages, key conventions, usage in code).

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Sync & open native projects
npx cap sync
npx cap open android
npx cap open ios
```


## Scenes & Navigation

The game features 7 scenes with full navigation:

- **Title Screen** — Press any button, then main menu (New Game, Continue, Deck, Options, Quit)
- **Base Camp** — Home base with access to the battle map
- **Map** — Choose and launch battles
- **Battle** — Main combat scene
- **End Battle** — Victory/defeat results with navigation back to camp or map
- **Deck** — Card collection viewer
- **Options** — Game settings

An **in-game menu** (☰ top-right button) provides quick navigation between all scenes during a game.

See [docs/MENU.md](docs/MENU.md) for the full navigation flow and scene details.

## License
This project is licensed under the MIT License.
