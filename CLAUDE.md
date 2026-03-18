# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~19000 lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vX.Y`)
- **Current version**: v17.3
- **PeerJS version**: 1.5.5 (CDN: `unpkg.com/peerjs@1.5.5`)
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (default, 2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS + Metered TURN (password-protected)
- **DOM helper**: `const $ = id => document.getElementById(id);` — shorter syntax for DOM access
- **Game cleanup**: `stopAllGames()` — stops all running game timers/rafs on navigation

## CRITICAL: TDZ Declaration Order

**ALL `const`/`let` variables MUST be declared BEFORE any code that references them at init time.**

`const` and `let` in JavaScript have a "temporal dead zone" (TDZ). Even `typeof X` throws a ReferenceError if `const X` or `let X` is declared later in the same scope. This has caused crashes in v10-v12, v28-v38, v42, and v6.3.

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
- `globalP1`, `globalP2`, `globalP3`, `globalP4` — player names (P1/P2 from welcome, P3/P4 for Ludo)
- `_p1Avatar`, `_p2Avatar`, `_p3Avatar`, `_p4Avatar` — emoji avatars for all 4 players (stored in localStorage)
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `renderMobileGrid()` — filters MOBILE_GAMES based on welcomeGameMode
- `currentGameId` — currently active game, used to prevent keyboard conflicts between games

## Games (48 total)

### 2 Players + vs Computer (mode:'both')
- Piskvorky (3x3, 4x4, 5x5, 10x10) [MP]
- Connect 4 [MP] (AI: easy/medium/hard)
- Kamen Papier Noznice [MP] (AI: easy/medium/hard)
- Hadaj Cislo [MP]
- Pexeso (6 random themes) [MP]
- Sach [MP] (AI: easy/medium/hard, complete official rules: check/checkmate, castling, en passant, pawn promotion dialog, 50-move rule, legal move filtering)
- Dama [MP] (AI: easy/medium/hard)
- Lodicky (Battleship) [MP] (AI: easy/medium/hard)
- Clovece nehnevaj sa [MP] (AI: easy/medium/hard, PVP: 2/3/4 hráči s vlastnými menami a avatármi pre P3/P4)
- Puzzle Scramble (canvas, 3x3/4x4/5x5)
- Mini Labyrint (AI: easy/medium/hard — hard:30ms, medium:80ms, easy:180ms)
- Reversi/Othello (AI: easy/medium/hard)
- Wordle [MP] (SK: ~400 slov, EN: ~400 slov, language selector, word validation, MP: simultaneous guessing with tie-breaking)
- Breakout/Arkanoid (AI: easy/medium/hard, canvas, roundRect polyfill)
- Pong [MP] (AI: easy/medium/hard, canvas, W/S + arrows, touch drag, first to 10)
- Tank Battle [MP] (AI: easy/medium/hard, 16x16 grid, power-ups: shield/rapid/speed)
- Vcely / Bee Counting (AI: easy/medium/hard, canvas, bees fly into 3 hives, guess which got most, solo X/5 in AI mode)
- Futbal / Soccer (AI: easy/medium/hard, canvas, penalty shootout with swinging arrow + power bar, solo X/5 in AI mode)
- Uno (AI: easy/medium/hard, color/number matching, wild, +2, +4 Wild Draw Four, skip, reverse, UNO! callout)
- Nim (AI: easy/medium/hard, 4 piles 1/3/5/7, take 1-3, misère — last stone loses, Grundy XOR strategy)
- Angry Birds (AI: easy/medium/hard, canvas, drag & release slingshot, parabolic physics, destructible boxes, 5 shots per player)
- Sokoban (AI: easy/medium/hard, 10 original Hiroyuki Imabayashi levels, push-box puzzle, canvas grid rendering, undo system, BFS hint solver, level progression, PVP: both players complete each level before advancing)

### 2 Players Only (mode:'pvp')
- Kviz (17 tem, 1000+ otazok)
- Ghost (EN: 531 slov, SK)
- Reakcny Test (200ms penalty for early tap)
- Scramble / Jazykovy Scramble (5/10/15 rounds selector)
- Flashcards / Dopln pismeno / Prekladaj vety
- Spam Click, Matika Duel, Emoji Hadanka
- Obesenec, Vyssie Nizsie
- Bodky a Krabicky (Dots and Boxes, 5x5 grid)
- Doodle Jump (2-player turn-based, canvas, touch + arrows, 2 modes: wrap/wall)
- Snake Duel [MP] (2 snakes simultaneously, WASD vs arrows, first to 5)

### Solo (mode:'solo'/'always')
- Tetris (wall kicks, ghost piece)
- Snake (canvas, swipe + arrows + buttons, high score)
- Preteky (Racing, coins +2 bonus)
- Gravity Run (canvas, endless runner with gravity flip, high score, space/click/tap to flip)
- Minesweeper / Míny (8x8/10x10/12x12, iterative flood-fill, flag mode, timer, tournament-compatible in AI mode)
- 2048 (4x4 sliding tiles, swipe + arrows, high score in localStorage, leaderboard)
- Flappy Bird (canvas, tap/space/click to flap, pipe obstacles, high score, leaderboard)
- Vojna / War (pure luck card game, higher card takes both, war on tie, quick play button)
- Solitaire / Klondike (7 tableau columns, 4 foundations, stock/waste, click-to-select, undo, auto-complete, timer)
- Nonogram / Picross (5x5, 8 predefined patterns, error limit 3, long-press for X marks)
- Sudoku (easy/medium/hard, backtracking generator, group highlighting, keyboard input)
- Statistiky + Achievement system (43 achievements, split reset: stats vs achievements)

## Features (v13-v114, v4.0+)

- **Tutorial/Rules Modal**: help button on all games, opens centralized modal with game rules
- **AI Difficulty**: All AI games have easy/medium/hard selector (shown when `welcomeGameMode==='ai'`)
- **Animations**: cell-appear, flip-card, dice-roll, piece-move, glow-correct, shake-wrong, rps-reveal
- **Sounds**: All games have sounds on key actions (click, correct, wrong, win, flip, hit, move)
- **Offline indicator**: Red banner when device offline, MP button auto-hides
- **Favorites**: Star on game cards, stored in `localStorage('hry_favorites')`, sorted to top
- **Recently played**: Last 5 games tracked in `localStorage('hry_recent')`, shown in grid with clear button
- **Achievement system**: 43 achievements (16 general + 23 per-game + 4 daily) checked after every `addWin()`, `toggleFavorite()`, and `dailyCheckComplete()`, toast notification on unlock, displayed in Stats page
- **Split stats reset**: Separate buttons for resetting game stats vs achievements, with reusable confirm dialog
- **Active turn indicator**: Inactive player card dims to 40% opacity, active shows colored "Na rade" badge
- **Chess coordinates**: A-H / 1-8 around board, flipped for black in MP
- **Chess voice commands**: Web Speech API (`sk-SK`), say "E2 E4" to move, mic toggle button
- **Chess complete rules**: Legal move filtering (can't move into check or ignore check), check detection with red king highlight, checkmate (0 legal moves + in check = win), stalemate (0 legal moves + not in check = draw), castling (kingside/queenside with through-check validation), en passant capture, pawn promotion dialog (Q/R/B/N choice), 50-move rule draw
- **Chess timer**: Optional game timer with 5/10/15 min modes, per-player countdown, automatically disabled in MP mode (not supported), time loss detection
- **Tetris wall kicks**: `tetRotate()` tries kick offsets `[0,-1,1,-2,2]`
- **Tetris ghost piece**: Semi-transparent preview of where piece will land (0.25 opacity)
- **Wordle word validation**: Both PVP set phase and guess phase validate against word list
- **Connect 4 AI**: Medium blocks opponent wins; hard blocks + seeks own wins + center preference
- **Doodle Jump**: Canvas game with platforms (normal/moving/breaking), power-ups (spring/rocket), 2-player turn-based
- **Breakout/Arkanoid**: Canvas brick breaker, 3 difficulties, PvP alternating
- **Pong**: Classic 2-paddle game, canvas, AI mode
- **Tank Battle**: 16x16 grid arena, WASD+Space vs Arrows+Enter, walls, projectiles, power-ups (shield/rapid/speed)
- **Snake Duel**: 2 snakes simultaneously, WASD vs arrows, first to 5 rounds
- **stopAllGames()**: All game loops stop on navigation (no background sounds/vibrations), includes chess voice recognition
- **Game Pause/Resume**: Tetris, Snake, Racing have pause button (⏸️/▶️), game logic pauses, status text updates
- **PWA Install Prompt**: "Inštaluj aplikáciu" button on welcome screen, captures `beforeinstallprompt`, auto-hides after install
- **AI Pre-thinking**: Chess and Checkers (hard mode) calculate next move during player's turn, 300ms delay, board snapshot validation
- **MP Role Badge**: HOST/GUEST indicator in MP modal title, updates on connect/disconnect
- **AI mode P2 controls hidden**: Tank Battle hides P2 mobile buttons in AI mode, arrows control P1
- **MP TURN servers**: Metered TURN for cross-network play, password-protected (STUN-first, TURN fallback)
- **MP connection type indicator**: Shows "Cez server (TURN)" or "Priame spojenie" after connecting
- **MP session persistence**: `sessionStorage` saves roomCode/isHost/myName, auto-reconnect on refresh (8s timeout)
- **MP auto-reconnect**: Automatic reconnection after unexpected disconnect (WiFi drop), max 3 attempts with 2s delay, toast notifications showing reconnect status, session preserved during attempts
- **MP QR codes**: QR generation (QRCode.js) for room code, QR scanning (BarcodeDetector API)
- **MP name sync**: Player names from welcome screen sync to opponent via handshake
- **Player name persistence**: Names saved to localStorage, empty by default, each device remembers its own names
- **Game count + copyright**: "47 hier pre celú rodinu" on welcome, "(c) Dusan Oravsky" at bottom
- **Version-tracked SW update**: Service worker installs immediately, version tracking via localStorage shows update toast, user clicks to reload when ready, prevents blank page during GitHub outage, works fully offline
- **Dark/light theme**: Automatic by time of day + manual toggle
- **Bee Counting**: Canvas game, bees fly into 3 hives via bezier paths, guess which hive got most, solo mode shows "Správne: X/5" (no P2 in AI mode)
- **Soccer/Futbal**: Canvas penalty shootout, swinging arrow for direction + oscillating power bar, AI keeper (easy 20%/medium 45%/hard 70% intercept), solo X/5 or PvP alternating
- **Gravity Run**: Canvas endless runner, player runs on floor/ceiling, tap/space to flip gravity, obstacles spawn on both sides, increasing speed, high score in localStorage
- **Solo mode pattern**: Games with mode:'both' show solo score (X/5) in AI mode — hide player-info div, show soloScore div via `applyGameMode()` and `reset*()`
- **mpSend() helper**: Wraps `MP.connection.send()` with null checks and try/catch — all 46+ send calls use this
- **AI difficulty persistence**: `saveDiff(gameId,d)` / `loadDiff(gameId)` save to `localStorage('hry_diff_'+gameId)`, `restoreAllDiffs()` on page load
- **Game categories**: 6 categories (Všetky, Doskové, Arkádové, Slovné, Logické, Zábavné), `GAME_CATS` array, `cat` property on MOBILE_GAMES, horizontal scrollable pills
- **Confetti on wins**: Canvas confetti animation on any win via `addWin()`, 150 particles, 2.5s duration
- **Daily Challenge**: 32 games rotation, streak badge in button (🔥X), 30-day calendar in Stats section (green=completed), history in localStorage
- **Emoji Avatars**: 46 emoji options for all 4 players (P1/P2 on welcome screen, P3/P4 in Ludo), stored in localStorage, shown in game cards
- **Top 5 Leaderboard**: Solo games (Tetris, Snake, Racing, Gravity Run, 2048, Flappy Bird) track top 5 scores in localStorage
- **Wordle MP**: Simultaneous guessing mode, both players see own board, tie-breaking logic (fewer rows wins, equal = draw)
- **2048**: Classic sliding tile puzzle, 4x4 grid, swipe + arrows, merge tiles to reach 2048, high score + leaderboard
- **Flappy Bird**: Canvas game, tap/space/click to flap, pipe obstacles with gap, gravity physics, high score + leaderboard
- **Animated transitions**: Slide animations (slideInRight/slideOutLeft) between navigation levels, cardPop for game cards
- **Welcome screen UX**: Time-based greeting, rotating emoji animation, continue last game button, pulse animation on start button
- **Solitaire (Klondike)**: Click-to-select interaction, undo (single-level JSON snapshot), auto-complete when all face-up, timer starts on first move
- **War quick play**: Auto-plays entire game at 100ms per round, epoch-protected timeouts
- **Uno Wild Draw Four**: +4 cards only playable when no matching color cards (official rules), UNO! toast when 1 card left
- **Nim**: Classic misère variant (last stone loses), 4 piles (1,3,5,7), take 1-3, hard AI uses Grundy values (n%4 XOR)
- **Doodle Jump modes**: Wrap mode (pass through edges) and Wall mode (bounce off walls, brick rendering, separate high scores, horizontal platform distance limit 120px)
- **Nonogram/Picross**: 5x5 grid puzzles, 8 predefined patterns, fill/X toggle, max 3 errors with red feedback, long-press for X on mobile, timer
- **Sudoku**: 3 difficulties, backtracking generator with unique solutions, group highlighting (row/col/box), keyboard input, error tracking, timer
- **Tank Battle wallSet**: O(1) wall lookups using Set instead of O(n) array includes
- **Fullscreen mode**: Canvas games (Snake, Doodle Jump, Breakout, Gravity Run, Flappy Bird, Angry Birds) have fullscreen button (⛶), wrapper-based approach with exit button overlay, auto-cleanup on exit
- **Sound & Vibration Persistence**: Settings saved to localStorage ('hry_sound', 'hry_vibration'), restored on page load via `loadSoundSettings()`, prevents frustrating reset-to-defaults on reload
- **Angry Birds**: Slingshot physics game, drag & release mechanics, parabolic bird flight with gravity, destructible box towers, PvP: 5 shots per player, AI: varying accuracy based on difficulty
- **Sokoban**: Classic push-box puzzle, 10 original Hiroyuki Imabayashi levels (progressive difficulty), player pushes boxes (📦) onto targets (⭐), can't pull/push 2 boxes, unlimited undo system, BFS AI hint solver (500/2000/5000 iterations), level selector, move counter & timer, auto-advance on win, WASD/arrows/swipe controls

## Adding a New Game

1. Add game HTML section with `id="gameId"` inside `.container`
2. Add entry to `MOBILE_GAMES` array with `{id, icon, mode, mp?}`
3. Add entry to `GAME_NAMES` object
4. Add to `gameKeys` object (button ID mapping)
5. Add stat key to both `getActiveP1Name` and `getActiveP2Name`
6. Add `reset*()` function and call it AFTER the `const` state object declaration (either in init section or right after the game section). **NEVER call reset before the const declaration — TDZ crash!**
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
  dkRound: 0, bsRound: 0, ludoRound: 0, gnRound: 0,
  sdRound: 0, tnkRound: 0, pngRound: 0, wdlRound: 0,
  _intentionalDisconnect: false,
  _reconnectAttempts: 0,
  _maxReconnectAttempts: 3,
  _reconnectTimeout: null
};
```

**Session Persistence & Auto-Reconnect:**
- `mpSaveSession()` — saves to sessionStorage after handshake
- `mpClearSession()` — clears on disconnect
- `mpTryReconnect()` — called on page load, 8s timeout, toast UI
- `mpHandleDisconnect()` — distinguishes intentional vs unintentional disconnect, triggers auto-reconnect
- `mpAutoReconnect()` — max 3 attempts with 2s delay, preserves session, shows toast notifications
- `showToast()` — utility for reconnect status messages

**Player Names in MP:**
- Both host and guest use `wP1Input` (device owner's name) as their MP name
- MP handshake temporarily swaps globalP1/globalP2 to show correct names
- `MP._savedP1`/`MP._savedP2` stores originals, restored on disconnect
- `saveNames()` is blocked when `MP._savedP1` exists (prevents overwriting local names)

**Games with MP Support (13 games):**

*Turn-based (10 games):*
- Piskvorky — `ttt-move`, alternating start (tttRound)
- Connect4 — `c4-move`
- Kamen Papier Noznice — `rps-choice`
- Sach — `ch-move`
- Dama — `dk-move`
- Pexeso — `mem-flip`, `mem-board` (host sends card layout)
- Lodicky — `bs-shoot`, `bs-result`, `bs-ready`, `bs-gameover`
- Clovece — `ludo-roll`, `ludo-move`
- Hadaj Cislo — `gn-setup`, `gn-guess`, `gn-feedback`
- Wordle — `wdl-word`, `wdl-guess`, `wdl-result` (simultaneous guessing, both see own board, tie-breaking)

*Real-time (3 games — host-authoritative architecture):*
- Snake Duel — `sd-start`, `sd-dir`, `sd-state` (host runs setInterval, guest sends direction only)
- Tank Battle — `tnk-start`, `tnk-input`, `tnk-state` (host runs setInterval at 8fps, guest sends keys+shoot)
- Pong — `png-start`, `png-input`, `png-state` (host runs RAF, sends state every 3 frames, guest sends paddle dir/position)

**Adding MP to a Game:**
1. Add `mp:true` to MOBILE_GAMES entry
2. In click handler, check turn: `if(MP.isConnected) { if(notMyTurn) return; }`
3. Send move: `MP.connection.send({type:'game-move', ...data})`
4. Handle in `mpHandleMessage()`: `if(data.type==='game-move') { applyMove(); }`
5. Add rematch support in `mpRematch()` and `mp-rematch` handler
6. Guest settings sync: host sends settings in handshake, guest applies

**Real-time MP Pattern (Snake Duel, Tank Battle, Pong):**
- Host runs game loop (setInterval or RAF), guest does NOT run game logic
- Guest sends only inputs (direction, keys, shoot) — host applies as P2
- Host sends full game state every tick (or every N frames for bandwidth)
- Guest receives state, updates local variables, renders
- Guest plays sounds based on state changes (score diff, death flags, ate flag)
- P2 mobile controls hidden in MP (each player uses own P1 controls)
- Input wrapper functions (sdSetDir, tnkSetKey, pngSetDir) handle MP routing
- Start button: only host can start; guest click does nothing

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
- `SD` — Snake Duel (2 snakes, directions, scores, first to 5)
- `BEE` — Bee Counting (canvas, hives, bees, phase, timers, scores, solo X/5)
- `SOC` — Soccer (canvas, arrow angle, power, keeper, ball, penalty shootout)
- `GRAV` — Gravity Run (canvas, player, obstacles, particles, gravDir, score, best)
- `MS` — Minesweeper (grid[][], rows, cols, mines, diff, revealed, flagged, totalSafe, gameOver, won, firstClick, started, timer, flagMode)
- `WAR` — War card game (deck1, deck2, card1, card2, pile, over, animating, _timer, _epoch, _quick)
- `UNO` — Uno (hand1, hand2, deck, discard, turn, dir, over, topColor, diff, pendingWild, _timer)
- `SOL` — Solitaire (tableau[]x7, foundation[]x4, stock, waste, selected, moves, timer, time, over, started, _undo)
- `NIM` — Nim (piles[1,3,5,7], turn, over, selected, diff, s1, s2, _timer)
- `G48` — 2048 (grid 4x4, score, best, won, over)
- `FLAP` — Flappy Bird (canvas, bird, pipes, score, best, running, raf)
- `AB` — Angry Birds (W:400, H:300, turn, s1, s2, shots1, shots2, maxShots:5, diff, slingX, slingY, bird, birdFlying, drag, dragX, dragY, boxes, raf, over)
- `SOK` — Sokoban (level:0-9, grid[][], w, h, px, py, boxes[{x,y}], targets[{x,y}], moves, moveHistory[], time, timer, turn, s1, s2, diff, aiSolving, cellSize, over, won, p1Completed, p2Completed)
- `NG` — Nonogram (size, pattern, solution[][], player[][], errors, maxErrors:3, started, timer)
- `SDK` — Sudoku (grid[][], solution[][], given[][], selected, diff, errors, timer)

## Performance Optimization

### DOM Helper Function
`const $ = id => document.getElementById(id);` — used throughout codebase.

### stopAllGames()
Centralized cleanup function that stops all game timers/rafs:
- SNK.timer, TET.dropTimer, RACE.interval, DOOD.raf, BRK.raf, PNG.raf, TNK.timer, SD.timer, REAC.timeout, BEE timers, SOC.raf, GRAV.raf, FLAP.raf, AB.raf, MS.timer, WAR._timer, UNO._timer, SOL.timer, NIM._timer
- Called by `mobileGoTo()` and desktop sidebar game switching

## Deploy

After committing, always push automatically:
```bash
git add index.html sw.js
git commit -m "description"
git push
```
GitHub Pages auto-deploys from main branch. Git credentials are configured via `credential.helper store` — push should work without prompts.

### Service Worker Update Flow

**Version tracking with localStorage:**
1. New version deployed → SW installs immediately (skipWaiting + claim)
2. `APP_VERSION` compared with `localStorage('hry_last_version')`
3. If different → show toast "🎮 Nová verzia nainštalovaná! [Obnoviť stránku]"
4. Version saved to localStorage immediately (not on button click)
5. User clicks button → `location.reload()`
6. Next F5 → no toast (versions match)

**Offline resilience:**
- SW install must complete before activation → assets in cache
- If GitHub offline during install → install fails, old version keeps working
- If GitHub offline after install → reload works from cache
- Toast appears even after hard refresh (version tracking)

**Version bump:**
- Update `APP_VERSION` in index.html
- Update `CACHE_NAME` in sw.js (format: `hrajmesi-vX.Y`)
- Keep versions in sync

## Common Issues

- **Blank screen / can't click**: JS crash from TDZ or undefined function. Check browser console. Most common: `const`/`let` variable referenced before declaration, or calling non-existent function (e.g., v15.3 had `getActiveName('ab')` undefined). See "CRITICAL: TDZ Declaration Order" section. **Solution**: Hard refresh (Ctrl+Shift+R) to get latest fixed version.
- **Cache not updating**: Hard refresh (Ctrl+Shift+R). Bump `APP_VERSION` + `CACHE_NAME`. SW auto-reload should handle most cases.
- **Board too small on mobile**: Use `max-width:min(Xpx, 90vw)` with `1fr` grid columns.
- **Text invisible**: Don't hardcode `color:white` — use `color:inherit` to handle both dark/light mode.
- **Topbar disappearing**: `#mobileGameView` and `#mobileGamePicker` need `position:fixed`.
- **Mode selectors in games**: Hidden via `applyGameMode()` when mode chosen from welcome screen.
- **Games running in background**: All game loops must be added to `stopAllGames()` and stopped on navigation.

### MP-Specific Issues

- **TDZ crash (v10-v12, v28-v38, v42, v6.3)**: `const`/`let` declarations are NOT hoisted. Even `typeof` throws in TDZ. Solution: declare ALL variables before any init calls. This applies to `const MP`, `let welcomeGameMode`, `const SOC`, `const GRAV`, `const BEE`, and any other module-level variable. **Best practice: place `reset*()` call right after the game section (after const + functions), NOT in a centralized init block that runs before the const.**
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
