# PortalHall 🌀
**Console implementation of the Monty Hall problem** with a Rick & Morty twist, written in Node.js.  
Supports different Morty strategies via a plugin system (SPI).

---

## ✨ Features
- Provably fair randomness with **HMAC-SHA3** protocol.  
- Support for different Morty strategies (ClassicMorty, LazyMorty).  
- Easy to plug in your own Morty implementations via SPI.  
- Clean ASCII statistics table (powered by `cli-table3`).  
- Friendly error messages (English only).  

---

## 🚀 Installation

Clone the repo and install dependencies:
```bash
git clone https://github.com/yourname/portal-hall.git
cd portal-hall
npm install
```

Run (Node.js v20+):
```bash
node cli.js <number_of_boxes> <path_to_Morty>
```

---

## 🎮 Usage Examples

### 3 boxes with ClassicMorty
```bash
node cli.js 3 ./morties/ClassicMorty.js
```

### 3 boxes with LazyMorty
```bash
node cli.js 3 ./morties/LazyMorty.js
```

### Invalid examples
```bash
node index.js
# Error: Missing required arguments.
# Usage: node cli.js <boxes> <path> [className]
# Example: node cli.js 3 ./morties/ClassicMorty.js ClassicMorty

node index.js 2 ./morties/ClassicMorty.js
# Error: Invalid box count: 1. The number of boxes must be an integer greater than 2.
# Usage: node cli.js <boxes> <path> [className]
# Example: node cli.js 3 ./morties/ClassicMorty.js ClassicMorty
```

---

## 📊 Example Output

```
Welcome! Number of boxes: 3. Morty: ClassicMorty
Play a round? (y/n): y
Morty: HMAC=49a9397c1c6e...
Rick: enter your number [0,3): 2
Rick: choose a box index [0,3): 1
Morty: I leave boxes: 1, 0
Rick: enter 0 to switch to 0 or 1 to stay with 1 (0=switch,1=stay): 0
Morty: my mortyValue = 2
Morty: KEY=3a9f7cd89c...
Morty: final gun is in box 0
Rick wins!

GAME STATISTICS
┌────────────────────┬───────────────┬───────────────┐
│ Metric             │ Switch        │ Stay          │
├────────────────────┼───────────────┼───────────────┤
│ Rounds (total)     │ 5             │ 4             │
│ Wins               │ 3             │ 1             │
│ P (empirical)      │ 0.600         │ 0.250         │
│ P (theoretical)    │ 0.667         │ 0.333         │
└────────────────────┴───────────────┴───────────────┘
```

---

## 🧩 How It Works (without Morty’s brain it’s chaos)

- **cli.js** — entry point. Nothing fancy, just boots the game.  
- **ParamsValidator** — checks that you didn’t type garbage (like 2 boxes).  
- **Api** — Rick’s command center: yells at everyone and makes them talk to each other.  
- **MortyLoader** — drags the chosen Morty into the game (Classic, Lazy, or your own).  
- **Core** — the heart of the game. Shouts at modules until they cooperate.  
- **Morty (SPI)** — interface for custom Morty strategies. Wanna add your own? Implement a couple methods and you’re in.  
- **KeyManager** — generates secret keys, because even interdimensional games need crypto.  
- **FairRandomGenerator** — honest RNG powered by HMAC-SHA3. Morty can’t cheat (or at least he pretends not to).  
- **Statistics** — counts wins and prints a smart-looking ASCII table, like we’re scientists.  

In short: the Core runs the show, Morty hosts it, and everyone else plays along.

---

## 🛠️ How to Write Your Own Morty

Create a file, e.g. `MyMorty.js`:

```js
const Morty = require('../components/Morty');

class MyMorty extends Morty {
   constructor(name) {
      super(name);
   }

   openBox(boxes) {
      boxes.filter(box => !box.isSelected).filter(box => !box.hasPortalGun)[0].isOpen = true;
   }

   theoreticalProbability(n) {
    return { switch: (n-1)/n, stay: 1/n };
  }
}

exports.MyMorty = MyMorty;
```

Run it:
```bash
node cli.js 3 ./morties/MyMorty.js
```

---

## 📜 License
MIT
