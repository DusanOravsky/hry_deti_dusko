# Hrajme si - Lukáško & Natálka

Offline herná zbierka pre deti. Single-file PWA s 20+ hrami pre dvoch hráčov alebo proti počítaču.

## Live

https://dusanoravsky.github.io/hry_deti_dusko/

## Hry

### 2 hráči aj vs Počítač
- Piškvorky (3x3, 4x4, 5x5, 10x10)
- Connect 4
- Šach
- Dáma (Checkers)
- Lodičky (Battleship)
- Puzzle Scramble (canvas obrázky, 3x3/4x4/5x5)
- Mini Labyrint

### Len 2 hráči
- Kameň Papier Nožnice
- Hádaj Číslo
- Pamäť (Memory)
- Kvíz
- Ghost
- Reakčný Test
- Scramble
- Jazykový Scramble
- Flashcards
- Doplň písmeno
- Prekladaj vety
- Spam Click
- Matika Duel
- Emoji Hádanka
- Obesenec
- Vyššie Nižšie

## Technológie

- Single HTML file (~7700 riadkov)
- PWA s Service Worker (network-first pre HTML, cache-first pre assets)
- Plne offline funkčná
- Responsívny dizajn (mobile + desktop)
- Canvas-based Puzzle Scramble s 6 scénami
- DFS generovanie labyrintu, BFS AI solver
- Štatistiky hier uložené v localStorage

## Štruktúra

```
index.html      # Celá aplikácia (HTML + CSS + JS)
sw.js           # Service Worker
manifest.json   # PWA manifest
icon-192.png    # App ikona 192x192
icon-512.png    # App ikona 512x512
```

## Vývoj

```bash
# Lokálny server
python3 -m http.server 8080

# Otvor v prehliadači
open http://localhost:8080
```

## Verzionovanie

Verzia sa nastavuje v `index.html` (`APP_VERSION`) a musí byť synchronizovaná s `sw.js` (`CACHE_NAME`).
