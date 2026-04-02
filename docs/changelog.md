# Version History

## v19.91–v19.92
- **Search results count** (v19.91): `filterGames()` shows "X hier nájdených" above results (Slovak plural: 1 hra / 2-4 hry / 5+ hier)
- **Daily Challenge complete** (v19.91): DAILY_GAMES expanded from 46 → 56 games; added quiz, emojiGuess, langScramble, flashcard, missingLetter, sentence, cardWar, animalQuiz, gofish, guessNum
- **showPlayAgain for 5 PVP games** (v19.92): reaction, spamClick, mathDuel, emojiGuess, ghost — skipped during `TOUR.active`
- **Tournament tiebreaker** (v19.92): on draw shows `⚡ Rozhodujúca hra` button → picks random game from TOUR.games as tiebreaker via `tourTiebreaker()`

## v19.82–v19.90
- **Deep review fixes** (v19.82–v19.85): SRI integrity hashes on PeerJS+QRCode CDN; canvas ctx caching (7 games: Snake/Doodle/Breakout/Pong/Tanks/SnakeDuel/AngryBirds — `STATE.ctx||c.getContext('2d')`); `currentGameId` guards on Racing/Doodle/Maze/Breakout keydown; stopAllGames+4 missing timers; stats tab `min-width:80px`
- **Go Fish / Kvarteto** (v19.86): game #56, AI 3 difficulties (easy=random/medium=prefers 2+/hard=prefers 3+), PVP pass-device screen, MP host-authoritative, `GF` state object
- **Go Fish UX fixes** (v19.87): removed vs-badge from player-info (broke 2-col grid); standard player1/player2 card classes; welcome emoji rotation expanded 10→30 icons
- **Go Fish difficulty + MP security** (v19.88): difficulty selector HTML + `setGFDiff()` + `restoreAllDiffs`; gf-start/gf-state array validation against GF_RANKS/GF_SUITS whitelist; deckCount capped to [0,52]
- **MP message validation** (v19.89): HL validate player (1|2) + score (isFinite+floor); WC turn owner guard on wc-timeout; Breakout validate oppPlayer (1|2)
- **localStorage + achievement** (v19.90): Array.isArray guard on hry_daily_history; object type check on hry_seasonal_plays; gf5 🎣 Rybár achievement added (69 total); onboarding 55→56

## v19.45–v19.81
- **MMZV MP** (v19.45+): simultaneous play, mmsv-start/mmsv-done/mmsv-answers, mmsvRound alternation, timer 30/45/60/90s
- **Slovný Reťazec MP** (v19.45+): wc-start/wc-word/wc-timeout, wcRound, WC._isMyTurn flag, epoch-protected 10s timer
- **Scramble MP** (v19.45+): scr-word (host sends word+hint), simultaneous race, scrRound, SCR._mpRoundDone guard
- **Breakout MP** (v19.45+): brk-done, brkRound alternation, oppWasFirst logic fixes odd-round scoring
- **Puzzle Scramble MP** (v19.45+): puzzle-done (with time), simultaneous solve, PZ._mpDone guard
- **TDZ fix** (v19.60): resetMMSV()/resetWC() moved to init block after const MP
- **WC double-timeout fix** (v19.66–v19.67): _isMyTurn guard + wc-timeout sync message to other device
- **MMSV improvements** (v19.68–v19.74): letter validation, two-step challenge confirm, extra category toggles opt-in
- **MMSV extra cats MP sync fix** (v19.75): mmsvGetActiveCats uses MMSV_CAT_POOL refs; mmsv-start calls mmsvPickCats()
- **Game count fix** (v19.77–v19.81): gamesAll achievement uses hardcoded 55; animalQuiz counted; 52→54→55 games

## v19.38–v19.44
- **Ghost MP** (v19.38–v19.41): ghost-letter/challenge/lang; host-only language change; ghostRound alternation; series score #ghostSeriesScore
- **Dots & Boxes MP** (v19.38): db-line from dbClick() (not dbPlaceLine); dbRound alternation
- **14 new achievements** (v19.44): ttt10, pong10, sok5, simon5, man10, ab5, sd10, uno10, ng5, sdk5, sol5, ghost10, scr10, hl10 → 68 total
- **Vyššie Nižšie MP** (v19.44): hl-turn-done, hlRound alternation, sequential turns

## v19.34–v19.37
- **Reversi MP** (v19.34): rev-move, revRound, host=⚫ even rounds, guest=⚫ odd rounds
- **Nim MP** (v19.34): nim-take from nimSelect() (confirm point, NOT nimTake), nimRound
- **MP Chat** (v19.34): #mpChatSection, chat-msg type, max 40 messages, Enter key
- **MP Ping** (v19.34): mp-ping/mp-pong every 4s, RTT in #mpPingMs
- **In-game chat bar** (v19.35): fixed bottom-left widget, auto-expand, unread badge on MP button
- **Simon Says MP** (v19.36): ss-result handoff, simonRound alternation
- **Mancala MP** (v19.36): mancala-move from manClickPit(), manRound alternation
- **Sokoban MP** (v19.36): sok-done on completion, p1Completed/p2Completed independent tracking

## v18.0–18.1
- **Search/Filter**: Quick search in game picker, real-time filtering, auto-clear on category change
- **Seasonal achievements**: 6 new (Christmas/Easter/Summer/Halloween), hry_seasonal_plays localStorage
- **Game preview animations**: Hover effects on cards (bounce/spin/pulse/wiggle)
