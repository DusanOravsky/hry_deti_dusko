# Common Code Patterns

## Adding a Game — Checklist
See CLAUDE.md "Adding a New Game" for full steps. Key gotcha: `reset*()` MUST be called after `const STATE = {...}`, never before (TDZ crash).

## Score Reset Guard (MP session games)
Turn-based games where scores accumulate across rounds (RPS, Memory, GN, AGA, Mancala, etc.) must NOT reset scores when MP is connected:
```javascript
function resetXXX() {
  if (!MP.isConnected) { XXX.s1 = 0; XXX.s2 = 0; }
  // rest of reset...
}
```
First-to-N games (Pong, Tanks, Snake Duel) DO reset scores on rematch — intentional.

## Round Alternation (MP color/role assignment)
When a game has roles that alternate each round (Chess colors, Ludo colors, Reversi colors):
```javascript
// On both host and guest:
const hostIsX = !MP.isConnected || MP.xxxRound % 2 === 0;
// In addWin():
addWin(hostIsX ? 1 : 2);  // host always maps to P1
```
Games that do this: Chess (white/black), Ludo (red/blue), Dama (red/blue), Reversi (black/white), GN (who guesses).

## MP Turn Guard (turn-based games)
```javascript
function onUserClick() {
  if (MP.isConnected && !isMyTurn()) return;  // block opponent's turn
  // apply move locally
  applyMove(data);
  // send to opponent
  mpSend({ type: 'xxx-move', ...data });
}
function applyMove(data) {
  // purely apply state — never sends anything
}
// In mpHandleMessage():
if (data.type === 'xxx-move') applyMove(data);
```
**CRITICAL**: Send from the USER ACTION function, NOT from `applyMove()` — applyMove runs on both devices, double-send = infinite loop.

## Solo Mode Pattern (mode:'both' games in AI mode)
Games with `mode:'both'` show P1-only solo score (X/5) in AI mode:
```javascript
function resetXXX() {
  if (welcomeGameMode === 'ai') {
    $('xxxPlayerInfo').style.display = 'none';
    $('xxxSoloScore').style.display = '';
    XXX.soloCorrect = 0; XXX.soloTotal = 0;
  } else {
    $('xxxPlayerInfo').style.display = '';
    $('xxxSoloScore').style.display = 'none';
  }
}
```

## Canvas ctx Caching
Don't call `getContext('2d')` every frame — cache it on the state object:
```javascript
function renderXXX() {
  const canvas = $('xxxCanvas');
  XXX.ctx = XXX.ctx || canvas.getContext('2d');
  const ctx = XXX.ctx;
  // draw...
}
```

## currentGameId Guard (canvas + keyboard)
Prevents keyboard events from firing in games that aren't active:
```javascript
document.addEventListener('keydown', e => {
  if (currentGameId !== 'yourGameId') return;
  // handle key...
});
```

## AI Difficulty Persistence
```javascript
// Save on difficulty change:
saveDiff('gameId', difficulty);  // stores to localStorage('hry_diff_gameId')

// Restore on init (called from restoreAllDiffs()):
function restoreXXXDiff() {
  const d = loadDiff('gameId');
  if (d) setXXXDiff(d);
}
```
Always register in `restoreAllDiffs()`.

## MP Send Helper
Always use `mpSend()` instead of `MP.connection.send()` directly — it has null-check and try/catch:
```javascript
mpSend({ type: 'xxx-move', data: value });
```

## Epoch-protected Timeouts (for async game timers)
Prevents stale timeouts from firing after game reset:
```javascript
XXX._epoch = (XXX._epoch || 0) + 1;
const epoch = XXX._epoch;
XXX._timer = setTimeout(() => {
  if (XXX._epoch !== epoch) return;  // stale, ignore
  // timer action...
}, delay);
```
Used in: War, WC (Slovný Reťazec), Ludo.

## Rematch Pattern (MP)
```javascript
// Called when "Nová hra" button clicked:
function newGameXXX() {
  if (MP.isConnected) { mpRematch('gameId'); return; }
  resetXXX();
}
// In mpRematch():
case 'gameId': resetXXX(); break;
// In mp-rematch handler:
case 'gameId': resetXXX(); break;
```

## addWin() Calls
```javascript
addWin(1, 'gameId');  // P1 wins
addWin(2, 'gameId');  // P2 wins
addWin(0, 'gameId');  // draw
```
`addWin()` handles: stats increment, achievement checks, confetti animation.

## applyGameMode() — hiding elements by mode
Called after `welcomeGameMode` is set. Games can add to it:
```javascript
function applyGameMode() {
  const ai = welcomeGameMode === 'ai';
  // hide P2 controls in AI mode:
  $('xxxP2Controls').style.display = ai ? 'none' : '';
  // show difficulty selector in AI mode:
  $('xxxDiffSelector').style.display = ai ? '' : 'none';
}
```

## Guest Settings Sync (MP handshake)
Host sends game settings during handshake; guest applies them:
```javascript
// Host side (in mpHandshake send):
{ type: 'handshake', ..., xxxDiff: XXX.diff, xxxSetting: value }
// Guest side (in handshake receive):
if (data.xxxDiff) setXXXDiff(data.xxxDiff);
// Also disable settings UI for guest:
$('xxxDiffSelect').disabled = MP.isConnected && !MP.isHost;
```

## Host-authoritative Real-time Pattern (Snake Duel, Tanks, Pong)
- Host owns all game state and runs the game loop
- Guest sends only inputs; host applies them
- Host sends full state snapshot every tick (or N frames)
- Guest just renders received state + plays sounds based on diffs
```javascript
// Host game loop:
function hostTick() {
  applyGuestInput();
  updateState();
  if (MP.isConnected) mpSend({ type: 'xxx-state', ...STATE });
  render();
}
// Guest:
function onReceive(data) {
  if (data.type === 'xxx-state') {
    updateLocalFromState(data);
    render();
  } else if (data.type === 'xxx-input') {
    // Guest doesn't receive this — only host does
  }
}
```
