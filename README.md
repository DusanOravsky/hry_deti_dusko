# Hrajme si - Lukasko & Natalka

Offline herna zbierka pre deti. Single-file PWA s 27 hrami pre dvoch hracov, proti pocitacu, alebo **online cez internet**.

## Live

https://dusanoravsky.github.io/hry_deti_dusko/

## Hry (27)

### 2 hraci aj vs Pocitac (mode: both)
| Hra | Online MP |
|-----|-----------|
| Piskvorky (3x3, 4x4, 5x5, 10x10) | Yes |
| Connect 4 | Yes |
| Sach | - |
| Dama (Checkers) | - |
| Lodicky (Battleship) | Yes |
| Pexeso (6 nahodnych tem) | Yes |
| Clovece nehnevaj sa | Yes |
| Puzzle Scramble (canvas obrazky, 3x3/4x4/5x5) | - |
| Mini Labyrint | - |

### Len 2 hraci (mode: pvp)
| Hra | Online MP |
|-----|-----------|
| Kamen Papier Noznicky | - |
| Hadaj Cislo | Yes |
| Kviz | - |
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

### Solo (mode: always)
- Tetris (s mobilnymi ovladacimi tlacidlami)
- Statistiky

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

## Technologie

- Single HTML file (~9700+ riadkov)
- PWA s Service Worker (network-first pre HTML, cache-first pre assety)
- Plne offline funkcna (okrem online multiplayer)
- WebRTC peer-to-peer cez PeerJS (ziadny backend)
- Responsivny dizajn (mobile + desktop)
- Web Audio API zvuky s vibraciami
- Canvas-based Puzzle Scramble s 6 scenami
- DFS generovanie labyrintu, BFS AI solver
- Statistiky hier ulozene v localStorage

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

Aktualna verzia: **v12** (sw.js) / **v55** (APP_VERSION)

## Deploy

```bash
git add index.html sw.js
git commit -m "description"
git push
```

GitHub Pages auto-deploys z main branch.
