# Hrajme si - Lukasko & Natalka

Offline herna zbierka pre deti. Single-file PWA s 35 hrami pre dvoch hracov, proti pocitacu, alebo **online cez internet**.

## Live

https://dusanoravsky.github.io/hry_deti_dusko/

## Hry (35)

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
| Wordle (SK/EN, ~400 slov/jazyk, validacia slov) | - | Yes (solo) + PVP |
| Puzzle Scramble (canvas obrazky, 3x3/4x4/5x5) | - | - |
| Mini Labyrint | - | Yes (easy/medium/hard) |
| Reversi (Othello) | - | Yes (easy/medium/hard) |
| Breakout (Arkanoid) | - | Yes (easy/medium/hard) |
| Pong | Yes | Yes (easy/medium/hard) |
| Tank Battle (power-upy: shield/rapid/speed) | Yes | Yes (easy/medium/hard) |

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
- Statistiky + Achievement system (oddeleny reset statistik a achievementov)

## Online Multiplayer

12 hier podporuje online multiplayer cez WebRTC peer-to-peer (PeerJS 1.5.5):
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
- **Pong** - real-time, host runs physics, guest sends paddle direction/position

**Pripojenie:** Modra zemegula (floating button) > Vytvor/Pripoj sa > Room code alebo QR kod

**TURN server s ochranou hesla:**
- Na rovnakej WiFi funguje priame spojenie (STUN) — zadarmo, bez limitu
- Na roznych sietach (WiFi vs mobilne data) sa pouzije TURN relay server (Metered, 500MB/mesiac)
- TURN je chraneny heslom — pri prvom pouziti cez rozne siete sa zobrazi dialog na zadanie hesla
- Po odomknuti sa heslo ulozi v localStorage a netreba ho zadavat znova
- Indikator typu spojenia: "Priame spojenie" alebo "Cez server (TURN)"

**Session persistence:** Po refreshi stranky sa MP automaticky pokusi znovu pripojit (8s timeout).

## Features

- **Mena hracov**: Prazdne na zaciatku, deti si nastavia vlastne mena, ulozia sa v localStorage per zariadenie
- **Wordle**: Slovensky aj anglicky jazyk (~400 slov/jazyk), solo (AI vyberie slovo) + PVP (striedanie zadavanie/hadanie), validacia slov
- **Animacie**: cellAppear, flipCard, diceRoll, glowCorrect, shakeWrong, pieceMove, rpsReveal
- **Zvuky**: Web Audio API zvuky (click, move, correct, wrong, flip, shot, hit, win) + vibracie
- **AI Difficulty**: hry s easy/medium/hard AI (Sach, Dama, Lodicky, Clovece, Labyrint, Reversi, Connect 4, Breakout, Pong, Tank Battle)
- **Offline indikator**: Cerveny banner ked nie je internet, auto-skrytie MP tlacidla
- **Favoritne hry**: Hviezdicka na kartach hier, zoradenie na zaciatok gridu
- **Posledne hrane**: Sekcia s nedavno hranymi hrami + moznost vymazat
- **Achievement system**: 16 achievementov s toast notifikaciami
- **Oddeleny reset**: Samostatne tlacidla na vymazanie statistik a achievementov
- **Tmava/svetla tema**: Automaticky podla casu + manualne prepinanie
- **Aktivny hrac**: Vizualny indikator kto je na tahu (dimovanie + "Na rade" badge)
- **Sachove suradnice**: A-H / 1-8 okolo dosky, otocene pre cierneho v MP
- **Sachovy pat**: Detekcia patu (0 legalnych tahov = remiza)
- **Hlasove prikazy (Sach)**: Web Speech API (sk-SK), povedz "E2 E4" pre tah
- **QR kody**: Generovanie a skenovanie QR kodu pre MP room code
- **Kviz**: 17 tematickych kategorii s 1000+ otazkami
- **Tetris**: Wall kicks (5 offset pokusov) + ghost piece (priehladny nahlad dopadu)
- **Doodle Jump**: Canvas hra s platformami (normalne/pohyblive/lamave), power-upy (pruzina/raketa), 2-player
- **Scramble kola**: Volitelny pocet kol (5/10/15)
- **Tank Battle power-upy**: Shield (blokuje 1 zasah), Rapid fire (3x rychlejsie nabijanie), Speed (2x pohyb)
- **stopAllGames()**: Centralizovany cleanup - vsetky hry sa zastavia pri navigacii prec

## Technologie

- Single HTML file (~14600 riadkov)
- PWA s Service Worker (network-first pre HTML, cache-first pre assety, auto-reload pri update)
- Plne offline funkcna (okrem online multiplayer)
- WebRTC peer-to-peer cez PeerJS 1.5.5 + Metered TURN servery (heslo chranene)
- Responsivny dizajn (mobile + desktop)
- Web Audio API zvuky s vibraciami
- Canvas-based hry (Snake, Tetris, Doodle Jump, Puzzle Scramble, Dots & Boxes, Breakout, Pong, Tank Battle, Snake Duel)
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

Aktualna verzia: **v114**

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys z main branch.

## (c) Dusan Oravsky
