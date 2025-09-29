# PortalHall 🌀
**Консольная реализация задачи Монти Холла** в стиле Rick & Morty, написанная на Node.js.  
Поддерживает разные стратегии Морти через систему плагинов (SPI).

---

## ✨ Возможности
- Доказуемая честность случайности через **HMAC-SHA3** протокол.  
- Поддержка разных стратегий Морти (ClassicMorty, LazyMorty).  
- Возможность подключать свои реализации Морти через SPI.  
- Красивый вывод статистики в ASCII-таблице (библиотека `cli-table3`).  
- Понятные ошибки на английском языке.  

---

## 🚀 Установка

Клонируй репозиторий и установи зависимости:
```bash
git clone https://github.com/yourname/portal-hall.git
cd portal-hall
npm install
```

Запуск (Node.js v20+):
```bash
node cli.js <количество_ящиков> <путь_к_Морти>
```

---

## 🎮 Примеры запуска

### 3 ящика и ClassicMorty
```bash
node cli.js 3 ./morties/ClassicMorty.js
```

### 3 ящика и LazyMorty
```bash
node cli.js 3 ./morties/LazyMorty.js
```

### Ошибочные примеры
```bash
node index.js
#Error: Missing required arguments.
#Usage: node cli.js <boxes> <path> [className]
#$xapmle: node cli.js 3 ./morties/ClassicMorty.js ClassicMorty

node index.js 2 ./morties/ClassicMorty.js
# Error: Invalid box count: 1. The number of boxes must be an integer greater than 2.
# Usage: node cli.js <boxes> <path> [className]
# Exapmle: node cli.js 3 ./morties/ClassicMorty.js ClassicMorty
```

---

## 📊 Пример вывода

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

## 🧩 Архитектура

```
## 🧠 Как всё устроено (без мозгов Морти никак)

- **cli.js** — точка входа. Ничего умного, просто запускает игру.  
- **ParamsValidator** — проверяет, что ты не ввёл чушь (например, 2 ящика).  
- **Api** — обеспечивает взаимодействи между модулями (раздает всем приказы).  
- **MortyLoader** — затаскивает в игру выбранного Морти (Classic, Lazy или кастомного).  
- **Core** — сердце игры. Оно орёт на всех и заставляет работать вместе.  
- **MortyLoader** — интерфейс для разных стратегий Морти. Хочешь своего? Реализуй пару методов, и вперёд.  
- **KeyManager** — генерирует секретные ключи, потому что без крипты сейчас никуда.  
- **FairRandomGenerator** — честный генератор на HMAC-SHA3. Чтобы Морти не мухлевал (ну или хотя бы делал вид).  
- **Statistics** — считает победы и печатает умную ASCII-таблицу, как будто мы учёные.  

Короче, ядро игры рулит процессом, Морти «ведёт шоу», а остальные модули подыгрывают.
```

---

## 🛠️ Как написать своего Морти

Создай файл, например `MyMorty.js`:

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

Запусти:
```bash
node cli.js 3 ./morties/MyMorty.js
```

---

## 📜 Лицензия
MIT
