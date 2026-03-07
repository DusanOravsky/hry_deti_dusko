# Hrajme si - Lukasko & Natalka

Offline herna zbierka pre deti. Single-file PWA s 29 hrami pre dvoch hracov, proti pocitacu, alebo **online cez internet**.

## Live

https://dusanoravsky.github.io/hry_deti_dusko/

## Hry (29)

### 2 hraci aj vs Pocitac (mode: both)
| Hra | Online MP | AI Difficulty |
|-----|-----------|---------------|
| Piskvorky (3x3, 4x4, 5x5, 10x10) | Yes | Yes |
| Connect 4 | Yes | Yes |
| Sach | - | Yes (easy/medium/hard) |
| Dama (Checkers) | - | Yes (easy/medium/hard) |
| Lodicky (Battleship) | Yes | Yes (easy/medium/hard) |
| Pexeso (6 nahodnych tem) | Yes | Yes |
| Clovece nehnevaj sa | Yes | Yes (easy/medium/hard) |
| Puzzle Scramble (canvas obrazky, 3x3/4x4/5x5) | - | - |
| Mini Labyrint | - | Yes (easy/medium/hard) |

### Len 2 hraci (mode: pvp)
| Hra | Online MP |
|-----|-----------|
| Kamen Papier Noznicky | - |
| Hadaj Cislo | Yes |
| Kviz (16 tem + 200+ otazok) | - |
| Ghost | Yes |
| Reakcny Test | - |
| Scramble | - |
| Jazykovy Scramble | - |
| Flashcards | - |
| Dopln pismeno | - |
| Prekladaj vety | - |
| Spam Click | - |
| Matika Duel | - |
| Emoji Hadanka | - |
| Obesenec | Yes |
| Vyssie Nizsie | Yes |
| Preteky (Racing) | - |
| Bodky a Krabicky (Dots & Boxes) | - |

### Solo (mode: always)
- Tetris (s mobilnymi ovladacimi tlacidlami)
- Snake (canvas, swipe + sipky + tlacidla)
- Statistiky + Achievement system

## Online Multiplayer

9 hier podporuje online multiplayer cez WebRTC peer-to-peer (PeerJS):
- **Piskvorky** - sync velkosti dosky, striedanie startujuceho hraca
- **Connect 4** - realtime sync tahov
- **Lodicky** - placement + strelanina
- **Pexeso** - sync otacania kariet + rozlozenia
- **Clovece** - sync kocky + tahov
- **Hadaj Cislo** - host posle cislo, guest hada
- **Ghost** - sync pismen
- **Obesenec** - sync hadania
- **Vyssie Nizsie** - sync tipov

Pripojenie: Modra zemegula (floating button) > Vytvor/Pripoj sa > Room code

## Features

- **Animacie**: cellAppear, flipCard, diceRoll, glowCorrect, shakeWrong, pieceMove, rpsReveal
- **Zvuky**: Web Audio API zvuky (click, move, correct, wrong, flip, shot, hit, win) + vibracie
- **AI Difficulty**: 5 hier s easy/medium/hard AI (Sach, Dama, Lodicky, Clovece, Labyrint)
- **Offline indikator**: Cerveny banner ked nie je internet, auto-skrytie MP tlacidla
- **Favoritne hry**: Hviezdicka na kartach hier, zoradenie na zaciatok gridu
- **Posledne hrane**: Sekcia s 3 nedavno hranymi hrami + moznost vymazat
- **Achievement system**: 16 achievementov s toast notifikaciami (prvá hra, serie, maraton, ...)
- **Tmava/svetla tema**: Automaticky podla casu + manualne prepinanie
- **Kviz**: 16 tematickych kategorii (vseobecne, jedlo, zvierata, psy, kone, Avengers, DC, zemepis, historia, veda, sport, filmy, hudba, Slovensko, hlavne mesta) s 200+ otazkami

## Technologie

- Single HTML file (~10100+ riadkov)
- PWA s Service Worker (network-first pre HTML, cache-first pre assety)
- Plne offline funkcna (okrem online multiplayer)
- WebRTC peer-to-peer cez PeerJS (ziadny backend)
- Responsivny dizajn (mobile + desktop)
- Web Audio API zvuky s vibraciami
- Canvas-based Puzzle Scramble s 6 scenami + Dots & Boxes
- DFS generovanie labyrintu, BFS AI solver
- Statistiky hier + achievementy ulozene v localStorage

## Struktura

```
index.html      # Cela aplikacia (HTML + CSS + JS)
sw.js           # Service Worker (network-first HTML, cache-first assets)
manifest.json   # PWA manifest
icon-192.png    # App ikona 192x192
icon-512.png    # App ikona 512x512
CLAUDE.md       # Dokumentacia pre Claude Code
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

Aktualna verzia: **v20**

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys z main branch.
