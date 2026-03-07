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

Aktuálna verzia: **v29**

## Changelog

### v29 (2026-03-07)
- 📷 **QR Scanner pre Online Multiplayer**
  - Button "📷 Naskenuj QR kód" v Join sekcii
  - Kameru scanner modal (zadná kamera na mobile / webcam na desktop)
  - Auto-pripojenie po naskenovaní QR kódu

### v28 (2026-03-07)
- 🌐 **MP: Synchronizácia mien**
  - Obaja hráči vidia správne mená (Lukáško vs Natálka)
  - Nie viac "Hráč 1/2" v MP režime
  - Handshake výmena mien pri pripojení
  - Player cards sa aktualizujú automaticky

### v27 (2026-03-07)
- 🌐 **Online Multiplayer: Funguje! 🎮**
  - **Piškvorky** - hraj proti kamarátovi cez internet
  - **Connect 4** - real-time synchronizácia ťahov
  - Host = Hráč 1 (X/Red), Guest = Hráč 2 (O/Blue)
  - WebRTC peer-to-peer (bez servera, bez oneskorenia)
  - Automatická detekcia ťahu (iba aktívny hráč môže hrať)

### v26 (2026-03-07)
- 🔧 **Online Multiplayer: UX vylepšenia**
  - MP tlačidlo sa skrýva keď si zvolíš "vs Počítač" režim
  - MP je dostupný iba pre 2-player hry (nie pre AI režim)
  - Automaticky sa resetuje keď sa vrátiš na welcome screen

### v25 (2026-03-07)
- 🎮 **Tetris: Solo režim** - iba 1 hráč (score/level tracking)
  - Odstránený 2-player a AI režim
  - Klikni/ťukni na pole pre otočenie kocky
  - Šípky ←→↓ pre pohyb
  - High score tracking
- 🌐 **Online Multiplayer: opravy**
  - Fix: PeerJS server (0.peerjs.com cloud namiesto Heroku)
  - Nové: Status indikátor na MP tlačidle (🌐 → ✅)
  - Debug režim pre diagnostiku pripojenia
- 🔧 **Topbar: fix viditeľnosti**
  - Oprava: Navigačná lišta zmizla v hrách/štatistikách
  - welcomeScreen.hide teraz správne skrýva overlay

### v24 (2026-03-07)
- Fix: V štatistikách sa teraz zobrazujú správne mená hráčov (namiesto "Hráč 1/2")

### v23 (2026-03-07)
- 🎮 **Tetris AI režim** - 1 hráč vs počítač
  - Mode selector: 2 hráči alebo vs Počítač
  - AI difficulty: Ľahká/Stredná/Ťažká
  - **Rotácia cez klik/tap** na tvoje pole (nie šípky)
  - AI hodnotí pozície a optimalizuje umiestnenie
  - Šípky ←→↓ pre pohyb a rýchly pád
  - PVP režim stále funguje s WASD pre P2

### v22 (2026-03-07)
- 🌐 **Online Multiplayer** - WebRTC peer-to-peer cez PeerJS
  - QR kód na pripojenie (bez vlastného servera)
  - Host vytvorí miestnosť a zobrazí QR
  - Guest naskenuje QR alebo zadá kód
  - Real-time synchronizácia game state
  - Pripravené pre rozšírenie na všetky hry

### v21 (2026-03-07)
- 🎮 **Nová hra: Tetris** - 2 hráči súťažia (šípky vs WASD)
  - Klasický Tetris s 7 tvarmi (I, O, T, S, Z, J, L)
  - Každý hráč má vlastné pole 10×20
  - Rýchlosť sa zvyšuje s levelom
  - Body za cleared lines

### v20 (2026-03-07)
- Nové: Rozšírené zvuky (move, correct, flip, shot, miss, timeout) s vibráciami
- Nové: Automatický tmavý/svetlý režim podľa času (18:00-06:00 = tmavý)
- Nové: História posledných 3 hier na welcome screen
- Nové: "Hraj znova" overlay button po skončení hry
- Vylepšenie: Vibrácie pre všetky akcie (výhry, prehry, timeout)

### v19 (2026-03-07)
- Oprava: Mobile topbar zmizol pri prezeraní štatistík (zvýšený z-index, explicitné skrývanie welcome screen)
- Oprava: Button na vymazanie štatistík mal zlú pozíciu (flexbox layout namiesto float)
- Oprava: Piškvorky 10x10 doska sa zmenšila pri prvom načítaní (CSS špecificita)

### v18 (2026-03-07)
- Oprava: Remízy sa nepočítali vo všetkých hrách (pridané addWin(0) do 10 hier)
- Oprava: Navigácia späť nefungovala správne (nový _returnGameToParent helper)
- Premenované: Piškvorky 15×15 → 10×10 (zodpovedá mobilnej veľkosti)
- Pridané: README.md a CLAUDE.md dokumentácia
