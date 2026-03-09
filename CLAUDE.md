# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~14600 lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vN`)
- **Current version**: v110
- **PeerJS version**: 1.5.5 (CDN: `unpkg.com/peerjs@1.5.5`)
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (default, 2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS + Metered TURN (password-protected)
- **DOM helper**: `const $ = id => document.getElementById(id);` — shorter syntax for DOM access
- **Game cleanup**: `stopAllGames()` — stops all running game timers/rafs on navigation

## CRITICAL: TDZ Declaration Order

**ALL `const`/`let` variables MUST be declared BEFORE any code that references them at init time.**

`const` and `let` in JavaScript have a "temporal dead zone" (TDZ). Even `typeof X` throws a ReferenceError if `const X` or `let X` is declared later in the same scope. This has caused crashes in v10-v12, v28-v38, and v42.

```javascript
// CORRECT ORDER — all declarations before any reset*() calls:
const MP = { peer: null, connection: null, ... };
let welcomeGameMode = 'pvp';           // MUST be before resetWordle() etc.
resetChess();  // These can now safely reference MP
resetBS();     // MP._meReady = false works
resetWordle(); // welcomeGameMode check works
```

**Rules:**
1. Any function called at init time that references `MP` will crash if `const MP` is declared after the call site.
2. Any function called at init time that references `welcomeGameMode` will crash if `let welcomeGameMode` is declared after the call site.
3. **Before adding any new `reset*()` call**, grep for ALL variables it references and verify they are declared EARLIER in the file.
4. Always grep: `grep -n "const MP\|let welcomeGameMode\|resetWordle\|resetDB\|resetChess" index.html`

## Important Variables

- `MOBILE_GAMES` array — defines games with `mode` and optional `mp:true`:
  - `'both'` = AI + PVP (shows in both modes)
  - `'pvp'` = 2-player only
  - `'solo'` = solo games (Tetris, Snake, Racing) — only visible in AI mode
  - `'always'` = always shown (Stats)
  - `mp:true` = has online multiplayer support (shows globe badge)
- `welcomeGameMode` — `'pvp'` (default) or `'ai'`
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `renderMobileGrid()` — filters MOBILE_GAMES based on welcomeGameMode
- `currentGameId` — currently active game, used to prevent keyboard conflicts between games

## Games (35 total)

### 2 Players + vs Computer (mode:'both')
- Piskvorky (3x3, 4x4, 5x5, 10x10) [MP]
- Connect 4 [MP] (AI: easy/medium/hard)
- Kamen Papier Noznice [MP] (AI: easy/medium/hard)
- Hadaj Cislo [MP]
- Pexeso (6 random themes) [MP]
- Sach [MP] (AI: easy/medium/hard, stalemate detection)
- Dama [MP] (AI: easy/medium/hard)
- Lodicky (Battleship) [MP] (AI: easy/medium/hard)
- Clovece nehnevaj sa [MP] (AI: easy/medium/hard)
- Puzzle Scramble (canvas, 3x3/4x4/5x5)
- Mini Labyrint (AI: easy/medium/hard — hard:30ms, medium:80ms, easy:180ms)
- Reversi/Othello (AI: easy/medium/hard)
- Wordle (SK: ~400 slov, EN: ~400 slov, language selector, word validation)
- Breakout/Arkanoid (AI: easy/medium/hard, canvas, roundRect polyfill)
- Pong (AI: easy/medium/hard, canvas, W/S + arrows, touch drag, first to 10)
- Tank Battle (AI: easy/medium/hard, 16x16 grid, power-ups: shield/rapid/speed)

### 2 Players Only (mode:'pvp')
- Kviz (17 tem, 1000+ otazok)
- Ghost (EN: 531 slov, SK)
- Reakcny Test (200ms penalty for early tap)
- Scramble / Jazykovy Scramble (5/10/15 rounds selector)
- Flashcards / Dopln pismeno / Prekladaj vety
- Spam Click, Matika Duel, Emoji Hadanka
- Obesenec, Vyssie Nizsie
- Bodky a Krabicky (Dots and Boxes, 5x5 grid)
- Doodle Jump (2-player turn-based, canvas, touch + arrows)
- Snake Duel (2 snakes simultaneously, WASD vs arrows, first to 5)

### Solo (mode:'solo'/'always')
- Tetris (wall kicks, ghost piece)
- Snake (canvas, swipe + arrows + buttons, high score)
- Preteky (Racing, coins +2 bonus)
- Statistiky + Achievement system (split reset: stats vs achievements)

## Features (v13-v105)

- **Tutorial/Rules Modal**: help button on all games, opens centralized modal with game rules
- **AI Difficulty**: All AI games have easy/medium/hard selector (shown when `welcomeGameMode==='ai'`)
- **Animations**: cell-appear, flip-card, dice-roll, piece-move, glow-correct, shake-wrong, rps-reveal
- **Sounds**: All games have sounds on key actions (click, correct, wrong, win, flip, hit, move)
- **Offline indicator**: Red banner when device offline, MP button auto-hides
- **Favorites**: Star on game cards, stored in `localStorage('hry_favorites')`, sorted to top
- **Recently played**: Last 5 games tracked in `localStorage('hry_recent')`, shown in grid with clear button
- **Achievement system**: 16 achievements checked after every `addWin()` and `toggleFavorite()`, toast notification on unlock, displayed in Stats page
- **Split stats reset**: Separate buttons for resetting game stats vs achievements, with reusable confirm dialog
- **Active turn indicator**: Inactive player card dims to 40% opacity, active shows colored "Na rade" badge
- **Chess coordinates**: A-H / 1-8 around board, flipped for black in MP
- **Chess voice commands**: Web Speech API (`sk-SK`), say "E2 E4" to move, mic toggle button
- **Chess stalemate**: Detected after turn switch — 0 legal moves = draw
- **Tetris wall kicks**: `tetRotate()` tries kick offsets `[0,-1,1,-2,2]`
- **Tetris ghost piece**: Semi-transparent preview of where piece will land (0.25 opacity)
- **Wordle word validation**: Both PVP set phase and guess phase validate against word list
- **Connect 4 AI**: Medium blocks opponent wins; hard blocks + seeks own wins + center preference
- **Doodle Jump**: Canvas game with platforms (normal/moving/breaking), power-ups (spring/rocket), 2-player turn-based
- **Breakout/Arkanoid**: Canvas brick breaker, 3 difficulties, PvP alternating
- **Pong**: Classic 2-paddle game, canvas, AI mode
- **Tank Battle**: 16x16 grid arena, WASD+Space vs Arrows+Enter, walls, projectiles, power-ups (shield/rapid/speed)
- **Snake Duel**: 2 snakes simultaneously, WASD vs arrows, first to 5 rounds
- **stopAllGames()**: All game loops stop on navigation (no background sounds/vibrations)
- **AI mode P2 controls hidden**: Tank Battle hides P2 mobile buttons in AI mode, arrows control P1
- **MP TURN servers**: Metered TURN for cross-network play, password-protected (STUN-first, TURN fallback)
- **MP connection type indicator**: Shows "Cez server (TURN)" or "Priame spojenie" after connecting
- **MP session persistence**: `sessionStorage` saves roomCode/isHost/myName, auto-reconnect on refresh (8s timeout)
- **MP QR codes**: QR generation (QRCode.js) for room code, QR scanning (BarcodeDetector API)
- **MP name sync**: Player names from welcome screen sync to opponent via handshake
- **Player name persistence**: Names saved to localStorage, empty by default, each device remembers its own names
- **Game count + copyright**: "Obsahuje 36 hier!" on welcome, "(c) Dusan Oravsky" at bottom
- **SW auto-reload**: New service worker version triggers automatic page reload
- **Dark/light theme**: Automatic by time of day + manual toggle

## Adding a New Game

1. Add game HTML section with `id="gameId"` inside `.container`
2. Add entry to `MOBILE_GAMES` array with `{id, icon, mode, mp?}`
3. Add entry to `GAME_NAMES` object
4. Add to `gameKeys` object (button ID mapping)
5. Add stat key to both `getActiveP1Name` and `getActiveP2Name`
6. Add `reset*()` function and call it in init section (AFTER `const MP` AND `let welcomeGameMode`)
7. Implement game logic with `addWin()` calls for all outcomes
8. For AI mode: block player clicks with `if(welcomeGameMode==='ai' && turn===opponent) return;`
9. **CRITICAL**: Verify your `reset*()` function does NOT reference any `const`/`let` variable declared later in the file. Grep all referenced variables and check line numbers.
10. For colors: use `color:inherit` instead of `color:white` — supports both dark and light mode
11. Add timer/raf cleanup to `stopAllGames()` function
12. For canvas games with keyboard: guard with `if(currentGameId!=='yourGame')return;`
13. In AI mode: hide P2 mobile controls via `applyGameMode()`, remap arrows to P1

## Online Multiplayer

**Architecture:**
- PeerJS 1.5.5 (CDN: `unpkg.com/peerjs@1.5.5`)
- WebRTC peer-to-peer, cloud broker: `0.peerjs.com`
- Floating globe button (hidden in AI mode)
- **TURN password-protected** — STUN-first, TURN fallback with password

**ICE Config (STUN-first + TURN fallback):**
```javascript
const STUN_ONLY_CONFIG = {
  host: '0.peerjs.com', port: 443, secure: true, debug: 0,
  config: { iceServers: [
    {urls:'stun:stun.l.google.com:19302'},
    {urls:'stun:stun.relay.metered.ca:80'}
  ]}
};
const TURN_CONFIG = {
  host: '0.peerjs.com', port: 443, secure: true, debug: 0,
  config: { iceServers: [
    {urls:'stun:stun.l.google.com:19302'},
    {urls:'stun:stun.relay.metered.ca:80'},
    {urls:'turn:global.relay.metered.ca:80', username:'...', credential:'...'},
    // + TCP/TLS variants on ports 80 and 443
  ]}
};
const TURN_PASSWORD = 'lukaskonatalka2026';
```
- `mpGetConfig()` returns STUN_ONLY or TURN based on `mpIsTurnUnlocked()`
- TURN unlock stored in `localStorage('mp_turn_unlocked')`
- MP modal has TURN section with password input and lock/unlock buttons

**Connection Flow (guest):**
1. Try STUN-only connection (8s timeout)
2. If fails → show TURN password prompt
3. Correct password → reconnect with TURN config
4. Both sides need TURN unlocked for cross-network play

**Connection Type Detection:**
- `mpCheckConnectionType()` — called after connection opens, uses `RTCPeerConnection.getStats()`
- Checks BOTH local and remote ICE candidates for `candidateType === 'relay'`
- Shows badge: "Cez server (TURN)" or "Priame spojenie"
- `MP._isRelay` — boolean flag set after detection

**MP State:**
```javascript
const MP = {
  peer: null, connection: null,
  isHost: false, isConnected: false,
  roomCode: null, myName: '', opponentName: '',
  tttRound: 0, memRound: 0, c4Round: 0, chRound: 0,
  dkRound: 0, bsRound: 0, ludoRound: 0, gnRound: 0
};
```

**Session Persistence:**
- `mpSaveSession()` — saves to sessionStorage after handshake
- `mpClearSession()` — clears on disconnect
- `mpTryReconnect()` — called on page load, 8s timeout, toast UI

**Player Names in MP:**
- Both host and guest use `wP1Input` (device owner's name) as their MP name
- MP handshake temporarily swaps globalP1/globalP2 to show correct names
- `MP._savedP1`/`MP._savedP2` stores originals, restored on disconnect
- `saveNames()` is blocked when `MP._savedP1` exists (prevents overwriting local names)

**Games with MP Support (9 games):**
- Piskvorky — `ttt-move`, alternating start (tttRound)
- Connect4 — `c4-move`
- Kamen Papier Noznice — `rps-choice`
- Sach — `ch-move`
- Dama — `dk-move`
- Pexeso — `mem-flip`, `mem-board` (host sends card layout)
- Lodicky — `bs-shoot`, `bs-result`, `bs-ready`, `bs-gameover`
- Clovece — `ludo-roll`, `ludo-move`
- Hadaj Cislo — `gn-setup`, `gn-guess`, `gn-feedback`

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
- Alternating start player via round counter (all games)
- Rematch resets game and syncs via `mp-rematch` message
- Name sync: handshake sets globalP1/globalP2 from MP names, restored on disconnect
- `getChessColorName(color)` maps chess color to correct player name based on round
- QR code for room joining: `mpGenerateQR()` / `mpScanQR()`
- Cleanup old peers: `mpCreateRoom()` and `mpJoinRoom()` destroy previous peer before creating new one

## Game State Objects

Key game state objects and their patterns:
- `TET` — Tetris (W, H, board, piece, ghost, score, best, running)
- `SNK` — Snake (W, H, snake array, food, dir, score, best, running)
- `DOOD` — Doodle Jump (W:320, H:480, platforms, score, best, player, s1/s2, phase)
- `CH` — Chess (board 8x8, turn, selected, castling, enPassant)
- `C4` — Connect 4 (board 6x7, turn, s1/s2)
- `BS` — Battleship (grids, ships, phase)
- `WDL` — Wordle (word, guesses, phase)
- `SCR` — Scramble (word, scrambled, rounds, totalRounds)
- `LS` — Lang Scramble
- `MEM` — Pexeso (cards, flipped, matched)
- `DB` — Dots and Boxes (rows:5, cols:5, lines, boxes)
- `RACE` — Racing (lanes, obstacles, coins, score)
- `BRK` — Breakout (canvas, bricks, ball, paddle, score)
- `PNG` — Pong (canvas, paddles, ball, scores, first to 10)
- `TNK` — Tank Battle (16x16 grid, tanks, bullets, walls, powerup, cooldowns, first to 5)
- `SDUEL` — Snake Duel (2 snakes, directions, scores, first to 5)

## Performance Optimization

### DOM Helper Function
`const $ = id => document.getElementById(id);` — used throughout codebase.

### stopAllGames()
Centralized cleanup function that stops all game timers/rafs:
- SNK.timer, TET.dropTimer, RACE.interval, DOOD.raf, BRK.raf, PNG.raf, TNK.timer, SDUEL.timer, REAC.timeout
- Called by `mobileGoTo()` and desktop sidebar game switching

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```
GitHub Pages auto-deploys from main branch.

## Common Issues

- **Blank screen / can't click**: JS crash from TDZ. Check browser console. Most common: `const`/`let` variable referenced before declaration. See "CRITICAL: TDZ Declaration Order" section.
- **Cache not updating**: Hard refresh (Ctrl+Shift+R). Bump `APP_VERSION` + `CACHE_NAME`. SW auto-reload should handle most cases.
- **Board too small on mobile**: Use `max-width:min(Xpx, 90vw)` with `1fr` grid columns.
- **Text invisible**: Don't hardcode `color:white` — use `color:inherit` to handle both dark/light mode.
- **Topbar disappearing**: `#mobileGameView` and `#mobileGamePicker` need `position:fixed`.
- **Mode selectors in games**: Hidden via `applyGameMode()` when mode chosen from welcome screen.
- **Games running in background**: All game loops must be added to `stopAllGames()` and stopped on navigation.

### MP-Specific Issues

- **TDZ crash (v10-v12, v28-v38, v42)**: `const`/`let` declarations are NOT hoisted. Even `typeof` throws in TDZ. Solution: declare ALL variables before any init calls. This applies to `const MP`, `let welcomeGameMode`, and any other module-level variable.
- **Game state desync**: Host MUST send all game settings in handshake. Guest applies via UI functions.
- **Guest changing settings**: Block or hide setting controls for guest in MP mode.
- **Duplicate declarations**: Always `grep "const MP\|let welcomeGameMode" index.html` before changes.
- **TURN servers replace PeerJS defaults**: When `config: { iceServers: [...] }` is specified in Peer(), it REPLACES (not supplements) PeerJS built-in ICE servers. Always include STUN servers alongside TURN.
- **Stale peers on PeerJS broker**: Always destroy old peer before creating new one in mpCreateRoom/mpJoinRoom.
- **MP name overwrite**: `saveNames()` must NOT run when `MP._savedP1` exists, otherwise MP temporary names overwrite user's real names in localStorage.

## TURN Server (Metered)

- **Provider**: Metered (relay.metered.ca), free tier
- **Password**: `lukaskonatalka2026` — stored in `TURN_PASSWORD` constant
- **Config**: `STUN_ONLY_CONFIG` (same WiFi) and `TURN_CONFIG` (cross-network), selected by `mpGetConfig()`
- **Unlock UI**: TURN section in MP modal + automatic prompt on STUN failure
- **Unlock storage**: `localStorage('mp_turn_unlocked')` — persists across sessions
- **Connection flow**: STUN-first (8s timeout) → TURN password prompt → reconnect with TURN
- **Same WiFi**: Uses direct/STUN connection (no TURN quota used)
- **Different networks**: Uses TURN relay (both sides need TURN unlocked)
