# Features Reference

## UI & Navigation
- **Tutorial/Rules Modal**: help button on all games, opens centralized modal with game rules
- **AI Difficulty**: All AI games have easy/medium/hard selector (shown when `welcomeGameMode==='ai'`)
- **Active turn indicator**: Inactive player card dims to 40% opacity, active shows colored "Na rade" badge
- **Animated transitions**: Slide animations (slideInRight/slideOutLeft) between navigation levels, cardPop for game cards
- **Welcome screen UX**: Time-based greeting, rotating emoji animation, continue last game button, pulse animation on start button
- **Dark/light theme**: Automatic by time of day + manual toggle
- **Favorites**: Star on game cards, stored in `localStorage('hry_favorites')`, sorted to top
- **Recently played**: Last 5 games tracked in `localStorage('hry_recent')`, shown in grid with clear button
- **Search/Filter**: Quick search input in game picker, real-time filtering, clear button (✕), results count ("X hier nájdených")
- **Game categories**: 6 categories (Všetky, Doskové, Arkádové, Slovné, Logické, Zábavné), `GAME_CATS` array, `cat` property on MOBILE_GAMES
- **Game preview animations**: Hover effects on game cards (bounce/spin/pulse/wiggle)
- **Fullscreen mode**: Canvas games (Snake, Doodle Jump, Breakout, Gravity Run, Flappy Bird, Angry Birds) have fullscreen button (⛶), wrapper-based with exit button overlay
- **Offline indicator**: Red banner when device offline, MP button auto-hides
- **PWA Install Prompt**: "Inštaluj aplikáciu" button on welcome screen, captures `beforeinstallprompt`
- **Emoji Avatars**: 46 emoji options for all 4 players (P1/P2 on welcome screen, P3/P4 in Ludo), stored in localStorage

## Sounds & Feedback
- **Sounds**: All games have sounds on key actions (click, correct, wrong, win, flip, hit, move)
- **Animations**: cell-appear, flip-card, dice-roll, piece-move, glow-correct, shake-wrong, rps-reveal
- **Confetti on wins**: Canvas confetti animation on any win via `addWin()`, 150 particles, 2.5s duration
- **Sound & Vibration Persistence**: Settings saved to localStorage ('hry_sound', 'hry_vibration'), restored via `loadSoundSettings()`
- **Turn-change sounds**: `playSound('move')` at turn transitions in Ghost, Dots & Boxes, Mancala, Simon Says

## XP & Level System
- **9 levels**: Nováčik (0) → Začiatočník (50) → Hráč (150) → Skúsený (350) → Pokročilý (700) → Expert (1200) → Majster (2000) → Šampión (3200) → Legenda (5000)
- **XP sources**: Výhra +10, Remíza +3, Denná výzva +25, Achievement +8, Turnaj výhra +50
- **AI guard**: `if(welcomeGameMode!=='ai')` before awarding P2 XP (computer doesn't earn XP)
- **Welcome screen**: Per-player XP badge (Lv.X), title, progress bar below name inputs
- **Stats tab**: `stXPSummary` cards + `stXPTable` level table built on first render (`dataset.built` guard)
- **Storage**: `localStorage('hry_xp')` → `{p1, p2}`; loaded via `_loadXP()`, `_saveXP()`
- **Level-up toast**: 500ms delay after win toast so they don't overlap

## Stats & Achievements
- **Achievement system**: 73 achievements (16 general + 31 per-game + 4 daily + 6 seasonal + 14 new per-game + hm5/mmsv5/wc5 + drt5) checked after every `addWin()`, `toggleFavorite()`, `dailyCheckComplete()`, toast notification on unlock
- **Achievement Progress Bars**: All 73 achievements show visual progress bars for locked achievements (current/max values, percentage)
- **Split stats reset**: Separate buttons for resetting game stats vs achievements, with reusable confirm dialog
- **Daily Challenge**: 57 games rotation (all games), streak badge (🔥X), 30-day calendar in Stats (green=completed), history in localStorage
- **Seasonal achievements**: 6 achievements (Christmas/Easter/Summer/Halloween), tracks plays per season/year in `localStorage('hry_seasonal_plays')`
- **Top 5 Leaderboard**: Solo games (Tetris, Snake, Racing, Gravity Run, 2048, Flappy Bird) track top 5 scores

## Game-Specific Features
- **Chess complete rules**: Legal move filtering, check detection (red king), checkmate, stalemate, castling, en passant, pawn promotion dialog (Q/R/B/N), 50-move rule
- **Chess voice commands**: Web Speech API (`sk-SK`), say "E2 E4" to move, mic toggle button
- **Chess timer**: Optional 5/10/15 min modes, per-player countdown, disabled in MP
- **Chess coordinates**: A-H / 1-8 around board, flipped for black in MP
- **Chess AI pre-thinking**: Hard mode calculates next move during player's turn, 300ms delay, board snapshot validation
- **Tetris wall kicks**: `tetRotate()` tries kick offsets `[0,-1,1,-2,2]`
- **Tetris ghost piece**: Semi-transparent preview of landing position (0.25 opacity)
- **Connect 4 AI**: Medium blocks opponent wins; hard blocks + seeks own wins + center preference
- **Wordle word validation**: Both PVP set phase and guess phase validate against word list
- **Wordle MP**: Simultaneous guessing; `#wdlOpponentProg` shows opponent progress; tie-breaking logic
- **Wordle hard mode**: `#wdlHardBadge`, `wdlApplyHardModeUI()` (re-enables btn after game)
- **Uno Wild Draw Four**: +4 only playable when no matching color cards (official rules), UNO! toast when 1 card left
- **Nim**: misère variant (last stone loses), 4 piles (1,3,5,7), take 1-3, hard AI uses Grundy values (n%4 XOR)
- **Doodle Jump modes**: Wrap (pass through edges) and Wall (bounce off walls, separate high scores, horizontal platform distance limit 120px)
- **Sokoban**: 15 hand-crafted verified levels, BFS AI hint solver (500/2000/5000 iterations), unlimited undo, WASD/arrows/swipe
- **Simon Says**: 4, 6, or 9 colored buttons; easy=4/800ms, medium=6/500ms, hard=9/300ms; PVP alternating turns
- **Mancala**: Kalaha variant, capture mechanics, extra turns, hard=minimax evaluation
- **Soccer/Futbal**: Swinging arrow + oscillating power bar, AI keeper (easy 20%/medium 45%/hard 70%)
- **Bee Counting**: Bees fly into 3 hives via bezier paths; solo mode "Správne: X/5"
- **Gravity Run**: Tap/space to flip gravity, obstacles both sides, increasing speed
- **Tank Battle wallSet**: O(1) wall lookups using Set instead of O(n) array
- **Ludo dice animation**: setInterval cycles ⚀–⚅ 7× at 70ms each (~490ms), then settles
- **Ghost series score**: `#ghostSeriesScore` shows "Séria: P1 X – Y P2", hidden at 0-0
- **Play Again overlay**: `showPlayAgain(resetFn, gameId)` — shows `▶️ Hraj znova` (local) or `🌐 Odveta!` (MP) after game ends; used in tetris, wordle, game2048 (solo) + reaction, spamClick, mathDuel, emojiGuess, ghost (PVP); skip with `if(!TOUR.active)` guard
- **Tournament tiebreaker**: On draw, `⚡ Rozhodujúca hra` button appears → `tourTiebreaker()` picks random game from TOUR.games
- **Solitaire**: Click-to-select, undo (single-level JSON snapshot), auto-complete when all face-up, timer on first move
- **War quick play**: Auto-plays entire game at 100ms per round, epoch-protected timeouts
- **MMSV letter validation**: Answer must start with correct letter; two-step challenge confirm flow; extra category toggles opt-in
- **Šípky 301 (Darts 301)**: Canvas dartboard with 20 sectors, triple/double rings, bull (50/25); oscillating Lissajous crosshair aim mechanic; 3 darts per turn; bust rule (score <0 or =1 reverts to turn start); win on exactly 0; AI difficulty easy=random / medium=upper board ±18px / hard=triple-20 ±5px; epoch-guarded RAF + AI timeout
- **Go Fish (Kvarteto)**: Collect 4-of-a-kind books; "Choď rybárčiť" on miss; PVP pass-device screen; host-authoritative MP
- **Checkers (Dáma) 3D pieces**: `.dk-piece` divs with radial gradient (red/blue), `dk-pop` spring animation on move, `dk-crown` burst on king promotion; `DK._lastPromoted` tracks promoted square for crown CSS class; king marker: 👑 emoji (`.dk-king::after`, font-size:.7em)
- **Stats rules modal**: `#stats` section has hidden `.rules` div — `showRules('stats')` shows XP/levels/achievements/daily/leaderboard explanation

## MP Handler Validation (security)
All `_mpHandleMessageInner(data)` handlers validate `data.*` before use:
- Array indices: bounds-checked (0–63 for boards, 0–3 for Nim piles/Ludo pieces, 0–13 for Mancala)
- String fields: whitelisted ('h'|'v' for db-line, chess piece whitelist for ch-promote, single letter regex for ghost-letter)
- Numbers: `isFinite()` + range checks; scores capped at reasonable maxima
- `addXP(player, amount)`: guards `player !== 1 && player !== 2`

## AI Difficulty Persistence
- `saveDiff(gameId,d)` / `loadDiff(gameId)` — save to `localStorage('hry_diff_'+gameId)`
- `restoreAllDiffs()` — called on page load

## Solo Mode Pattern
Games with `mode:'both'` show solo score (X/5) in AI mode — hide player-info div, show soloScore div via `applyGameMode()` and `reset*()`

## Version-tracked SW Update
1. New version deployed → SW installs immediately (skipWaiting + claim)
2. `APP_VERSION` compared with `localStorage('hry_last_version')`
3. If different → toast "🎮 Nová verzia nainštalovaná! [Obnoviť stránku]"
4. Version saved to localStorage immediately; user clicks button → `location.reload()`
