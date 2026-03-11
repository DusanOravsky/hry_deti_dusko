# Hrajme si - Lukasko & Natalka

Offline herna zbierka pre deti. Single-file PWA so 42 hrami pre dvoch hracov, proti pocitacu, alebo **online cez internet**.

## Live

https://dusanoravsky.github.io/hry_deti_dusko/

## Hry (42)

### 2 hraci aj vs Pocitac (mode: both)
| Hra | Online MP | AI Difficulty |
|-----|-----------|---------------|
| Piskvorky (3x3, 4x4, 5x5, 10x10) | Yes | Yes |
| Connect 4 | Yes | Yes (easy/medium/hard) |
| Kamen Papier Noznice | Yes | - |
| Sach | Yes | Yes (easy/medium/hard) |
| Dama (Checkers) | Yes | Yes (easy/medium/hard) |
| Lodicky (Battleship) | Yes | Yes (easy/medium/hard) |
| Pexeso (6 nahodnych tem) | Yes | Yes |
| Clovece nehnevaj sa | Yes | Yes (easy/medium/hard) |
| Hadaj Cislo | Yes | - |
| Wordle (SK/EN, ~400 slov/jazyk, validacia slov) | Yes | Yes (solo) + PVP |
| Puzzle Scramble (canvas obrazky, 3x3/4x4/5x5) | - | - |
| Mini Labyrint | - | Yes (easy/medium/hard) |
| Reversi (Othello) | - | Yes (easy/medium/hard) |
| Breakout (Arkanoid) | - | Yes (easy/medium/hard) |
| Pong | Yes | Yes (easy/medium/hard) |
| Tank Battle (power-upy: shield/rapid/speed) | Yes | Yes (easy/medium/hard) |
| Vcely (canvas, vcely letia do ulov, hadaj ktory dostal najviac) | - | Yes (easy/medium/hard) |
| Futbal (canvas, penaltova strelba, sipka+sila, brankár) | - | Yes (easy/medium/hard) |
| Vojna (War) — kartova hra, vyššia karta berie, vojna pri zhode | - | - (pure luck) |
| Uno Light — farby+cisla+specials, wild, +2, skip, reverse | - | Yes (easy/medium/hard) |

### Len 2 hraci (mode: pvp)
| Hra |
|-----|
| Kviz (17 tem + 1000+ otazok) |
| Ghost (EN: 531 slov) |
| Reakcny Test (200ms penalta za predcasny tap) |
| Scramble / Jazykovy Scramble (5/10/15 kol) |
| Flashcards / Dopln pismeno / Prekladaj vety |
| Spam Click, Matika Duel, Emoji Hadanka |
| Obesenec, Vyssie Nizsie |
| Bodky a Krabicky (Dots & Boxes, 5x5 grid) |
| Doodle Jump (2-player turn-based, power-ups) |
| Snake Duel (2 hady sucasne, WASD vs sipky) [MP] |

### Solo
- Tetris (wall kicks, ghost piece, mobilne ovladacie tlacidla)
- Snake (canvas, swipe + sipky + tlacidla, high score)
- Preteky (Racing) (5x12 grid, 3 drahy, prekazky + mince)
- Gravity Run (canvas, endless runner, preklop gravitacie, high score)
- Minesweeper / Míny (8x8/10x10/12x12, flood-fill, vlajky, casovac)
- 2048 (4x4, swipe + sipky, zlucovanie dlazdic, high score + leaderboard)
- Flappy Bird (canvas, tap/space, prekazky z rur, high score + leaderboard)
- Statistiky + Achievement system (43 achievementov, oddeleny reset statistik a achievementov)

## Online Multiplayer

13 hier podporuje online multiplayer cez WebRTC peer-to-peer (PeerJS 1.5.5):
- **Piskvorky** - sync velkosti dosky, striedanie startujuceho hraca
- **Connect 4** - realtime sync tahov
- **Kamen Papier Noznice** - sucasne odhalenie volieb
- **Sach** - suradnice, otocenie dosky pre cierneho, hlasove prikazy, detekcia patu
- **Dama** - striedanie startujuceho hraca
- **Lodicky** - placement + strelanina + potopene lode
- **Pexeso** - sync otacania kariet + rozlozenia
- **Clovece** - sync kocky + tahov, farby hracov
- **Hadaj Cislo** - host posle cislo, guest hada
- **Snake Duel** - real-time, host runs game loop, guest sends direction
- **Tank Battle** - real-time, host runs game loop, guest sends keys + shoot
- **Wordle** - simultanne hadanie, oba hraci vidia vlastnu dosku, tie-breaking
- **Pong** - real-time, host runs physics, guest sends paddle direction/position

**Pripojenie:** Modra zemegula (floating button) > Vytvor/Pripoj sa > Room code alebo QR kod

**TURN server s ochranou hesla:**
- Na rovnakej WiFi funguje priame spojenie (STUN) — zadarmo, bez limitu
- Na roznych sietach (WiFi vs mobilne data) sa pouzije TURN relay server (Metered, 500MB/mesiac)
- TURN je chraneny heslom — pri prvom pouziti cez rozne siete sa zobrazi dialog na zadanie hesla
- Po odomknuti sa heslo ulozi v localStorage a netreba ho zadavat znova
- Indikator typu spojenia: "Priame spojenie" alebo "Cez server (TURN)"

**Session persistence:** Po refreshi stranky sa MP automaticky pokusi znovu pripojit (8s timeout).

**Auto-reconnect:** Pri strate spojenia (napr. vypla sa WiFi) sa automaticky pokusi znovu pripojit — max 3 pokusy po 2s, zobrazuje status toastom.

## Features

- **Mena hracov**: Prazdne na zaciatku, deti si nastavia vlastne mena, ulozia sa v localStorage per zariadenie
- **Wordle**: Slovensky aj anglicky jazyk (~400 slov/jazyk), solo (AI vyberie slovo) + PVP (striedanie zadavanie/hadanie), validacia slov
- **Animacie**: cellAppear, flipCard, diceRoll, glowCorrect, shakeWrong, pieceMove, rpsReveal
- **Zvuky**: Web Audio API zvuky (click, move, correct, wrong, flip, shot, hit, win) + vibracie
- **AI Difficulty**: hry s easy/medium/hard AI (Sach, Dama, Lodicky, Clovece, Labyrint, Reversi, Connect 4, Breakout, Pong, Tank Battle)
- **Offline indikator**: Cerveny banner ked nie je internet, auto-skrytie MP tlacidla
- **Favoritne hry**: Hviezdicka na kartach hier, zoradenie na zaciatok gridu
- **Posledne hrane**: Sekcia s nedavno hranymi hrami + moznost vymazat
- **Achievement system**: 43 achievementov (16 vseobecnych + 23 per-game + 4 daily) s toast notifikaciami
- **Oddeleny reset**: Samostatne tlacidla na vymazanie statistik a achievementov
- **Tmava/svetla tema**: Automaticky podla casu + manualne prepinanie
- **Aktivny hrac**: Vizualny indikator kto je na tahu (dimovanie + "Na rade" badge)
- **Sachove suradnice**: A-H / 1-8 okolo dosky, otocene pre cierneho v MP
- **Sachovy pat**: Detekcia patu (0 legalnych tahov = remiza)
- **Sachovy casovac**: Volitelny casovac na hru (5/10/15 min), odpocitavanie per hrac, automaticky vypnuty v MP mode
- **Hlasove prikazy (Sach)**: Web Speech API (sk-SK), povedz "E2 E4" pre tah
- **QR kody**: Generovanie a skenovanie QR kodu pre MP room code
- **Kviz**: 17 tematickych kategorii s 1000+ otazkami
- **Tetris**: Wall kicks (5 offset pokusov) + ghost piece (priehladny nahlad dopadu)
- **Doodle Jump**: Canvas hra s platformami (normalne/pohyblive/lamave), power-upy (pruzina/raketa), 2-player
- **Scramble kola**: Volitelny pocet kol (5/10/15)
- **Tank Battle power-upy**: Shield (blokuje 1 zasah), Rapid fire (3x rychlejsie nabijanie), Speed (2x pohyb)
- **stopAllGames()**: Centralizovany cleanup - vsetky hry sa zastavia pri navigacii prec
- **Confetti**: Canvas konfety animacia pri kazdom vitazstve (150 castic, 2.5s)
- **Denny challenge**: Nahodna hra/ciel kazdy den, streak tracking, tlacidlo na welcome + sidebar
- **Emoji avatary**: 20 emoji avatarov per hrac, ulozene v localStorage
- **Top 5 Leaderboard**: Solo hry (Tetris, Snake, Racing, Gravity Run, 2048, Flappy Bird) top 5 skorov
- **Animovane prechody**: Slide animacie (slideInRight/slideOutLeft) pri navigacii, cardPop pre karty hier
- **Welcome screen UX**: Pozdrav podla casu dna, rotujuci emoji, tlacidlo pokracovania poslednej hry

## Technologie

- Single HTML file (~18500 riadkov)
- PWA s Service Worker (network-first pre HTML, cache-first pre assety, auto-reload pri update)
- Plne offline funkcna (okrem online multiplayer)
- WebRTC peer-to-peer cez PeerJS 1.5.5 + Metered TURN servery (heslo chranene)
- Responsivny dizajn (mobile + desktop)
- Web Audio API zvuky s vibraciami
- Canvas-based hry (Snake, Tetris, Doodle Jump, Puzzle Scramble, Dots & Boxes, Breakout, Pong, Tank Battle, Snake Duel, Vcely, Futbal, Gravity Run, Flappy Bird)
- DFS generovanie labyrintu, BFS AI solver
- Web Speech API pre hlasove prikazy
- RTCPeerConnection.getStats() pre detekciu typu spojenia
- Statistiky hier + achievementy ulozene v localStorage
- MP session persistence v sessionStorage

## Struktura

```
index.html      # Cela aplikacia (HTML + CSS + JS)
sw.js           # Service Worker (network-first HTML, cache-first assets)
manifest.json   # PWA manifest
icon-192.png    # App ikona 192x192
icon-512.png    # App ikona 512x512
CLAUDE.md       # Dokumentacia pre Claude Code
README.md       # Tento subor
```

## Vyvoj

```bash
# Lokalny server
python3 -m http.server 8080

# Otvor v prehliadaci
open http://localhost:8080
```

## Verzionovanie

Verzia sa nastavuje v `index.html` (`APP_VERSION`) a musi byt synchronizovana s `sw.js` (`CACHE_NAME`).

Format: `hrajmesi-vN`

Aktualna verzia: **v10.0**

### Changelog

**v10.0** (2026-03-11) - War + Uno + Categories + Difficulty Persistence
- 🃏 **Vojna (War)** — kartova hra, vyššia karta berie, vojna pri zhode, AI auto-flip
- 🎴 **Uno Light** — farby+cisla, wild, +2, skip, reverse (acts as skip in 2-player), AI easy/medium/hard
- 🏷️ **Kategorie hier** — 6 kategorii (Všetky, Doskové, Arkádové, Slovné, Logické, Zábavné), horizontalne scrollovatelne pills
- 💾 **AI difficulty persistence** — ulozenie zvolenej obtiažnosti per hra v localStorage, auto-restore pri nacitani
- Bugfix: Reverse v Uno teraz správne funguje ako skip v 2-hráčovom mode
- Bugfix: War/Uno AI timeout cleanup v stopAllGames()
- Celkovo 42 hier

**v9.1** (2026-03-11) - Docs & Version Sync
- Aktualizacia CLAUDE.md a README.md
- Sync verzii a dokumentacie

**v9.0** (2026-03-11) - Welcome UX + Achievements + Transitions
- 🎮 **Welcome screen UX**: Pozdrav podla casu dna, rotujuci emoji, continue poslednej hry, pulse start
- 🏅 **23 novych per-game achievementov**: Tetris 1000+, Snake 20+, Racing 50+, Gravity 100+, Minesweeper hard, Sach 10 hier, atd.
- 🎞️ **Animovane prechody**: slideInRight/slideOutLeft pri navigacii, cardPop pre karty hier
- Celkovo 43 achievementov (16 vseobecnych + 23 per-game + 4 daily)
- Bugfix: TDZ crash z welcome emoji rotation

**v8.0** (2026-03-11) - New Games + Major Features
- 🔢 **2048** — klasicka hra, 4x4 grid, swipe + sipky, high score + leaderboard
- 🐤 **Flappy Bird** — canvas hra, tap/space, prekazky z rur, high score + leaderboard
- 🎊 **Konfety** — canvas animacia pri kazdom vitazstve (150 castic, 2.5s)
- 📅 **Denny challenge** — nahodna hra/ciel kazdy den, streak tracking
- 😀 **Emoji avatary** — 20 emoji avatarov per hrac, ulozene v localStorage
- 🏆 **Top 5 Leaderboard** — solo hry (Tetris, Snake, Racing, Gravity Run, 2048, Flappy) top 5 skorov
- 🟩 **Wordle MP** — simultanne hadanie online, tie-breaking logika
- Bugfixy: Wordle MP tie bias, 2048 false win on game-over, game count, Reversi icon mismatch
- 40 hier celkovo, 13 s online MP

**v7.0** (2026-03-10) - Version Bump
- Bump verzie a stabilizacia

**v6.6** (2026-03-10) - Minesweeper + UI Polish
- 💣 **Minesweeper (Míny)** — klasická hra, 3 obťažnosti (8×8/10×10/12×12)
  - Iteratívny flood-fill, vlajkovanie mín, časovač
  - Prvý klik vždy bezpečný (9 políčok okolo)
  - Režim Kopať/Vlajka pre mobilné zariadenia
  - Pridaný do turnaja (len AI mode, výhra=1 bod, boom=0.5 bodu)
- 🔄 Reversi ikona zmenená z ⚫ na 🔄 (lepšia rozlíšiteľnosť)
- 🎨 Minesweeper grid: viditeľné okraje, modré neodkryté bunky, kontrastné farby

**v6.4** (2026-03-10) - New Games + Bugfixes
- 🐝 **Vcely (Bee Counting)** — canvas hra, vcely letia do 3 ulov, hadaj ktory dostal najviac
  - AI mode: solo X/5 (bez P2), PvP: striedanie hracov
  - 3 obtiaznosti (easy/medium/hard) ovplyvnuju rychlost a pocet vciel
- ⚽ **Futbal (Penalty Shootout)** — canvas penaltova strelba
  - Kyvajuca sipka pre smer + oscilujuci power bar pre silu
  - AI brankar (easy 20%/medium 45%/hard 70% zachytenie)
  - Solo X/5 v AI mode, PvP striedanie strelcov
- 🌀 **Gravity Run** — canvas endless runner s preklpom gravitacie
  - Bezis automaticky, klikni/medzernik pre zmenu gravitacie (podlaha/strop)
  - Prekazky na oboch stranach, zvysujuca sa rychlost
  - High score ulozeny v localStorage
- 🔧 **Bugfixy:**
  - 7 systemovych bugov (mpSend helper, localStorage crash protection, memory leaks)
  - Bee solo mode: skryte mena hracov v AI mode
  - TDZ crash fix (v6.3): resetSoccer/resetGravity volane pred const deklaraciami
  - 13 chybajucich desktop sidebar tlacidiel
  - Quiz ikona zmenena z ❓ na 🧪
  - Stats page: pridana help informacia

**v6.0** (2026-03-10) - Tournament Polish & Fixes
- 🏆 **Tournament mode improvements:**
  - Fixed 7 critical bugs (custom confirm, celebrate crash, mobile detection)
  - Floating leaderboard banner - visible during games with live scores
  - Mobile back button protection - warns before canceling tournament
  - Immediate score updates after each game
  - AI/PvP mode filtering - shows only relevant games (10 vs 15)
  - Tournament rules help button
  - Better UX with green toast notifications
- 📳 Vibration toggle improvements - red background when disabled for clarity
- Tournament available games filtered by mode (AI: 10 games, PvP: 15 games)

**v5.0** (2026-03-10) - Major Feature Release
- 🏆 **Multi-Game Tournament Mode** - compete across 3-5 games
  - Manual game selection or random selection by computer
  - Point system: 1 for win, 0.5 for draw
  - Live leaderboard with progress tracker
  - Auto-progression between games (3-sec delay)
  - Victory screen with final results + confetti
- 📳 Vibration toggle - on/off control next to sound button
- Integrated tournament tracking with existing stats system
- New sidebar buttons: 🏆 TURNAJ and 🎲 RANDOM BATTLE

**v4.7** (2026-03-10)
- Fix: Turn timer memory leak - timers sa zastavuju pri navigacii
- Fix: MP reconnect cleanup - reset counter pri manuálnom odpojení
- Fix: Player name preservation - "Počítač" sa neukladá do localStorage v AI mode
- Fix: Empty name validation - trim() a fallback na default mená
- Optimization: playSound('win') - rýchlejšia generácia tónov
- UX: Turn timer expire animation - blink efekt + timeout sound
- UX: MP connection type tooltips - vysvetlenie TURN vs P2P
- UX: Pause button visibility - oranžový gradient pre lepšiu viditeľnosť
- Optimization: Wordle board - reuse DOM tiles namiesto rebuild

**v4.6** (predchádzajúca)
- Version-tracked SW update - localStorage tracking pre update toast
- Session persistence - MP auto-reconnect po refresh
- Chess timer + complete rules (check/checkmate/castling/en passant)
- AI pre-thinking - Chess & Checkers hard mode
- PWA install prompt

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys z main branch.

## (c) Dusan Oravsky
