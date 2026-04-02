# Online Multiplayer Reference

## Architecture
- PeerJS 1.5.5 (CDN: `unpkg.com/peerjs@1.5.5`)
- WebRTC peer-to-peer, cloud broker: `0.peerjs.com`
- Floating globe button (hidden in AI mode)
- STUN-first, TURN fallback with password

## ICE Config
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
- `mpGetConfig()` — returns STUN_ONLY or TURN based on `mpIsTurnUnlocked()`
- TURN unlock stored in `localStorage('mp_turn_unlocked')`

## TURN Server (Metered)
- Provider: Metered (relay.metered.ca), free tier
- Password: `lukaskonatalka2026` — stored in `TURN_PASSWORD` constant
- Connection flow: STUN-first (8s timeout) → TURN password prompt → reconnect with TURN
- Same WiFi: Uses direct/STUN (no TURN quota used)
- Different networks: Both sides need TURN unlocked

## MP State Object
```javascript
const MP = {
  peer: null, connection: null,
  isHost: false, isConnected: false,
  roomCode: null, myName: '', opponentName: '',
  tttRound: 0, memRound: 0, c4Round: 0, chRound: 0,
  dkRound: 0, bsRound: 0, ludoRound: 0, gnRound: 0,
  sdRound: 0, tnkRound: 0, pngRound: 0, wdlRound: 0, agaRound: 0, revRound: 0, nimRound: 0,
  simonRound: 0, manRound: 0, sokRound: 0, ghostRound: 0, dbRound: 0, hlRound: 0,
  quizRound: 0, mmsvRound: 0, wcRound: 0, scrRound: 0, brkRound: 0, puzzleRound: 0,
  gofishRound: 0,
  _intentionalDisconnect: false,
  _pingInterval: null,
  _reconnectAttempts: 0,
  _maxReconnectAttempts: 3,
  _reconnectTimeout: null
};
```

## Session Persistence & Auto-Reconnect
- `mpSaveSession()` — saves to sessionStorage after handshake
- `mpClearSession()` — clears on disconnect
- `mpTryReconnect()` — called on page load, 8s timeout, toast UI
- `mpHandleDisconnect()` — distinguishes intentional vs unintentional, triggers auto-reconnect
- `mpAutoReconnect()` — max 3 attempts with 2s delay, preserves session, shows toast notifications

## Player Names in MP
- Both host and guest use `wP1Input` (device owner's name) as their MP name
- MP handshake temporarily swaps globalP1/globalP2 to show correct names
- `MP._savedP1`/`MP._savedP2` stores originals, restored on disconnect
- `saveNames()` is blocked when `MP._savedP1` exists (prevents overwriting local names)

## Games with MP Support (26 games)

**Turn-based (15 games):**
- Piskvorky — `ttt-move`, alternating start (tttRound)
- Connect4 — `c4-move`
- Kamen Papier Noznice — `rps-choice`
- Sach — `ch-move`
- Dama — `dk-move`
- Pexeso — `mem-flip`, `mem-board` (host sends card layout)
- Lodicky — `bs-shoot`, `bs-result`, `bs-ready`, `bs-gameover`
- Clovece — `ludo-roll`, `ludo-move`
- Hadaj Cislo — `gn-setup`, `gn-guess`, `gn-feedback`
- Wordle — `wdl-word`, `wdl-guess`, `wdl-result` (simultaneous guessing, tie-breaking)
- Reversi — `rev-move`; host=black even rounds, guest=black odd rounds (revRound)
- Nim — `nim-take` from nimSelect() at confirm (NOT nimTake to avoid double-send); nimRound alternation
- Mancala — `mancala-move` from manClickPit() (action point); manMakeMove() on receiver; manRound alternation
- Bodky a Krabičky — `db-line` from dbClick(); dbPlaceLine() on receiver; dbRound alternation
- Vyššie Nižšie — `hl-turn-done` (score, player, isFirst); hlRound alternation; sequential turns

**Sequential turn (4 games):**
- Simon Says — `ss-result` on failure; simonRound alternation; simonStart() has SIMON.over + MP turn guard
- Ghost — `ghost-letter`, `ghost-challenge`, `ghost-lang` (host-only); ghostRound alternation
- Hádaj Zviera (AGA) — `aga-guess`, agaRound alternation
- Slovný Reťazec (WC) — `wc-start`/`wc-word`/`wc-timeout`; wcRound alternation; `WC._isMyTurn` flag

**Simultaneous (4 games):**
- Sokoban — `sok-done` on level completion; p1Completed/p2Completed tracked independently
- MMZV — `mmsv-start`/`mmsv-done`/`mmsv-answers`; mmsvRound alternation
- Scramble — `scr-word` (host sends word+hint); SCR._mpRoundDone guard; guest category disabled
- Puzzle Scramble — `puzzle-done` (with time); PZ._mpDone guard

**Alternating turns (1 game):**
- Breakout — `brk-done`; brkRound alternation; `oppWasFirst` boolean fixes odd-round scoring

**Real-time (3 games — host-authoritative):**
- Snake Duel — `sd-start`, `sd-dir`, `sd-state` (host runs setInterval, guest sends direction only)
- Tank Battle — `tnk-start`, `tnk-input`, `tnk-state` (host runs setInterval at 8fps)
- Pong — `png-start`, `png-input`, `png-state` (host runs RAF, sends state every 3 frames)

**Go Fish (host-authoritative, 1 game):**
- Go Fish — `gf-start` (host sends deck), `gf-state` (host sends guest their hand only); gofishRound

## Adding MP to a Game
1. Add `mp:true` to MOBILE_GAMES entry
2. In click handler, check turn: `if(MP.isConnected) { if(notMyTurn) return; }`
3. Send move: `mpSend({type:'game-move', ...data})`
4. Handle in `mpHandleMessage()`: `if(data.type==='game-move') { applyMove(); }`
5. Add rematch support in `mpRematch()` and `mp-rematch` handler
6. Guest settings sync: host sends settings in handshake, guest applies

## Real-time MP Pattern
- Host runs game loop (setInterval or RAF), guest does NOT run game logic
- Guest sends only inputs (direction, keys, shoot) — host applies as P2
- Host sends full game state every tick (or every N frames for bandwidth)
- Guest receives state, updates local variables, renders
- Guest plays sounds based on state changes (score diff, death flags, ate flag)
- P2 mobile controls hidden in MP (each player uses own P1 controls)
- Input wrapper functions (sdSetDir, tnkSetKey, pngSetDir) handle MP routing
- Start button: only host can start; guest click does nothing

## MP Key Rules
- Guest cannot change game settings (hidden/blocked)
- Host sends game state (board, settings) to guest
- Alternating start player via round counter (all games)
- Rematch resets game and syncs via `mp-rematch` message
- **CRITICAL**: Send move from USER ACTION (e.g. `revClick`, `nimSelect`), NOT from apply function (`revPlace`, `nimTake`) — infinite loop otherwise
- Cleanup old peers: `mpCreateRoom()` and `mpJoinRoom()` destroy previous peer before creating new one
- `mpSend()` wraps `MP.connection.send()` with null checks and try/catch — use everywhere
- QR code for room joining: `mpGenerateQR()` / `mpScanQR()`
- MP Chat: `mpChatSend()` / `mpChatAppend()`, max 40 messages, shown only when connected
- MP Ping: `mpStartPing()` / `mpStopPing()`, every 4s, RTT in `#mpPingMs`

## MP Scoring Patterns (Round Alternation)
- P1=host, P2=guest on BOTH devices after handshake
- TTT/Piskvorky: X/O alternates per round → use `getTTTActiveCard(symbol)`
- Ludo: `hostIsRed=ludoRound%2===0`
- Dama: `hostIsRed=dkRound%2===0`
- Reversi: `hostIsBlack=!MP.isConnected||MP.revRound%2===0`
- Chess: `(color==='w')===hostIsWhite ? 1 : 2`
- Nim: no role alternation; `loser===1?2:1`; first player via `nimRound%2`
- GN: `gnHostGuesses = !MP.isConnected || (MP.gnRound%2!==0)`

## MP Score Reset Pattern
- Turn-based session games (RPS, Memory, GN, AGA, Mancala): do NOT reset s1/s2 when MP.isConnected
- Guard: `if(!MP.isConnected) { game.s1=0; game.s2=0; }`
- First-to-N series (Pong, Tank, Snake Duel): reset scores on rematch intentionally

## MP-Specific Issues
- **TDZ crash**: `const MP` must be declared before any `reset*()` call that references it. Best practice: place `reset*()` right after game section, not in centralized init block.
- **Game state desync**: Host MUST send all game settings in handshake. Guest applies via UI functions.
- **Duplicate declarations**: Always `grep "const MP\|let welcomeGameMode" index.html` before changes.
- **TURN servers replace PeerJS defaults**: `config: { iceServers: [...] }` REPLACES PeerJS built-in ICE servers — always include STUN alongside TURN.
- **Stale peers**: Always destroy old peer before creating new one in mpCreateRoom/mpJoinRoom.
- **MP name overwrite**: `saveNames()` must NOT run when `MP._savedP1` exists.
- **Sequential MP start button**: Must have `SIMON.over` check AND MP turn guard to prevent waiting player corruption.
- **Message validation** (v19.89): Validate `data.player` (must be 1|2), `data.score` (isFinite + floor), array inputs against whitelists.
