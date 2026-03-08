# Hrajme si - Lukasko & Natalka

Offline herna zbierka pre deti. Single-file PWA s 30 hrami pre dvoch hracov, proti pocitacu, alebo **online cez internet**.

## Live

https://dusanoravsky.github.io/hry_deti_dusko/

## Hry (30)

### 2 hraci aj vs Pocitac (mode: both)
| Hra | Online MP | AI Difficulty |
|-----|-----------|---------------|
| Piskvorky (3x3, 4x4, 5x5, 10x10) | Yes | Yes |
| Connect 4 | Yes | Yes |
| Kamen Papier Noznice | Yes | - |
| Sach | Yes | Yes (easy/medium/hard) |
| Dama (Checkers) | Yes | Yes (easy/medium/hard) |
| Lodicky (Battleship) | Yes | Yes (easy/medium/hard) |
| Pexeso (6 nahodnych tem) | Yes | Yes |
| Clovece nehnevaj sa | Yes | Yes (easy/medium/hard) |
| Hadaj Cislo | Yes | - |
| Puzzle Scramble (canvas obrazky, 3x3/4x4/5x5) | - | - |
| Mini Labyrint | - | Yes (easy/medium/hard) |
| Reversi (Othello) | - | Yes (easy/medium/hard) |

### Len 2 hraci (mode: pvp)
| Hra |
|-----|
| Kviz (17 tem + 200+ otazok) |
| Ghost |
| Reakcny Test |
| Scramble / Jazykovy Scramble |
| Flashcards / Dopln pismeno / Prekladaj vety |
| Spam Click, Matika Duel, Emoji Hadanka |
| Obesenec, Vyssie Nizsie |
| Bodky a Krabicky (Dots & Boxes) |

### Solo
- Tetris (s mobilnymi ovladacimi tlacidlami)
- Snake (canvas, swipe + sipky + tlacidla, high score)
- Preteky (Racing) (5x12 grid, 3 drahy, prekazky + mince)
- Statistiky + Achievement system

## Online Multiplayer

9 hier podporuje online multiplayer cez WebRTC peer-to-peer (PeerJS 1.5.5):
- **Piskvorky** - sync velkosti dosky, striedanie startujuceho hraca
- **Connect 4** - realtime sync tahov
- **Kamen Papier Noznice** - sucasne odhalenie volieb
- **Sach** - suradnice, otocenie dosky pre cierneho, hlasove prikazy
- **Dama** - striedanie startujuceho hraca
- **Lodicky** - placement + strelanina + potopene lode
- **Pexeso** - sync otacania kariet + rozlozenia
- **Clovece** - sync kocky + tahov, farby hracov
- **Hadaj Cislo** - host posle cislo, guest hada

**Pripojenie:** Modra zemegula (floating button) > Vytvor/Pripoj sa > Room code alebo QR kod

**Poznamka:** Online MP vyzaduje aby obe zariadenia boli na rovnakej WiFi sieti (bez TURN servera).

**Session persistence:** Po refreshi stranky sa MP automaticky pokusi znovu pripojit (8s timeout).

## Features

- **Animacie**: cellAppear, flipCard, diceRoll, glowCorrect, shakeWrong, pieceMove, rpsReveal
- **Zvuky**: Web Audio API zvuky (click, move, correct, wrong, flip, shot, hit, win) + vibracie
- **AI Difficulty**: hry s easy/medium/hard AI (Sach, Dama, Lodicky, Clovece, Labyrint, Reversi)
- **Offline indikator**: Cerveny banner ked nie je internet, auto-skrytie MP tlacidla
- **Favoritne hry**: Hviezdicka na kartach hier, zoradenie na zaciatok gridu
- **Posledne hrane**: Sekcia s nedavno hranymi hrami + moznost vymazat
- **Achievement system**: 16 achievementov s toast notifikaciami
- **Tmava/svetla tema**: Automaticky podla casu + manualne prepinanie
- **Aktivny hrac**: Vizualny indikator kto je na tahu (dimovanie + "Na rade" badge)
- **Sachove suradnice**: A-H / 1-8 okolo dosky, otocene pre cierneho v MP
- **Hlasove prikazy (Sach)**: Web Speech API (sk-SK), povedz "E2 E4" pre tah
- **QR kody**: Generovanie a skenovanie QR kodu pre MP room code
- **Kviz**: 17 tematickych kategorii s 200+ otazkami

## Technologie

- Single HTML file (~11300+ riadkov)
- PWA s Service Worker (network-first pre HTML, cache-first pre assety)
- Plne offline funkcna (okrem online multiplayer)
- WebRTC peer-to-peer cez PeerJS 1.5.5 (ziadny backend)
- Responsivny dizajn (mobile + desktop)
- Web Audio API zvuky s vibraciami
- Canvas-based Puzzle Scramble + Dots & Boxes
- DFS generovanie labyrintu, BFS AI solver
- Web Speech API pre hlasove prikazy
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

Aktualna verzia: **v33**

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys z main branch.

## (c) Dusan Oravsky
