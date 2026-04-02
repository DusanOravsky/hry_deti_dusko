# Games Reference (57 total)

## Quick Lookup Table

| gameId | Label | Mode | MP | State | Reset fn |
|--------|-------|------|----|-------|----------|
| `ticTacToe` | Piškvorky | both | ✓ | — | `resetTTT()` / `resetPsk15()` |
| `rockPaper` | Kameň Papier | both | ✓ | `RPS` | `resetRPS()` |
| `memory` | Pexeso | both | ✓ | `MEM` | `resetMem()` |
| `connect4` | Connect 4 | both | ✓ | `C4` | `resetC4()` |
| `guessNum` | Hádaj Číslo | both | ✓ | `GN` | `resetGN()` |
| `chess` | Šach | both | ✓ | `CH` | `resetChess()` |
| `checkers` | Dáma | both | ✓ | `DK` | `resetCheckers()` |
| `quiz` | Kvíz | pvp | ✓ | `QUIZ` | `resetQuiz()` |
| `battleship` | Lodičky | both | ✓ | `BS` | `resetBS()` |
| `ghost` | Ghost | pvp | ✓ | `GHOST` | `resetGhost()` |
| `reaction` | Reakcia | pvp | — | `REAC` | `resetReaction()` |
| `spamClick` | Spam Click | pvp | — | `SC` | `resetSC()` |
| `mathDuel` | Matika Duel | pvp | — | `MD` | `resetMD()` |
| `emojiGuess` | Emoji Hádanka | pvp | — | `EG` | `resetEG()` |
| `hangman` | Obesenec | pvp | — | `HM` | `resetHM()` |
| `mmsv` | Meno Mesto | pvp | ✓ | `MMSV` | `resetMMSV()` |
| `wordChain` | Slovný Reťazec | pvp | ✓ | `WC` | `resetWC()` |
| `higherLower` | Vyššie Nižšie | pvp | ✓ | `HL` | `resetHL()` |
| `scramble` | Scramble | pvp | ✓ | `SCR` | `resetScramble()` |
| `langScramble` | Jaz. Scramble | pvp | — | `LS` | `resetLS()` |
| `flashcard` | Flashcards | pvp | — | `FC` | `resetFC()` |
| `missingLetter` | Doplň písmeno | pvp | — | `ML` | `resetML()` |
| `sentence` | Prekladaj vety | pvp | — | `ST` | `resetST()` |
| `puzzle` | Puzzle Scramble | both | ✓ | `PZ` | `resetPuzzle()` |
| `maze` | Labyrint | both | — | `MZ` | `resetMaze()` |
| `reversi` | Reversi | both | ✓ | `REV` | `resetReversi()` |
| `tetris` | Tetris | solo | — | `TET` | `resetTetris()` |
| `snake` | Snake | solo | — | `SNK` | `resetSnake()` |
| `ludo` | Človeče | both | ✓ | `LUDO` | `resetLudo()` |
| `dotsBoxes` | Bodky | pvp | ✓ | `DB` | `resetDB()` |
| `racing` | Preteky | solo | — | `RACE` | `resetRace()` |
| `breakout` | Breakout | both | ✓ | `BRK` | `resetBreakout()` |
| `pong` | Pong | both | ✓ | `PNG` | `resetPong()` |
| `tanks` | Tank Battle | both | ✓ | `TNK` | `resetTanks()` |
| `snakeDuel` | Snake Duel | pvp | ✓ | `SD` | `resetSnakeDuel()` |
| `doodle` | Doodle Jump | both | — | `DOOD` | `resetDoodle()` |
| `wordle` | Wordle | both | ✓ | `WDL` | `resetWordle()` |
| `beeCount` | Včely | both | — | `BEE` | `resetBee()` |
| `soccer` | Futbal | both | — | `SOC` | `resetSoccer()` |
| `minesweeper` | Míny | solo | — | `MS` | `resetMinesweeper()` |
| `gravityRun` | Gravity Run | solo | — | `GRAV` | `resetGravity()` |
| `game2048` | 2048 | solo | — | `G48` | `resetG2048()` |
| `flappy` | Flappy Bird | solo | — | `FLAP` | `resetFlappy()` |
| `angryBirds` | Angry Birds | both | — | `AB` | `resetAngryBirds()` |
| `sokoban` | Sokoban | both | ✓ | `SOK` | `resetSokoban()` |
| `cardWar` | Vojna | solo | — | `WAR` | `resetWar()` |
| `unoGame` | Uno | both | — | `UNO` | `resetUno()` |
| `solitaire` | Solitaire | solo | — | `SOL` | `resetSol()` |
| `nimGame` | Nim | both | ✓ | `NIM` | `resetNim()` |
| `nonogram` | Nonogram | solo | — | `NG` | `resetNonogram()` |
| `sudoku` | Sudoku | solo | — | `SDK` | `resetSudoku()` |
| `simonSays` | Simon Says | both | ✓ | `SIMON` | `resetSimon()` |
| `mancala` | Mancala | both | ✓ | `MAN` | `resetMancala()` |
| `animalGuess` | Hádaj Zviera | both | ✓ | `AGA` | `resetAGA()` |
| `animalQuiz` | Zvierací Kvíz | both | — | `AZQ` | `resetAZQ()` |
| `gofish` | Kvarteto | both | ✓ | `GF` | `resetGoFish()` |
| `darts301` | Šípky 301 | both | — | `DARTS` | `resetDarts()` |

**Special entries (no game logic):**
| `tournament` | Turnaj | always | — | — | — |
| `stats` | Štatistiky | always | — | — | — |

## By Mode

**both** (AI + PVP): ticTacToe, rockPaper, memory, connect4, guessNum, chess, checkers, battleship, puzzle, maze, reversi, ludo, breakout, pong, tanks, doodle, wordle, beeCount, soccer, angryBirds, sokoban, unoGame, nimGame, simonSays, mancala, animalGuess, animalQuiz, gofish, darts301

**pvp** (2-player only): quiz, ghost, reaction, spamClick, mathDuel, emojiGuess, hangman, mmsv, wordChain, higherLower, scramble, langScramble, flashcard, missingLetter, sentence, dotsBoxes, snakeDuel

**solo**: tetris, snake, racing, minesweeper, gravityRun, game2048, flappy, cardWar, solitaire, nonogram, sudoku

**MP games (29):** ticTacToe, rockPaper, memory, connect4, guessNum, chess, checkers, quiz, battleship, ghost, mmsv, wordChain, higherLower, scramble, puzzle, reversi, ludo, dotsBoxes, breakout, pong, tanks, snakeDuel, wordle, sokoban, nimGame, simonSays, mancala, animalGuess, gofish
