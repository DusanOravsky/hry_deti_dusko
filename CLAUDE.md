# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~8400+ lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets (Note: SW was disabled in v36, re-enabled later)
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vN`)
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS (v48+)

## Important Variables

- `MOBILE_GAMES` array — defines games with `mode`: `'both'` (AI+PVP), `'pvp'` (2-player only), `'always'` (stats)
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `_mobileCurrentGame` / `_gameAreaParent` — tracks which game area is moved into mobile content

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
- ✅ Piškvorky (v49+)
- 🔜 Connect4, Ghost, Hádaj Číslo, Obesenec (planned)

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
- **Duplicate modal structures**: Old MP modals from v27 can conflict with new implementations. Remove ALL old MP HTML/CSS/JS before implementing new version.
- **GitHub Pages deploy delay**: Typically 1-3 minutes, but can take longer (4+ min). Check status: `gh run list --repo USER/REPO`
- **PeerJS connection timeout**: If peers can't connect, check firewall/NAT. PeerJS uses STUN servers for NAT traversal.
- **Service Worker cache**: Hard refresh (Ctrl+Shift+R) may be needed to see new MP code on mobile.
