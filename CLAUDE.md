# CLAUDE.md - Hrajme si

## Project Overview

Single-file PWA game collection for kids. Everything is in `index.html` (~7700 lines).

## Key Architecture

- **Single file**: All HTML, CSS, and JS in `index.html`
- **PWA**: `sw.js` uses network-first for HTML, cache-first for assets
- **Version sync**: `APP_VERSION` in index.html must match `CACHE_NAME` in sw.js (format: `hrajmesi-vN`)
- **Game modes**: `welcomeGameMode` variable — `'pvp'` (2 players) or `'ai'` (vs computer)
- **Mobile nav**: 3-level navigation — welcome → game picker → game view
- **Stats**: `addWin(w, gameId)` — w=1 player1 win, w=2 player2 win, w=0 draw

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

## Common Patterns

- AI games check `welcomeGameMode==='ai'` to trigger AI moves
- `celebrate(elementId)` + `playSound('win')` on game win
- `activeTurn(p1CardId, p2CardId, playerNum)` highlights active player
- `getP1Name(prefix)` / `getP2Name(prefix)` get player names from input fields
- `updateRecord(key, value)` saves best scores

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys from main branch.

## Common Issues

- **Blank screen on mobile**: Game area not returned to parent when switching. Fixed via `_returnGameToParent()`.
- **Cache not updating**: SW uses network-first for HTML, so refreshing should get latest. Bump `APP_VERSION` + `CACHE_NAME` for new SW activation.
- **Draws not counted**: Every game path showing "Remíza" must call `addWin(0)`.
- **Mobile topbar disappearing**: Welcome screen has high z-index (9000). Always explicitly hide it when navigating to levels 2/3. Topbar needs `position:sticky`, `z-index:1000`, and `flex-shrink:0`.
- **Board too small on initial render**: ID selectors have higher specificity than class selectors. Use combined selector `#elementId.className` when both needed.
- **Button positioning issues**: Avoid `float` with negative margins. Use flexbox with `justify-content:space-between` for headers.
