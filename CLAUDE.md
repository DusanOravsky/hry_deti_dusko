# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~11600 lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vN`)
- **Current version**: v52
- **PeerJS version**: 1.5.5 (CDN: `unpkg.com/peerjs@1.5.5`)
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (default, 2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS + Metered TURN (password-protected)

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
  - `'solo'` = solo games (Tetris, Racing)
  - `'always'` = always shown (Stats)
  - `mp:true` = has online multiplayer support (shows globe badge)
- `welcomeGameMode` — `'pvp'` (default) or `'ai'`
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `renderMobileGrid()` — filters MOBILE_GAMES based on welcomeGameMode

## Games (31 total)

### 2 Players + vs Computer (mode:'both')
- Piskvorky (3x3, 4x4, 5x5, 10x10) [MP]
- Connect 4 [MP]
- Kamen Papier Noznice [MP]
- Hadaj Cislo [MP]
- Pexeso (6 random themes) [MP]
- Sach [MP] (AI: easy/medium/hard)
- Dama [MP] (AI: easy/medium/hard)
- Lodicky (Battleship) [MP] (AI: easy/medium/hard)
- Clovece nehnevaj sa [MP] (AI: easy/medium/hard)
- Puzzle Scramble
- Mini Labyrint (AI: easy/medium/hard)
- Reversi/Othello (AI: easy/medium/hard)
- Wordle (SK: ~400 slov, EN: ~400 slov, language selector)

### 2 Players Only (mode:'pvp')
- Kviz (17 tem)
- Ghost
- Reakcny Test
- Scramble / Jazykovy Scramble
- Flashcards / Dopln pismeno / Prekladaj vety
- Spam Click, Matika Duel, Emoji Hadanka
- Obesenec, Vyssie Nizsie
- Bodky a Krabicky (Dots and Boxes)

### Solo (mode:'solo'/'always')
- Tetris
- Snake (canvas, swipe + arrows + buttons, high score)
- Preteky (Racing)

## Features (v13-v44)

- **Tutorial/Rules Modal (v44)**: ❓ help button on all 30 games, opens centralized modal with game rules. Rules hidden by default for cleaner UI. Click button or outside modal to close.
- **AI Difficulty**: All AI games have easy/medium/hard selector (shown when `welcomeGameMode==='ai'`)
- **Animations**: cell-appear, flip-card, dice-roll, piece-move, glow-correct, shake-wrong, rps-reveal
- **Sounds**: All games now have sounds on key actions (click, correct, wrong, win, flip, hit, move)
- **Offline indicator**: Red banner when device offline, MP button auto-hides
- **Favorites**: Star on game cards, stored in `localStorage('hry_favorites')`, sorted to top
- **Recently played**: Last 5 games tracked in `localStorage('hry_recent')`, shown in grid with clear button
- **Achievement system**: 16 achievements checked after every `addWin()` and `toggleFavorite()`, toast notification on unlock, displayed in Stats page
- **Active turn indicator**: Inactive player card dims to 40% opacity, active shows colored "Na rade" badge
- **Chess coordinates**: A-H / 1-8 around board, flipped for black in MP
- **Chess voice commands**: Web Speech API (`sk-SK`), say "E2 E4" to move, mic toggle button
- **MP TURN servers**: Metered TURN for cross-network play, password-protected (STUN-first, TURN fallback)
- **MP connection type indicator**: Shows "Cez server (TURN)" or "Priame spojenie" after connecting
- **MP session persistence**: `sessionStorage` saves roomCode/isHost/myName, auto-reconnect on refresh (8s timeout)
- **MP QR codes**: QR generation (QRCode.js) for room code, QR scanning (BarcodeDetector API)
- **MP name sync**: Player names from welcome screen sync to opponent via handshake
- **Player name persistence**: Names saved to localStorage, empty by default, each device remembers its own names
- **Game count + copyright**: "Obsahuje 31 hier!" on welcome, "(c) Dusan Oravsky" at bottom
- **SW auto-reload**: New service worker version triggers automatic page reload

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

## Performance Optimization (v43+)

### DOM Helper Function

**Added in v43**: `const $ = id => document.getElementById(id);` (line ~3381)

Shorter syntax for DOM access. Used throughout codebase to reduce repetitive `document.getElementById()` calls.

```javascript
// Before (v42):
document.getElementById('tttStatus').textContent = '...';

// After (v43+):
$('tttStatus').textContent = '...';
```

**Benefits:**
- Shorter code (882 → reduced by ~300 chars)
- Better readability
- Same performance (no caching yet, just syntax sugar)
- No logic changes — MP and all games work identically

**Implementation Status (v43):**
- ✅ **Piškvorky (Tic Tac Toe)** — fully optimized (all 4 sizes: 3x3, 4x4, 5x5, 10x10)
- ⏳ **Connect4, Lodičky, Pexeso, etc.** — pending (waiting for MP test confirmation)
- 📝 **Next**: Apply to remaining ~800 `document.getElementById()` calls

**MP Testing Required:**
Before continuing optimization, test MP functionality:
1. Create room (host) + join (guest) on 2 devices
2. Play Piškvorky in all modes (3x3, 4x4, 5x5, 10x10/15x15)
3. Verify turn sync, rematch, score counting
4. If OK → continue to other games

**TDZ Safety:**
- `const $` declared at line ~3381 (early in JS section)
- All `reset*()` calls at ~line 10288+ (safe, no TDZ issues)
- Always verify declaration order before adding new helper functions

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
