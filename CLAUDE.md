# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~25200 lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vX.Y`) — check this for current version
- **PeerJS version**: 1.5.5 (CDN: `unpkg.com/peerjs@1.5.5`)
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (default, 2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw
- **Online Multiplayer**: WebRTC peer-to-peer via PeerJS + Metered TURN (password-protected)
- **DOM helper**: `const $ = id => document.getElementById(id);`
- **Game cleanup**: `stopAllGames()` — stops all running game timers/rafs on navigation

## CRITICAL: TDZ Declaration Order

**ALL `const`/`let` variables MUST be declared BEFORE any code that references them at init time.**

`const` and `let` have a "temporal dead zone" (TDZ). Even `typeof X` throws a ReferenceError if `const X` is declared later in the same scope. Has caused crashes in v10-v12, v28-v38, v42, v6.3, v19.60.

```javascript
// CORRECT ORDER:
const MP = { peer: null, connection: null, ... };
let welcomeGameMode = 'pvp';   // MUST be before resetWordle() etc.
resetChess();   // Can now safely reference MP
resetWordle();  // welcomeGameMode check works
```

**Rules:**
1. Any `reset*()` called at init that references `MP` will crash if `const MP` is declared after it
2. **Best practice**: place `reset*()` call right after the game section (after const + functions), NOT in a centralized init block that runs before the const
3. Before adding any new `reset*()` call: `grep -n "const MP\|let welcomeGameMode\|resetWordle\|resetDB\|resetChess" index.html`

## Important Variables

- `MOBILE_GAMES` array — defines games with `mode` and optional `mp:true`:
  - `'both'` = AI + PVP, `'pvp'` = 2-player only, `'solo'` = solo only, `'always'` = always shown
  - `mp:true` = has online multiplayer support (shows globe badge)
- `welcomeGameMode` — `'pvp'` (default) or `'ai'`
- `globalP1`, `globalP2`, `globalP3`, `globalP4` — player names (P3/P4 for Ludo)
- `_p1Avatar`, `_p2Avatar`, `_p3Avatar`, `_p4Avatar` — emoji avatars (stored in localStorage)
- `GAME_NAMES` object — display names for each game
- `mobileGoTo(level, gameId)` — mobile navigation (1=welcome, 2=picker, 3=game)
- `renderMobileGrid()` — filters MOBILE_GAMES based on welcomeGameMode
- `currentGameId` — currently active game, used to prevent keyboard conflicts
- `_xp` — `{p1, p2}` XP values, persisted in `localStorage('hry_xp')`
- `XP_LEVELS` — 9-level array (Nováčik→Legenda), `addXP(player,amount)` triggers level-up toast
- `renderXPBadges()` — updates XP badge/bar on welcome screen for both players

## Adding a New Game

1. Add game HTML section with `id="gameId"` inside `.container` — include `<div class="rules">` with game description
2. Add entry to `MOBILE_GAMES` array with `{id, icon, mode, cat, mp?}`
3. Add entry to `GAME_NAMES` object
4. Add to `gameKeys` object (button ID mapping)
5. Add stat key to both `getActiveP1Name` and `getActiveP2Name`
6. Add `reset*()` function and call it AFTER the `const` state object declaration — **NEVER before — TDZ crash!**
7. Implement game logic with `addWin()` calls for all outcomes
8. For AI mode: block player clicks with `if(welcomeGameMode==='ai' && turn===opponent) return;`
9. **CRITICAL**: Verify `reset*()` does NOT reference any `const`/`let` declared later in the file
10. Use `color:inherit` not `color:white` — supports both dark and light mode
11. Add timer/raf cleanup to `stopAllGames()`
12. For canvas games with keyboard: guard with `if(currentGameId!=='yourGame')return;`
13. In AI mode: hide P2 mobile controls via `applyGameMode()`, remap arrows to P1
14. For MP: see `docs/mp.md`
15. For MP handlers: validate ALL `data.*` fields before use — bounds check array indices, whitelist strings, isFinite numbers

## Performance Optimization

- **DOM helper**: `const $ = id => document.getElementById(id);`
- **Canvas ctx caching**: `STATE.ctx || canvas.getContext('2d')` — don't call getContext every frame
- **stopAllGames()** timers: SNK.timer, TET.dropTimer, RACE.interval, DOOD.raf, BRK.raf, PNG.raf, TNK.timer, SD.timer, REAC.timeout, BEE timers, SOC.raf, GRAV.raf, FLAP.raf, AB.raf, MS.timer, WAR._timer, UNO._timer, SOL.timer, NIM._timer, SIMON._timeout, MAN._aiTimeout, SOK.timer

## Deploy

```bash
git add index.html sw.js
git commit -m "feat/fix: description (vX.Y)"
git push
```
GitHub Pages auto-deploys from main branch. **Always bump `APP_VERSION` in index.html AND `CACHE_NAME` in sw.js with every commit.**

**Version bump checklist:**
- `APP_VERSION` in index.html → `hrajmesi-vX.Y`
- `CACHE_NAME` in sw.js → `hrajmesi-vX.Y`
- Update "Current version" in this file

## Common Issues

- **Blank screen / can't click**: JS crash from TDZ or undefined function. Check browser console. Hard refresh (Ctrl+Shift+R).
- **Cache not updating**: Hard refresh (Ctrl+Shift+R). Bump `APP_VERSION` + `CACHE_NAME`.
- **Board too small on mobile**: Use `max-width:min(Xpx, 90vw)` with `1fr` grid columns.
- **Text invisible**: Don't hardcode `color:white` — use `color:inherit`.
- **Topbar disappearing**: `#mobileGameView` and `#mobileGamePicker` need `position:fixed`.
- **Games running in background**: All game loops must be in `stopAllGames()` and stopped on navigation.
- **MP issues**: See `docs/mp.md` — MP-Specific Issues section.

## Reference Files (read when needed)

- `docs/games.md` — Quick-lookup table: gameId → mode/MP/stateObj/resetFn, grouped by mode
- `docs/patterns.md` — Common code patterns: score reset guard, round alternation, MP turn guard, solo mode, canvas ctx caching, epoch timers, rematch, host-authoritative
- `docs/mp.md` — MP architecture, ICE config, TURN server, MP state, per-game message types, scoring patterns, MP issues
- `docs/game-states.md` — All game state objects (TET, SNK, CH, GF, SIMON, MAN, etc.)
- `docs/features.md` — Feature list (UI, sounds, achievements, game-specific features)
- `docs/changelog.md` — Version history (v18.0–v20.4)
