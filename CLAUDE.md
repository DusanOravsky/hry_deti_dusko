# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~8400+ lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets (Note: SW was disabled in v36, re-enabled later)
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vN`)
- **Current version**: v55 (2026-03-07)
- **Game modes**: `welcomeGameMode` variable — `''` (default/all games), `'pvp'` (2 players), or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS (v48+)

## Important Variables

- `MOBILE_GAMES` array — defines games with `mode`:
  - `'both'` = AI + PVP (shows in both modes)
  - `'pvp'` = 2-player only (shows only in pvp mode)
  - `'always'` = Solo/Stats (shows only when no mode selected, e.g. Tetris, Stats)
- `welcomeGameMode` — `''` (default), `'pvp'`, or `'ai'`
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `_mobileCurrentGame` / `_gameAreaParent` — tracks which game area is moved into mobile content
- `renderMobileGrid()` — filters MOBILE_GAMES based on welcomeGameMode

## Adding a New Game

1. Add game HTML section with `id="gameId"` inside `.container`
2. Add entry to `MOBILE_GAMES` array with `{id, icon, mode}`
3. Add entry to `GAME_NAMES` object
4. Add button ID mapping if needed
5. Implement game logic with `addWin()` calls for all outcomes (win1, win2, draw)
6. For AI mode: block player clicks during AI turn with `if(welcomeGameMode==='ai' && turn==='ai') return;`

## Online Multiplayer (v48+)

**Architecture:**
- PeerJS library (CDN: `https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js`)
- WebRTC peer-to-peer (no server, direct connection between browsers)
- Cloud broker: `0.peerjs.com` (HTTPS, port 443)

**MP State (`MP` object):**
```javascript
{
  peer: null,           // PeerJS Peer instance
  connection: null,     // DataConnection to opponent
  isHost: false,        // true = room creator, false = joiner
  isConnected: false,   // connection status
  roomCode: null,       // 8-char room code (e.g. "HRAB12C")
  myName: '',          // player's name (from wP1Input/wP2Input)
  opponentName: ''     // opponent's name (from handshake)
}
```

**Connection Flow:**
1. **Host**: `mpCreateRoom()` → generates room code → creates peer with code as ID → waits for connection
2. **Guest**: `mpJoinRoom()` → creates peer with random ID → connects to host via room code
3. **Handshake**: Both send `{type:'handshake', from:'host'|'guest', name:'...'}`
4. **Game sync**: Send moves via `MP.connection.send({type:'ttt-move', index, player})`

**UI Components:**
- Floating button: `.floating-mp-btn` (z-index: 8000, bottom-right)
- Modal overlay: `.mp-overlay` (z-index: 9500, full-screen blur)
- Status: Blue 🌐 (disconnected) → Green pulsing ✅ (connected)

**Integrating MP into a Game:**

1. **Check turn in click handler:**
```javascript
if(MP.isConnected) {
  const mySymbol = MP.isHost ? 'X' : 'O';
  if(GAME.player !== mySymbol) return; // Not your turn
}
```

2. **Send move after validation:**
```javascript
MP.connection.send({
  type: 'game-move',
  data: { index: i, player: GAME.player }
});
```

3. **Receive move in `mpHandleMessage()`:**
```javascript
if(data.type === 'game-move') {
  GAME.board[data.data.index] = data.data.player;
  // ... apply move, check win, switch turn
}
```

4. **Use MP-aware player names:**
```javascript
getTTTPlayerName(symbol) // Returns MP.myName/opponentName in MP mode
```

**Games with MP Support:**
- ✅ Piškvorky (v49+) - full sync with player names
- 🔜 Connect4, Ghost, Hádaj Číslo, Obesenec (planned)

**MP UI Improvements:**
- **v51**: Player role indicators after connection
  - Host sees: "✅ Pripojený! Si Hráč 1 🔴 (X)"
  - Guest sees: "✅ Pripojený! Si Hráč 2 🔵 (O)"
- **v52**: Info box in MP modal explaining roles before connection

## Tetris (Solo-Only Mode)

**Important:** Tetris is `mode:'always'` which means:
- Shows ONLY in default game grid (when `welcomeGameMode=''`)
- Does NOT show when "2 Hráči" or "vs Počítač" is selected
- This is by design - Tetris is solo-only, not for 2-player mode

**Controls:**
- Keyboard: ←→ move, ↑ rotate, ↓ drop
- Mobile: On-screen arrow buttons (60px touch-friendly)
- Board tap/click: Also rotates piece

**Implementation (v54):**
```html
<div style="display:flex;gap:8px;justify-content:center;margin-top:15px">
  <button onclick="tetMove(-1)">←</button>
  <button onclick="tetRotate()">↑</button>
  <button onclick="tetMove(1)">→</button>
  <button onclick="tetDrop()">↓</button>
</div>
```

## Game Mode Filtering

`renderMobileGrid()` filters games based on `welcomeGameMode`:

```javascript
const filtered = MOBILE_GAMES.filter(g => {
  if(g.mode==='always') return !welcomeGameMode || welcomeGameMode===''; // Solo games
  if(welcomeGameMode==='ai') return g.mode==='both'; // AI-capable only
  if(welcomeGameMode==='pvp') return g.mode==='both' || g.mode==='pvp'; // PVP games
  return true;
});
```

**Default state:** `welcomeGameMode = ''` (no mode selected)
- Shows ALL games including Tetris and Stats
- Welcome screen buttons NOT active by default (v53+)

## Common Patterns

- AI games check `welcomeGameMode==='ai'` to trigger AI moves
- `celebrate(elementId)` + `playSound('win')` on game win
- `activeTurn(p1CardId, p2CardId, playerNum)` highlights active player
- `getP1Name(prefix)` / `getP2Name(prefix)` get player names (local mode)
- `getTTTPlayerName(symbol)` get player names (MP-aware, v50+)
- `updateRecord(key, value)` saves best scores

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys from main branch.

## Sound & Feedback System

Sounds are generated using Web Audio API. Available types:
- `'click'/'move'` - UI clicks and piece moves
- `'correct'` - Successful action
- `'wrong'` - Incorrect action
- `'flip'` - Card flip
- `'shot'` - Battleship shot
- `'miss'` - Battleship miss
- `'hit'` - Hit/capture
- `'win'` - Victory melody
- `'timeout'` - Time expired

Each sound also triggers vibration (15-100ms) if device supports it.

## Common Issues

- **Blank screen on mobile**: Game area not returned to parent when switching. Fixed via `_returnGameToParent()`.
- **Cache not updating**: SW uses network-first for HTML, so refreshing should get latest. Bump `APP_VERSION` + `CACHE_NAME` for new SW activation.
- **Draws not counted**: Every game path showing "Remíza" must call `addWin(0)`.
- **Mobile topbar disappearing**: Welcome screen has high z-index (9000). Always explicitly hide it when navigating to levels 2/3. Topbar needs `position:sticky`, `z-index:1000`, and `flex-shrink:0`.
- **Board too small on initial render**: ID selectors have higher specificity than class selectors. Use combined selector `#elementId.className` when both needed.
- **Button positioning issues**: Avoid `float` with negative margins. Use flexbox with `justify-content:space-between` for headers.
- **Keyboard conflicts**: Games using keyboard (Tetris, Maze) should `preventDefault()` to avoid scrolling page.

### Multiplayer-Specific Issues

- **Welcome screen broken after MP changes (v28-v38, v46)**: Duplicate `const MP = {}` declarations cause JavaScript crash. Always check for old MP code remnants before adding new MP state.
  - **Root cause (v46)**: Old `const MP = {}` from v27 (line 8217) + new `const MP = {}` (line 8243) = duplicate declaration
  - **Solution**: Use `grep "const MP = {" index.html` to find all occurrences before adding new one
- **Duplicate modal structures**: Old MP modals from v27 can conflict with new implementations. Remove ALL old MP HTML/CSS/JS before implementing new version.
- **Missing modal functions (v42)**: When cleaning up old code, check that you don't accidentally remove current functions. v42 removed `openMPModal()`, `closeMPModal()`, `closeMPModalOnOverlay()` along with old duplicate code.
- **Game state desync (v55)**: Players must have SAME game settings (board size, rules, etc.)
  - **Root cause**: Each player independently selects game settings, no sync
  - **Solution**: Host sends game settings in handshake, guest applies them automatically
  - **Example (Piškvorky)**: Host sends `{tttSize, tttGrid}` in handshake, guest calls `setTTTSize()` to match
  - **Important**: Guest should call the UI update function (like `setTTTSize()`), not just set variables, to ensure all UI elements update correctly
- **Multiple active buttons**: Using global selectors like `document.querySelectorAll('.difficulty-btn')` can affect buttons from other games
  - **Solution**: Use `btn.parentElement.querySelectorAll('.difficulty-btn')` to scope to current control group
- **GitHub Pages deploy delay**: Typically 1-3 minutes, but can take longer (4+ min, v49 took 7min). Check status: `gh run list --repo USER/REPO`
- **PeerJS connection timeout**: If peers can't connect, check firewall/NAT. PeerJS uses STUN servers for NAT traversal.
- **Service Worker cache**: Hard refresh (Ctrl+Shift+R) may be needed to see new MP code on mobile.

### Tetris Issues

- **Showing in wrong mode (v52-v53)**: If Tetris appears in 2-player grid, check `renderMobileGrid()` filter logic and `welcomeGameMode` default value.
  - Default should be `''` (empty), NOT `'pvp'`
  - mode='always' games should filter: `if(g.mode==='always') return !welcomeGameMode || welcomeGameMode==='';`
- **Missing mobile controls**: Desktop keyboard works but mobile needs on-screen buttons (added v54)

## Recent Session Notes (2026-03-07)

**MP Implementation Complete (v48-v55):**
- v48: PeerJS WebRTC connections (debugged duplicate MP object issue)
- v49: Piškvorky online multiplayer working
- v50: Real player names sync (Lukáško & Natálka)
- v51: Player role indicators after connection (🔴 P1, 🔵 P2)
- v52: Info box in MP modal + Tetris ArrowUp rotation
- v53: Tetris removed from 2-player mode grid
- v54: On-screen mobile controls for Tetris
- v55: **CRITICAL FIX** - Board size synchronization in MP + multiple active buttons fix

**Key Learnings:**
- Always grep for duplicate declarations before adding new state objects
- Test MP on actual 2 devices/mobiles, not just 2 browser windows
- **Game state MUST sync**: Host sends ALL game settings in handshake (board size, rules, etc.)
- Guest must apply host's settings by calling UI update functions (e.g., `setTTTSize()`), not just setting variables
- Use scoped selectors (`parent.querySelectorAll`) instead of global selectors to avoid affecting other game controls
- GitHub Pages deploy can be slow, use `gh run list` to monitor
- mode='always' games need special filter logic to hide in pvp/ai modes
- Mobile games need on-screen controls, can't rely on keyboard

**Testing Checklist for MP:**
1. Open on 2 devices/mobiles
2. Device 1: Click globe → Create room → copy code
3. Device 2: Click globe → paste code → Join
4. Both see green ✅ with role indicator
5. **IMPORTANT**: Device 1 (host) selects game settings FIRST (e.g., board size)
6. Open same game on both devices - guest should auto-match host's settings
7. Take turns, moves sync in real-time
8. Winner displays correctly with real player names
9. **Verify**: Both players have SAME board size/rules

**MP Handshake Protocol (v55):**
```javascript
// Host sends:
conn.send({
  type: 'handshake',
  from: 'host',
  name: MP.myName,
  tttSize: TTT.size,    // Game-specific settings
  tttGrid: TTT.grid
});

// Guest receives and applies:
if(data.from === 'host' && data.tttSize) {
  setTTTSize(data.tttSize, matchingButton); // Call UI function
}
```

**Next Steps (Future Sessions):**
- Extend MP to Connect4, Ghost, Hádaj Číslo, Obesenec, Vyššie Nižšie
- Add "Waiting for opponent..." indicator when host is waiting
- Consider adding "Rematch" button after game ends in MP mode
- Test with poor network conditions (slow 3G, packet loss)
