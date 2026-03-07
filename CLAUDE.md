# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~10100 lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vN`)
- **Current version**: v22
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (default, 2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS

## CRITICAL: MP Declaration Order

**`const MP` MUST be declared BEFORE any `reset*()` init calls.**

`const` in JavaScript has a "temporal dead zone" (TDZ). Even `typeof MP` throws a ReferenceError if `const MP` is declared later in the same scope. This has caused crashes in v10-v12, v46, and v28-v38.

```javascript
// CORRECT ORDER:
const MP = { peer: null, connection: null, ... };  // Line ~8809
resetChess();  // These can now safely reference MP
resetBS();     // MP._meReady = false works
resetMem();    // MP.isConnected check works
```

**Rule**: Any function called at init time that references `MP` will crash if `MP` is declared after the call site. Always grep for `MP.` in any function you call during initialization.

## Important Variables

- `MOBILE_GAMES` array — defines games with `mode` and optional `mp:true`:
  - `'both'` = AI + PVP (shows in both modes)
  - `'pvp'` = 2-player only
  - `'solo'` = solo games (Tetris, Racing)
  - `'always'` = always shown (Stats)
  - `mp:true` = has online multiplayer support (shows 🌐 badge)
- `welcomeGameMode` — `'pvp'` (default) or `'ai'`
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `renderMobileGrid()` — filters MOBILE_GAMES based on welcomeGameMode

## Games (30 total)

### 2 Players + vs Computer (mode:'both')
- Piškvorky (3×3, 4×4, 5×5, 10×10) 🌐
- Connect 4 🌐
- Kameň Papier Nožnice 🌐
- Hádaj Číslo 🌐
- Pexeso (6 random themes) 🌐
- Šach 🌐 (AI: easy/medium/hard)
- Dáma 🌐 (AI: easy/medium/hard)
- Lodičky (Battleship) 🌐 (AI: easy/medium/hard)
- Človeče nehnevaj sa 🌐 (AI: easy/medium/hard)
- Puzzle Scramble
- Mini Labyrint (AI: easy/medium/hard)
- Reversi/Othello (AI: easy/medium/hard)

### 2 Players Only (mode:'pvp')
- Kvíz (17 tém: vseobecne, jedlo, zvierata, psy, kone, superhrdinovia, zemepis, historia, biologia, veda, sport, filmy, hudba, slovensko, hlavne mesta)
- Ghost
- Reakčný Test
- Scramble / Jazykový Scramble
- Flashcards / Doplň písmeno / Prekladaj vety
- Spam Click, Matika Duel, Emoji Hádanka
- Obesenec, Vyššie Nižšie
- Bodky a Krabičky (Dots and Boxes)

### Solo (mode:'solo'/'always')
- Tetris
- Snake (canvas, swipe + arrows + buttons, high score)
- Preteky (Racing)

## Features (v13-v22)

- **AI Difficulty**: All AI games have easy/medium/hard selector (shown when `welcomeGameMode==='ai'`)
- **Animations**: cell-appear, flip-card, dice-roll, piece-move, glow-correct, shake-wrong, rps-reveal
- **Sounds**: All games now have sounds on key actions (click, correct, wrong, win, flip, hit, move)
- **Offline indicator**: Red banner when device offline, MP button auto-hides
- **Favorites**: Star on game cards, stored in `localStorage('hry_favorites')`, sorted to top
- **Recently played**: Last 5 games tracked in `localStorage('hry_recent')`, shown in grid with clear button
- **Achievement system**: 16 achievements checked after every `addWin()` and `toggleFavorite()`, toast notification on unlock, displayed in Stats page. Stored in `localStorage('hry_achievements')`.

## Adding a New Game

1. Add game HTML section with `id="gameId"` inside `.container`
2. Add entry to `MOBILE_GAMES` array with `{id, icon, mode, mp?}`
3. Add entry to `GAME_NAMES` object
4. Add to `gameKeys` object (button ID mapping)
5. Add stat key to both `getActiveP1Name` and `getActiveP2Name`
6. Add `reset*()` function and call it in init section (AFTER `const MP`)
7. Implement game logic with `addWin()` calls for all outcomes
8. For AI mode: block player clicks with `if(welcomeGameMode==='ai' && turn===opponent) return;`

## Online Multiplayer

**Architecture:**
- PeerJS library (CDN: `unpkg.com/peerjs@1.5.2`)
- WebRTC peer-to-peer, cloud broker: `0.peerjs.com`
- Floating globe button (hidden in AI mode)

**MP State:**
```javascript
const MP = {
  peer: null, connection: null,
  isHost: false, isConnected: false,
  roomCode: null, myName: '', opponentName: '',
  tttRound: 0  // Alternating start player
};
```

**Games with MP Support (9 games):**
- Piškvorky — `ttt-move`, alternating start (tttRound)
- Connect4 — `c4-move`
- Kameň Papier Nožnice — `rps-choice`
- Šach — `ch-move`
- Dáma — `dk-move`
- Pexeso — `mem-flip`, `mem-board` (host sends card layout)
- Lodičky — `bs-shoot`, `bs-result`, `bs-ready`, `bs-gameover`
- Človeče — `ludo-roll`, `ludo-move`
- Hádaj Číslo — `gn-setup`, `gn-guess`, `gn-feedback`

**Adding MP to a Game:**
1. Add `mp:true` to MOBILE_GAMES entry
2. In click handler, check turn: `if(MP.isConnected) { if(notMyTurn) return; }`
3. Send move: `MP.connection.send({type:'game-move', ...data})`
4. Handle in `mpHandleMessage()`: `if(data.type==='game-move') { applyMove(); }`
5. Add rematch support in `mpRematch()` and `mp-rematch` handler
6. Guest settings sync: host sends settings in handshake, guest applies

**MP Key Rules:**
- Guest cannot change game settings (hidden/blocked)
- Host sends game state (board, settings) to guest
- Alternating start player via round counter (Piškvorky)
- Rematch resets game and syncs via `mp-rematch` message

## Pexeso Themes

6 random themes, auto-selected each new game:
```javascript
const memThemes = {
  ovocie: ['🍎','🍌',...],    // Fruit
  zvierata: ['🐶','🐱',...],  // Animals
  auta: ['🚗','🚕',...],      // Cars
  nastroje: ['🎸','🎹',...],  // Instruments
  sport: ['⚽','🏀',...],     // Sports
  jedlo: ['🍕','🍔',...],     // Food
};
```

## Človeče nehnevaj sa

- 11×11 CSS grid board, 2 players (red vs blue)
- 4 pieces per player, dice rolling (⚀-⚅)
- Path: 40 positions clockwise, 4 home positions per player
- Rules: 6 to leave base, land on opponent = capture, 6 = bonus roll
- Win: all 4 pieces at position >= 40 (in home)
- AI: prefers captures > entering home > leaving base
- MP: host=red (turn 0), guest=blue (turn 1)

## Racing Game (Preteky)

- 5×12 grid road, 3 lanes (cols 1-3)
- Obstacles: 🚧🛢️🪨🌲, coins: ⭐
- Speed increases every 20 points
- Keyboard (←→) and button controls

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```
GitHub Pages auto-deploys from main branch.

## Common Issues

- **Blank screen / can't click**: JS crash. Check browser console. Most common: duplicate `const` declaration or TDZ issue with MP.
- **Cache not updating**: Hard refresh (Ctrl+Shift+R). Bump `APP_VERSION` + `CACHE_NAME`.
- **Board too small on mobile**: Use `max-width:min(Xpx, 90vw)` with `1fr` grid columns.
- **Text invisible**: Don't hardcode `color:white` — use classes that handle both dark/light mode.
- **Topbar disappearing**: `#mobileGameView` and `#mobileGamePicker` need `position:fixed`.
- **Mode selectors in games**: Hidden via `applyGameMode()` when mode chosen from welcome screen.

### MP-Specific Issues

- **const MP TDZ crash (v10-v12, v46)**: `const` declarations are NOT hoisted. Even `typeof` throws in TDZ. Solution: declare MP before any init calls.
- **Game state desync**: Host MUST send all game settings in handshake. Guest applies via UI functions.
- **Guest changing settings**: Block or hide setting controls for guest in MP mode.
- **Duplicate declarations**: Always `grep "const MP" index.html` before changes.
