# Architecture — Stratideck

## Tech Stack

| Layer        | Technology                  | Purpose                                |
|--------------|-----------------------------|----------------------------------------|
| Game Engine  | **Phaser 3**                | Rendering, physics, input, audio       |
| Bundler      | **Vite**                    | Fast dev server with HMR / hot reload  |
| Testing      | **Vitest**                  | Unit tests (mirrors Vite configuration)|
| Linting      | **ESLint** + **Prettier**   | Code quality & consistent formatting   |
| Mobile Build | **Capacitor**               | Wrap web app as native iOS / Android   |
| Language     | **JavaScript (ES2022+)**    | Native web — JSDoc for type hints      |

## Folder Structure

```
stratideck/
├── .copilot-instructions.md   # Copilot coding directives
├── eslint.config.js           # ESLint flat config
├── .gitignore
├── .prettierrc
├── capacitor.config.js        # Capacitor native build config (JSDoc typed)
├── index.html                 # Entry HTML (Vite entrypoint)
├── package.json
├── vite.config.js             # Vite dev server & build config
├── vitest.config.js           # Vitest test config
├── README.md
│
├── docs/                      # Project documentation
│   └── ARCHITECTURE.md        # ← You are here
│
├── public/                    # Static files served as-is — no build processing
│   └── assets/                # Game assets loaded by Phaser at runtime
│       ├── images/            # PNG, SVG, WebP
│       ├── spritesheets/      # Texture atlases (PNG + JSON)
│       └── audio/
│           ├── music/         # Background music (MP3, OGG)
│           └── sfx/           # Sound effects (MP3, OGG, WAV)
│
├── src/                       # Application source code
│   ├── main.js                # Entry point — creates the Phaser.Game instance
│   │
│   ├── configs/               # Configuration & constants
│   │   ├── game-config.js     # Phaser GameConfig object
│   │   └── constants.js       # Shared constants (sizes, colors, scene keys…)
│   │
│   ├── scenes/                # Phaser scenes (one per screen / state)
│   │   ├── BootScene.js       # Minimal boot, transitions to PreloadScene
│   │   ├── PreloadScene.js    # Asset loading with progress bar
│   │   ├── MenuScene.js       # Main menu
│   │   └── GameScene.js       # Core gameplay
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Button.js          # Clickable button with hover state
│   │   ├── Title.js           # Styled heading text
│   │   └── Modal.js           # Overlay modal dialog with confirm/cancel
│   │
│   ├── entities/              # Game objects (units, cards, tiles…)
│   │
│   ├── managers/              # Cross-cutting singletons
│   │   ├── AudioManager.js    # Music & SFX playback
│   │   ├── I18nManager.js     # Locale switching & translation lookups
│   │   └── StateManager.js    # Observable key-value state store
│   │
│   ├── locales/               # Translation files (one per language)
│   │   ├── en.js              # English strings
│   │   └── fr.js              # French strings
│   │
│   └── utils/                 # Pure helper functions
│       └── math.js            # clamp, randomInt, shuffle…
│
├── tests/                     # Unit tests (mirrors src/ structure)
│   ├── utils/
│   │   └── math.test.js
│   └── managers/
│       ├── StateManager.test.js
│       └── I18nManager.test.js
│
├── android/                   # (generated) Capacitor Android project
└── ios/                       # (generated) Capacitor iOS project
```

## Key Design Decisions

### Scenes

Each game screen is a **Phaser.Scene** subclass in `src/scenes/`. Scenes follow the Phaser lifecycle:

1. `init(data)` — receive data from the previous scene
2. `preload()` — load scene-specific assets (most loading happens in PreloadScene)
3. `create()` — build the scene's game objects
4. `update(time, delta)` — game loop tick

Scenes should stay thin: delegate complex logic to **managers** and **entities**.

### Components

UI components (`Button`, `Title`, `Modal`) are **plain JavaScript classes** — not Phaser scenes.
They receive a `scene` reference in their constructor and add Phaser game objects to it.
This allows them to be instantiated and destroyed from any scene, promoting reuse.

Usage:
```js
import { Button, Modal } from '../components/index.js';

// In a scene's create():
new Button(this, x, y, 'Start', () => this.scene.start('GameScene'));

new Modal(this, {
  title: 'Game Over',
  body: 'You scored 1200 points!',
  confirmLabel: 'Restart',
  onConfirm: () => this.scene.restart(),
});
```

### Managers

Managers are **singleton-ish** classes for cross-cutting concerns:

- **AudioManager** — wraps Phaser's sound system with volume control.
- **I18nManager** — singleton handling locale selection, translation lookups (`i18n.t('key')`), and persistence to `localStorage`. See [docs/TRANSLATE.md](TRANSLATE.md).
- **StateManager** — observable key-value store for shared game state (score, settings, player data). Supports `on(key, callback)` subscriptions.

### Entities

Game objects (units, cards, grid tiles…) live in `src/entities/`. They typically extend `Phaser.GameObjects.Sprite` or `Phaser.GameObjects.Container`, or are plain classes that compose Phaser objects.

### Utils

Pure utility functions in `src/utils/` — no side effects, no Phaser dependency.
Easy to unit test.

### Assets

Assets live in `public/assets/` and are **served directly** without any build processing.
Phaser loads them at runtime via root-relative URLs in `PreloadScene`:

```js
this.load.image('logo', 'assets/images/logo.png');
this.load.audio('bgm', 'assets/audio/music/theme.mp3');
this.load.atlas('sprites', 'assets/spritesheets/atlas.png', 'assets/spritesheets/atlas.json');
```

This approach is simpler and standard for Phaser projects: no import statements needed, paths work identically in the browser and in native builds (Capacitor copies `dist/` which includes `public/assets/`).

## Hot Reload

**Vite** provides near-instant Hot Module Replacement (HMR) during development:

```bash
npm run dev
```

The dev server starts at `http://localhost:3000`. Any change to source files triggers an automatic page reload, allowing rapid iteration.

## Mobile Builds (iOS / Android)

The project uses **Capacitor** to wrap the web build into native mobile apps.

```bash
# Build web assets
npm run build

# Sync with native projects
npx cap sync

# Open in native IDE
npx cap open android   # Opens Android Studio
npx cap open ios       # Opens Xcode
```

The game is locked to **landscape orientation** via:
- `capacitor.config.ts` → `ScreenOrientation` plugin
- `<meta name="screen-orientation" content="landscape">` in `index.html`
- Phaser `Scale.FIT` + `CENTER_BOTH` for responsive scaling to any screen size

## Testing

Tests use **Vitest** and live in `tests/`, mirroring the `src/` structure.

```bash
npm test          # Run once
npm run test:watch # Watch mode
```

Focus testing on:
- `utils/` — pure functions, easy to test
- `managers/` — state logic, subscriptions
- `entities/` — game logic detached from rendering
