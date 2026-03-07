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
- ~~PWA s Service Worker~~ (DISABLED v36 - cache issues)
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

Aktuálna verzia: **v50**

## Changelog

### v50 (2026-03-07)
- 👥 **MP: Real player names in game (Lukáško & Natálka)**
  - MP.myName and MP.opponentName added to state
  - Host gets name from wP1Input (Lukáško)
  - Guest gets name from wP2Input (Natálka)
  - Handshake sends player name to opponent
  - getTTTPlayerName() helper returns correct name (MP vs local)
  - All status messages now show real names: "🎉 Lukáško vyhral!"
  - User request: "vies tam potom dat skutocne mena ako su napisane v hra"
  - **MP Step 4/5 complete!**

### v49 (2026-03-07)
- 🎮 **MP Step 4/5: Piškvorky Online Multiplayer!**
  - Piškvorky now work over the internet!
  - Host = Hráč 1 (X), Guest = Hráč 2 (O)
  - Turn-based system: only your turn is clickable
  - Moves synchronized via MP.connection.send()
  - Opponent moves received via mpHandleMessage()
  - Win detection works for both players
  - Real-time game state synchronization
  - User tested: "spojili sme 2 mobily dali zelena fajka"
  - **Next step:** Extend to more games (Connect4, Ghost, etc.)

### v48 (2026-03-07)
- 🚀 **MP Step 3/5: PeerJS Real Connections (debugged!)**
  - **ROOT CAUSE FOUND:** v45 had old `const MP = {}` from v27 (line 8217)
  - v46 added new `const MP = {}` (line 8243) → duplicate const declaration
  - JavaScript crashed → welcome screen non-interactive
  - **FIX:** Removed old MP object + old comment remnants from v45
  - Now: Clean single MP state object with PeerJS implementation
  - WebRTC peer-to-peer connections via 0.peerjs.com
  - Host creates room, guest connects via code
  - Real-time status updates, handshake protocol
  - User helped debug: "asi si odstranil button multiplayer a s tym daco spolocne?"

### v47 (2026-03-07)
- 🔄 **ROLLBACK to v45 (PeerJS broke welcome screen)**
  - v46 PeerJS implementation broke welcome screen
  - User symptom: "zase zmizla verzia a zase nejde na nic klikat"
  - Same issue as v28-v38 - MP changes break welcome screen
  - **ROOT CAUSE UNKNOWN** - need to debug v46 code carefully
  - v45 is KNOWN WORKING - keeping until issue resolved
  - Will NOT add PeerJS until we find root cause

### v46 (2026-03-07) - REVERTED
- ❌ PeerJS implementation broke welcome screen
- ❌ ROLLED BACK

### v45 (2026-03-07)
- 🧹 **Complete cleanup of old v27 MP code**
  - Removed old CSS: .multiplayer-box, .multiplayer-close, #mpQrCode
  - Removed old HTML: welcome-mp-btn with mpOpen() call
  - Removed old JS: updateMPButtonVisibility(), anyGameInAIMode variable
  - All old v27 remnants now completely removed
  - Only new floating button + modal system remains
  - User: "tak to vsetko poriadne oprav"

### v44 (2026-03-07)
- 🔧 **HOTFIX: Removed duplicate old modal structure**
  - ROOT CAUSE: Old modal from v27 was never removed
  - Duplicate IDs caused mpCreateRoom() to target wrong elements
  - Removed old multiplayerOverlay modal (lines 8368-8398)
  - Only new mp-overlay modal remains
  - User symptom: "vytvorenie miestnosti nedovoli"

### v43 (2026-03-07)
- 🔧 **HOTFIX: Restored missing modal control functions**
  - ROOT CAUSE: v42 cleanup accidentally removed v41 modal functions
  - Added back: openMPModal(), closeMPModal(), closeMPModalOnOverlay()
  - Floating MP button now works again
  - These control the MP modal overlay visibility
  - User symptom: "na ten modry globus mi teraz nejde kliknut"

### v42 (2026-03-07)
- 🔧 **HOTFIX: Removed duplicate MP functions**
  - ROOT CAUSE: Old MP code from v27 survived rollback
  - Removed 211 lines of old MP implementation
  - Functions were defined twice: mpCreateRoom, mpJoinRoom, etc.
  - Old code used non-existent variables (MP.peer, MP.isHost, etc.)
  - Kept only new simple UI-only functions from v41
  - "Vytvoriť miestnosť" button now works

### v41 (2026-03-07)
- 🚀 **MP Krok 2/5: Modal UI**
  - Full-screen overlay with blur effect (z-index: 9500)
  - Beautiful gradient modal with close button
  - **Host section:** "Vytvoriť miestnosť" → generates random code
  - **Join section:** Input field + "Pripojiť sa" button
  - Copy code button (📋)
  - Simulates connection (test mode - 1s delay → ✅)
  - Disconnect button
  - Close via X or click outside modal
  - Status indicators: waiting (⏳), connected (✅), error (❌)
  - Light/dark mode support
  - Mobile responsive
  - **No PeerJS yet** - just UI (Step 3 will add real connections)

### v40 (2026-03-07)
- 🚀 **MP Krok 1/5: Floating button**
  - Circular floating button in bottom-right corner (🌐)
  - Blue gradient with floating animation
  - Completely separate from welcome screen (z-index: 8000)
  - Opens alert() for testing (modal in next step)
  - updateFloatingMPButton() helper for state management
  - Changes to green pulsing when connected (✅)
  - **No changes to welcome screen** - learned from v28-v38

### v39 (2026-03-07)
- 🔄 **ROLLBACK to v37 again**
  - v38 broke welcome screen (same issue as v28-v36)
  - User: "zase nejde na nič klikať" - exact same problem
  - ROOT CAUSE: v27 MP code has something that breaks welcome screen
  - **v37 is KNOWN WORKING** - keeping it until we understand the root cause
  - Will NOT attempt MP re-implementation until root cause is found

### v38 (2026-03-07)
- 🌐 **Online Multiplayer re-implemented (carefully)**
  - Based on v27 (working MP) + improvements
  - ✅ MP Visual state: blue (disconnected) → green pulsing (connected)
  - ✅ MP Name synchronization: obaja hráči vidia správne mená
  - ✅ QR scanner + manual input
  - ✅ Host/Guest role indicator
  - ✅ Working in: Piškvorky & Connect4
  - **NO changes to welcome screen** (learned from v28-v36 mistakes)
  - Green pulsing animation when connected
  - Icon changes: 🌐 → ✅

### v37 (2026-03-07)
- 🔄 **ROLLBACK to v26 (known working version)**
  - REVERTED all changes from v27-v36 (online multiplayer + fixes)
  - **ROOT CAUSE:** Online multiplayer changes broke welcome screen
  - User symptom: "nič nefunguje, nejde klikať" (started with MP changes)
  - This is KNOWN WORKING version from before MP implementation
  - **Trade-off:** No online multiplayer, but app works
  - Will re-implement MP carefully in future versions

### v36 (2026-03-07)
- 💣 **RADICAL FIX: Service Worker DISABLED**
  - SW causing persistent cache issues
  - Auto-unregisters all existing SWs
  - No longer PWA/offline (trade-off for reliability)

### v35 (2026-03-07)
- 🔥 **HOTFIX: JavaScript crash fixed**
  - clearAllCache() function was missing (button existed but function didn't)
  - Caused entire page to be non-interactive
  - Fixed: function added before mpOpen()

### v34 (2026-03-07)
- 🔧 **NUCLEAR FIX: Welcome screen z-index war**
  - Z-index: 99999 (extreme priority)
  - Force Service Worker update
  - 🗑️ Clear Cache button (unregister SW, clear caches)
  - No-cache meta tags

### v33 (2026-03-07)
- 🔧 **CRITICAL FIX: Welcome screen fully interactive**
  - Verzia viditeľná (opacity:0.6, bold)
  - Všetky buttony fungujú
  - Force hide overlays on page load
  - .mobile-nav správne skrytý s pointer-events:none

### v32 (2026-03-07)
- 🔧 **Fix: Verzia viditeľná na mobile (znovu)**
  - Version display obnovený v renderMobileGrid()
  - MP badges zachované

### v31 (2026-03-07)
- 🔧 **CRITICAL FIX: Welcome screen clickable na mobile**
  - Opravené: buttons na welcome screen nefungovali na mobile v30
  - `.mobile-nav` skrytý dokým nie je aktívny

### v30 (2026-03-07)
- 🌐 **MP indikátory v hrách**
  - 🌐 MP badge na game cards
  - Hry s MP: Piškvorky, Connect4, Ghost, Hádaj Číslo, Obesenec, Vyššie Nižšie
- 📱 **Verzia viditeľná na mobile** (v spodnej časti game grid)

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
