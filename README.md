# Block Shift

A modern, production-ready falling-block puzzle arcade built on **React Native + Expo Managed Workflow** in pure JavaScript/JSX.

Inspired by timeless mobile puzzle aesthetics, **Block Shift** features a pastel sunset landscape, dot matrix grid, 3D beveled tetrominoes, exact Ghost Piece projections, 30 campaign levels across 3 worlds with milestone upgrades, 4 additional game modes, and smooth single-handed mobile touch controls.

---

## Features

- **10×20 Visible Grid + 4 Hidden Spawn Rows** (10×24 internal simulation)
- **7-Bag Randomizer** (Fisher-Yates shuffle with deterministic RNG support)
- **Hold System** (single hold per piece, swap, reset on piece lock)
- **Next Queue** (displays 3–6 upcoming tetrominoes)
- **Ghost Piece Invariant** (`getGhostY` strictly matches `hardDrop` landing)
- **Super Rotation System (SRS)** (Standard wall kicks for J, L, S, T, Z and dedicated table for I)
- **Lock Delay** (500ms baseline with a strict 15-reset limit to prevent infinite stalling)
- **Scoring & Combo System** (Single, Double, Triple, Quad, Back-to-Back, Spin Clears, Perfect Clear)
- **30 Campaign Levels across 3 Worlds**:
  - *World 1: Neon Stack* (Levels 1–10, Pulse Trial I)
  - *World 2: Shift Circuit* (Levels 11–20, Pulse Trial II)
  - *World 3: Gravity Core* (Levels 21–30, Final Shift Trial)
- **9 Campaign Run Upgrades** (Gravity Dampener, Lock Stabilizer, Preview Matrix, Shift Multiplier, Combo Driver, Hold Buffer, Garbage Scrubber, Focus Window, Recovery Protocol)
- **4 Extra Game Modes**:
  - *Marathon* (Endless classic scaling)
  - *Sprint 40* (Clear 40 lines in record time)
  - *Time Attack* (2-minute score rush)
  - *Zen* (Relaxed, slow pace endless mode)
- **Audio & Haptics**:
  - `MusicManager` and `SfxManager` with procedural Web Audio synthesis fallback
  - Haptic feedback on rotation, hold, line clears, and game over
- **Persistence** (Versioned AsyncStorage schema for high scores, level stars, settings, and progress)

---

## Tech Stack

- **Framework**: React Native 0.86, Expo SDK 57 (Managed Workflow)
- **Language**: Pure JavaScript / JSX (Vanilla ES6+)
- **Graphics**: `react-native-svg`
- **Storage**: `@react-native-async-storage/async-storage`
- **Haptics**: `expo-haptics`
- **Audio**: `expo-audio` & `expo-asset` with procedural synthesis fallback

---

## Install & Run

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start

# Run on Web directly
npx expo start --web

# Run automated game engine verification suite
node scripts/test-engine.mjs

# Run project health diagnostics
npx expo-doctor
```

---

## Touch Controls

Designed for seamless one-handed portrait gameplay:
- **Drag Left / Right**: Moves the active piece horizontally (calibrated threshold per cell).
- **Short Tap**: Rotates the piece 90° clockwise with instant SRS wall-kick validation.
- **Drag Downward**: Activates soft drop (accelerated gravity + 1 pt/cell).
- **Fast Swipe Down / Flick**: Performs immediate Hard Drop directly to the Ghost position.
- **Tap Hold Panel**: Swaps active piece with Hold slot.
- **On-Screen Quick Buttons**: Left, Rotate, and Right buttons for alternative tap control.

---

## Ghost Piece Invariant

The Ghost Piece calculates the exact landing position in real time:
```
Ghost shape    === Current active piece shape
Ghost rotation === Current active piece rotation
Ghost X        === Current active piece X
Ghost Y        === getGhostY(board, activePiece)
```
When Hard Drop is executed, `piece.y` lands strictly at `Ghost Y`.

---

## Audio Licensing & Safety

> Use only original or properly licensed music/SFX suitable for commercial mobile distribution. Do not copy copyrighted assets from commercial falling-block games.

To add custom music and sound effects:
- Place background music tracks into `assets/audio/music/`
- Place sound effects into `assets/audio/sfx/`

If audio assets are omitted, the game automatically operates safely with responsive Web Audio procedural synthesizers without crashes or runtime errors.

---

## Project Structure

```text
src/
├── app/
│   ├── _layout.js              # Expo Router root layout
│   └── index.js                # App entry point & screen navigation
│
├── game/
│   ├── constants.js            # Board dimensions, piece colors, score values
│   ├── pieces.js               # 7 tetrominoes & 4 rotation states
│   ├── rotation.js             # SRS Wall Kicks & Floor Kicks
│   ├── board.js                # Board matrix, collisions, row clearing
│   ├── ghost.js                # getGhostY and hardDrop invariant
│   ├── bag.js                  # 7-Bag Randomizer
│   ├── scoring.js              # Combo, B2B, drop points & 1-3 star calculation
│   ├── gravity.js              # Delta accumulator & speed curve
│   ├── lockDelay.js            # 500ms lock delay with reset cap
│   ├── garbage.js              # Starting & rising garbage rows
│   ├── objectives.js           # 9 Campaign objective evaluators
│   ├── upgrades.js             # 9 Milestone run upgrade cards
│   ├── modes.js                # Marathon, Sprint, Time Attack, Zen configs
│   ├── input.js                # Touch gesture processor
│   └── engine.js               # Unified game loop & state engine
│
├── levels/
│   ├── world1.js               # Levels 1–10 (Neon Stack)
│   ├── world2.js               # Levels 11–20 (Shift Circuit)
│   ├── world3.js               # Levels 21–30 (Gravity Core)
│   ├── validation.js           # Level schema validator
│   └── index.js
│
├── components/
│   ├── BackgroundScene.js      # Pastel sunset gradient with sun & landscape
│   ├── BoardCanopy.js          # Tree crowns atop the board capsule
│   ├── BoardRenderer.js        # 10x20 visible grid, dot intersections, 3D blocks, Ghost
│   ├── PiecePreview.js         # Centered tetromino preview component
│   ├── HoldPanel.js            # Coral Hold card
│   ├── NextPanel.js            # Teal Next queue card
│   ├── LevelCard.js            # Teal Level / objective progress card
│   ├── Hud.js                  # Star score & combo banners
│   ├── TouchControlsOverlay.js # Touch gesture listener
│   ├── GameBoard.js            # Master board layout
│   ├── PauseOverlay.js         # Pause modal
│   ├── LevelClearOverlay.js    # Victory modal with star breakdown
│   ├── GameOverOverlay.js      # Game over modal with retry
│   ├── UpgradeModal.js         # 3 upgrade cards selection modal
│   └── SettingsModal.js        # Audio, haptics, ghost, sensitivity settings
│
├── screens/
│   ├── MenuScreen.js           # Main title menu
│   ├── ModeSelectScreen.js     # Mode selector with records
│   ├── LevelSelectScreen.js    # 30-level world map
│   ├── GameScreen.js           # Complete game view
│   └── CampaignCompleteScreen.js # Grand victory screen
│
└── utils/
    ├── storage.js              # AsyncStorage manager (`block-shift.save.v1`)
    ├── audio.js                # MusicManager & SfxManager
    ├── haptics.js              # expo-haptics wrapper
    └── testRunner.js           # Automated test suite (23/23 passing)
```
